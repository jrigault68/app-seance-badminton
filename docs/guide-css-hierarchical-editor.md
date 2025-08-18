# Guide d'utilisation des classes CSS pour éditeurs hiérarchiques

## 📋 **Vue d'ensemble**

Ce guide présente les classes CSS réutilisables pour créer des éditeurs hiérarchiques cohérents dans l'application. Ces classes sont basées sur le design de l'éditeur de structure de séance et peuvent être utilisées pour toutes les pages d'administration hiérarchique.

## 🎨 **Classes principales**

### **Conteneur principal**
```css
.hierarchical-editor          /* Conteneur principal avec espacement */
.hierarchical-editor-container /* Conteneur avec fond et bordure */
.hierarchical-editor-title    /* Titre de l'éditeur */
```

### **Éléments hiérarchiques**
```css
.hierarchical-item            /* Élément principal (bloc, zone, etc.) */
.hierarchical-item-header     /* En-tête de l'élément */
.hierarchical-item-content    /* Contenu principal */
.hierarchical-item-name       /* Nom de l'élément */
.hierarchical-item-icon       /* Icône de l'élément */
.hierarchical-item-actions    /* Actions (drag, edit, delete) */
.hierarchical-item-expanded   /* Contenu déplié */
```

### **Actions et interactions**
```css
.hierarchical-drag-button     /* Bouton de drag & drop */
.hierarchical-action-button   /* Bouton d'action générique */
.hierarchical-add-button      /* Bouton d'ajout */
.hierarchical-action-bar      /* Barre d'actions principale */
```

### **Navigation et états**
```css
.hierarchical-item-chevron    /* Flèche d'accordéon */
.hierarchical-item-chevron.open /* Flèche ouverte */
.hierarchical-dragging        /* État de drag */
.hierarchical-drag-overlay    /* Overlay de drag */
```

## 🔧 **Exemple d'utilisation**

### **Structure de base**
```jsx
<div className="hierarchical-editor">
  <div className="hierarchical-editor-container">
    <h2 className="hierarchical-editor-title">Mon éditeur</h2>
    
    {/* Éléments hiérarchiques */}
    <div className="hierarchical-item">
      <div className="hierarchical-item-header" onClick={toggleAccordion}>
        <div className="p-1">
          <ChevronRight className={`hierarchical-item-chevron ${isOpen ? 'open' : ''}`} />
        </div>
        <div className="hierarchical-item-content">
          <span className="hierarchical-item-icon">🦴</span>
          <span className="hierarchical-item-name">Nom de l'élément</span>
        </div>
        <div className="hierarchical-item-actions">
          <button className="hierarchical-drag-button">
            <GripVertical />
          </button>
          <button className="hierarchical-action-button">
            <MoreVertical />
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="hierarchical-item-expanded">
          {/* Contenu déplié */}
        </div>
      )}
    </div>
    
    {/* Barre d'actions */}
    <div className="hierarchical-action-bar">
      <button className="hierarchical-add-button">
        <Plus /> Ajouter
      </button>
    </div>
  </div>
</div>
```

### **Menu contextuel**
```jsx
<div className="hierarchical-context-menu">
  <button className="hierarchical-context-menu-item">
    <Copy /> Copier
  </button>
  <button className="hierarchical-context-menu-item danger">
    <Trash2 /> Supprimer
  </button>
</div>
```

### **Dialog de confirmation**
```jsx
<div className="hierarchical-confirm-dialog">
  <div className="hierarchical-confirm-content">
    <div className="hierarchical-confirm-title">Confirmation</div>
    <div className="hierarchical-confirm-message">Message...</div>
    <div className="hierarchical-confirm-actions">
      <button className="hierarchical-confirm-button cancel">Annuler</button>
      <button className="hierarchical-confirm-button confirm">Confirmer</button>
    </div>
  </div>
</div>
```

## 📱 **Responsive**

Les classes incluent automatiquement le support responsive :
- Sur mobile : padding réduit, boutons en colonne
- Sur desktop : layout horizontal, espacement normal

## 🎯 **Bonnes pratiques**

### **1. Structure cohérente**
- Toujours utiliser `.hierarchical-editor` comme conteneur principal
- Utiliser `.hierarchical-item` pour chaque élément hiérarchique
- Respecter la structure header → content → actions

### **2. États et interactions**
- Utiliser `.hierarchical-item-chevron.open` pour l'état ouvert
- Appliquer `.hierarchical-dragging` pendant le drag & drop
- Utiliser `.hierarchical-action-button` pour tous les boutons d'action

### **3. Accessibilité**
- Toujours inclure des `title` sur les boutons d'action
- Utiliser des icônes explicites (Lucide React)
- Maintenir un contraste suffisant

### **4. Performance**
- Les classes utilisent Tailwind CSS pour une taille optimale
- Pas de JavaScript supplémentaire requis
- Compatible avec le système de thème existant

## 🔄 **Migration depuis l'ancien système**

### **Avant (classes inline)**
```jsx
<div className="bg-gray-800/80 md:rounded-2xl rounded-lg mb-3 border border-gray-700 shadow-lg w-full">
  <div className="flex items-center gap-1.5 p-2">
    <span className="font-medium text-orange-300 select-none text-sm tracking-wide">
```

### **Après (classes réutilisables)**
```jsx
<div className="hierarchical-item">
  <div className="hierarchical-item-header">
    <span className="hierarchical-item-name">
```

## 📝 **Exemples concrets**

### **Page AdminZones**
- ✅ Utilise `.hierarchical-item` pour les zones du corps
- ✅ Utilise `.hierarchical-item` pour les zones spécifiques
- ✅ Utilise `.hierarchical-action-bar` pour les boutons d'ajout

### **Éditeur de structure de séance**
- ✅ Utilise `.hierarchical-item` pour les blocs
- ✅ Utilise `.hierarchical-item` pour les exercices
- ✅ Utilise `.hierarchical-context-menu` pour les menus

### **Futures pages d'administration**
- 🔄 Page AdminCatégories (à créer)
- 🔄 Page AdminFamilles (à créer)
- 🔄 Autres pages hiérarchiques

## 🎨 **Personnalisation**

Les classes peuvent être étendues en ajoutant des classes supplémentaires :

```jsx
<div className="hierarchical-item custom-item">
  <div className="hierarchical-item-header custom-header">
```

Ou en modifiant le fichier CSS :

```css
.hierarchical-item.custom-item {
  @apply border-blue-500;
}
```

## 📚 **Ressources**

- **Fichier CSS** : `src/styles/hierarchical-editor.css`
- **Import** : `src/index.css`
- **Exemple** : `src/pages/AdminZones.jsx`
- **Icons** : [Lucide React](https://lucide.dev/)
