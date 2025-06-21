import { useEffect } from 'react';
import { getDisplayName, getTagline } from '../config/brand';

export default function DynamicTitle({ pageTitle = null }) {
  useEffect(() => {
    const title = pageTitle 
      ? `${pageTitle} - ${getDisplayName()}`
      : `${getDisplayName()} - ${getTagline()}`;
    
    document.title = title;
  }, [pageTitle]);

  return null; // Ce composant ne rend rien visuellement
} 