import React from "react";

export default function CustomCheckbox({ label, checked, onChange, name, id, disabled = false, className = "", ...props }) {
  const inputId = id || `custom-checkbox-${name || Math.random()}`;
  return (
    <label className={`relative flex items-center cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} htmlFor={inputId}>
      <input
        type="checkbox"
        id={inputId}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer absolute opacity-0 w-0 h-0"
        {...props}
      />
      <span className="h-5 w-5 flex items-center justify-center border-2 border-gray-400 rounded transition-colors bg-gray-900 peer-checked:bg-brand-rose peer-checked:border-brand-rose">
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        )}
      </span>
      <span className="ml-3 text-white text-sm">{label}</span>
    </label>
  );
} 