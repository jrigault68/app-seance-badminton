import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRight, GripVertical, MoreVertical, Copy, Trash2, Plus, Edit, Save, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import Layout from '../components/Layout';
import FloatingLabelInput from '../components/ui/FloatingLabelInput';
import Snackbar from '../components/Snackbar';
import FloatingSaveButton from '../components/ui/FloatingSaveButton';
import IconSelector from '../components/ui/IconSelector';
import LucideIcon from '../components/ui/LucideIcon';

// =================================================================
// HELPERS
// =================================================================

const getUID = () => `uid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Composant ContextMenuPortal exactement comme dans EditeurStructureSeance
const ContextMenuPortal = ({ children, anchorRef }) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  useLayoutEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + window.scrollY, left: rect.right + window.scrollX - 192 });
    }
  }, [anchorRef]);
  return ReactDOM.createPortal(<div style={{ position: 'absolute', ...coords, zIndex: 1000 }}>{children}</div>, document.body);
};

// =================================================================
// SOUS-COMPOSANTS
// =================================================================

// Composant de confirmation générique
function ConfirmDialog({ open, message, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div
      className="hierarchical-confirm-dialog"
      onClick={onCancel}
    >
      <div
        className="hierarchical-confirm-content"
        onClick={e => e.stopPropagation()}
      >
        <div className="hierarchical-confirm-title">Confirmation</div>
        <div className="hierarchical-confirm-message">{message}</div>
        <div className="hierarchical-confirm-actions">
          <button onClick={onCancel} className="hierarchical-confirm-button cancel">Annuler</button>
          <button onClick={onConfirm} className="hierarchical-confirm-button confirm">Confirmer</button>
        </div>
      </div>
    </div>
  );
}

// Modal pour éditer une catégorie
function CategorieModal({ open, categorie, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    couleur: '#000000',
    icone: 'Icône'
  });
  const [showIconSelector, setShowIconSelector] = useState(false);

  useEffect(() => {
    if (categorie) {
      setFormData({
        nom: categorie.nom || '',
        description: categorie.description || '',
        couleur: categorie.couleur || '#000000',
        icone: categorie.icone || 'Icône'
      });
    } else {
      setFormData({
        nom: '',
        description: '',
        couleur: '#000000',
        icone: 'Icône'
      });
    }
  }, [categorie]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!open) return null;

  return (
    <div className="hierarchical-confirm-dialog">
      <div className="hierarchical-confirm-content" style={{ minWidth: '400px' }}>
        <h2 className="hierarchical-confirm-title">
          {categorie ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Icône
              </label>
              <button
                type="button"
                onClick={() => setShowIconSelector(true)}
                className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white hover:border-orange-500 transition flex items-center justify-center gap-2"
              >
                <LucideIcon name={formData.icone} size={20} />
                <span className="text-sm">{formData.icone}</span>
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Couleur
              </label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-full h-[46px] rounded-lg border border-gray-600 cursor-pointer hover:border-orange-500 transition-colors relative flex items-center justify-center"
                  style={{ backgroundColor: formData.couleur }}
                  onClick={() => document.getElementById('color-input').click()}
                >
                  <span className="text-xs font-mono font-bold text-white drop-shadow-lg">
                    {formData.couleur}
                  </span>
                </div>
                <input
                  id="color-input"
                  type="color"
                  value={formData.couleur}
                  onChange={e => setFormData(prev => ({ ...prev, couleur: e.target.value }))}
                  className="sr-only"
                />
              </div>
            </div>
          </div>
          
          <FloatingLabelInput
            label="Nom"
            value={formData.nom}
            onChange={e => setFormData(prev => ({ ...prev, nom: e.target.value }))}
            placeholder="ex: Cardio"
            required
          />
          
          <FloatingLabelInput
            label="Description"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description de la catégorie"
          />
          
          <div className="hierarchical-confirm-actions">
            <button
              type="button"
              onClick={onCancel}
              className="hierarchical-confirm-button cancel"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="hierarchical-confirm-button confirm"
              style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}
            >
              {categorie ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
        
        {/* Icon Selector */}
        <IconSelector
          isOpen={showIconSelector}
          onClose={() => setShowIconSelector(false)}
          onSelect={(iconName) => {
            setFormData(prev => ({ ...prev, icone: iconName }));
            setShowIconSelector(false);
          }}
          currentIcon={formData.icone}
        />
      </div>
    </div>
  );
}

// Modal pour éditer une sous-catégorie
function SousCategorieModal({ open, sousCategorie, categories, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nom: '',
    description: ''
  });

  useEffect(() => {
    if (sousCategorie) {
      setFormData({
        nom: sousCategorie.nom || '',
        description: sousCategorie.description || ''
      });
    } else {
      setFormData({
        nom: '',
        description: ''
      });
    }
  }, [sousCategorie]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!open) return null;

  return (
    <div className="hierarchical-confirm-dialog">
      <div className="hierarchical-confirm-content" style={{ minWidth: '400px' }}>
        <h2 className="hierarchical-confirm-title">
          {sousCategorie ? 'Modifier la sous-catégorie' : 'Ajouter une sous-catégorie'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingLabelInput
            label="Nom"
            value={formData.nom}
            onChange={e => setFormData(prev => ({ ...prev, nom: e.target.value }))}
            placeholder="ex: Course à pied"
            required
          />
          
          <FloatingLabelInput
            label="Description"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description de la sous-catégorie"
          />
          
          <div className="hierarchical-confirm-actions">
            <button
              type="button"
              onClick={onCancel}
              className="hierarchical-confirm-button cancel"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="hierarchical-confirm-button confirm"
              style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}
            >
              {sousCategorie ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Composant pour une sous-catégorie (style exact de l'éditeur de séance)
const SortableSousCategorie = ({ sousCategorie, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: sousCategorie.id 
  });
  
  const [contextMenu, setContextMenu] = useState(false);
  const moreBtnRef = useRef(null);
  const menuRef = useRef(null);
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (!contextMenu) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && moreBtnRef.current && !moreBtnRef.current.contains(e.target)) {
        setContextMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenu]);

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="hierarchical-item"
    >
      <div className="hierarchical-item-header">
        <div className="p-1"></div>
        <div className="hierarchical-item-content">
          <span className="hierarchical-item-name">
            {sousCategorie.nom}
          </span>
          {sousCategorie.description && (
            <span className="text-gray-400 text-sm"> {sousCategorie.description}</span>
          )}
        </div>
        <div className="hierarchical-item-actions">
          <button 
            type="button" 
            {...attributes} 
            {...listeners} 
            className="hierarchical-drag-button"
          >
            <GripVertical size={18} />
          </button>
          <button
            type="button"
            ref={moreBtnRef}
            onClick={e => { e.stopPropagation(); setContextMenu(!contextMenu); }}
            className="hierarchical-action-button"
          >
            <MoreVertical size={18} />
          </button>
          {contextMenu && (
            <ContextMenuPortal anchorRef={moreBtnRef}>
              <div ref={menuRef} className="hierarchical-context-menu">
                <button
                  onClick={e => { e.stopPropagation(); onEdit(sousCategorie); setContextMenu(false); }}
                  className="hierarchical-context-menu-item"
                >
                  <Edit size={16} /> Modifier
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(sousCategorie); setContextMenu(false); }}
                  className="hierarchical-context-menu-item danger"
                >
                  <Trash2 size={16} /> Supprimer
                </button>
              </div>
            </ContextMenuPortal>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant pour une catégorie (style exact de l'éditeur de séance)
const SortableCategorie = ({ categorie, sousCategories, onEdit, onDelete, onAddSousCategorie, onEditSousCategorie, onDeleteSousCategorie }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: categorie.id 
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(false);
  const moreBtnRef = useRef(null);
  const menuRef = useRef(null);
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sousCategoriesOfCategorie = sousCategories.filter(sc => sc.categorie_id === categorie.id);

  const toggleAccordion = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (!contextMenu) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && moreBtnRef.current && !moreBtnRef.current.contains(e.target)) {
        setContextMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenu]);

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="hierarchical-item"
    >
      <div className="hierarchical-item-header cursor-pointer" onClick={toggleAccordion}>
        <div className="p-1">
          <ChevronRight 
            className={`hierarchical-item-chevron ${isOpen ? 'open' : ''}`} 
            size={18} 
          />
        </div>
        <div className="hierarchical-item-content">
          <span style={{ color: categorie.couleur }} className="hierarchical-item-icon">
            <LucideIcon name={categorie.icone} size={20} />
          </span>
          <span className="hierarchical-item-name">
            {categorie.nom}
          </span>
          {categorie.description && (
            <span className="text-gray-400 text-sm">- {categorie.description}</span>
          )}
        </div>
        <div className="hierarchical-item-actions">
          <button 
            type="button" 
            {...attributes} 
            {...listeners} 
            className="hierarchical-drag-button"
            onClick={e => e.stopPropagation()}
          >
            <GripVertical size={18} />
          </button>
          <button
            type="button"
            ref={moreBtnRef}
            onClick={e => { e.stopPropagation(); setContextMenu(!contextMenu); }}
            className="hierarchical-action-button"
          >
            <MoreVertical size={18} />
          </button>
          {contextMenu && (
            <ContextMenuPortal anchorRef={moreBtnRef}>
              <div ref={menuRef} className="hierarchical-context-menu">
                <button
                  onClick={e => { e.stopPropagation(); onEdit(categorie); setContextMenu(false); }}
                  className="hierarchical-context-menu-item"
                >
                  <Edit size={16} /> Modifier
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(categorie); setContextMenu(false); }}
                  className="hierarchical-context-menu-item danger"
                >
                  <Trash2 size={16} /> Supprimer
                </button>
              </div>
            </ContextMenuPortal>
          )}
        </div>
      </div>
      
      {isOpen && (
        <div className="hierarchical-item-expanded" onClick={e => e.stopPropagation()}>
          <div className="hierarchical-recursive-container">
            {sousCategoriesOfCategorie.length > 0 ? (
              <SortableContext items={sousCategoriesOfCategorie.map(sc => sc.id)} strategy={verticalListSortingStrategy}>
                {sousCategoriesOfCategorie.map(sousCategorie => (
                  <SortableSousCategorie
                    key={sousCategorie.id}
                    sousCategorie={sousCategorie}
                    onEdit={onEditSousCategorie}
                    onDelete={onDeleteSousCategorie}
                  />
                ))}
              </SortableContext>
            ) : (
              <div className="text-gray-400 text-center py-4">Aucune sous-catégorie</div>
            )}
            
          </div>
          <div className="hierarchical-action-bar">
            <button
              onClick={() => onAddSousCategorie(categorie.id)}
              className="hierarchical-add-button"
            >
              <Plus size={18} /> Sous-catégorie
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Barre d'actions (style exact de l'éditeur de séance)
function BarreActionsCategories({ onAddCategorie }) {
  return (
    <div className="hierarchical-action-bar">
      <button 
        onClick={onAddCategorie} 
        className="hierarchical-add-button"
      >
        <Plus size={18} /> Catégorie
      </button>
    </div>
  );
}

// =================================================================
// COMPOSANT PRINCIPAL
// =================================================================

export default function AdminCategories() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [categories, setCategories] = useState([]);
  const [sousCategories, setSousCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Modals
  const [categorieModal, setCategorieModal] = useState({ open: false, categorie: null });
  const [sousCategorieModal, setSousCategorieModal] = useState({ open: false, sousCategorie: null });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, item: null, type: null });
  
  const sensors = useSensors(useSensor(PointerSensor));

  // Charger les données
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/admin-categories' } });
      return;
    }
    
    // Vérifier si l'utilisateur est admin
    if (!user.is_admin) {
      alert('Accès refusé. Vous devez être administrateur pour accéder à cette page.');
      navigate('/');
      return;
    }
    
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Charger les catégories
      const categoriesResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/categories`, {
        credentials: 'include'
      });
      const categoriesData = await categoriesResponse.json();
      
      // Charger les sous-catégories
      const sousCategoriesResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/sous-categories`, {
        credentials: 'include'
      });
      const sousCategoriesData = await sousCategoriesResponse.json();
      
      // Trier par ordre_affichage
      const categoriesTriees = (categoriesData.categories || []).sort((a, b) => (a.ordre_affichage || 0) - (b.ordre_affichage || 0));
      const sousCategoriesTriees = (sousCategoriesData.sousCategories || []).sort((a, b) => (a.ordre_affichage || 0) - (b.ordre_affichage || 0));
      
      setCategories(categoriesTriees);
      setSousCategories(sousCategoriesTriees);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      setSnackbarMessage('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  // Gestion du drag & drop
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    // Déterminer si on déplace une catégorie ou une sous-catégorie
    const activeCategorie = categories.find(c => c.id === active.id);
    const activeSousCategorie = sousCategories.find(sc => sc.id === active.id);

    if (activeCategorie) {
      // Déplacer une catégorie
      const oldIndex = categories.findIndex(c => c.id === active.id);
      const newIndex = categories.findIndex(c => c.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newCategories = arrayMove(categories, oldIndex, newIndex);
        setCategories(newCategories);
        
        // Sauvegarder l'ordre
        try {
          // N'envoyer que les IDs et les nouveaux ordres
          const categoriesOrder = newCategories.map((categorie, index) => ({
            id: categorie.id,
            ordre_affichage: index
          }));
          
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/categories/ordre`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ categories: categoriesOrder })
          });
          
          if (!response.ok) throw new Error('Erreur lors de la sauvegarde de l\'ordre');
          
          setSnackbarMessage('Ordre des catégories sauvegardé');
        } catch (error) {
          console.error('Erreur lors de la sauvegarde de l\'ordre:', error);
          setSnackbarMessage('Erreur lors de la sauvegarde de l\'ordre');
        }
      }
    } else if (activeSousCategorie) {
      // Déplacer une sous-catégorie
      const oldIndex = sousCategories.findIndex(sc => sc.id === active.id);
      const newIndex = sousCategories.findIndex(sc => sc.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newSousCategories = arrayMove(sousCategories, oldIndex, newIndex);
        setSousCategories(newSousCategories);
        
        // Sauvegarder l'ordre de toutes les sous-catégories
        try {
          // N'envoyer que les IDs et les nouveaux ordres
          const sousCategoriesOrder = newSousCategories.map((sousCategorie, index) => ({
            id: sousCategorie.id,
            ordre_affichage: index
          }));
          
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/sous-categories/ordre`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ sousCategories: sousCategoriesOrder })
          });
          
          if (!response.ok) throw new Error('Erreur lors de la sauvegarde de l\'ordre');
          
          setSnackbarMessage('Ordre des sous-catégories sauvegardé');
        } catch (error) {
          console.error('Erreur lors de la sauvegarde de l\'ordre:', error);
          setSnackbarMessage('Erreur lors de la sauvegarde de l\'ordre');
        }
      }
    }
    
    setActiveId(null);
  };

  // Actions sur les catégories
  const handleAddCategorie = () => {
    setCategorieModal({ open: true, categorie: null });
  };

  const handleEditCategorie = (categorie) => {
    setCategorieModal({ open: true, categorie });
  };

  const handleDeleteCategorie = (categorie) => {
    setConfirmDelete({ open: true, item: categorie, type: 'categorie' });
  };

  const handleSaveCategorie = async (formData) => {
    try {
      if (categorieModal.categorie) {
        // Modifier
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/categories/${categorieModal.categorie.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Erreur lors de la modification');
        
        setSnackbarMessage('Catégorie modifiée avec succès');
      } else {
        // Ajouter
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Erreur lors de l\'ajout');
        
        setSnackbarMessage('Catégorie ajoutée avec succès');
      }
      
      setCategorieModal({ open: false, categorie: null });
      fetchCategories(); // Recharger les données
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbarMessage('Erreur lors de la sauvegarde');
    }
  };

  // Actions sur les sous-catégories
  const handleAddSousCategorie = (categorieId) => {
    setSousCategorieModal({ open: true, sousCategorie: { categorie_id: categorieId } });
  };

  const handleEditSousCategorie = (sousCategorie) => {
    setSousCategorieModal({ open: true, sousCategorie });
  };

  const handleDeleteSousCategorie = (sousCategorie) => {
    setConfirmDelete({ open: true, item: sousCategorie, type: 'sous_categorie' });
  };

  const handleSaveSousCategorie = async (formData) => {
    try {
      if (sousCategorieModal.sousCategorie.id) {
        // Modifier - inclure la categorie_id existante
        const dataToSend = {
          ...formData,
          categorie_id: sousCategorieModal.sousCategorie.categorie_id
        };
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/sous-categories/${sousCategorieModal.sousCategorie.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(dataToSend)
        });
        
        if (!response.ok) throw new Error('Erreur lors de la modification');
        
        setSnackbarMessage('Sous-catégorie modifiée avec succès');
      } else {
        // Ajouter - utiliser la categorie_id passée lors de l'ajout
        const dataToSend = {
          ...formData,
          categorie_id: sousCategorieModal.sousCategorie.categorie_id
        };
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/sous-categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(dataToSend)
        });
        
        if (!response.ok) throw new Error('Erreur lors de l\'ajout');
        
        setSnackbarMessage('Sous-catégorie ajoutée avec succès');
      }
      
      setSousCategorieModal({ open: false, sousCategorie: null });
      fetchCategories(); // Recharger les données
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbarMessage('Erreur lors de la sauvegarde');
    }
  };

  // Confirmation de suppression
  const handleConfirmDelete = async () => {
    try {
      const { item, type } = confirmDelete;
      
      if (type === 'categorie') {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/categories/${item.id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        setSnackbarMessage('Catégorie supprimée avec succès');
      } else if (type === 'sous_categorie') {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/sous-categories/${item.id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        setSnackbarMessage('Sous-catégorie supprimée avec succès');
      }
      
      setConfirmDelete({ open: false, item: null, type: null });
      fetchCategories(); // Recharger les données
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbarMessage('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <Layout pageTitle="Administration des catégories">
        <div className="w-full flex items-center justify-center">
          <div className="text-orange-300 text-xl">Chargement...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Administration des catégories">
      <div className="page-wrapper">
        <div className="page-content">
          <h1 className="page-title">Administration des Catégories</h1>
          <p className="page-description">Gérez les catégories et les sous-catégories</p>

          <div className="hierarchical-editor">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                {categories.map(categorie => (
                  <SortableCategorie
                    key={categorie.id}
                    categorie={categorie}
                    sousCategories={sousCategories}
                    onEdit={handleEditCategorie}
                    onDelete={handleDeleteCategorie}
                    onAddSousCategorie={handleAddSousCategorie}
                    onEditSousCategorie={handleEditSousCategorie}
                    onDeleteSousCategorie={handleDeleteSousCategorie}
                  />
                ))}
              </SortableContext>
              <DragOverlay>
                {activeId ? (
                  <div className="hierarchical-drag-overlay">
                    <div className="hierarchical-item-header">
                      <div className="p-1">
                        <ChevronRight className="hierarchical-item-chevron" size={18} />
                      </div>
                      <div className="hierarchical-item-content">
                        <span className="hierarchical-item-name">
                          {categories.find(c => c.id === activeId)?.nom || sousCategories.find(sc => sc.id === activeId)?.nom}
                        </span>
                      </div>
                      <div className="hierarchical-item-actions">
                        <div className="hierarchical-drag-button">
                          <GripVertical size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            <BarreActionsCategories onAddCategorie={handleAddCategorie} />
          </div>
        </div>

        {/* Modals */}
        <CategorieModal
          open={categorieModal.open}
          categorie={categorieModal.categorie}
          onSave={handleSaveCategorie}
          onCancel={() => setCategorieModal({ open: false, categorie: null })}
        />

        <SousCategorieModal
          open={sousCategorieModal.open}
          sousCategorie={sousCategorieModal.sousCategorie}
          categories={categories}
          onSave={handleSaveSousCategorie}
          onCancel={() => setSousCategorieModal({ open: false, sousCategorie: null })}
        />

        <ConfirmDialog
          open={confirmDelete.open}
          message={`Êtes-vous sûr de vouloir supprimer "${confirmDelete.item?.nom}" ?`}
          onCancel={() => setConfirmDelete({ open: false, item: null, type: null })}
          onConfirm={handleConfirmDelete}
        />

        <Snackbar 
          message={snackbarMessage} 
          type="success" 
          onClose={() => setSnackbarMessage('')} 
        />
      </div>
    </Layout>
  );
}
