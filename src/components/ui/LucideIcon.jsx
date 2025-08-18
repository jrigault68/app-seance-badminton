import React from 'react';
import { DynamicIcon } from 'lucide-react/dynamic';

export default function LucideIcon({ 
  name, 
  size = 24, 
  className = "", 
  color = "currentColor",
  fallback = null 
}) {
  // Si pas de nom d'icône, retourner le fallback ou null
  if (!name) {
    return fallback || null;
  }

  // Rendu de l'icône avec DynamicIcon
  return (
    <DynamicIcon 
      name={name} 
      size={size} 
      className={className}
      color={color}
    />
  );
}
