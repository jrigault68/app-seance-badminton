# Adaptation Frontend après Restructuration

## 🎯 **Champs supprimés de la base de données**

Les champs suivants ont été supprimés des tables `exercices` et `seances` :
- `niveau_id`
- `type_id` 
- `categorie_id` (remplacé par la relation many-to-many avec `sous_categories`)

## 📋 **Composants à adapter**

### 1. **SeanceDetail.jsx** (`src/pages/SeanceDetail.jsx`)

#### **Changements nécessaires :**

**Supprimer les états obsolètes :**
```javascript
// ❌ À supprimer
const [niveaux, setNiveaux] = useState([]);
const [types, setTypes] = useState([]);
```

**Modifier le formulaire :**
```javascript
// ❌ Ancien
const [form, setForm] = useState({ 
  nom: "", 
  description: "", 
  niveau_id: "", 
  type_id: "", 
  categorie_id: "", 
  notes: "", 
  structure: [], 
  type_seance: "exercice" 
});

// ✅ Nouveau
const [form, setForm] = useState({ 
  nom: "", 
  description: "", 
  sous_categories_ids: [], 
  notes: "", 
  structure: [], 
  type_seance: "exercice" 
});
```

**Supprimer les appels API obsolètes :**
```javascript
// ❌ À supprimer
fetch(`${apiUrl}/niveaux`).then(res => res.json()).then(setNiveaux);
fetch(`${apiUrl}/types`).then(res => res.json()).then(setTypes);
```

**Ajouter l'appel pour les sous-catégories :**
```javascript
// ✅ Nouveau
fetch(`${apiUrl}/exercices/sous-categories/list`)
  .then(res => res.json())
  .then(data => setSousCategories(data.sousCategories || []));
```

**Supprimer les champs du formulaire :**
```jsx
// ❌ À supprimer
<FloatingLabelInput label="Niveau" name="niveau_id" value={form.niveau_id} onChange={handleChange} as="select">
  <option value="" className="bg-gray-700 text-gray-400">Sélectionner un niveau</option>
  {niveaux.map(n => (<option key={n.id} value={n.id} className={'bg-gray-700 text-white'}>{n.nom}</option>))}
</FloatingLabelInput>

<FloatingLabelInput label="Type" name="type_id" value={form.type_id} onChange={handleChange} as="select">
  <option value="" className="bg-gray-700 text-gray-400">Sélectionner un type</option>
  {types.map(t => (<option key={t.id} value={t.id} className="bg-gray-700 text-white">{t.nom}</option>))}
</FloatingLabelInput>
```

**Remplacer par un sélecteur de sous-catégories :**
```jsx
// ✅ Nouveau - Sélecteur de sous-catégories multiples
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-300 mb-2">
    Sous-catégories
  </label>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
    {sousCategories.map(sc => (
      <label key={sc.sous_categorie_id} className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={form.sous_categories_ids.includes(sc.sous_categorie_id)}
          onChange={(e) => {
            if (e.target.checked) {
              setForm(prev => ({
                ...prev,
                sous_categories_ids: [...prev.sous_categories_ids, sc.sous_categorie_id]
              }));
            } else {
              setForm(prev => ({
                ...prev,
                sous_categories_ids: prev.sous_categories_ids.filter(id => id !== sc.sous_categorie_id)
              }));
            }
          }}
          className="rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
        />
        <span className="text-sm text-gray-300">
          {sc.sous_categorie_nom}
        </span>
      </label>
    ))}
  </div>
</div>
```

**Supprimer les badges obsolètes :**
```jsx
// ❌ À supprimer
<span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Niveau de la séance">
  <BarChart2 size={14} className="inline-block text-gray-300 mr-1" />
  {niveaux.find(n => n.id === Number(seance.niveau_id))?.nom || <span className="italic text-gray-500">Niveau inconnu</span>}
</span>

<span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Type de la séance">
  <Layers size={14} className="inline-block text-gray-300 mr-1" />
  {types.find(t => t.id === Number(seance.type_id))?.nom || <span className="italic text-gray-500">Type inconnu</span>}
</span>
```

**Remplacer par les badges de sous-catégories :**
```jsx
// ✅ Nouveau - Badges des sous-catégories
{seance.sous_categories_noms && seance.sous_categories_noms.map((nom, index) => (
  <span key={index} className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1">
    <Tag size={14} className="inline-block text-gray-300 mr-1" />
    {nom}
  </span>
))}
```

