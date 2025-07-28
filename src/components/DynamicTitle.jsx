import { useEffect } from 'react';
import { getDisplayName, getTagline } from '../config/brand';
import { usePageTitle } from '../contexts/PageTitleContext';

export default function DynamicTitle() {
  const { pageTitle } = usePageTitle();
  
  useEffect(() => {
    const title = pageTitle 
      ? `${pageTitle} - ${getDisplayName()}`
      : `${getDisplayName()} - ${getTagline()}`;
    
    document.title = title;
  }, [pageTitle]);

  return null; // Ce composant ne rend rien visuellement
} 