import React from "react";

export default function Switch({ checked, onChange, id, disabled = false }) {
  // Dimensions réduites
  const TRACK_WIDTH = 32;
  const TRACK_HEIGHT = 16;
  const THUMB_SIZE = 20;
  // Décalage pour que le thumb dépasse légèrement
  const THUMB_OFFSET = -3;
  const THUMB_TRANSLATE = checked ? TRACK_WIDTH - THUMB_SIZE - THUMB_OFFSET : THUMB_OFFSET;

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={0}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      onKeyDown={e => {
        if (!disabled && (e.key === " " || e.key === "Enter")) {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      className={`relative inline-flex items-center focus:outline-none transition-colors duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{ width: TRACK_WIDTH, height: TRACK_HEIGHT, background: 'none', minWidth: TRACK_WIDTH }}
    >
      {/* Track (barre fine) */}
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-full rounded-full transition-colors duration-200 shadow-inner ${checked ? 'bg-brand-rose' : 'bg-gray-300'}`}
        style={{ height: TRACK_HEIGHT, width: TRACK_WIDTH }}
      />
      {/* Thumb (rond flottant) */}
      <span
        className={`absolute top-1/2 -translate-y-1/2 transition-all duration-200 rounded-full shadow-lg bg-white border ${checked ? 'border-brand-rose' : 'border-gray-300'}`}
        style={{
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          left: THUMB_TRANSLATE,
          boxShadow: '0 1px 4px 0 #0002',
        }}
      />
    </button>
  );
} 