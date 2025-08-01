import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay, useDroppable} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronRight, GripVertical, MoreVertical, Copy, Trash2, ClipboardPaste, Plus, Search, Save, X, RotateCcw } from 'lucide-react';
import FloatingLabelInput from "./ui/FloatingLabelInput";
import Snackbar from './Snackbar';
import Switch from "./ui/Switch";
import FloatingSaveButton from "./ui/FloatingSaveButton";
import ExerciceHelpDialog from "./ui/ExerciceHelpDialog";

// =================================================================
// HELPERS
// =================================================================

let uidCounter = 1;
const getUID = () => `uid-${Date.now()}-${uidCounter++}`;
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
const arraysEqual = (a, b) => a && b && a.length === b.length && a.every((val, i) => val === b[i]);

function flattenStructure(nestedStructure) {
  const allItems = {};
  const containers = { root: [] };
  
  function traverse(items, containerId) {
    containers[containerId] = [];
    (items || []).forEach(item => {
      const newItem = { ...item, _uid: item._uid || getUID() };
      allItems[newItem._uid] = newItem;
      containers[containerId].push(newItem._uid);
      if (newItem.type === 'bloc') {
        traverse(newItem.contenu, newItem._uid);
      }
    });
  }
  
  traverse(nestedStructure, 'root');
  return { allItems, containers };
}

function buildNestedStructure(allItems, containers) {
  // Fonction pour trouver la configuration automatique du bloc parent
  const getParentBlocConfig = (itemUid, path = []) => {
    if (path.length < 2) return null;
    
    // Remonter dans la hiérarchie pour trouver le bloc parent
    for (let i = path.length - 2; i >= 0; i--) {
      const parentUid = path[i];
      const parentItem = allItems[parentUid];
      if (parentItem && parentItem.type === 'bloc') {
        // Vérifier si le bloc a des configurations automatiques actives
        const hasAutoConfig = (
          (parentItem.valeur_series !== null && parentItem.valeur_series !== undefined) ||
          (parentItem.valeur_type_exercice !== null && parentItem.valeur_type_exercice !== undefined && parentItem.valeur_type_exercice !== '') ||
          (parentItem.valeur_duree !== null && parentItem.valeur_duree !== undefined && parentItem.valeur_duree !== '') ||
          (parentItem.valeur_repetitions !== null && parentItem.valeur_repetitions !== undefined && parentItem.valeur_repetitions !== '') ||
          (parentItem.valeur_repos_series !== null && parentItem.valeur_repos_series !== undefined && parentItem.valeur_repos_series !== '') ||
          (parentItem.valeur_repos_exercice !== null && parentItem.valeur_repos_exercice !== undefined && parentItem.valeur_repos_exercice !== '')
        );
        
        if (hasAutoConfig) {
          return parentItem;
        }
      }
    }
    return null;
  };

  // Fonction pour nettoyer les valeurs incohérentes d'un exercice
  const cleanExerciceValues = (item) => {
    if (item.type !== 'exercice') return item;
    
    const updatedItem = { ...item };
    const exerciceType = item.exerciceType || 'repetitions';
    
    // Nettoyer les valeurs selon le type d'exercice
    if (exerciceType === 'duree') {
      // Exercice basé sur la durée : répétitions = 0
      updatedItem.repetitions = 0;
    } else if (exerciceType === 'repetitions') {
      // Exercice basé sur les répétitions : durée = 0
      updatedItem.temps_series = 0;
    }
    
    return updatedItem;
  };

  // Fonction pour appliquer la configuration automatique à un exercice
  const applyAutoConfigToExercice = (item, parentConfig) => {
    if (!parentConfig || item.type !== 'exercice') return item;
    
    const updatedItem = { ...item };
    
    // Appliquer le nombre de séries si configuré
    if (parentConfig.valeur_series !== null && parentConfig.valeur_series !== undefined && parentConfig.valeur_series !== '') {
      updatedItem.series = parentConfig.valeur_series;
    }
    
    if (parentConfig.valeur_duree !== null && parentConfig.valeur_duree !== undefined && parentConfig.valeur_duree !== '') {
      updatedItem.temps_series = parentConfig.valeur_duree;
    }
    if (parentConfig.valeur_repetitions !== null && parentConfig.valeur_repetitions !== undefined && parentConfig.valeur_repetitions !== '') {
      updatedItem.repetitions = parentConfig.valeur_repetitions;
    }
    // Appliquer le type d'exercice forcé et les valeurs correspondantes
    if (parentConfig.valeur_type_exercice && parentConfig.valeur_type_exercice !== '') {
      updatedItem.exerciceType = parentConfig.valeur_type_exercice;
    } 
    if (updatedItem.exerciceType === "duree") {
      updatedItem.repetitions = 0;
    } else if (updatedItem.exerciceType === "repetitions") {
      updatedItem.temps_series = 0;
    }
    
    // Appliquer le temps de repos entre séries si configuré (valeur présente, même 0)
    if (parentConfig.valeur_repos_series !== null && parentConfig.valeur_repos_series !== undefined && parentConfig.valeur_repos_series !== '') {
      updatedItem.temps_repos_series = parentConfig.valeur_repos_series;
    }
    
    // Appliquer le temps de repos entre exercices si configuré (valeur présente, même 0)
    if (parentConfig.valeur_repos_exercice !== null && parentConfig.valeur_repos_exercice !== undefined && parentConfig.valeur_repos_exercice !== '') {
      updatedItem.temps_repos_exercice = parentConfig.valeur_repos_exercice;
    }
    
    return updatedItem;
  };

  const buildNode = (uid, path = []) => {
    const item = allItems[uid];
    const currentPath = [...path, uid];
    
    if (item.type === 'bloc') {
      const childUids = containers[item._uid] || [];
      // Exclure showAutoConfig de la sauvegarde
      const { showAutoConfig, ...itemWithoutShowAutoConfig } = item;
      return { ...itemWithoutShowAutoConfig, contenu: childUids.map(childUid => buildNode(childUid, currentPath)) };
    } else if (item.type === 'exercice') {
      // Appliquer la configuration automatique du bloc parent
      const parentConfig = getParentBlocConfig(uid, currentPath);
      let updatedItem = applyAutoConfigToExercice(item, parentConfig);
      
      // Nettoyer les valeurs incohérentes
      updatedItem = cleanExerciceValues(updatedItem);
      
      // Ne sauvegarder les champs personnalisables que s'ils sont explicitement définis
      // (c'est-à-dire modifiés par l'utilisateur, même si c'est pour les vider)
      const fieldsToCheck = ['description', 'position_depart', 'focus_zone', 'erreurs', 'conseils'];
      fieldsToCheck.forEach(field => {
        if (updatedItem[field] === undefined || updatedItem[field] === null) {
          delete updatedItem[field];
        }
        // Note: les champs vides ('') ou tableaux vides ([]) sont conservés car ils indiquent une personnalisation
      });
      
      return updatedItem;
    }
    
    return item;
  };
  
  return containers.root.map(uid => buildNode(uid, []));
}

// =================================================================
// SOUS-COMPOSANTS
// =================================================================

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

const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative'
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {React.cloneElement(children, { dragHandleListeners: listeners })}
    </div>
  );
};

const Item = ({ children }) => <div className="bg-gray-700 rounded-lg shadow-xl">{children}</div>;

// Composant de confirmation générique
function ConfirmDialog({ open, message, onCancel, onConfirm }) {
  if (!open) return null;
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
      onClick={onCancel}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-6 min-w-[320px] max-w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-orange-300 font-semibold mb-4">Confirmation</div>
        <div className="text-gray-200 mb-6">{message}</div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 border border-gray-600">Annuler</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 border border-red-700">Confirmer</button>
        </div>
      </div>
    </div>,
    document.body
  );
}