### 2. **ExerciceDetail.jsx** (`src/pages/ExerciceDetail.jsx`)

#### **Changements nécessaires :**

**Supprimer les états obsolètes :**
```javascript
// ❌ À supprimer
const [types, setTypes] = useState([]);
```

**Modifier le formulaire :**
```javascript
// ❌ Ancien
categorie_id: '',
type_id: '',

// ✅ Nouveau
sous_categories_ids: [],
```

**Supprimer l'appel API obsolète :**
```javascript
// ❌ À supprimer
fetch(`${apiUrl}/exercices/types/list`)
```

**Supprimer le champ type du formulaire :**
```jsx
// ❌ À supprimer
<FloatingLabelInput
  label="Type"
  name="type_id"
  value={form.type_id}
  onChange={handleChange}
  as="select"
>
  <option value="">Sélectionner un type</option>
  {types.map(type => (
    <option key={type.id} value={type.id}>{type.nom}</option>
  ))}
</FloatingLabelInput>
```

**Remplacer par le sélecteur de sous-catégories :**
```jsx
// ✅ Nouveau - Sélecteur de sous-catégories multiples
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-300 mb-2">
    Sous-catégories
  </label>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
    {sousCategories.map(sc => (
      <label key={sc.sous_categorie_id} className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={form.sous_categories_ids.includes(sc.sous_categorie_id)}
          onChange={(e) => {
            if (e.target.checked) {
              setForm(prev => ({
                ...prev,
                sous_categories_ids: [...prev.sous_categories_ids, sc.sous_categorie_id]
              }));
            } else {
              setForm(prev => ({
                ...prev,
                sous_categories_ids: prev.sous_categories_ids.filter(id => id !== sc.sous_categorie_id)
              }));
            }
          }}
          className="rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
        />
        <span className="text-sm text-gray-300">
          {sc.sous_categorie_nom}
        </span>
      </label>
    ))}
  </div>
</div>
```

### 3. **ProgrammeDetail.jsx** (`src/pages/ProgrammeDetail.jsx`)

#### **Changements nécessaires :**

**Supprimer les états obsolètes :**
```javascript
// ❌ À supprimer
const [niveaux, setNiveaux] = useState([]);
const [types, setTypes] = useState([]);
```

**Modifier le formulaire :**
```javascript
// ❌ Ancien
niveau_id: "",
type_id: "",

// ✅ Nouveau
sous_categories_ids: [],
```

**Supprimer les champs du formulaire :**
```jsx
// ❌ À supprimer
<FloatingLabelInput
  as="select"
  label="Niveau"
  name="niveau_id"
  value={form.niveau_id || ""}
  onChange={handleChange}
  required
>
  <option value="" className="bg-gray-700 text-gray-400">Sélectionner un niveau</option>
  {niveaux.map(n => (
    <option key={n.id} value={n.id} className={'bg-gray-700 text-white'}>{n.nom}</option>
  ))}
</FloatingLabelInput>

<FloatingLabelInput
  as="select"
  label="Type"
  name="type_id"
  value={form.type_id || ""}
  onChange={handleChange}
  required
>
  <option value="" className="bg-gray-700 text-gray-400">Sélectionner un type</option>
  {types.map(t => (
    <option key={t.id} value={t.id} className="bg-gray-700 text-white">{t.nom}</option>
  ))}
</FloatingLabelInput>
```

### 4. **Autres composants à vérifier**

- **Seances.jsx** - Vérifier les filtres et l'affichage
- **Exercices.jsx** - Vérifier les filtres et l'affichage
- **Programmes.jsx** - Vérifier les filtres et l'affichage
- **Tous les composants de sélection** - Vérifier les sélecteurs de catégories/types/niveaux

## 🔧 **Étapes de migration**

1. **Exécuter les scripts SQL** de restructuration
2. **Adapter les routes backend** (déjà fait)
3. **Adapter les composants frontend** selon ce guide
4. **Tester l'application** complète
5. **Migrer les données existantes** vers les nouvelles sous-catégories

## 📝 **Notes importantes**

- Les **sous-catégories** remplacent les anciens champs `categorie_id`, `type_id`, et `niveau_id`
- Un exercice/séance peut avoir **plusieurs sous-catégories**
- Les **filtres** doivent être adaptés pour utiliser les nouvelles vues
- Les **formulaires** doivent gérer la sélection multiple de sous-catégories
- Les **affichages** doivent montrer les sous-catégories au lieu des anciens champs
