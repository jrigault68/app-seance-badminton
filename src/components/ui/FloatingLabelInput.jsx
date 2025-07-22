import React from 'react';

const FloatingLabelInput = ({ label, value, onChange, type = 'text', as = 'input', size = 'normal', inputRef, ...props }) => {
  const InputComponent = as;
  const { className: customClassName, ...restOfProps } = props;

  // Définition des classes de base pour une meilleure lisibilité
  const baseClasses = 'block px-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 peer';
  
  // Classes pour le padding, plus d'espace en haut
  const paddingClasses = 'pt-5 pb-2.5'; 

  // Classes pour la largeur, en fonction de la prop `size`
  const widthClass = size === 'small' ? 'w-40' : 'w-full';

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
  const finalClassName = `${baseClasses} ${paddingClasses} ${widthClass} ${typeClasses} ${customClassName || ''}`.trim();

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

  const commonProps = {
    value,
    onChange,
    placeholder: ' ', // Nécessaire pour le sélecteur :placeholder-shown
    className: finalClassName,
    ...restOfProps,
    ...(inputRef ? { ref: inputRef } : {}),
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
        className="absolute text-sm text-gray-400 duration-300 transform z-10 origin-[0] bg-gray-900 px-2 left-1
                   peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                   top-4 -translate-y-3 scale-75
                   peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:top-4
                   peer-focus:text-orange-400
                   max-w-full break-words whitespace-normal leading-snug text-xs"
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

      {type === 'number' && (
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

      {as === 'select' && (
        <div className="absolute right-3 top-0 bottom-0 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      )}
    </div>
  );
};

export default FloatingLabelInput; 