import React from "react";

export default function CustomRadio({ label, checked, onChange, name, value, id, disabled = false, className = "", ...props }) {
  // Correction : id unique par radio
  const inputId = id || `custom-radio-${name}-${value}`;

  function handleRadioChange(e) {
    if (disabled) return;
    if (onChange) onChange(e);
  }

  return (
    <label className={`relative flex items-center cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} htmlFor={inputId}>
      <input
        type="radio"
        id={inputId}
        name={name}
        value={value}
        checked={checked}
        onChange={handleRadioChange}
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />
      <span className="h-5 w-5 flex items-center justify-center border-2 border-gray-400 rounded-full transition-colors bg-gray-900 peer-checked:bg-brand-rose peer-checked:border-brand-rose">
        {checked && (
          <span className="block w-2 h-2 rounded-full bg-white" />
        )}
      </span>
      <span className="ml-3 text-white text-sm">{label}</span>
    </label>
  );
} 