function StepContent({
  uid,
  path,
  dragHandleListeners,
  allItems,
  globalStates,
  onUpdate,
  onAddBloc,
  onAddExercice,
  onPaste,
  openAccordions
}) {
  const {
    openAccordions: parentOpenAccordions, setOpenAccordions,
    contextMenu, setContextMenu,
    setIsAddExoDialogOpen, setAddExoTargetPath
  } = globalStates;
  
  const item = allItems[uid];
  // Ajout du type d'exercice par défaut si absent
  const moreBtnRef = useRef(null);
  const menuRef = useRef(null);
  const isMenuOpen = contextMenu && arraysEqual(contextMenu, path);
  const [showDetails, setShowDetails] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const detailsBtnRef = useRef(null);
  const detailsPopoverRef = useRef(null);

  // État pour l'accordéon de configuration automatique des blocs
  const showAutoConfig = item.showAutoConfig || false;

  // Variable pour stocker les infos de l'exercice depuis l'API backend
  const [exerciceInfos, setExerciceInfos] = useState(null);

  // Fonction pour aller chercher les infos de l'exercice dans la bdd via l'API backend
  useEffect(() => {
    // On ne fait la requête que si l'item est un exercice et qu'il a un id
    if (item && item.type === "exercice" && item.id) {
      // Remplacez l'URL par celle de votre API backend
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/exercices/${item.id}`)
        .then(res => {
          if (!res.ok) throw new Error("Erreur lors de la récupération de l'exercice");
          return res.json();
        })
                 .then(data => setExerciceInfos(data.exercice))
        .catch(err => {
          setExerciceInfos(null);
          // Optionnel : log ou gestion d'erreur
        });
    } else {
      setExerciceInfos(null);
    }
  }, [item && item.type === "exercice" ? item.id : null]);


  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && moreBtnRef.current && !moreBtnRef.current.contains(e.target)) {
        setContextMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, setContextMenu]);

  // Fermer le popover détails si clic en dehors
  useEffect(() => {
    if (!showDetails) return;
    const handleClick = (e) => {
      if (
        detailsPopoverRef.current &&
        !detailsPopoverRef.current.contains(e.target) &&
        detailsBtnRef.current &&
        !detailsBtnRef.current.contains(e.target)
      ) {
        setShowDetails(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showDetails]);

  const toggleAccordion = () => setOpenAccordions(o => o.includes(uid) ? o.filter(i => i !== uid) : [...o, uid]);
  const handleChange = (field, value, isBlur = false) => {
    // Si c'est un blur, valider et nettoyer la valeur
    if (isBlur) {
      let val = value;
      let num = parseInt(val, 10);
      if (isNaN(num)) num = 0;
      
      // Appliquer les contraintes de validation selon le champ
      if (field === 'series' && num < 1) {
        num = 1; // Minimum 1 pour le nombre de séries
      } else if (field === 'nbTours' && num < 1) {
        num = 1; // Minimum 1 pour le nombre de tours
      } else if (field === 'valeur_series' && num < 1) {
        num = 1; // Minimum 1 pour la valeur_series
      }
      
      value = num;
    }

    // Si on change le type d'exercice, forcer la valeur inutilisée à 0
    if (field === 'exerciceType') {
      if (value === 'duree') {
        onUpdate(uid, { ...item, exerciceType: value, repetitions: 0 });
      } else if (value === 'repetitions') {
        onUpdate(uid, { ...item, exerciceType: value, temps_series: 0 });
      } else {
        onUpdate(uid, { ...item, [field]: value });
      }
    } else if (field === 'nbTours') {
      // Si on change le nombre de tours, réinitialiser le temps de repos si nécessaire
      const updatedItem = { ...item, [field]: value };
      if (value <= 1) {
        updatedItem.temps_repos_bloc = 0;
      }
      onUpdate(uid, updatedItem);
    } else if (field === 'valeur_series') {
      // Si on change le nombre de séries dans la config auto, réinitialiser le repos entre séries si nécessaire
      const updatedItem = { ...item, [field]: value };
      if (value <= 1) {
        updatedItem.valeur_repos_series = null;
      }
      onUpdate(uid, updatedItem);
    } else {
      // Gestion spéciale pour les champs personnalisables des exercices
      const personalizableFields = ['description', 'position_depart', 'conseils', 'erreurs', 'focus_zone'];
      
      if (item.type === 'exercice' && personalizableFields.includes(field)) {
        const updatedItem = { ...item };
        
        // Si la valeur est vide ou null, sauvegarder une chaîne vide pour indiquer qu'on ne veut pas l'info
        if (value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
          updatedItem[field] = field === 'conseils' || field === 'erreurs' || field === 'focus_zone' ? [] : '';
        } else {
          // Vérifier si la nouvelle valeur correspond à la valeur de base de l'exercice
          let baseValue = '';
          if (field === 'description') {
            baseValue = exerciceInfos?.description || '';
          } else if (field === 'position_depart') {
            baseValue = exerciceInfos?.position_depart || '';
          } else if (field === 'conseils') {
            baseValue = Array.isArray(exerciceInfos?.conseils) ? exerciceInfos.conseils : [];
          } else if (field === 'erreurs') {
            baseValue = Array.isArray(exerciceInfos?.erreurs) ? exerciceInfos.erreurs : [];
          } else if (field === 'focus_zone') {
            baseValue = Array.isArray(exerciceInfos?.focus_zone) ? exerciceInfos.focus_zone : [];
          }
          
          // Si la valeur correspond à la valeur de base, supprimer le champ de la structure
          if (JSON.stringify(value) === JSON.stringify(baseValue)) {
            delete updatedItem[field];
          } else {
            updatedItem[field] = value;
          }
        }
        
        onUpdate(uid, updatedItem);
      } else {
        // Mise à jour simple pour tous les autres champs
        onUpdate(uid, { ...item, [field]: value });
      }
      
      // Si on change la configuration automatique d'un bloc, appliquer immédiatement
      if (item.type === 'bloc' && (
        field === 'valeur_type_exercice' || 
        field === 'valeur_duree' || 
        field === 'valeur_repetitions' || 
        field === 'valeur_series' || 
        field === 'valeur_repos_series' || 
        field === 'valeur_repos_exercice'
      )) {
        // Appliquer la configuration aux exercices existants
        setTimeout(() => applyAutoConfigToExercices(field), 0);
      }
    }
  };
  const handleRemove = () => setShowConfirmDelete(true);
  const handleConfirmDelete = () => {
    setShowConfirmDelete(false);
    onUpdate(uid, null);
  };
  const handleCopy = () => globalStates.setClipboard({ type: 'copy', item });
  const handleCut = () => {
    globalStates.setClipboard({ type: 'cut', item });
    onUpdate(uid, null);
  };


  // Fonction pour appliquer la configuration automatique aux exercices du bloc
  const applyAutoConfigToExercices = (changedField = null) => {
    if (item.type !== 'bloc') return;
    
    const childUids = globalStates.containers[item._uid] || [];
    childUids.forEach(childUid => {
      const childItem = allItems[childUid];
      if (childItem && childItem.type === 'exercice') {
        let updatedChild = { ...childItem };
        
        // Appliquer le nombre de séries si configuré
        if (item.valeur_series !== null && item.valeur_series !== undefined && item.valeur_series !== '') {
          updatedChild.series = item.valeur_series;
        } else if (item.valeur_series === null || item.valeur_series === undefined || item.valeur_series === '') {
          // Réinitialiser à 1 si aucune valeur n'est configurée
          updatedChild.series = 1;
        }
        
        // Appliquer le type d'exercice forcé et les valeurs correspondantes
        if (item.valeur_type_exercice) {
          // Si un type est forcé, l'appliquer
          updatedChild.exerciceType = item.valeur_type_exercice;
          
          // Appliquer les valeurs selon le type forcé
          if (item.valeur_type_exercice === "duree") {
            // Type forcé à durée : appliquer la durée et réinitialiser les répétitions
            if (item.valeur_duree !== null && item.valeur_duree !== undefined && item.valeur_duree !== '') {
              updatedChild.temps_series = item.valeur_duree;
            }
            updatedChild.repetitions = 0;
          } else if (item.valeur_type_exercice === "repetitions") {
            // Type forcé à répétitions : appliquer les répétitions et réinitialiser la durée
            if (item.valeur_repetitions !== null && item.valeur_repetitions !== undefined && item.valeur_repetitions !== '') {
              updatedChild.repetitions = item.valeur_repetitions;
            }
            updatedChild.temps_series = 0;
          }
        } else {
          // Pas de type forcé : appliquer les valeurs par défaut selon le type de l'exercice
          if (item.valeur_duree !== null && item.valeur_duree !== undefined && item.valeur_duree !== '') {
            updatedChild.temps_series = item.valeur_duree;
          }
          if (item.valeur_repetitions !== null && item.valeur_repetitions !== undefined && item.valeur_repetitions !== '') {
            updatedChild.repetitions = item.valeur_repetitions;
          }
        }
        
        // Appliquer le temps de repos entre séries si configuré (valeur présente, même 0)
        if (item.valeur_repos_series !== null && item.valeur_repos_series !== undefined && item.valeur_repos_series !== '') {
          updatedChild.temps_repos_series = item.valeur_repos_series;
        }
        
        // Appliquer le temps de repos entre exercices si configuré (valeur présente, même 0)
        if (item.valeur_repos_exercice !== null && item.valeur_repos_exercice !== undefined && item.valeur_repos_exercice !== '') {
          updatedChild.temps_repos_exercice = item.valeur_repos_exercice;
        }
        
        // Ajouter un timestamp pour forcer le re-rendu
        updatedChild._lastAutoConfigUpdate = Date.now();
        
        onUpdate(childUid, updatedChild);
      }
    });
    

  };

  const handlePaste = (position) => {
    if (!globalStates.clipboard) return;
    onUpdate(null, { 
        paste: 'contextual', 
        clipboardItem: globalStates.clipboard.item, 
        position, 
        targetUid: uid 
    });
  };

  // Fonction pour réinitialiser un champ à sa valeur par défaut
  const handleResetField = (field) => {
    const updatedItem = { ...item };
    delete updatedItem[field];
    onUpdate(uid, updatedItem);
  };

  // Fonction pour vérifier si un champ est personnalisé
  const isFieldPersonalized = (field) => {
    return item[field] !== undefined;
  };

  // Handler générique pour les champs numériques

  


  // Fonction pour vérifier si un exercice est dans un bloc avec configuration automatique
  const getParentBlocConfig = () => {
    if (item.type !== 'exercice' || path.length < 2) return null;
    
    // Remonter dans la hiérarchie pour trouver le bloc parent
    for (let i = path.length - 2; i >= 0; i--) {
      const parentUid = path[i];
      const parentItem = allItems[parentUid];
      if (parentItem && parentItem.type === 'bloc') {
        // Vérifier si le bloc a des configurations automatiques actives
        const hasAutoConfig = (
          (parentItem.valeur_series !== null && parentItem.valeur_series !== undefined) ||
          (parentItem.valeur_type_exercice !== null && parentItem.valeur_type_exercice !== undefined && parentItem.valeur_type_exercice !== '') ||
          (parentItem.valeur_duree !== null && parentItem.valeur_duree !== undefined && parentItem.valeur_duree !== '') ||
          (parentItem.valeur_repetitions !== null && parentItem.valeur_repetitions !== undefined && parentItem.valeur_repetitions !== '') ||
          (parentItem.valeur_repos_series !== null && parentItem.valeur_repos_series !== undefined && parentItem.valeur_repos_series !== '') ||
          (parentItem.valeur_repos_exercice !== null && parentItem.valeur_repos_exercice !== undefined && parentItem.valeur_repos_exercice !== '')
        );
        
        if (hasAutoConfig) {
          return parentItem;
        }
      }
    }
    return null;
  };

  const parentBlocConfig = getParentBlocConfig();

 // Fonction helper pour récupérer les libellés
 const getLabel = (key) => {
  const labels = {
    'series': 'Nombre de séries',
    'type_exercice': 'Type d\'exercice',
    'repetitions': 'Nombre de répétitions',
    'duree': 'Durée d\'une série (s)',
    'repos_series': 'Repos entre les séries (s)',
    'repos_exercice': 'Repos après l\'exercice (s)'
  };
  return labels[key] || key;
};
  
  const getFieldWidthClass = (lbl) => {
      const len = lbl.length;
      if (len <= 15) return 'w-40';
      if (len <= 25) return 'w-56';
      return 'w-64';
  };

  // Fonctions helper pour déterminer si un champ doit être en lecture seule
  const isRepetitionsLocked = () => {
    if (!parentBlocConfig) return false;
    // Verrouillé si type forcé à répétitions ET valeur configurée
    return parentBlocConfig.valeur_type_exercice === 'repetitions' && 
           parentBlocConfig.valeur_repetitions !== null && 
           parentBlocConfig.valeur_repetitions !== undefined && 
           parentBlocConfig.valeur_repetitions !== '';
  };

  const isDureeLocked = () => {
    if (!parentBlocConfig) return false;
    // Verrouillé si type forcé à durée ET valeur configurée
    return parentBlocConfig.valeur_type_exercice === 'duree' && 
           parentBlocConfig.valeur_duree !== null && 
           parentBlocConfig.valeur_duree !== undefined && 
           parentBlocConfig.valeur_duree !== '';
  };

  const isReposExerciceLocked = () => {
    if (!parentBlocConfig) return false;
    // Verrouillé si type forcé à repos exercice ET valeur configurée
    return parentBlocConfig.valeur_repos_exercice !== null && 
           parentBlocConfig.valeur_repos_exercice !== undefined && 
           parentBlocConfig.valeur_repos_exercice !== '';
  };

  // Fonctions helper pour l'affichage avec priorité parent > item
  const getDisplayValue = (field, parentField = null) => {
    const parentValue = parentField ? parentBlocConfig?.[parentField] : null;
    const itemValue = item[field];
    
    // Priorité au parent si configuré, sinon fallback sur item
    if (parentValue !== null && parentValue !== undefined && parentValue !== '') {
      return parentValue;
    }
    return itemValue ?? '';
  };

  const getRepetitionsValue = () => {
    return getDisplayValue('repetitions', 'valeur_repetitions');
  };

  const getDureeValue = () => {
    return getDisplayValue('temps_series', 'valeur_duree');
  };

  const getSeriesValue = () => {
    return getDisplayValue('series', 'valeur_series');
  };

  const getReposSeriesValue = () => {
    return getDisplayValue('temps_repos_series', 'valeur_repos_series');
  };

  const getReposExerciceValue = () => {
    return getDisplayValue('temps_repos_exercice', 'valeur_repos_exercice');
  };

  return (
    <div className="bg-gray-800/80 md:rounded-2xl rounded-lg mb-3 border border-gray-700 shadow-lg w-full">
      <div className={`flex items-center gap-1.5 p-2`} onClick={toggleAccordion}>
        <div className="p-1"><ChevronRight className={`text-white transition-transform duration-200 ${(openAccordions || []).includes(uid) ? 'rotate-90' : ''}`} size={18} /></div>
        <div className="flex-1 flex items-center gap-2">
          <span className="font-medium text-orange-300 select-none text-sm tracking-wide">{item.type === "bloc" ? item.nom || "Section" : item.nom || "Exercice"}</span>

        </div>
        <div className="flex items-center gap-2">
          <button type="button" {...dragHandleListeners} className="text-white p-1 cursor-grab active:cursor-grabbing" onClick={e => e.stopPropagation()}><GripVertical size={18} /></button> 
          
            <button type="button" ref={moreBtnRef} onClick={e => { e.stopPropagation(); setContextMenu(isMenuOpen ? null : path); }} className="text-white p-1"><MoreVertical size={18} /></button>
            {isMenuOpen && (
              <ContextMenuPortal anchorRef={moreBtnRef}>
                <div ref={menuRef} className="w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg">
                   <button onClick={e => { e.stopPropagation(); handleCopy(); setContextMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-2"><Copy size={16} /> Copier</button>
                   <button onClick={e => { e.stopPropagation(); handleCut(); setContextMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-2"><ClipboardPaste size={16} /> Couper</button>
                   <button onClick={e => { e.stopPropagation(); handlePaste('before'); setContextMenu(null); }} disabled={!globalStates.clipboard} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50"><ClipboardPaste size={16} /> Coller avant</button>
                   <button onClick={e => { e.stopPropagation(); handlePaste('after'); setContextMenu(null); }} disabled={!globalStates.clipboard} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50"><ClipboardPaste size={16} /> Coller après</button>
                   <button onClick={e => { e.stopPropagation(); handleRemove(); setContextMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"><Trash2 size={16} /> Supprimer</button>
                </div>
              </ContextMenuPortal>
            )}
          
        </div>
      </div>
      { (openAccordions || []).includes(uid) && (
        <div className="p-4 border-t border-gray-700/50 space-y-4 cursor-default" onClick={e => e.stopPropagation()}>
          {item.type === "bloc" ? (
            <>
              <div className="space-y-4">
                <FloatingLabelInput label="Titre de la section" value={item.nom || ""} onChange={e => handleChange("nom", e.target.value)} />
                <FloatingLabelInput label="Description / Consignes" value={item.description || ""} onChange={e => handleChange("description", e.target.value)} />
                {/* Switch pour intro_bloc */}
                <div className="flex items-center gap-3 mt-3 mb-2">
                  <Switch
                    checked={item.intro_bloc || false}
                    onChange={checked => handleChange("intro_bloc", checked)}
                    id={`intro-bloc-switch-${uid}`}
                  />
                  <label htmlFor={`intro-bloc-switch-${uid}`} className="text-sm text-orange-200 cursor-pointer select-none ml-1">
                    Lancement manuel de la section
                  </label>
                  <span className="relative group ml-2">
                    {/* Icône ? dans un cercle orange */}
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-md border-2 border-orange-400 group-hover:bg-orange-600 group-focus:bg-orange-600 transition-colors cursor-pointer outline-none" tabIndex={0}>
                      ?
                    </span>
                    <span className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 bg-orange-900 text-orange-100 text-xs rounded-lg p-3 shadow-2xl border border-orange-500 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50 pointer-events-none select-text">
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-orange-900"></span>
                      Affiche une page de présentation au début de la section avec les consignes et exercices.<br />L'utilisateur devra appuyer sur 'Commencer la section' pour démarrer les exercices.
                    </span>
                  </span>
                </div>
                <div className="flex flex-row flex-wrap">
                  <div className="shrink-0 w-auto">
                    <FloatingLabelInput label="Nombre de tours de la section" type="number" min={1} value={item.nbTours || 1} onChange={e => handleChange("nbTours", parseInt(e.target.value) || 1)} size="medium" className={getFieldWidthClass("Nombre de tours")} />
                  </div>
                  { (item.nbTours > 1) && (
                  <div className="w-auto shrink-0 md:flex-1 mt-0 ml-4">
                    <FloatingLabelInput label="Temps de repos entre les tours (s)" type="number" min={0} value={item.temps_repos_bloc || 0} onChange={e => handleChange("temps_repos_bloc", parseInt(e.target.value) || 0)} size="small" className={getFieldWidthClass("Temps de repos entre les tours (s)")} />
                  </div>
                  )}
                </div>
                
                {/* Configuration automatique des exercices */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <div
                    className="cursor-pointer select-none"
                    onClick={() => handleChange("showAutoConfig", !showAutoConfig)}
                    aria-label={showAutoConfig ? "Réduire la configuration automatique" : "Déplier la configuration automatique"}
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleChange("showAutoConfig", !showAutoConfig);
                      }
                    }}
                    role="button"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight
                        size={20}
                        className={`text-white transition-transform duration-200 ${showAutoConfig ? "rotate-90" : ""}`}
                      />
                      <span className="text-orange-300 font-medium">Configuration automatique des exercices</span>
                    </div>
                    {/* Aperçu de la configuration active sous le titre */}
                     <div className="text-xs text-gray-400 mt-1 ml-7">
                       {[
                         (item.valeur_series !== null && item.valeur_series !== undefined) && `${getLabel('series')} : ${item.valeur_series || 1}`,
                         (item.valeur_repos_series !== null && item.valeur_repos_series !== undefined && item.valeur_repos_series !== '') && `${getLabel('repos_series')} : ${item.valeur_repos_series}`,
                         (item.valeur_type_exercice === 'duree') && `${getLabel('type_exercice')}: Durée`,
                         (item.valeur_type_exercice === 'repetitions') && `${getLabel('type_exercice')}: Répétitions`,
                         (item.valeur_type_exercice !== 'repetitions' && item.valeur_duree !== null && item.valeur_duree !== undefined && item.valeur_duree !== '') && `${getLabel('duree')} : ${item.valeur_duree}`,
                         (item.valeur_type_exercice !== 'duree' && item.valeur_repetitions !== null && item.valeur_repetitions !== undefined && item.valeur_repetitions !== '') && `${getLabel('repetitions')} : ${item.valeur_repetitions}`,
                         (item.valeur_repos_exercice !== null && item.valeur_repos_exercice !== undefined && item.valeur_repos_exercice !== '') && `${getLabel('repos_exercice')} : ${item.valeur_repos_exercice}`
                       ].filter(Boolean).join(', ') || 'Aucune configuration'}
                     </div>
                  </div>
                  
                  {showAutoConfig && (
                    <div className="space-y-3 mt-3">
                      {/* 2ème ligne : Sélecteur du type d'exercice */}
                      <div className="flex flex-row gap-4">
                        <FloatingLabelInput
                          as="select"
                          label={getLabel('type_exercice')}
                          value={item.valeur_type_exercice || ""}
                          onChange={e => handleChange("valeur_type_exercice", e.target.value === "" ? null : e.target.value)}
                        >
                          <option value="">Aucune configuration</option>
                          <option value="repetitions">Basé sur le nombre de répétitions</option>
                          <option value="duree">Basé sur la durée</option>
                        </FloatingLabelInput>

                        {/* Afficher le champ répétitions seulement si le type n'est pas "duree" */}
                        {item.valeur_type_exercice !== "duree" && (
                          <div className="">
                            <FloatingLabelInput
                              label={getLabel('repetitions')}
                              type="number"
                              min={1}
                              value={item.valeur_repetitions !== null && item.valeur_repetitions !== undefined ? item.valeur_repetitions : ''}
                              onChange={e => {
                                let num = e.target.value === '' ? null : parseInt(e.target.value, 10);
                                if (num !== null && num < 1)  { e.target.value = 1;}
                                handleChange('valeur_repetitions', e.target.value);
                              }}
                              size="medium"
                              onClear={() => handleChange("valeur_repetitions", null)}
                            />
                          </div>
                        )}
                        {/* Afficher le champ durée seulement si le type n'est pas "repetitions" */}
                        {item.valeur_type_exercice !== "repetitions" && (
                          <div className="">
                            <FloatingLabelInput
                              label={isDureeLocked() ? `${getLabel('duree')} 🔒` : getLabel('duree')}
                              type="number"
                              min={1}
                              value={item.valeur_duree !== null && item.valeur_duree !== undefined ? item.valeur_duree : ''}
                              onChange={e => {
                                let num = e.target.value === '' ? null : parseInt(e.target.value, 10);
                                if (num !== null && num < 1)  { e.target.value = 1;}
                                handleChange('valeur_duree', e.target.value);
                              }}
                              size="medium"
                              onClear={() => handleChange("valeur_duree", null)}
                            />
                          </div>
                        )}
                      </div>
                      {/* 1ère ligne : Nombre de séries */}
                      <div className="flex flex-row items-start gap-4">
                        <div className="">
                          <FloatingLabelInput
                            label={getLabel('series')}
                            type="number"
                            min={1}
                            value={item.valeur_series !== null && item.valeur_series !== undefined ? item.valeur_series : ''}  
                            onChange={e => {
                              let num = e.target.value === '' ? null : parseInt(e.target.value, 10);
                              if (num !== null && num < 1)  { e.target.value = 1;}
                              handleChange('valeur_series', e.target.value);
                            }}
                            onFocus={e => e.target.select()}
                            size="medium"
                            onClear={() => handleChange("valeur_series", null)}
                          />
                        </div>
                        {/* 4ème ligne : Repos entre les séries (si plus d'une série) */}
                        {( item.valeur_series && item.valeur_series > 1) && (
                          <div className="">
                            <FloatingLabelInput
                              label={getLabel('repos_series')}
                              type="number"
                              min={0}
                              value={item.valeur_repos_series !== null && item.valeur_repos_series !== undefined ? item.valeur_repos_series : ''}
                              onChange={e => handleChange("valeur_repos_series", e.target.value === '' ? null : parseInt(e.target.value) || 0)}
                              size="medium"
                              onClear={() => handleChange("valeur_repos_series", null)}
                            />
                          </div>
                        )}
                      </div>
                      
                      
                      
                      {/* 5ème ligne : Repos après l'exercice */}
                      <div className="flex">
                        <FloatingLabelInput
                            label={getLabel('repos_exercice')}
                          type="number"
                          min={0}
                          value={item.valeur_repos_exercice !== null && item.valeur_repos_exercice !== undefined ? item.valeur_repos_exercice : ''}
                          onChange={e => handleChange("valeur_repos_exercice", e.target.value === '' ? null : parseInt(e.target.value) || 0)}
                          size="medium"
                          onClear={() => handleChange("valeur_repos_exercice", null)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Libellé Exercices */}
              <div className="font-semibold text-orange-300 mt-4 mb-2">Exercices :</div>
              <EditeurStructureSeance isSubEditor allItems={allItems} containers={{ [item._uid]: globalStates.containers[item._uid] }} onUpdate={onUpdate} globalStates={globalStates} pathPrefix={path} />
              <BarreActionsStructure
                onAddBloc={() => onAddBloc(uid)}
                onAddExercice={() => onAddExercice(uid)}
                onPaste={() => onPaste(uid)}
                clipboard={globalStates.clipboard}
              />
            </>
          ) : (
            <>
              <div className="space-y-4">                
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1">
                    <FloatingLabelInput
                      label="Nom de l'exercice"
                      value={item.nom !== undefined ? item.nom : (exerciceInfos?.nom || "")}
                      onChange={e => handleChange("nom", e.target.value)}
                      placeholder="Nom de l'exercice"
                    />
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {!item.id && (
                      <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                        Perso
                      </span>
                    )}
                    {item.id && (
                      <button
                        type="button"
                        className="text-xs text-orange-300 underline hover:text-orange-400 focus:outline-none"
                        onClick={e => { e.stopPropagation(); setShowDetails(true); }}
                      >
                        Détails
                      </button>
                    )}
                  </div>
                </div>
                <ExerciceHelpDialog open={showDetails} onClose={() => setShowDetails(false)} exercice={item} />
                
                {/* Accordéon pour les options avancées */}
                <div className="border border-gray-700 rounded-lg">
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setOpenAccordions(o => o.includes(uid + '_advanced') ? o.filter(i => i !== uid + '_advanced') : [...o, uid + '_advanced']); }}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight 
                        size={18} 
                        className={`text-white transition-transform ${(openAccordions || []).includes(uid + '_advanced') ? 'rotate-90' : ''}`}
                      />
                      <span className="text-sm font-medium text-orange-300">Options avancées</span>
                      {/* Indicateur si des champs sont personnalisés */}
                      {( item.description !== undefined || item.position_depart !== undefined || 
                        item.conseils !== undefined || 
                        item.erreurs !== undefined || 
                        item.focus_zone !== undefined) && (
                        <span className="px-2 py-1 text-xs bg-orange-500 text-white rounded-full">Personnalisé</span>
                      )}
                    </div>
                    
                  </button>
                  
                  {(openAccordions || []).includes(uid + '_advanced') && (
                    <div className="px-4 pb-4 space-y-4 border-t border-gray-700/50 pt-4">
                      {/* Option changement de côté */}
                      <div className="flex items-center gap-3 mt-3 mb-2">
                        <Switch
                          checked={item.changement_cote || false}
                          onChange={checked => handleChange("changement_cote", checked)}
                          id={`changement-cote-switch-${uid}`}
                        />
                        <label htmlFor={`changement-cote-switch-${uid}`} className="text-sm text-orange-200 cursor-pointer select-none ml-1">
                          Changement de côté
                        </label>
                        <span className="relative group ml-2">
                          {/* Icône ? dans un cercle orange */}
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-md border-2 border-orange-400 group-hover:bg-orange-600 group-focus:bg-orange-600 transition-colors cursor-pointer outline-none" tabIndex={0}>
                            ?
                          </span>
                          <span className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 bg-orange-900 text-orange-100 text-xs rounded-lg p-3 shadow-2xl border border-orange-500 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50 pointer-events-none select-text">
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-orange-900"></span>
                            Divise automatiquement l'exercice en deux parties égales avec une transition "Changement de côté" au milieu.<br />Utile pour les exercices qui nécessitent de faire chaque côté (gauche/droite).
                          </span>
                        </span>
                      </div>
                        <div className="flex gap-2 items-center">
                          <div className="flex-1">
                            <FloatingLabelInput 
                             label="Description" 
                             value={item.description !== undefined ? item.description : (exerciceInfos?.description || "")} 
                             onChange={e => handleChange("description", e.target.value)}
                             placeholder="Laisser vide pour ne pas afficher de description"
                           />
                          </div>
                          {isFieldPersonalized('description') && (
                            <button
                              type="button"
                              onClick={() => handleResetField('description')}
                              className="p-2 text-orange-400 hover:text-orange-300 transition-colors bg-gray-800 hover:bg-gray-700 rounded border border-gray-600 hover:border-gray-500"
                              title="Remettre la valeur par défaut"
                            >
                              <RotateCcw size={16} />
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="flex-1">
                            <FloatingLabelInput 
                              label="Position de départ" 
                              value={item.position_depart !== undefined ? item.position_depart : (exerciceInfos?.position_depart || "")} 
                              onChange={e => handleChange("position_depart", e.target.value)}
                              placeholder="Laisser vide pour ne pas afficher de position"
                            />
                          </div>
                          {isFieldPersonalized('position_depart') && (
                            <button
                              type="button"
                              onClick={() => handleResetField('position_depart')}
                              className="p-2 text-orange-400 hover:text-orange-300 transition-colors bg-gray-800 hover:bg-gray-700 rounded border border-gray-600 hover:border-gray-500"
                              title="Remettre la valeur par défaut"
                            >
                              <RotateCcw size={16} />
                            </button>
                          )}
                        </div>

                      
                      {/* Conseils personnalisés */}
                      <div className="flex gap-2 items-start">
                        <div className="flex-1">
                          <FloatingLabelInput
                            as="textarea"
                            label="Conseils (un par ligne)"
                            value={item.conseils !== undefined ? (Array.isArray(item.conseils) ? item.conseils.join('\n') : '') : (Array.isArray(exerciceInfos?.conseils) ? exerciceInfos.conseils.join('\n') : '')}
                            onChange={e => handleChange("conseils", e.target.value.split('\n').filter(line => line.trim()))}
                            placeholder="Un conseil par ligne. Laisser vide pour ne pas afficher de conseils"
                            rows={3}
                          />
                        </div>
                        {isFieldPersonalized('conseils') && (
                          <button
                            type="button"
                            onClick={() => handleResetField('conseils')}
                            className="p-2 text-orange-400 hover:text-orange-300 transition-colors bg-gray-800 hover:bg-gray-700 rounded border border-gray-600 hover:border-gray-500 mt-3"
                            title="Remettre la valeur par défaut"
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}
                      </div>
                      
                      {/* Erreurs courantes personnalisées */}
                      <div className="flex gap-2 items-start">
                        <div className="flex-1">
                          <FloatingLabelInput
                            as="textarea"
                            label="Erreurs fréquentes (une par ligne)"
                            value={item.erreurs !== undefined ? (Array.isArray(item.erreurs) ? item.erreurs.join('\n') : '') : (Array.isArray(exerciceInfos?.erreurs) ? exerciceInfos.erreurs.join('\n') : '')}
                            onChange={e => handleChange("erreurs", e.target.value.split('\n').filter(line => line.trim()))}
                            placeholder="Une erreur par ligne. Laisser vide pour ne pas afficher d'erreurs"
                            rows={3}
                          />
                        </div>
                        {isFieldPersonalized('erreurs') && (
                          <button
                            type="button"
                            onClick={() => handleResetField('erreurs')}
                            className="p-2 text-orange-400 hover:text-orange-300 transition-colors bg-gray-800 hover:bg-gray-700 rounded border border-gray-600 hover:border-gray-500 mt-3"
                            title="Remettre la valeur par défaut"
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}
                      </div>
                      
                      {/* Zones de focus personnalisées */}
                      <div className="flex gap-2 items-start">
                        <div className="flex-1">
                          <FloatingLabelInput
                            as="textarea"
                            label="Zones de focus (une par ligne)"
                            value={item.focus_zone !== undefined ? (Array.isArray(item.focus_zone) ? item.focus_zone.join('\n') : '') : (Array.isArray(exerciceInfos?.focus_zone) ? exerciceInfos.focus_zone.join('\n') : '')}
                            onChange={e => handleChange("focus_zone", e.target.value.split('\n').filter(line => line.trim()))}
                            placeholder="Une zone par ligne. Laisser vide pour ne pas afficher de zones"
                            rows={3}
                          />
                        </div>
                        {isFieldPersonalized('focus_zone') && (
                          <button
                            type="button"
                            onClick={() => handleResetField('focus_zone')}
                            className="p-2 text-orange-400 hover:text-orange-300 transition-colors bg-gray-800 hover:bg-gray-700 rounded border border-gray-600 hover:border-gray-500 mt-3"
                            title="Remettre la valeur par défaut"
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}
                      </div>
                      
                      
                    </div>
                  )}
                </div>
                
                  {/* 2ème ligne : Sélecteur du type d'exercice */}
                <div className="flex flex-row gap-4">
                <FloatingLabelInput
                  as="select"
                  label="Type d'exercice"
                  value={(parentBlocConfig?.valeur_type_exercice !== null && parentBlocConfig?.valeur_type_exercice !== undefined && parentBlocConfig?.valeur_type_exercice !== '') ? parentBlocConfig.valeur_type_exercice : (item.exerciceType || 'repetitions')}
                  onChange={e => handleChange("exerciceType", e.target.value)}
                  readonly={(parentBlocConfig?.valeur_type_exercice !== null && parentBlocConfig?.valeur_type_exercice !== undefined && parentBlocConfig?.valeur_type_exercice !== '')}
                  readonlyTooltip={(parentBlocConfig?.valeur_type_exercice !== null && parentBlocConfig?.valeur_type_exercice !== undefined && parentBlocConfig?.valeur_type_exercice !== '') ? "Configuré sur la section parente" : undefined}
                >
                  <option value="repetitions">Basé sur le nombre de répétitions</option>
                  <option value="duree">Basé sur la durée</option>
                </FloatingLabelInput>
                
                  {(
                    (parentBlocConfig?.valeur_type_exercice !== null &&
                      parentBlocConfig?.valeur_type_exercice !== undefined &&
                      parentBlocConfig?.valeur_type_exercice !== ''
                    )
                      ? parentBlocConfig.valeur_type_exercice
                      : (item.exerciceType || 'repetitions')
                  ) === "repetitions" ? (
                    <div className="">
                      <FloatingLabelInput
                        label={getLabel('repetitions')}
                        type="number"
                        min={1}
                        value={getRepetitionsValue()}
                        onChange={e => handleChange('repetitions', e.target.value)}
                        onBlur={() => handleChange('repetitions', item.repetitions, true)}
                        onFocus={e => e.target.select()}
                        size="medium"
                        className={getFieldWidthClass(getLabel('repetitions'))}
                        readonly={isRepetitionsLocked()}
                        readonlyTooltip={isRepetitionsLocked() ? "Configuré sur la section parente" : undefined}
                      />
                    </div>
                  ) : (
                    <div className="">
                      <FloatingLabelInput
                        label={getLabel('duree')}
                        type="number"
                        min={1}
                        value={getDureeValue()}
                        onChange={e => handleChange('temps_series', e.target.value)}
                        onBlur={() => handleChange('temps_series', item.temps_series, true)}
                        onFocus={e => e.target.select()}
                        size="medium"
                        className={getFieldWidthClass(getLabel('duree'))}
                        readonly={isDureeLocked()}
                        readonlyTooltip={isDureeLocked() ? "Configuré sur la section parente" : undefined}
                      />
                    </div>
                  )}
                </div>
                {/* 1ère ligne : Nombre de séries et Repos entre les séries */}
                <div className="flex flex-row gap-4 items-end">
                      <FloatingLabelInput
                        label={getLabel('series')}
                        type="number"
                        min={1}
                        value={getSeriesValue()}
                        onChange={e => handleChange('series', e.target.value)}
                        onBlur={() => handleChange('series', e.target.value, true)}
                        onFocus={e => e.target.select()}
                        size="medium"
                        className={getFieldWidthClass(getLabel('series'))}
                        readonly={(parentBlocConfig?.valeur_series !== null && parentBlocConfig?.valeur_series !== undefined)}
                        readonlyTooltip={(parentBlocConfig?.valeur_series !== null && parentBlocConfig?.valeur_series !== undefined) ? "Configuré sur la section parente" : undefined}
                      />
                      {(
                        // On regarde la valeur effective du nombre de séries (parent ou local)
                        Number(getSeriesValue()) > 1
                      ) && (
                        <FloatingLabelInput
                          label={getLabel('repos_series')}
                          type="number"
                          min={0}
                          value={getReposSeriesValue()}
                          onChange={e => handleChange('temps_repos_series', e.target.value)}
                          onFocus={e => e.target.select()}
                          size="medium"
                          className={getFieldWidthClass(getLabel('repos_series'))}
                          readonly={
                            (parentBlocConfig?.valeur_repos_series !== null && parentBlocConfig?.valeur_repos_series !== undefined && parentBlocConfig?.valeur_repos_series !== '')
                          }
                          readonlyTooltip={
                            (parentBlocConfig?.valeur_repos_series !== null && parentBlocConfig?.valeur_repos_series !== undefined && parentBlocConfig?.valeur_repos_series !== '')
                              ? "Configuré sur la section parente"
                              : undefined
                          }
                        />
                      )}
                </div>

                {/* 4ème ligne : Repos après l'exercice */}
                <div className="flex flex-row gap-4">
                  <FloatingLabelInput
                    label={getLabel('repos_exercice')}
                    type="number"
                    min={0}
                    value={getReposExerciceValue()}
                    onChange={e => handleChange('temps_repos_exercice', e.target.value)}
                    onBlur={() => handleChange('temps_repos_exercice', item.temps_repos_exercice, true)}
                    onFocus={e => e.target.select()}
                    size="medium"
                    className={getFieldWidthClass(getLabel('repos_exercice'))}
                    readonly={isReposExerciceLocked()}
                    readonlyTooltip={isReposExerciceLocked() ? "Configuré sur la section parente" : undefined}
                  />
                </div>
              </div>
            </>
          )}
          
        </div>
      )}
      <ConfirmDialog
            open={showConfirmDelete}
            message={"Supprimer cette étape ?"}
            onCancel={() => setShowConfirmDelete(false)}
            onConfirm={handleConfirmDelete}
          />
    </div>
  );
}

// Ajout d'un petit spinner SVG
const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-orange-400 ml-2 inline-block align-middle" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
  </svg>
);

function AddExerciceDialog({ open, onClose, search, setSearch, onAddExercice }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const inputRef = useRef(null);
  const [exercices, setExercices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [mode, setMode] = useState('search'); // 'search' ou 'free'
  const [freeExercice, setFreeExercice] = useState({
    nom: '',
    description: '',
    position_depart: '',
    conseils: [],
    erreurs: [],
    focus_zone: [],
    changement_cote: false
  });

  // Debounce la recherche
  useEffect(() => {
    if (!open) return;
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search, open]);

  // Fetch dynamique à chaque recherche
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.append("search", debouncedSearch);
    params.append("limit", "50");
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/exercices?${params.toString()}`)
      .then(r => r.json())
      .then(d => setExercices(d.exercices || []))
      .finally(() => setLoading(false));
  }, [debouncedSearch, open]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);
  if (!open) return null;
  return ReactDOM.createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      onClick={e => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        ref={contentRef}
        className="bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-700 min-w-[400px] w-[420px] max-w-full max-h-[90vh] flex flex-col"
      >
        <h2 className="text-xl font-bold mb-4 text-orange-300">Ajouter un exercice</h2>
        
        {/* Onglets */}
        <div className="flex gap-1 mb-4">
          <button
            type="button"
            onClick={() => setMode('search')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'search' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Rechercher
          </button>
          <button
            type="button"
            onClick={() => setMode('free')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'free' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Exercice libre
          </button>
        </div>

        <div className="space-y-3 flex-1 flex flex-col min-h-0">
          {mode === 'search' ? (
            <div className="relative w-full">
              <FloatingLabelInput
                label="Nom de l'exercice"
                value={search}
                onChange={e => setSearch(e.target.value)}
                inputRef={inputRef}
                className="w-full pr-10" // padding right pour le spinner
              />
              {loading && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Spinner />
                </span>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <FloatingLabelInput
                label="Nom de l'exercice"
                value={freeExercice.nom}
                onChange={e => setFreeExercice(prev => ({ ...prev, nom: e.target.value }))}
                placeholder="Nom de l'exercice"
              />
              <FloatingLabelInput
                label="Position de départ"
                value={freeExercice.position_depart}
                onChange={e => setFreeExercice(prev => ({ ...prev, position_depart: e.target.value }))}
                placeholder="Position de départ"
              />
              <FloatingLabelInput
                label="Description"
                value={freeExercice.description}
                onChange={e => setFreeExercice(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description de l'exercice"
              />
              <FloatingLabelInput
                as="textarea"
                label="Conseils (un par ligne)"
                value={freeExercice.conseils.join('\n')}
                onChange={e => setFreeExercice(prev => ({ 
                  ...prev, 
                  conseils: e.target.value.split('\n').filter(line => line.trim())
                }))}
                placeholder="Un conseil par ligne"
                rows={2}
              />
              <FloatingLabelInput
                as="textarea"
                label="Erreurs fréquentes (une par ligne)"
                value={freeExercice.erreurs.join('\n')}
                onChange={e => setFreeExercice(prev => ({ 
                  ...prev, 
                  erreurs: e.target.value.split('\n').filter(line => line.trim())
                }))}
                placeholder="Une erreur par ligne"
                rows={2}
              />
              <FloatingLabelInput
                as="textarea"
                label="Zones de focus (une par ligne)"
                value={freeExercice.focus_zone.join('\n')}
                onChange={e => setFreeExercice(prev => ({ 
                  ...prev, 
                  focus_zone: e.target.value.split('\n').filter(line => line.trim())
                }))}
                placeholder="Une zone par ligne"
                rows={2}
              />

            </div>
          )}
          {mode === 'search' ? (
            <div className="flex flex-col gap-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 rounded scrollbar-thumb-rounded-full scrollbar-track-rounded-full pr-1 transition-opacity duration-200" style={{ scrollbarColor: '#374151 #111827', scrollbarWidth: 'thin', opacity: loading ? 0.7 : 1 }}>
              {(!loading && exercices.length === 0) ? (
                <div className="text-gray-400 text-center py-4">Aucun exercice trouvé</div>
              ) : (
                exercices.map(exo => (
                  <button
                    key={exo.id}
                    onClick={() => { onAddExercice(exo); onClose(); }}
                    className="p-2 bg-gray-800 rounded-md text-left text-sm hover:bg-gray-700 text-white border border-gray-700 transition-colors duration-150"
                    style={{ opacity: loading ? 0.7 : 1 }}
                  >
                    <div className="font-medium">{exo.nom}</div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-end">
              <button
                onClick={() => {
                  if (freeExercice.nom.trim()) {
                    onAddExercice({
                      ...freeExercice,
                      id: null, // Pas d'ID car c'est un exercice libre
                      type: 'exercice'
                    });
                    onClose();
                  }
                }}
                disabled={!freeExercice.nom.trim()}
                className="w-full p-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                Créer l'exercice libre
              </button>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end flex-shrink-0">
          <button onClick={onClose} className="p-2 bg-gray-700 rounded-md text-sm hover:bg-gray-600 text-white border border-gray-600">Annuler</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function BarreActionsStructure({ onAddBloc, onAddExercice, onPaste, clipboard }) {
  return (
    <div className="mt-4 flex flex-row gap-2 items-center">
      <button onClick={onAddBloc} className="flex items-center gap-2 px-3 py-1.5 text-orange-300 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors w-auto">
        <Plus size={18} /> Section
      </button>
      <button onClick={onAddExercice} className="flex items-center gap-2 px-3 py-1.5 text-orange-300 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors w-auto">
        <Plus size={18} /> Exercice
      </button>
      {clipboard && (
        <button onClick={onPaste} className="flex items-center gap-2 px-3 py-1.5 text-orange-300 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors w-auto">
          <ClipboardPaste size={18} /> Coller
        </button>
      )}
    </div>
  );
}

// =================================================================
// COMPOSANT PRINCIPAL
// =================================================================

// Nouveau composant pour chaque conteneur (racine ou bloc)
function DroppableContainer({ containerId, items, allItems, globalStates, onUpdate, onAddBloc, onAddExercice, onPaste, activeId, pathPrefix }) {
  const { setNodeRef } = useDroppable({ id: containerId });
  return (
    <div ref={setNodeRef} data-containerid={containerId} className="mb-4">
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((uid) => (
          <SortableItem key={uid + '-' + (globalStates.openAccordions || []).join('_')} id={uid}>
            <StepContent
              uid={uid}
              path={pathPrefix.concat(uid)}
              allItems={allItems}
              globalStates={globalStates}
              onUpdate={onUpdate}
              onAddBloc={onAddBloc}
              onAddExercice={onAddExercice}
              onPaste={onPaste}
              openAccordions={globalStates.openAccordions}
            />
          </SortableItem>
        ))}
      </SortableContext>
    </div>
  );
}

export default function EditeurStructureSeance({
  initialStructure,
  onSave,
  isSubEditor = false,
  allItems: allItemsFromParent,
  containers: containersFromParent,
  onUpdate: onUpdateFromParent,
  globalStates: globalStatesFromParent,
  pathPrefix = [],
  isSaving = false
}) {
  const isRoot = !isSubEditor;
  
  const [state, setState] = useState(() => ({
    ...flattenStructure(initialStructure || []),
    lastAddedUid: null
  }));
  const { allItems, containers } = isRoot ? state : { allItems: allItemsFromParent, containers: containersFromParent };

  const onUpdate = isRoot
    ? (uid, data) => {
        let newUid = null;
        setState(currentState => {
          let { allItems, containers } = deepClone(currentState);

          if (data === null) {
            delete allItems[uid];
            for (const containerId in containers) {
              if(containers[containerId]) containers[containerId] = containers[containerId].filter(id => id !== uid);
            }
            return { allItems, containers, lastAddedUid: currentState.lastAddedUid };
          } else if (data.paste) {
            const { clipboardItem } = data;
            function deepCloneBloc(item) {
              const newUid = getUID();
              const cloned = { ...item, _uid: newUid };
              allItems[newUid] = cloned;
              if (item.type === 'bloc') {
                containers[newUid] = [];
                for (const child of item.contenu || []) {
                  const childCloneUid = deepCloneBloc(child);
                  containers[newUid].push(childCloneUid);
                }
              }
              return newUid;
            }

            let pastedUid;
            if (clipboardItem.type === 'bloc') {
              pastedUid = deepCloneBloc(clipboardItem);
            } else {
              pastedUid = getUID();
              allItems[pastedUid] = { ...clipboardItem, _uid: pastedUid };
            }

            if (data.paste === 'endOfContainer') {
              const { containerId } = data;
              if (!containers[containerId]) containers[containerId] = [];
              containers[containerId].push(pastedUid);
            } else if (data.paste === 'contextual') {
              const { position, targetUid } = data;
              const targetContainerId = findContainer(targetUid) || 'root';
              const targetContainer = containers[targetContainerId];
              const targetIndex = targetContainer.indexOf(targetUid);
              
              if (targetIndex === -1) {
                console.error("Target element for paste not found. Pasting at the end of container.");
                targetContainer.push(pastedUid);
              } else {
                const pasteIndex = position === 'before' ? targetIndex : targetIndex + 1;
                targetContainer.splice(pasteIndex, 0, pastedUid);
              }
            }
            return { allItems, containers, lastAddedUid: pastedUid };
          } else if (data.add) {
            const { item, containerId } = data;
            const addedUid = getUID();
            allItems[addedUid] = { ...item, _uid: addedUid };
            if (!containers[containerId]) containers[containerId] = [];
            containers[containerId].push(addedUid);
            if (item.type === 'bloc') {
              containers[addedUid] = [];
            }
            return { allItems, containers, lastAddedUid: addedUid };
          } else if (data.type === 'reorder') {
            const { containerId, activeId, overId } = data;
            if (containers[containerId]) {
                const containerItems = containers[containerId];
                const oldIndex = containerItems.indexOf(activeId);
                const newIndex = containerItems.indexOf(overId);
                if (oldIndex > -1 && newIndex > -1) {
                  containers[containerId] = arrayMove(containerItems, oldIndex, newIndex);
                }
            }
            return { allItems, containers, lastAddedUid: currentState.lastAddedUid };
          } else if (data.type === 'move') {
            const { activeId, activeContainerId, overContainerId, overId } = data;
            if (containers[activeContainerId]) {
                const activeIndex = containers[activeContainerId].indexOf(activeId);
                if(activeIndex > -1) {
                  containers[activeContainerId].splice(activeIndex, 1);
                }
            }

            if (containers[overContainerId]) {
                const overIndex = containers[overContainerId].indexOf(overId);
                const newIndex = overIndex >= 0 ? overIndex : containers[overContainerId].length;
                containers[overContainerId].splice(newIndex, 0, activeId);
            } else {
                containers[overContainerId] = [activeId];
            }
            return { allItems, containers, lastAddedUid: currentState.lastAddedUid };
          } else {
            allItems[uid] = data;
            return { allItems, containers, lastAddedUid: currentState.lastAddedUid };
          }
        });
        // Si on demande le retour de l'UID (ajout d'exercice), on le retourne
        if (data && data.add && data.returnUid) return newUid;
      }
    : onUpdateFromParent;
  
  const [activeId, setActiveId] = useState(null);
  const activeItem = activeId ? allItems[activeId] : null;

  const [openAccordions, setOpenAccordions] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [clipboard, setClipboard] = useState(null);
  const [isAddExoDialogOpen, setIsAddExoDialogOpen] = useState(false);
  const [addExoTargetPath, setAddExoTargetPath] = useState('root');
  // SUPPRIMER toute la logique liée à pendingOpenUid
  // const [pendingOpenUid, setPendingOpenUid] = useState(null);
  // Effet pour ouvrir l'accordéon du dernier élément ajouté dès qu'il apparaît dans allItems
  // useEffect(() => { ... }, [pendingOpenUid, allItems]);

  const globalStates = isRoot ? {
    openAccordions, setOpenAccordions,
    contextMenu, setContextMenu,
    clipboard, setClipboard,
    setIsAddExoDialogOpen, setAddExoTargetPath,
    containers
  } : globalStatesFromParent;

  const [exercices, setExercices] = useState([]);
  const [search, setSearch] = useState("");
  const dialogContentRef = useRef(null);

  useEffect(() => {
    if (isRoot) {
      setState(flattenStructure(initialStructure || []));
    }
  }, [initialStructure, isRoot]);

  useEffect(() => {
    if (isRoot) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/exercices`).then(r => r.json()).then(d => setExercices(d.exercices || []));
    }
  }, [isRoot]);

  // NOUVEL effet pour ouvrir l'accordéon du dernier bloc ajouté
  useEffect(() => {
    if (isRoot && state.lastAddedUid && allItems[state.lastAddedUid]) {
      setOpenAccordions((prev) =>
        prev.includes(state.lastAddedUid) ? prev : [...prev, state.lastAddedUid]
      );
      setState((s) => ({ ...s, lastAddedUid: null }));
    }
  }, [isRoot, state.lastAddedUid, allItems]);
  
  const findContainer = (uid) => {
    if (!uid) return null;
    if (containers.root && containers.root.includes(uid)) return 'root';
    for (const key in containers) {
      if (key !== 'root' && containers[key] && containers[key].includes(uid)) {
        return key;
      }
    }
    return null;
  };
  
  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    const overId = over.id;
    const activeContainer = findContainer(active.id);
    let overContainer = findContainer(overId);
  
    if (!overContainer && allItems[overId]?.type === 'bloc') {
      overContainer = overId;
    }
  
    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }
  
    onUpdate(null, {
      type: 'move',
      activeId: active.id,
      activeContainerId: activeContainer,
      overContainerId: overContainer,
      overId: over.id
    });
  };

  const handleAddBloc = (containerId) => {
    const newBloc = { type: 'bloc', nom: 'Nouvelle section', contenu: [], nbTours: 1 };
    onUpdate(null, { add: true, item: newBloc, containerId });
  };

  const handleAddExercice = (containerId) => {
    globalStates.setIsAddExoDialogOpen(true);
    globalStates.setAddExoTargetPath(containerId);
  };

  const handlePaste = (containerId) => {
    if (!globalStates.clipboard) return;
    onUpdate(null, { 
        paste: 'endOfContainer', 
        clipboardItem: globalStates.clipboard.item, 
        containerId 
    });
  };

  const sensors = useSensors(useSensor(PointerSensor));
  const containerIdToRender = isRoot ? 'root' : Object.keys(containers)[0];
  const uidsToRender = containers[containerIdToRender] || [];

  // Nouvelle fonction récursive pour rendre tous les conteneurs (racine + blocs)
  function renderContainer(containerId, pathPrefix = []) {
    const items = containers[containerId] || [];
    return (
      <DroppableContainer
        key={containerId}
        containerId={containerId}
        items={items}
        allItems={allItems}
        globalStates={globalStates}
        onUpdate={onUpdate}
        onAddBloc={handleAddBloc}
        onAddExercice={handleAddExercice}
        onPaste={handlePaste}
        activeId={activeId}
        pathPrefix={pathPrefix}
      />
    );
  }

  // handleDragEnd adapté au multiple containers
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) { setActiveId(null); return; }
    if (active.id === over.id) { setActiveId(null); return; }

    // Trouver le conteneur source et cible
    const findContainerId = (uid) => {
      for (const key in containers) {
        if (containers[key] && containers[key].includes(uid)) return key;
      }
      return null;
    };
    const activeContainerId = findContainerId(active.id);
    const overContainerId = findContainerId(over.id) || over.id;

    if (!activeContainerId || !overContainerId) { setActiveId(null); return; }

    // Si même conteneur, reorder
    if (activeContainerId === overContainerId) {
      onUpdate(null, {
        type: 'reorder',
        containerId: activeContainerId,
        activeId: active.id,
        overId: over.id
      });
    } else {
      // Déplacement entre conteneurs
      onUpdate(null, {
        type: 'move',
        activeId: active.id,
        activeContainerId,
        overContainerId,
        overId: over.id
      });
    }
    setActiveId(null);
  };

  // =================================================================
  // State pour la structure sauvegardée
  const [lastSavedStructure, setLastSavedStructure] = useState(initialStructure || []);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Détection de modification de la structure
  const hasChanged = useMemo(() => {
    if (!isRoot) return false;
    const current = JSON.stringify(buildNestedStructure(allItems, containers));
    const lastSaved = JSON.stringify(lastSavedStructure);
    return current !== lastSaved;
  }, [isRoot, allItems, containers, lastSavedStructure]);

  return (
    <div className="space-y-4 relative w-full">
       <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {/* Rendu récursif de tous les conteneurs */}
          {isRoot ? renderContainer('root') : renderContainer(Object.keys(containers)[0], pathPrefix)}
          <DragOverlay>
            {activeId ? <Item><StepContent uid={activeId} path={[]} allItems={allItems} globalStates={globalStates} onUpdate={() => {}} /></Item> : null}
          </DragOverlay>
        </DndContext>
      
      {isRoot && (
        <BarreActionsStructure
          onAddBloc={() => {
            const newBloc = { type: 'bloc', nom: 'Nouvelle section', contenu: [], nbTours: 1 };
            onUpdate(null, { add: true, item: newBloc, containerId: containerIdToRender });
          }}
          onAddExercice={() => handleAddExercice(containerIdToRender)}
          onPaste={() => handlePaste(containerIdToRender)}
          clipboard={clipboard}
        />
      )}
      
      {isRoot && onSave && (
        <FloatingSaveButton
          show={hasChanged}
          loading={isSaving}
          onClick={async () => {
            if (isSaving) return; // Empêcher les clics multiples
            const newStruct = buildNestedStructure(allItems, containers);
            try {
              await onSave(newStruct);
              setLastSavedStructure(newStruct);
              setSnackbarMessage("Structure enregistrée avec succès !");
            } catch (error) {
              // L'erreur est déjà gérée dans handleSaveStructure
              console.error("Erreur lors de la sauvegarde:", error);
            }
          }}
          label="Enregistrer"
        />
      )}

      {isRoot && (
        <AddExerciceDialog
          open={isAddExoDialogOpen}
          onClose={() => setIsAddExoDialogOpen(false)}
          search={search}
          setSearch={setSearch}
          onAddExercice={(exo) => {
            // Fonction pour appliquer la configuration automatique du bloc parent
            const applyParentConfig = (containerId) => {
              const defaultConfig = {
                series: 1,
                exerciceType: 'duree',
                repetitions: 0,
                temps_series: 30,
                temps_repos_series: 0,
                temps_repos_exercice: 0
              };
              
              const parentItem = allItems[containerId];
              if (parentItem?.type === 'bloc') {
                const p = parentItem;
                const hasAutoConfig =
                  p.valeur_series != null ||
                  (p.valeur_type_exercice ?? '') !== '' ||
                  (p.valeur_duree ?? '') !== '' ||
                  (p.valeur_repetitions ?? '') !== '' ||
                  (p.valeur_repos_series ?? '') !== '' ||
                  (p.valeur_repos_exercice ?? '') !== '';
                if (hasAutoConfig) {
                  return {
                    series: p.valeur_series ?? defaultConfig.series,
                    exerciceType: p.valeur_type_exercice || defaultConfig.exerciceType,
                    repetitions: (p.valeur_type_exercice || defaultConfig.exerciceType) === 'repetitions' ? (p.valeur_repetitions ?? defaultConfig.repetitions) : 1,
                    temps_series: (p.valeur_type_exercice || defaultConfig.exerciceType) === 'duree' ? (p.valeur_duree ?? defaultConfig.temps_series) : 1,
                    temps_repos_series: p.valeur_repos_series ?? defaultConfig.temps_repos_series,
                    temps_repos_exercice: p.valeur_repos_exercice ?? defaultConfig.temps_repos_exercice
                  };
                }
              }
              return defaultConfig;
            };

            const config = applyParentConfig(addExoTargetPath);
            
            // Gestion différente selon le type d'exercice (base de données ou libre)
            if (exo.id) {
              // Exercice de la base de données
              const newExo = {
                type: 'exercice',
                id: exo.id,
                nom: exo.nom,
                // Champs personnalisables - NE PAS initialiser avec les valeurs de base
                // Ils ne seront sauvegardés que s'ils sont explicitement modifiés
                // Champs de configuration
                ...config
              };
              onUpdate(null, { add: true, item: newExo, containerId: addExoTargetPath });
            } else {
              // Exercice libre - tous les champs sont déjà définis
              const newExo = {
                type: 'exercice',
                id: null, // Pas d'ID pour les exercices libres
                nom: exo.nom,
                // Champs personnalisables - déjà définis dans l'exercice libre
                description: exo.description || '',
                position_depart: exo.position_depart || '',
                conseils: exo.conseils || [],
                erreurs: exo.erreurs || [],
                focus_zone: exo.focus_zone || [],
                changement_cote: exo.changement_cote || false,
                // Champs de configuration
                ...config
              };
              onUpdate(null, { add: true, item: newExo, containerId: addExoTargetPath });
            }
            
            setSearch("");
          }}
        />
      )}
      <Snackbar message={snackbarMessage} type="success" onClose={() => setSnackbarMessage("")} />
    </div>
  );
} 