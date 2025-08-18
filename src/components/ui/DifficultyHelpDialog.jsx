import React, { useState, useEffect } from 'react';
import { X, Dumbbell, Heart, Target, Move, Shield, Brain, ArrowLeft } from 'lucide-react';

const difficultyConfig = {
  force: {
    icon: Dumbbell,
    title: "Force / Intensité musculaire",
    description: "Niveau de sollicitation musculaire de l'exercice, indépendamment du nombre de répétitions",
    levels: [
      { range: "0-3", name: "Très faible", description: "Aucune charge, mouvement naturel" },
      { range: "4-7", name: "Faible", description: "Légère résistance, faible contraction" },
      { range: "8-11", name: "Modérée", description: "Résistance moyenne, effort notable" },
      { range: "12-15", name: "Élevée", description: "Forte résistance, effort intense" },
      { range: "16-20", name: "Très élevée", description: "Résistance maximale, effort extrême" }
    ]
  },
  cardio: {
    icon: Heart,
    title: "Cardio / Métabolique",
    description: "Impact intrinsèque de l'exercice sur la respiration et le rythme cardiaque",
    levels: [
      { range: "0-3", name: "Très faible", description: "Aucun essoufflement, respiration normale" },
      { range: "4-7", name: "Faible", description: "Léger essoufflement, respiration accélérée" },
      { range: "8-11", name: "Modérée", description: "Essoufflement notable, respiration rapide" },
      { range: "12-15", name: "Élevée", description: "Fort essoufflement, respiration très rapide" },
      { range: "16-20", name: "Très élevée", description: "Essoufflement extrême, respiration maximale" }
    ]
  },
  technique: {
    icon: Target,
    title: "Technique / Coordination",
    description: "Complexité du geste et risque d'erreur à l'exécution",
    levels: [
      { range: "0-3", name: "Très simple", description: "Mouvement naturel, aucune coordination" },
      { range: "4-7", name: "Simple", description: "Coordination basique, mouvement simple" },
      { range: "8-11", name: "Modérée", description: "Coordination moyenne, technique requise" },
      { range: "12-15", name: "Complexe", description: "Coordination avancée, technique précise" },
      { range: "16-20", name: "Très complexe", description: "Coordination expert, technique parfaite" }
    ]
  },
  mobilite: {
    icon: Move,
    title: "Mobilité / Amplitude requise",
    description: "Amplitude articulaire et souplesse nécessaires pour exécuter l'exercice.",
    levels: [
      { range: "0-3", name: "Très faible", description: "Aucune amplitude, position statique" },
      { range: "4-7", name: "Faible", description: "Amplitude limitée, mouvement simple" },
      { range: "8-11", name: "Modérée", description: "Amplitude moyenne, flexibilité requise" },
      { range: "12-15", name: "Élevée", description: "Grande amplitude, flexibilité avancée" },
      { range: "16-20", name: "Très élevée", description: "Amplitude maximale, flexibilité extrême" }
    ]
  },
  impact: {
    icon: Shield,
    title: "Impact articulaire / Risque",
    description: "Contraintes mécaniques ou traumatismes possibles sur les articulations",
    levels: [
      { range: "0-3", name: "Très faible", description: "Aucun impact, mouvement doux" },
      { range: "4-7", name: "Faible", description: "Impact léger, contact contrôlé" },
      { range: "8-11", name: "Modéré", description: "Impact moyen, stress articulaire" },
      { range: "12-15", name: "Élevé", description: "Impact fort, stress important" },
      { range: "16-20", name: "Très élevé", description: "Impact maximal, stress extrême" }
    ]
  },
  mentale: {
    icon: Brain,
    title: "Charge mentale / Cognitive",
    description: "Niveau de concentration et de contrôle requis pour exécuter correctement l'exercice",
    levels: [
      { range: "0-3", name: "Très faible", description: "Aucune concentration, automatique" },
      { range: "4-7", name: "Faible", description: "Concentration basique, attention simple" },
      { range: "8-11", name: "Modérée", description: "Concentration soutenue, focus requis" },
      { range: "12-15", name: "Élevée", description: "Concentration intense, focus avancé" },
      { range: "16-20", name: "Très élevée", description: "Concentration maximale, focus extrême" }
    ]
  }
};

