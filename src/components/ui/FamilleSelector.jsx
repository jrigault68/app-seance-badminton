import React, { useState, useEffect } from 'react';
import FloatingLabelInput from './FloatingLabelInput';

export default function FamilleSelector({ 
  value = '',
  onChange,
  placeholder = "Sélectionner une famille..."
}) {
  const [familles, setFamilles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les familles au montage du composant
  useEffect(() => {
    const chargerFamilles = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/familles-exercices?limit=100`);
        const data = await response.json();
        setFamilles(data.familles || []);
      } catch (error) {
        console.error('Erreur lors du chargement des familles:', error);
        setFamilles([]);
      } finally {
        setLoading(false);
      }
    };

    chargerFamilles();
  }, []);

  return (
    <FloatingLabelInput
      label="Famille d'exercices"
      value={value}
      onChange={onChange}
      as="select"
      disabled={loading}
    >
      <option value="">{loading ? 'Chargement...' : placeholder}</option>
      {familles.map(famille => (
        <option key={famille.id} value={famille.id}>
          {famille.nom}
        </option>
      ))}
    </FloatingLabelInput>
  );
}
