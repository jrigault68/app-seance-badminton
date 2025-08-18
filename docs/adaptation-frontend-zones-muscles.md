# Guide d'Adaptation Frontend - Zones du Corps et Zones Spécifiques

## 📋 **Vue d'ensemble des changements**

La restructuration des groupes musculaires en zones du corps et zones spécifiques nécessite les adaptations frontend suivantes :

### **Changements principaux :**
- Suppression de `groupe_musculaire_id` (entier) → Ajout de `zones_specifiques_ids` (array d'UUIDs)
- Nouvelle structure hiérarchique : **Zones du corps** → **Zones spécifiques**
- Sélection multiple possible pour les zones spécifiques
- Nouvelles routes API : `/zones/list` et `/zones-specifiques/list`

## 🔧 **Composants à adapter**

### **1. ExerciceDetail.jsx**

#### **États à modifier :**
```javascript
// SUPPRIMER
const [groupes, setGroupes] = useState([]);
const [selectedGroupe, setSelectedGroupe] = useState(null);

// AJOUTER
const [zones, setZones] = useState([]);
const [zonesSpecifiques, setZonesSpecifiques] = useState([]);
const [selectedZonesSpecifiques, setSelectedZonesSpecifiques] = useState([]);
```

#### **API calls à modifier :**
```javascript
// SUPPRIMER
const fetchGroupes = async () => {
  const response = await fetch('/exercices/groupes/list');
  const data = await response.json();
  setGroupes(data.groupes);
};

// AJOUTER
const fetchZones = async () => {
  const response = await fetch('/exercices/zones/list');
  const data = await response.json();
  setZones(data.zones);
};

const fetchZonesSpecifiques = async () => {
  const response = await fetch('/exercices/zones-specifiques/list');
  const data = await response.json();
  setZonesSpecifiques(data.zonesSpecifiques);
};
```

#### **Formulaire à modifier :**
```javascript
// SUPPRIMER
<FloatingLabelInput
  label="Groupe musculaire"
  type="select"
  value={selectedGroupe}
  onChange={(e) => setSelectedGroupe(e.target.value)}
  options={groupes.map(g => ({ value: g.id, label: g.nom }))}
/>

// AJOUTER - Sélecteur hiérarchique
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-300 mb-2">
    Zones et zones spécifiques travaillées
  </label>
  {zones.map(zone => (
    <div key={zone.id} className="mb-3">
      <div className="flex items-center mb-2">
        <span className="text-lg mr-2">{zone.icone}</span>
        <span className="font-medium text-gray-200">{zone.nom}</span>
      </div>
      <div className="ml-6 space-y-1">
        {zonesSpecifiques
          .filter(zs => zs.zone_corps_id === zone.id)
          .map(zoneSpecifique => (
            <label key={zoneSpecifique.zone_specifique_id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedZonesSpecifiques.includes(zoneSpecifique.zone_specifique_id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedZonesSpecifiques([...selectedZonesSpecifiques, zoneSpecifique.zone_specifique_id]);
                  } else {
                    setSelectedZonesSpecifiques(selectedZonesSpecifiques.filter(id => id !== zoneSpecifique.zone_specifique_id));
                  }
                }}
                className="mr-2"
              />
              <span className="text-sm text-gray-300">{zoneSpecifique.zone_specifique_nom}</span>
            </label>
          ))}
      </div>
    </div>
  ))}
</div>
```

#### **Affichage à modifier :**
```javascript
// SUPPRIMER
{exercice.groupe_musculaire_nom && (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
    {exercice.groupe_musculaire_nom}
  </span>
)}

// AJOUTER
{exercice.zones_corps_noms && exercice.zones_corps_noms.length > 0 && (
  <div className="flex flex-wrap gap-1">
    {exercice.zones_corps_noms.map((zone, index) => (
      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {zone}
      </span>
    ))}
  </div>
)}
{exercice.zones_specifiques_noms && exercice.zones_specifiques_noms.length > 0 && (
  <div className="flex flex-wrap gap-1 mt-1">
    {exercice.zones_specifiques_noms.map((zoneSpecifique, index) => (
      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
        {zoneSpecifique}
      </span>
    ))}
  </div>
)}
```

### **2. Exercices.jsx (liste des exercices)**

#### **Filtres à modifier :**
```javascript
// SUPPRIMER
const [selectedGroupe, setSelectedGroupe] = useState('');

// AJOUTER
const [selectedZone, setSelectedZone] = useState('');
const [selectedZoneSpecifique, setSelectedZoneSpecifique] = useState('');

// Modifier l'URL des filtres
const buildFilterUrl = () => {
  const params = new URLSearchParams();
  if (selectedZone) params.append('zone_corps', selectedZone);
  if (selectedZoneSpecifique) params.append('zone_specifique', selectedZoneSpecifique);
  // ... autres filtres
  return params.toString();
};
```

#### **Interface de filtres :**
```javascript
// SUPPRIMER
<select
  value={selectedGroupe}
  onChange={(e) => setSelectedGroupe(e.target.value)}
  className="..."
>
  <option value="">Tous les groupes</option>
  {groupes.map(groupe => (
    <option key={groupe.id} value={groupe.nom}>{groupe.nom}</option>
  ))}
</select>

// AJOUTER
<div className="flex gap-2">
  <select
    value={selectedZone}
    onChange={(e) => setSelectedZone(e.target.value)}
    className="..."
  >
    <option value="">Toutes les zones</option>
    {zones.map(zone => (
      <option key={zone.id} value={zone.nom}>{zone.nom}</option>
    ))}
  </select>
  
  <select
    value={selectedZoneSpecifique}
    onChange={(e) => setSelectedZoneSpecifique(e.target.value)}
    className="..."
  >
    <option value="">Toutes les zones spécifiques</option>
    {zonesSpecifiques
      .filter(zs => !selectedZone || zs.zone_corps_nom === selectedZone)
      .map(zoneSpecifique => (
        <option key={zoneSpecifique.zone_specifique_id} value={zoneSpecifique.zone_specifique_nom}>
          {zoneSpecifique.zone_specifique_nom}
        </option>
      ))}
  </select>
</div>
```

### **3. Composants de sélection**

#### **Créer un nouveau composant : ZoneSpecifiqueSelector.jsx**
```javascript
import React, { useState, useEffect } from 'react';

const ZoneSpecifiqueSelector = ({ selectedZonesSpecifiques, onZonesSpecifiquesChange, className = '' }) => {
  const [zones, setZones] = useState([]);
  const [zonesSpecifiques, setZonesSpecifiques] = useState([]);

  useEffect(() => {
    fetchZones();
    fetchZonesSpecifiques();
  }, []);

  const fetchZones = async () => {
    const response = await fetch('/exercices/zones/list');
    const data = await response.json();
    setZones(data.zones);
  };

  const fetchZonesSpecifiques = async () => {
    const response = await fetch('/exercices/zones-specifiques/list');
    const data = await response.json();
    setZonesSpecifiques(data.zonesSpecifiques);
  };

  const handleZoneSpecifiqueToggle = (zoneSpecifiqueId) => {
    if (selectedZonesSpecifiques.includes(zoneSpecifiqueId)) {
      onZonesSpecifiquesChange(selectedZonesSpecifiques.filter(id => id !== zoneSpecifiqueId));
    } else {
      onZonesSpecifiquesChange([...selectedZonesSpecifiques, zoneSpecifiqueId]);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-300">
        Zones et zones spécifiques travaillées
      </label>
      {zones.map(zone => (
        <div key={zone.id} className="border border-gray-600 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">{zone.icone}</span>
            <span className="font-medium text-gray-200">{zone.nom}</span>
          </div>
          <div className="ml-6 grid grid-cols-2 gap-2">
            {zonesSpecifiques
              .filter(zs => zs.zone_corps_id === zone.id)
              .map(zoneSpecifique => (
                <label key={zoneSpecifique.zone_specifique_id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedZonesSpecifiques.includes(zoneSpecifique.zone_specifique_id)}
                    onChange={() => handleZoneSpecifiqueToggle(zoneSpecifique.zone_specifique_id)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-300">{zoneSpecifique.zone_specifique_nom}</span>
                </label>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ZoneSpecifiqueSelector;
```

## 🎨 **Améliorations UI/UX suggérées**

### **1. Icônes et couleurs par zone**
```javascript
const zoneConfig = {
  muscles_bas_corps: { icon: '🦵', color: '#10B981' },
  muscles_haut_corps: { icon: '💪', color: '#F59E0B' },
  articulations: { icon: '🦴', color: '#3B82F6' },
  tendons_ligaments: { icon: '🔗', color: '#8B5CF6' },
  systeme_cardiovasculaire: { icon: '❤️', color: '#EF4444' },
  systeme_nerveux: { icon: '🧠', color: '#6366F1' }
};
```

### **2. Badges avec couleurs**
```javascript
const ZoneSpecifiqueBadge = ({ zoneSpecifique, zone }) => (
  <span 
    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
    style={{ 
      backgroundColor: `${zoneConfig[zone]?.color}20`,
      color: zoneConfig[zone]?.color 
    }}
  >
    <span className="mr-1">{zoneConfig[zone]?.icon}</span>
    {zoneSpecifique}
  </span>
);
```

### **3. Filtres avancés**
```javascript
const AdvancedFilters = () => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <h3 className="text-lg font-medium mb-3">Filtres avancés</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Zone du corps</label>
        <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2">
          <option value="">Toutes les zones</option>
          {zones.map(zone => (
            <option key={zone.id} value={zone.nom}>{zone.icone} {zone.nom}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Zone spécifique</label>
        <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2">
          <option value="">Toutes les zones spécifiques</option>
          {zonesSpecifiques.map(zoneSpecifique => (
            <option key={zoneSpecifique.zone_specifique_id} value={zoneSpecifique.zone_specifique_nom}>
              {zoneSpecifique.zone_specifique_nom}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
);
```

## 📝 **Checklist de migration**

### **Backend ✅**
- [x] Scripts SQL créés
- [x] Routes API adaptées
- [x] Documentation mise à jour

### **Frontend à faire**
- [ ] Adapter ExerciceDetail.jsx
- [ ] Adapter Exercices.jsx (liste)
- [ ] Créer ZoneSpecifiqueSelector.jsx
- [ ] Adapter les filtres
- [ ] Tester les nouvelles fonctionnalités
- [ ] Migrer les données existantes

### **Tests à effectuer**
- [ ] Création d'exercice avec nouveaux champs
- [ ] Modification d'exercice existant
- [ ] Filtrage par zone/zone spécifique
- [ ] Affichage des badges
- [ ] Validation des données

## 🚀 **Prochaines étapes**

1. **Exécuter les scripts SQL** dans l'ordre :
   - `restructuration-groupes-musculaires.sql`
   - `adaptation-vues-groupes-musculaires.sql`

2. **Adapter les composants frontend** selon ce guide

3. **Migrer les exercices existants** vers les nouvelles relations

4. **Tester l'application** complète

5. **Documenter les nouvelles fonctionnalités**
