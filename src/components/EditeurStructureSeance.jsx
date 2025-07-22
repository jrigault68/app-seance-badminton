import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronRight, GripVertical, MoreVertical, Copy, Trash2, ClipboardPaste, Plus, Search, Save, X } from 'lucide-react';
import FloatingLabelInput from "./ui/FloatingLabelInput";
import Snackbar from './Snackbar';
import Switch from "./ui/Switch";
import ExerciceAutocompleteInput from "./ui/ExerciceAutocompleteInput";

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
  const buildNode = (uid) => {
    const item = allItems[uid];
    if (item.type === 'bloc') {
      const childUids = containers[item._uid] || [];
      return { ...item, contenu: childUids.map(buildNode) };
    }
    return item;
  };
  return containers.root.map(buildNode);
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
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
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
    </div>
  );
}

// Dialog de détails d'exercice
function ExerciceDetailsDialog({ open, onClose, item }) {
  const [details, setDetails] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (open && item && item.id) {
      setLoading(true);
      setError(null);
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/exercices/${item.id}`)
        .then(r => r.json())
        .then(d => {
          if (d.exercice) {
            setDetails(d.exercice);
          } else {
            setError("Exercice non trouvé");
          }
        })
        .catch(() => setError("Erreur lors du chargement"))
        .finally(() => setLoading(false));
    } else if (!open) {
      setDetails(null);
      setError(null);
    }
  }, [open, item]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-6 min-w-[400px] max-w-lg w-full relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-orange-400"
          onClick={onClose}
          aria-label="Fermer"
        >
          <X size={18} />
        </button>
        <div className="text-orange-300 font-semibold mb-4">Détails de l'exercice</div>
        {loading ? (
          <div className="flex items-center justify-center py-8"><svg className="animate-spin h-6 w-6 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg></div>
        ) : error ? (
          <div className="text-red-400 text-center py-8">{error}</div>
        ) : details ? (
          <div className="text-sm text-gray-200 space-y-2 max-h-[32rem] overflow-y-auto pr-1">
            <div><b>Nom :</b> {details.nom}</div>
            {details.description && <div><b>Description :</b> {details.description}</div>}
            {details.position_depart && <div><b>Position de départ :</b> {details.position_depart}</div>}
            {details.categorie_nom && <div><b>Catégorie :</b> {details.categorie_nom} {details.categorie_icone && <span>{details.categorie_icone}</span>}</div>}
            {details.groupe_musculaire_nom && <div><b>Groupe musculaire :</b> {details.groupe_musculaire_nom}</div>}
            {details.zone_corps && <div><b>Zone du corps :</b> {details.zone_corps}</div>}
            {details.niveau_nom && <div><b>Niveau :</b> {details.niveau_nom}</div>}
            {details.type_nom && <div><b>Type :</b> {details.type_nom}</div>}
            {details.erreurs && Array.isArray(details.erreurs) && details.erreurs.length > 0 && <div><b>Erreurs fréquentes :</b> <ul className="list-disc ml-5">{details.erreurs.map((e,i) => <li key={i}>{e}</li>)}</ul></div>}
            {details.focus_zone && Array.isArray(details.focus_zone) && details.focus_zone.length > 0 && <div><b>Zones à focus :</b> <ul className="list-disc ml-5">{details.focus_zone.map((z,i) => <li key={i}>{z}</li>)}</ul></div>}
            {details.image_url && <div><b>Image :</b><br/><img src={details.image_url} alt="Aperçu exercice" className="max-h-32 rounded mt-1" /></div>}
            {details.video_url && <div><b>Vidéo :</b> <a href={details.video_url} target="_blank" rel="noopener noreferrer" className="text-orange-300 underline">Voir la vidéo</a></div>}
            {details.muscles_sollicites && Array.isArray(details.muscles_sollicites) && details.muscles_sollicites.length > 0 && <div><b>Muscles sollicités :</b> <ul className="list-disc ml-5">{details.muscles_sollicites.map((m,i) => <li key={i}>{m}</li>)}</ul></div>}
            {details.variantes && Array.isArray(details.variantes) && details.variantes.length > 0 && <div><b>Variantes :</b> <ul className="list-disc ml-5">{details.variantes.map((v,i) => <li key={i}>{v}</li>)}</ul></div>}
            {details.conseils && Array.isArray(details.conseils) && details.conseils.length > 0 && <div><b>Conseils :</b> <ul className="list-disc ml-5">{details.conseils.map((c,i) => <li key={i}>{c}</li>)}</ul></div>}
            {details.materiel && Array.isArray(details.materiel) && details.materiel.length > 0 && <div><b>Matériel :</b> <ul className="list-disc ml-5">{details.materiel.map((m,i) => <li key={i}>{m}</li>)}</ul></div>}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">Aucun détail à afficher</div>
        )}
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 border border-gray-600">Fermer</button>
        </div>
      </div>
    </div>
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
  const exerciceType = item.exerciceType || "repetitions";
  const moreBtnRef = useRef(null);
  const menuRef = useRef(null);
  const isMenuOpen = contextMenu && arraysEqual(contextMenu, path);
  const [showDetails, setShowDetails] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const detailsBtnRef = useRef(null);
  const detailsPopoverRef = useRef(null);

  // Ajout d'un état local pour les champs numériques (pour UX fluide)
  const [localNumFields, setLocalNumFields] = useState({});

  // Synchronise localNumFields avec item quand l'item change
  useEffect(() => {
    if (item) {
      setLocalNumFields({
        series: item.series !== undefined ? String(item.series) : '',
        repetitions: item.repetitions !== undefined ? String(item.repetitions) : '',
        temps_series: item.temps_series !== undefined ? String(item.temps_series) : '',
        temps_repos_series: item.temps_repos_series !== undefined ? String(item.temps_repos_series) : '',
        temps_repos_exercice: item.temps_repos_exercice !== undefined ? String(item.temps_repos_exercice) : '',
        nbTours: item.nbTours !== undefined ? String(item.nbTours) : '',
        temps_repos_bloc: item.temps_repos_bloc !== undefined ? String(item.temps_repos_bloc) : '',
      });
    }
  }, [item]);

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
  const handleChange = (field, value) => {
    // Si on change le type d'exercice, forcer la valeur inutilisée à 0
    if (field === 'exerciceType') {
      if (value === 'duree') {
        onUpdate(uid, { ...item, exerciceType: value, repetitions: 0 });
      } else if (value === 'repetitions') {
        onUpdate(uid, { ...item, exerciceType: value, temps_series: 0 });
      } else {
        onUpdate(uid, { ...item, [field]: value });
      }
    } else {
      onUpdate(uid, { ...item, [field]: value });
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
  const handlePaste = (position) => {
    if (!globalStates.clipboard) return;
    onUpdate(null, { 
        paste: 'contextual', 
        clipboardItem: globalStates.clipboard.item, 
        position, 
        targetUid: uid 
    });
  };

  // Handler générique pour les champs numériques
  const handleNumChange = (field, value) => {
    // Autorise la saisie libre (y compris vide)
    setLocalNumFields(f => ({ ...f, [field]: value }));
  };
  const handleNumBlur = (field) => {
    let val = localNumFields[field];
    let num = parseInt(val, 10);
    if (isNaN(num)) num = 0;
    onUpdate(uid, { ...item, [field]: num });
    setLocalNumFields(f => ({ ...f, [field]: num === 0 ? '' : String(num) }));
  };

  // Champs pour les deux modes
  const fieldsByType = {
    repetitions: [
      { label: "Nombre de séries", key: "series" },
      { label: "Nombre de répétitions par série", key: "repetitions" },
      { label: "Repos entre les séries (secondes)", key: "temps_repos_series" },
      { label: "Repos après l’exercice (secondes)", key: "temps_repos_exercice" },
    ],
    duree: [
      { label: "Nombre de séries", key: "series" },
      { label: "Durée d’une série (secondes)", key: "temps_series" },
      { label: "Repos entre les séries (secondes)", key: "temps_repos_series" },
      { label: "Repos après l’exercice (secondes)", key: "temps_repos_exercice" },
    ]
  };
  
  const getFieldWidthClass = (lbl) => {
      const len = lbl.length;
      if (len <= 15) return 'w-40';
      if (len <= 25) return 'w-56';
      return 'w-64';
  };

  return (
    <div className="bg-gray-800/80 md:rounded-2xl rounded-lg mb-3 border border-gray-700 shadow-lg w-full">
      <div className={`flex items-center gap-1.5 p-2`} onClick={toggleAccordion}>
        <div className="p-1"><ChevronRight className={`transition-transform duration-200 ${(openAccordions || []).includes(uid) ? 'rotate-90' : ''}`} size={18} /></div>
        <span className="font-medium text-orange-300 flex-grow select-none text-sm tracking-wide">{item.type === "bloc" ? item.nom || "Section" : item.nom || "Exercice"}</span>
        <div className="flex items-center gap-2">
          <button type="button" {...dragHandleListeners} className="p-1 cursor-grab active:cursor-grabbing" onClick={e => e.stopPropagation()}><GripVertical size={18} /></button>
          <div className="relative">
            <button type="button" ref={moreBtnRef} onClick={e => { e.stopPropagation(); setContextMenu(isMenuOpen ? null : path); }} className="p-1"><MoreVertical size={18} /></button>
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
      </div>
      { (openAccordions || []).includes(uid) && (
        <div className="p-4 border-t border-gray-700/50 space-y-4 cursor-default" onClick={e => e.stopPropagation()}>
          {item.type === "bloc" ? (
            <>
              <div className="space-y-4">
                <FloatingLabelInput label="Titre de la section" value={item.nom || ""} onChange={e => handleChange("nom", e.target.value)} />
                <FloatingLabelInput label="Description" as="textarea" value={item.description || ""} onChange={e => handleChange("description", e.target.value)} />
                {/* Switch pour intro_bloc */}
                <div className="flex items-center gap-3 mt-3 mb-2">
                  <Switch
                    checked={item.intro_bloc || false}
                    onChange={checked => handleChange("intro_bloc", checked)}
                    id={`intro-bloc-switch-${uid}`}
                  />
                  <label htmlFor={`intro-bloc-switch-${uid}`} className="text-sm text-orange-200 cursor-pointer select-none ml-1">
                    L'utilisateur lancera la section manuellement
                  </label>
                  <span className="relative group ml-2">
                    {/* Icône ? dans un cercle orange */}
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-md border-2 border-orange-400 group-hover:bg-orange-600 group-focus:bg-orange-600 transition-colors cursor-pointer outline-none" tabIndex={0}>
                      ?
                    </span>
                    <span className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 bg-orange-900 text-orange-100 text-xs rounded-lg p-3 shadow-2xl border border-orange-500 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50 pointer-events-none select-text">
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-orange-900"></span>
                      Affiche une page de présentation avant cette section. L'utilisateur devra appuyer sur 'Commencer la section' pour démarrer les exercices.
                    </span>
                  </span>
                </div>
                <div className="flex flex-row flex-wrap">
                  <div className="shrink-0 w-auto">
                    <FloatingLabelInput label="Nombre de tours" type="number" min={1} value={item.nbTours || 1} onChange={e => handleChange("nbTours", parseInt(e.target.value) || 1)} size="small" className={getFieldWidthClass("Nombre de tours")} />
                  </div>
                  { (item.nbTours > 1) && (
                  <div className="w-auto shrink-0 md:flex-1 mt-0 ml-4">
                    <FloatingLabelInput label="Temps de repos entre les tours (s)" type="number" min={0} value={item.temps_repos_bloc || 0} onChange={e => handleChange("temps_repos_bloc", parseInt(e.target.value) || 0)} size="small" className={getFieldWidthClass("Temps de repos entre les tours (s)")} />
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
                    <ExerciceAutocompleteInput
                      value={item.id ? { id: item.id, nom: item.nom } : null}
                      onChange={exo => {
                        // Met à jour tous les champs liés à l'exercice
                        onUpdate(uid, {
                          ...item,
                          id: exo.id,
                          nom: exo.nom,
                          // description: exo.description || "", // NE PAS mettre à jour la description
                          position_depart: exo.position_depart || "",
                          categorie_nom: exo.categorie_nom || "",
                          // Ajoute d'autres champs si besoin
                        });
                      }}
                      placeholder="Rechercher un exercice..."
                      label="Nom de l'exercice"
                    />
                  </div>
                  <button
                    type="button"
                    className="text-xs text-orange-300 underline hover:text-orange-400 focus:outline-none shrink-0 ml-2"
                    onClick={e => { e.stopPropagation(); setShowDetails(true); }}
                  >
                    Détails
                  </button>
                </div>
                <ExerciceDetailsDialog open={showDetails} onClose={() => setShowDetails(false)} item={item} />
                <FloatingLabelInput label="Description" as="textarea" value={item.description || ""} onChange={e => handleChange("description", e.target.value)} />
                {/* 1ère ligne : Nombre de séries et Repos entre les séries */}
                <div className="flex flex-row gap-4 items-end">
                  <div className="flex-1">
                    <FloatingLabelInput
                      label="Nombre de séries"
                      type="number"
                      min={1}
                      value={localNumFields.series ?? ''}
                      onChange={e => handleNumChange('series', e.target.value)}
                      onBlur={() => handleNumBlur('series')}
                      onFocus={e => e.target.select()}
                      size="small"
                      className={getFieldWidthClass("Nombre de séries")}
                    />
                  </div>
                  {item.series > 1 && (
                    <div className="flex-1">
                      <FloatingLabelInput
                        label="Repos entre les séries (secondes)"
                        type="number"
                        min={0}
                        value={localNumFields.temps_repos_series ?? ''}
                        onChange={e => handleNumChange('temps_repos_series', e.target.value)}
                        onBlur={() => handleNumBlur('temps_repos_series')}
                        onFocus={e => e.target.select()}
                        size="small"
                        className={getFieldWidthClass("Repos entre les séries (secondes)")}
                      />
                    </div>
                  )}
                </div>
                {/* 2ème ligne : Sélecteur du type d'exercice */}
                <FloatingLabelInput
                  as="select"
                  label="Type d'exercice"
                  value={exerciceType}
                  onChange={e => handleChange("exerciceType", e.target.value)}
                >
                  <option value="repetitions">Basé sur le nombre de répétitions</option>
                  <option value="duree">Basé sur la durée</option>
                </FloatingLabelInput>
                {/* 3ème ligne : Nombre de répétitions OU durée d'une série */}
                <div className="flex flex-row gap-4">
                  {exerciceType === "repetitions" ? (
                    <div className="flex-1">
                      <FloatingLabelInput
                        label="Nombre de répétitions par série"
                        type="number"
                        min={0}
                        value={localNumFields.repetitions ?? ''}
                        onChange={e => handleNumChange('repetitions', e.target.value)}
                        onBlur={() => handleNumBlur('repetitions')}
                        onFocus={e => e.target.select()}
                        size="small"
                        className={getFieldWidthClass("Nombre de répétitions par série")}
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <FloatingLabelInput
                        label="Durée d’une série (secondes)"
                        type="number"
                        min={0}
                        value={localNumFields.temps_series ?? ''}
                        onChange={e => handleNumChange('temps_series', e.target.value)}
                        onBlur={() => handleNumBlur('temps_series')}
                        onFocus={e => e.target.select()}
                        size="small"
                        className={getFieldWidthClass("Durée d’une série (secondes)")}
                      />
                    </div>
                  )}
                </div>
                {/* 4ème ligne : Repos après l’exercice */}
                <FloatingLabelInput
                  label="Repos après l’exercice (secondes)"
                  type="number"
                  min={0}
                  value={localNumFields.temps_repos_exercice ?? ''}
                  onChange={e => handleNumChange('temps_repos_exercice', e.target.value)}
                  onBlur={() => handleNumBlur('temps_repos_exercice')}
                  onFocus={e => e.target.select()}
                  size="small"
                  className={getFieldWidthClass("Repos après l’exercice (secondes)")}
                />
              </div>
            </>
          )}
          <ConfirmDialog
            open={showConfirmDelete}
            message={"Supprimer cette étape ?"}
            onCancel={() => setShowConfirmDelete(false)}
            onConfirm={handleConfirmDelete}
          />
        </div>
      )}
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
  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={e => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        ref={contentRef}
        className="bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-700 min-w-[400px] w-[420px] max-w-full"
      >
        <h2 className="text-xl font-bold mb-4 text-orange-300">Ajouter un Exercice</h2>
        <div className="space-y-3">
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
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 rounded scrollbar-thumb-rounded-full scrollbar-track-rounded-full pr-1 transition-opacity duration-200" style={{ scrollbarColor: '#374151 #111827', scrollbarWidth: 'thin', opacity: loading ? 0.7 : 1 }}>
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
                  {exo.nom}
                </button>
              ))
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="p-2 bg-gray-700 rounded-md text-sm hover:bg-gray-600 text-white border border-gray-600">Annuler</button>
        </div>
      </div>
    </div>
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
  pathPrefix = []
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
    const newBloc = { type: 'bloc', nom: 'Nouvelle Section', contenu: [], nbTours: 1 };
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

  const editorContent = (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {/* Rendu récursif de tous les conteneurs */}
      {isRoot ? renderContainer('root') : renderContainer(Object.keys(containers)[0], pathPrefix)}
      <DragOverlay>
        {activeId ? <Item><StepContent uid={activeId} path={[]} allItems={allItems} globalStates={globalStates} onUpdate={() => {}} /></Item> : null}
      </DragOverlay>
    </DndContext>
  );

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
      {isRoot ? editorContent : <div className="pl-4 border-l-2 border-gray-700">{editorContent}</div>}
      
      {isRoot && (
        <BarreActionsStructure
          onAddBloc={() => {
            const newBloc = { type: 'bloc', nom: 'Nouvelle Section', contenu: [], nbTours: 1 };
            onUpdate(null, { add: true, item: newBloc, containerId: containerIdToRender });
          }}
          onAddExercice={() => handleAddExercice(containerIdToRender)}
          onPaste={() => handlePaste(containerIdToRender)}
          clipboard={clipboard}
        />
      )}
      
      {isRoot && onSave && hasChanged && (
        <button
          onClick={() => {
            const newStruct = buildNestedStructure(allItems, containers);
            onSave(newStruct);
            setLastSavedStructure(newStruct);
            setSnackbarMessage("Structure enregistrée avec succès !");
          }}
          className="fixed bottom-6 right-4 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full shadow-lg z-20 flex items-center gap-2"
        >
          <Save size={20} />
          <span>Enregistrer</span>
        </button>
      )}

      {isRoot && (
        <AddExerciceDialog
          open={isAddExoDialogOpen}
          onClose={() => setIsAddExoDialogOpen(false)}
          search={search}
          setSearch={setSearch}
          onAddExercice={(exo) => {
            const newExo = {
              type: 'exercice',
              id: exo.id,
              nom: exo.nom,
              series: 1,
              repetitions: 0,
              temps_repos_series: 0,
              temps_repos_exercice: 0,
              temps_series: 0
            };
            onUpdate(null, { add: true, item: newExo, containerId: addExoTargetPath });
            setSearch("");
          }}
        />
      )}
      <Snackbar message={snackbarMessage} type="success" onClose={() => setSnackbarMessage("")} />
    </div>
  );
} 