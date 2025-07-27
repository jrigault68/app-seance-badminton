import React from "react";

export default function NavigationPromptDialog({ open, onConfirm, onCancel, onSaveAndQuit, savingAndQuit }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onCancel}>
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <div className="text-orange-300 font-semibold mb-4">
          Modifications non sauvegardées
        </div>
        <div className="text-white mb-6">
          Des changements ont été effectués sans être enregistrés.<br/>Voulez-vous vraiment quitter la page ?
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
            onClick={onCancel}
          >
            Rester
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 font-semibold"
            onClick={onConfirm}
          >
            Quitter
          </button>
          {onSaveAndQuit && (
            <button className="px-4 py-2 bg-green-600 rounded flex items-center gap-2 text-white" onClick={onSaveAndQuit} disabled={savingAndQuit}>
              {savingAndQuit && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
              )}
              Sauvegarder et quitter
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 