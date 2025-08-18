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

// Modal pour éditer une zone du corps
function ZoneCorpsModal({ open, zone, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    couleur: '#000000',
    icone: 'Icône'
  });
  const [showIconSelector, setShowIconSelector] = useState(false);

  useEffect(() => {
    if (zone) {
      setFormData({
        nom: zone.nom || '',
        description: zone.description || '',
        couleur: zone.couleur || '#000000',
        icone: zone.icone || 'Icône'
      });
    } else {
      setFormData({
        nom: '',
        description: '',
        couleur: '#000000',
        icone: 'Icône'
      });
    }
  }, [zone]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!open) return null;

  return (
    <div className="hierarchical-confirm-dialog">
      <div className="hierarchical-confirm-content" style={{ minWidth: '400px' }}>
        <h2 className="hierarchical-confirm-title">
          {zone ? 'Modifier la zone du corps' : 'Ajouter une zone du corps'}
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
            placeholder="ex: Muscles bas du corps"
            required
          />
          
          <FloatingLabelInput
            label="Description"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description de la zone du corps"
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
              {zone ? 'Modifier' : 'Ajouter'}
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

// Modal pour éditer une zone spécifique
function ZoneSpecifiqueModal({ open, zoneSpecifique, zonesCorps, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nom: '',
    description: ''
  });

  useEffect(() => {
    if (zoneSpecifique) {
      setFormData({
        nom: zoneSpecifique.nom || '',
        description: zoneSpecifique.description || ''
      });
    } else {
      setFormData({
        nom: '',
        description: ''
      });
    }
  }, [zoneSpecifique]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!open) return null;

  return (
    <div className="hierarchical-confirm-dialog">
      <div className="hierarchical-confirm-content" style={{ minWidth: '400px' }}>
        <h2 className="hierarchical-confirm-title">
          {zoneSpecifique ? 'Modifier la zone spécifique' : 'Ajouter une zone spécifique'}
        </h2>
        
                 <form onSubmit={handleSubmit} className="space-y-4">
           <FloatingLabelInput
             label="Nom"
             value={formData.nom}
             onChange={e => setFormData(prev => ({ ...prev, nom: e.target.value }))}
             placeholder="ex: Quadriceps"
             required
           />
          
          <FloatingLabelInput
            label="Description"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description de la zone spécifique"
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
              {zoneSpecifique ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Composant pour une zone spécifique (style exact de l'éditeur de séance)
const SortableZoneSpecifique = ({ zoneSpecifique, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: zoneSpecifique.id 
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
            {zoneSpecifique.nom}
          </span>
          {zoneSpecifique.description && (
            <span className="text-gray-400 text-sm"> {zoneSpecifique.description}</span>
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
                  onClick={e => { e.stopPropagation(); onEdit(zoneSpecifique); setContextMenu(false); }}
                  className="hierarchical-context-menu-item"
                >
                  <Edit size={16} /> Modifier
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(zoneSpecifique); setContextMenu(false); }}
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

// Composant pour une zone du corps (style exact de l'éditeur de séance)
const SortableZoneCorps = ({ zone, zonesSpecifiques, onEdit, onDelete, onAddZoneSpecifique, onEditZoneSpecifique, onDeleteZoneSpecifique }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: zone.id 
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

  const zonesSpecifiquesOfZone = zonesSpecifiques.filter(zs => zs.zone_corps_id === zone.id);

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
          <span style={{ color: zone.couleur }} className="hierarchical-item-icon">
            <LucideIcon name={zone.icone} size={20} />
          </span>
          <span className="hierarchical-item-name">
            {zone.nom}
          </span>
          {zone.description && (
            <span className="text-gray-400 text-sm">- {zone.description}</span>
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
                  onClick={e => { e.stopPropagation(); onEdit(zone); setContextMenu(false); }}
                  className="hierarchical-context-menu-item"
                >
                  <Edit size={16} /> Modifier
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(zone); setContextMenu(false); }}
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
            {zonesSpecifiquesOfZone.length > 0 ? (
              <SortableContext items={zonesSpecifiquesOfZone.map(zs => zs.id)} strategy={verticalListSortingStrategy}>
                {zonesSpecifiquesOfZone.map(zoneSpecifique => (
                  <SortableZoneSpecifique
                    key={zoneSpecifique.id}
                    zoneSpecifique={zoneSpecifique}
                    onEdit={onEditZoneSpecifique}
                    onDelete={onDeleteZoneSpecifique}
                  />
                ))}
              </SortableContext>
            ) : (
              <div className="text-gray-400 text-center py-4">Aucune zone spécifique</div>
            )}
            
          </div>
          <div className="hierarchical-action-bar">
            <button
              onClick={() => onAddZoneSpecifique(zone.id)}
              className="hierarchical-add-button"
            >
              <Plus size={18} /> Zone spécifique
            </button>
            </div>
        </div>
      )}
    </div>
  );
};

// Barre d'actions (style exact de l'éditeur de séance)
function BarreActionsZones({ onAddZoneCorps }) {
  return (
    <div className="hierarchical-action-bar">
      <button 
        onClick={onAddZoneCorps} 
        className="hierarchical-add-button"
      >
        <Plus size={18} /> Zone du corps
      </button>
    </div>
  );
}

// =================================================================
// COMPOSANT PRINCIPAL
// =================================================================

export default function AdminZones() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [zonesCorps, setZonesCorps] = useState([]);
  const [zonesSpecifiques, setZonesSpecifiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Modals
  const [zoneCorpsModal, setZoneCorpsModal] = useState({ open: false, zone: null });
  const [zoneSpecifiqueModal, setZoneSpecifiqueModal] = useState({ open: false, zoneSpecifique: null });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, item: null, type: null });
  
  const sensors = useSensors(useSensor(PointerSensor));

  // Charger les données
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/admin-zones' } });
      return;
    }
    
    // Vérifier si l'utilisateur est admin
    if (!user.is_admin) {
      alert('Accès refusé. Vous devez être administrateur pour accéder à cette page.');
      navigate('/');
      return;
    }
    
    fetchZones();
  }, [user, navigate]);

  const fetchZones = async () => {
    try {
      setLoading(true);
      
      // Charger les zones du corps
      const zonesResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/zones-corps`, {
        credentials: 'include'
      });
      const zonesData = await zonesResponse.json();
      
      // Charger les zones spécifiques
      const zonesSpecifiquesResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/zones-specifiques`, {
        credentials: 'include'
      });
      const zonesSpecifiquesData = await zonesSpecifiquesResponse.json();
      
      // Trier par ordre_affichage
      const zonesTriees = (zonesData.zones || []).sort((a, b) => (a.ordre_affichage || 0) - (b.ordre_affichage || 0));
      const zonesSpecifiquesTriees = (zonesSpecifiquesData.zonesSpecifiques || []).sort((a, b) => (a.ordre_affichage || 0) - (b.ordre_affichage || 0));
      
      setZonesCorps(zonesTriees);
      setZonesSpecifiques(zonesSpecifiquesTriees);
    } catch (error) {
      console.error('Erreur lors du chargement des zones:', error);
      setSnackbarMessage('Erreur lors du chargement des zones');
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

    // Déterminer si on déplace une zone du corps ou une zone spécifique
    const activeZoneCorps = zonesCorps.find(z => z.id === active.id);
    const activeZoneSpecifique = zonesSpecifiques.find(zs => zs.id === active.id);

    if (activeZoneCorps) {
      // Déplacer une zone du corps
      const oldIndex = zonesCorps.findIndex(z => z.id === active.id);
      const newIndex = zonesCorps.findIndex(z => z.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newZonesCorps = arrayMove(zonesCorps, oldIndex, newIndex);
        setZonesCorps(newZonesCorps);
        
                 // Sauvegarder l'ordre
         try {
           // N'envoyer que les IDs et les nouveaux ordres
           const zonesCorpsOrder = newZonesCorps.map((zone, index) => ({
             id: zone.id,
             ordre_affichage: index
           }));
           
           const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/zones-corps/ordre`, {
             method: 'PUT',
             headers: { 
               'Content-Type': 'application/json'
             },
             credentials: 'include',
             body: JSON.stringify({ zones: zonesCorpsOrder })
           });
          
          if (!response.ok) throw new Error('Erreur lors de la sauvegarde de l\'ordre');
          
          setSnackbarMessage('Ordre des zones du corps sauvegardé');
        } catch (error) {
          console.error('Erreur lors de la sauvegarde de l\'ordre:', error);
          setSnackbarMessage('Erreur lors de la sauvegarde de l\'ordre');
        }
      }
    } else if (activeZoneSpecifique) {
      // Déplacer une zone spécifique
      console.log('Déplacement d\'une zone spécifique détecté');
      const oldIndex = zonesSpecifiques.findIndex(zs => zs.id === active.id);
      const newIndex = zonesSpecifiques.findIndex(zs => zs.id === over.id);
      
      console.log('Indices trouvés:', { oldIndex, newIndex });
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newZonesSpecifiques = arrayMove(zonesSpecifiques, oldIndex, newIndex);
        console.log('Nouveau tableau après arrayMove:', newZonesSpecifiques);
        setZonesSpecifiques(newZonesSpecifiques);
        
                 // Sauvegarder l'ordre de toutes les zones spécifiques
         try {
           console.log('Envoi des zones spécifiques:', newZonesSpecifiques);
           console.log('URL de la requête:', `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/zones-specifiques/ordre`);
           
           // N'envoyer que les IDs et les nouveaux ordres
           const zonesSpecifiquesOrder = newZonesSpecifiques.map((zone, index) => ({
             id: zone.id,
             ordre_affichage: index
           }));
           
           const requestBody = { zonesSpecifiques: zonesSpecifiquesOrder };
           console.log('Body de la requête:', JSON.stringify(requestBody, null, 2));
          
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/zones-specifiques/ordre`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(requestBody)
          });
          
          console.log('Réponse reçue:', response.status, response.statusText);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur de réponse:', errorText);
            throw new Error(`Erreur lors de la sauvegarde de l'ordre: ${response.status} ${response.statusText}`);
          }
          
          const responseData = await response.json();
          console.log('Données de réponse:', responseData);
          
          setSnackbarMessage('Ordre des zones spécifiques sauvegardé');
        } catch (error) {
          console.error('Erreur lors de la sauvegarde de l\'ordre:', error);
          setSnackbarMessage('Erreur lors de la sauvegarde de l\'ordre');
        }
      } else {
        console.log('Indices invalides, pas de sauvegarde');
      }
    }
    
    setActiveId(null);
  };

  // Actions sur les zones du corps
  const handleAddZoneCorps = () => {
    setZoneCorpsModal({ open: true, zone: null });
  };

  const handleEditZoneCorps = (zone) => {
    setZoneCorpsModal({ open: true, zone });
  };

  const handleDeleteZoneCorps = (zone) => {
    setConfirmDelete({ open: true, item: zone, type: 'zone_corps' });
  };

  const handleSaveZoneCorps = async (formData) => {
    try {
      if (zoneCorpsModal.zone) {
        // Modifier
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/zones-corps/${zoneCorpsModal.zone.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Erreur lors de la modification');
        
        setSnackbarMessage('Zone du corps modifiée avec succès');
      } else {
        // Ajouter
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/zones-corps`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Erreur lors de l\'ajout');
        
        setSnackbarMessage('Zone du corps ajoutée avec succès');
      }
      
      setZoneCorpsModal({ open: false, zone: null });
      fetchZones(); // Recharger les données
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbarMessage('Erreur lors de la sauvegarde');
    }
  };

  // Actions sur les zones spécifiques
  const handleAddZoneSpecifique = (zoneCorpsId) => {
    setZoneSpecifiqueModal({ open: true, zoneSpecifique: { zone_corps_id: zoneCorpsId } });
  };

  const handleEditZoneSpecifique = (zoneSpecifique) => {
    setZoneSpecifiqueModal({ open: true, zoneSpecifique });
  };

  const handleDeleteZoneSpecifique = (zoneSpecifique) => {
    setConfirmDelete({ open: true, item: zoneSpecifique, type: 'zone_specifique' });
  };

  const handleSaveZoneSpecifique = async (formData) => {
    try {
      if (zoneSpecifiqueModal.zoneSpecifique.id) {
        // Modifier - inclure la zone_corps_id existante
        const dataToSend = {
          ...formData,
          zone_corps_id: zoneSpecifiqueModal.zoneSpecifique.zone_corps_id
        };
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/zones-specifiques/${zoneSpecifiqueModal.zoneSpecifique.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(dataToSend)
        });
        
        if (!response.ok) throw new Error('Erreur lors de la modification');
        
        setSnackbarMessage('Zone spécifique modifiée avec succès');
      } else {
        // Ajouter - utiliser la zone_corps_id passée lors de l'ajout
        const dataToSend = {
          ...formData,
          zone_corps_id: zoneSpecifiqueModal.zoneSpecifique.zone_corps_id
        };
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/zones-specifiques`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(dataToSend)
        });
        
        if (!response.ok) throw new Error('Erreur lors de l\'ajout');
        
        setSnackbarMessage('Zone spécifique ajoutée avec succès');
      }
      
      setZoneSpecifiqueModal({ open: false, zoneSpecifique: null });
      fetchZones(); // Recharger les données
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbarMessage('Erreur lors de la sauvegarde');
    }
  };

  // Confirmation de suppression
  const handleConfirmDelete = async () => {
    try {
      const { item, type } = confirmDelete;
      
      if (type === 'zone_corps') {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/zones-corps/${item.id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        setSnackbarMessage('Zone du corps supprimée avec succès');
      } else if (type === 'zone_specifique') {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/zones-specifiques/${item.id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        setSnackbarMessage('Zone spécifique supprimée avec succès');
      }
      
      setConfirmDelete({ open: false, item: null, type: null });
      fetchZones(); // Recharger les données
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbarMessage('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <Layout pageTitle="Administration des zones">
        <div className="w-full flex items-center justify-center">
          <div className="text-orange-300 text-xl">Chargement...</div>
        </div>
      </Layout>
    );
  }

           return (
      <Layout pageTitle="Administration des zones">
        <div className="page-wrapper">
          <div className="page-content">
            <h1 className="page-title">Administration des Zones</h1>
            <p className="page-description">Gérez les zones du corps et les zones spécifiques</p>

             <div className="hierarchical-editor">
               <DndContext
                 sensors={sensors}
                 collisionDetection={closestCenter}
                 onDragStart={handleDragStart}
                 onDragEnd={handleDragEnd}
               >
                 <SortableContext items={zonesCorps.map(z => z.id)} strategy={verticalListSortingStrategy}>
                   {zonesCorps.map(zone => (
                     <SortableZoneCorps
                       key={zone.id}
                       zone={zone}
                       zonesSpecifiques={zonesSpecifiques}
                       onEdit={handleEditZoneCorps}
                       onDelete={handleDeleteZoneCorps}
                       onAddZoneSpecifique={handleAddZoneSpecifique}
                       onEditZoneSpecifique={handleEditZoneSpecifique}
                       onDeleteZoneSpecifique={handleDeleteZoneSpecifique}
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
                             {zonesCorps.find(z => z.id === activeId)?.nom || zonesSpecifiques.find(zs => zs.id === activeId)?.nom}
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

               <BarreActionsZones onAddZoneCorps={handleAddZoneCorps} />
             </div>
         </div>

         {/* Modals */}
         <ZoneCorpsModal
           open={zoneCorpsModal.open}
           zone={zoneCorpsModal.zone}
           onSave={handleSaveZoneCorps}
           onCancel={() => setZoneCorpsModal({ open: false, zone: null })}
         />

         <ZoneSpecifiqueModal
           open={zoneSpecifiqueModal.open}
           zoneSpecifique={zoneSpecifiqueModal.zoneSpecifique}
           zonesCorps={zonesCorps}
           onSave={handleSaveZoneSpecifique}
           onCancel={() => setZoneSpecifiqueModal({ open: false, zoneSpecifique: null })}
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
