import React from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ProgrammeFollowDialog({ 
  open, 
  onClose, 
  onConfirm, 
  type, 
  programme, 
  programmeActuel,
  loading = false 
}) {
  if (!open) return null;

  const getTitle = () => {
    switch (type) {
      case 'suivre':
        return 'Suivre ce programme';
      case 'arreter':
        return 'Arrêter de suivre ce programme';
      case 'reprendre':
        return 'Reprendre ce programme';
      case 'changer':
        return 'Changer de programme';
      default:
        return 'Confirmation';
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'suivre':
        return `Êtes-vous sûr de vouloir suivre le programme "${programme?.nom}" ?`;
      case 'arreter':
        return `Êtes-vous sûr de vouloir arrêter de suivre le programme "${programme?.nom}" ?`;
      case 'reprendre':
        return `Êtes-vous sûr de vouloir reprendre le programme "${programme?.nom}" ?`;
      case 'changer':
        return (
          <div>
            <p>Vous allez arrêter de suivre le programme "{programmeActuel?.nom}"</p>
            <p className="mt-2">et commencer à suivre le programme "{programme?.nom}"</p>
          </div>
        );
      default:
        return 'Êtes-vous sûr de vouloir effectuer cette action ?';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'suivre':
        return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'arreter':
        return <AlertTriangle className="w-8 h-8 text-orange-400" />;
      case 'reprendre':
        return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'changer':
        return <AlertTriangle className="w-8 h-8 text-blue-400" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
    }
  };

  const getConfirmText = () => {
    switch (type) {
      case 'suivre':
        return 'Suivre le programme';
      case 'arreter':
        return 'Arrêter de suivre';
      case 'reprendre':
        return 'Reprendre le programme';
      case 'changer':
        return 'Changer de programme';
      default:
        return 'Confirmer';
    }
  };

  const getConfirmColor = () => {
    switch (type) {
      case 'suivre':
        return 'bg-green-600 hover:bg-green-700';
      case 'arreter':
        return 'bg-orange-600 hover:bg-orange-700';
      case 'reprendre':
        return 'bg-green-600 hover:bg-green-700';
      case 'changer':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#18191a] border border-gray-700 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-4">
          {getIcon()}
        </div>
        
        <h2 className="text-xl font-bold text-white mb-4">{getTitle()}</h2>
        
        <div className="text-gray-200 mb-6">
          {getMessage()}
        </div>
        
        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </button>
          <button
            className={`px-6 py-2 rounded-full text-white transition ${getConfirmColor()}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Chargement...' : getConfirmText()}
          </button>
        </div>
      </div>
    </div>
  );
} 