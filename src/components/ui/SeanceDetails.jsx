import React from 'react';

const SeanceDetails = ({ seance }) => {
  if (!seance) return null;

  const renderTags = (tags, title, icon, colorClass = 'bg-blue-500/20') => {
    if (!tags || tags.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`${colorClass} text-white px-3 py-1 rounded-full text-sm font-medium border border-gray-600`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderMaterial = (materiel) => {
    if (!materiel || materiel.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">🛠️</span>
          Matériel requis
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {materiel.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 flex items-center"
            >
              <span className="mr-2">📦</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Description */}
      {seance.description && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <span className="mr-2">📝</span>
            Description
          </h3>
          <p className="text-gray-300 leading-relaxed bg-black/30 p-4 rounded-xl border border-gray-700">
            {seance.description}
          </p>
        </div>
      )}

      {/* Objectifs */}
      {renderTags(seance.objectifs, 'Objectifs', '🎯', 'bg-green-500/20')}

      {/* Catégories */}
      {renderTags(seance.categories, 'Catégories', '📂', 'bg-purple-500/20')}

      {/* Matériel requis */}
      {renderMaterial(seance.materiel_requis)}

      {/* Notes */}
      {seance.notes && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <span className="mr-2">💡</span>
            Notes
          </h3>
          <p className="text-gray-300 leading-relaxed bg-black/30 p-4 rounded-xl border border-gray-700">
            {seance.notes}
          </p>
        </div>
      )}

      {/* Tags */}
      {renderTags(seance.tags, 'Tags', '🏷️', 'bg-orange-500/20')}
    </div>
  );
};

export default SeanceDetails; 