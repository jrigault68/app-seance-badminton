import React, { useState } from 'react';

const FloatingLabelInput = ({ label, value, onChange, type = 'text', as = 'input', size = 'normal', inputRef, placeholder, showClear = true, onClear, readonly = false, readonlyTooltip, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const InputComponent = as;
  const { className: customClassName, ...restOfProps } = props;

  // Définition des classes de base pour une meilleure lisibilité
  const baseClasses = readonly 
    ? 'block px-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 cursor-not-allowed peer' 
    : 'block px-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 peer';
  
  // Classes pour le padding, plus d'espace en haut
  const paddingClasses = 'pt-5 pb-2.5'; 

  // Classes pour la largeur, en fonction de la prop `size`
  const widthClass = size === 'small' ? 'w-40' : 'w-full';

  // Ajuster le padding pour les champs avec bouton de clear
  const shouldShowClear = showClear && !readonly && value !== null && value !== undefined && value !== '' && as !== 'select';
  // Appliquer un padding constant pour éviter le changement de taille
  // On garde toujours le padding maximum pour éviter le changement de taille
  const clearPaddingClass = (type === 'number' ? 'pr-12' : 'pr-8');

  // Classes spécifiques par type
  let typeClasses = '';
  if (type === 'number') {
    // Masque les flèches des champs numériques pour un look plus propre
    typeClasses = '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';
  } else if (type === 'date') {
    // Force l'icône du calendrier à être blanche sur fond sombre
    typeClasses = 'dark:[color-scheme:dark]';
  } else if (as === 'select') {
    // Masque la flèche par défaut et ajoute du padding pour la nouvelle icône
    typeClasses = 'appearance-none pr-8';
  }

  // Combinaison des classes
  const finalClassName = `${baseClasses} ${paddingClasses} ${widthClass} ${typeClasses} ${clearPaddingClass} ${customClassName || ''}`.trim();

  const handleStep = (amount) => {
    const min = restOfProps.min !== undefined ? Number(restOfProps.min) : -Infinity;
    const max = restOfProps.max !== undefined ? Number(restOfProps.max) : Infinity;
    
    const currentValue = Number(value) || 0;
    let newValue = currentValue + amount;
    
    // S'assurer que la valeur reste dans les bornes min/max
    newValue = Math.max(min, Math.min(newValue, max));
    
    // Simuler un événement onChange pour que le composant parent le reçoive
    const syntheticEvent = {
      target: { ...restOfProps, value: String(newValue) }
    };
    onChange(syntheticEvent);
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      // Simuler un événement onChange avec une valeur vide
      const syntheticEvent = {
        target: { ...restOfProps, value: '' }
      };
      onChange(syntheticEvent);
    }
  };

  const commonProps = {
    value,
    onChange: readonly ? undefined : onChange,
    placeholder: readonly ? ' ' : ((isFocused && !value) ? placeholder : ' '), // Affiche le vrai placeholder seulement si focus ET vide
    className: finalClassName,
    disabled: readonly,
    ...restOfProps,
    ...(inputRef ? { ref: inputRef } : {}),
    onFocus: readonly ? undefined : (e) => { setIsFocused(true); props.onFocus && props.onFocus(e); },
    onBlur: readonly ? undefined : (e) => { setIsFocused(false); props.onBlur && props.onBlur(e); },
  };
  
  // Le `as` prop permet d'utiliser 'textarea' au lieu de 'input'
  if (InputComponent !== 'textarea') {
    commonProps.type = type;
  } else {
     // Style spécifique pour le textarea
    commonProps.className += ' min-h-[80px]';
  }

  const id = restOfProps.id || `floating-input-${Math.random()}`;
  commonProps.id = id;

  const wrapperClassName = size === 'small' ? 'relative inline-block' : 'relative';

  return (
    <div className={wrapperClassName}>
      <InputComponent {...commonProps} />
      <label
        htmlFor={id}
        className={`absolute text-sm duration-300 transform z-10 origin-[0] px-2 left-1
                   peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                   top-4 -translate-y-3 scale-75
                   peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:top-4
                   max-w-full break-words whitespace-normal leading-snug text-xs
                   ${readonly ? 'text-gray-500 bg-gray-800' : 'text-gray-400 bg-gray-900 peer-focus:text-orange-400'}`}
        style={{
          maxWidth: (type === 'number' || as === 'select') ? 'calc(100% - 2.5rem)' : '100%',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          lineHeight: '1.2',
          paddingLeft: 6,
          paddingRight: (type === 'number' || as === 'select') ? 8 : 6
        }}
      >
        {label}
      </label>

      {type === 'number' && !readonly && (
        <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-center">
          <button
            type="button"
            onClick={() => handleStep(1)}
            aria-label="Incrémenter"
            tabIndex={-1}
            className="h-1/2 w-5 text-gray-400 hover:text-white flex items-center justify-center rounded-t-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
          </button>
          <button
            type="button"
            onClick={() => handleStep(-1)}
            aria-label="Décrémenter"
            tabIndex={-1}
            className="h-1/2 w-5 text-gray-400 hover:text-white flex items-center justify-center rounded-b-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        </div>
      )}

      {as === 'select' && !readonly && (
        <div className="absolute right-3 top-0 bottom-0 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      )}

      {/* Bouton de clear intégré */}
      {showClear && !readonly && value !== null && value !== undefined && value !== '' && as !== 'select' && (
        <div className={`absolute top-0 bottom-0 flex items-center ${type === 'number' ? 'right-8' : 'right-2'}`}>
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-800"
            title="Effacer"
            aria-label="Effacer le contenu"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}

      {/* Icône cadenas en mode readonly */}
      {readonly && (
        <div className="absolute right-3 top-0 bottom-0 flex items-center">
          <div className="relative group">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            {readonlyTooltip && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-gray-900 text-gray-100 text-xs rounded-lg p-2 shadow-2xl border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-normal">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900"></div>
                {readonlyTooltip}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingLabelInput; 