const DifficultyHelpDialog = ({ open, onClose, difficultyType, onNoteSelect }) => {
  const [step, setStep] = useState('levels');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [exemples, setExemples] = useState({});
  const [loadingExemples, setLoadingExemples] = useState(false);

  const config = difficultyConfig[difficultyType];
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (open && difficultyType) {
      setStep('levels');
      setSelectedLevel(null);
      loadExemples();
    }
  }, [open, difficultyType]);

  const loadExemples = async () => {
    setLoadingExemples(true);
    try {
      const promises = Array.from({length: 21}, (_, i) => 
        fetch(`${apiUrl}/exercices?note_${difficultyType}=${i}&limit=1`)
      );
      const responses = await Promise.all(promises);
      const data = await Promise.all(responses.map(r => r.json()));
      
      const exemplesMap = {};
      data.forEach((result, index) => {
        if (result.exercices && result.exercices.length > 0) {
          // Vérifier que l'exercice a vraiment la note spécifiée (pas 0 par défaut)
          const exercice = result.exercices[0];
          const noteField = `note_${difficultyType}`;
          if (exercice[noteField] === index) {
            exemplesMap[index] = exercice;
          }
        }
      });
      setExemples(exemplesMap);
    } catch (error) {
      console.error('Erreur chargement exemples:', error);
    } finally {
      setLoadingExemples(false);
    }
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setStep('refinement');
  };

  const handleNoteSelect = (note) => {
    if (onNoteSelect) {
      onNoteSelect(note);
    }
    onClose();
  };

  const handleBack = () => {
    setStep('levels');
    setSelectedLevel(null);
  };

  const getLevelRange = (level) => {
    const [min, max] = level.range.split('-').map(Number);
    return Array.from({length: max - min + 1}, (_, i) => min + i);
  };

  const getExempleForNote = (note) => {
    return exemples[note] || null;
  };

  if (!open || !config) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {step === 'refinement' && (
            <button 
              onClick={handleBack}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <config.icon size={20} className="text-gray-300" />
            <h2 className="text-lg font-semibold text-white">
              {step === 'levels' 
                ? `${config.title}` 
                : `${config.title} - ${selectedLevel.name}`
              }
            </h2>
          </div>
          
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {step === 'levels' ? (
            /* Étape 1: Sélection du niveau */
            <div className="space-y-3">
              <p className="text-orange-400 text-lg mb-4">{config.description}</p>
              
              {config.levels.map((level, index) => (
                <button
                  key={index}
                  onClick={() => handleLevelSelect(level)}
                  className="w-full p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-orange-500 hover:bg-gray-750 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{level.name}</span>
                    <span className="text-orange-400 text-sm font-medium">{level.range}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{level.description}</p>
                </button>
              ))}
            </div>
          ) : (
            /* Étape 2: Affinement de la note */
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <h3 className="font-medium text-white mb-1">{selectedLevel.name}</h3>
                <p className="text-gray-300 text-sm">{selectedLevel.description}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {getLevelRange(selectedLevel).map((note) => {
                  const exemple = getExempleForNote(note);
                  return (
                    <button
                      key={note}
                      onClick={() => handleNoteSelect(note)}
                      className="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-orange-500 hover:bg-gray-750 transition-all text-center"
                    >
                      <div className="text-lg font-bold text-orange-400 mb-2">{note}</div>
                      {exemple ? (
                        <div className="text-xs text-gray-400">
                          <div className="font-medium mb-1">Ex : {exemple.nom}</div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">Aucun exemple</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DifficultyHelpDialog;
