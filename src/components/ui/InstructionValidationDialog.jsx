import React, { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

const InstructionValidationDialog = ({ 
  isOpen, 
  onClose, 
  seance, 
  onValidate, 
  onDecline,
  isLoading = false 
}) => {
  const [commentaire, setCommentaire] = useState('');
  
  if (!isOpen || !seance) return null;

  const handleValidate = () => {
    onValidate(commentaire);
  };

  const handleDecline = () => {
    onDecline(commentaire);
  };

  const handleClose = () => {
    setCommentaire('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">
            Validation de la séance
          </h3>
                     <button
             onClick={handleClose}
             className="text-gray-400 hover:text-white transition-colors"
             disabled={isLoading}
           >
            <X size={24} />
          </button>
        </div>

                 {/* Content */}
         <div className="mb-6">
           <h4 className="text-lg font-medium text-orange-300 mb-3">
             {seance.seance?.nom || seance.nom}
           </h4>
           {(seance.seance?.description || seance.description) && (
               <p className="text-gray-300 whitespace-pre-line">
                 {seance.seance?.description || seance.description}
               </p>
           )}
         </div>

         {/* Champ commentaire */}
         <div className="mb-6">
           <label className="block text-sm font-medium text-gray-300 mb-2">
             Commentaire (optionnel)
           </label>
           <textarea
             value={commentaire}
             onChange={(e) => setCommentaire(e.target.value)}
             placeholder="Ajoutez un commentaire sur cette séance..."
             className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 resize-none"
             rows={3}
             disabled={isLoading}
           />
         </div>

                 {/* Actions */}
         <div className="flex gap-3">
           <button
             onClick={handleDecline}
             disabled={isLoading}
             className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white py-3 px-4 rounded-xl font-medium transition-colors"
           >
             <XCircle size={20} />
             Je n'ai pas fait
           </button>
           
           <button
             onClick={handleValidate}
             disabled={isLoading}
             className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white py-3 px-4 rounded-xl font-medium transition-colors"
           >
             <CheckCircle size={20} />
             J'ai fait
           </button>
         </div>

        {isLoading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400"></div>
            <p className="text-gray-400 mt-2">Enregistrement...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructionValidationDialog; 