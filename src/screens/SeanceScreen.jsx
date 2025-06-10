import React from "react";
import { screenStyle } from "@/styles/styles";
import StyledButton from "@/components/StyledButton";
import { getParId } from "@/exercices/index";
import { formatDureeTexte, estimerDureeEtape, getDetails } from "@/utils/helpers";

export default function SeanceScreen({ structure, meta, onStart, onReturn }) {
  if (!structure || !Array.isArray(structure) || !meta) {
    return <div className="text-center text-gray-400 italic">Aucune séance sélectionnée</div>;
  }

  const totalSeconds = structure.reduce((acc, etape) => acc + estimerDureeEtape(etape), 0);
  const totalMinutes = Math.ceil(totalSeconds / 60);

  const renderEtape = (etape, index) => {
    if (!etape) return null;

    if (etape.type === "bloc") {
      return (
        <li key={index} className="border-b border-gray-700 pb-2">
          <p className="font-semibold">🔁 Bloc {etape.repetitions || 1} séries</p>
          <ul className="pl-4 mt-1 space-y-1">
            {(etape.contenu || []).map((sousEtape, i) => renderEtape(sousEtape, `${index}-${i}`))}
          </ul>
        </li>
      );
    }

    const nom = getParId(etape.id)?.nom || etape.id;
    const desc = getDetails(etape);//.repetitions
      //? `${etape.series || 1} × ${etape.repetitions}`
      //: etape.temps_series
      //? `${etape.series || 1} × ${etape.temps_series}s`
      //: "?";

    return (
      <li key={index}>
        • <strong>{nom}</strong> – {desc}
      </li>
    );
  };

  return (
    <div className={screenStyle}>
      <div className="max-w-xl w-full space-y-4">
        <h2 className="text-xl font-bold">{meta?.nom || "Séance sans nom"}</h2>

        <div className="text-sm text-gray-300 space-y-1">
          {meta?.niveau && <p><strong>Niveau :</strong> {meta.niveau}</p>}
          {meta?.type && <p><strong>Type :</strong> {meta.type}</p>}
          {Array.isArray(meta?.categorie) && meta.categorie.length > 0 && (
            <p><strong>Catégories :</strong> {meta.categorie.join(", ")}</p>
          )}
          {meta?.description && <p className="italic">{meta.description}</p>}
        </div>

        {Array.isArray(meta?.objectifs) && meta.objectifs.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mt-4 mb-1">🎯 Objectifs</h3>
            <ul className="list-disc pl-5 text-sm">
              {meta.objectifs.map((objectif, idx) => (
                <li key={idx}>{objectif}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mt-4 mb-1">📋 Contenu de la séance</h3>
          <ul className="space-y-2 text-sm">
            {structure.map((etape, idx) => renderEtape(etape, idx))}
          </ul>
        </div>

        <p className="text-sm text-gray-400 mt-2">
          <strong>Durée estimée :</strong> ~{formatDureeTexte(totalSeconds)}
        </p>

        <div className="pt-4 flex flex-col gap-2">
          <StyledButton onClick={onStart}>Démarrer la séance</StyledButton>
          <StyledButton onClick={onReturn} className="bg-gray-700">← Retour</StyledButton>
        </div>
      </div>
    </div>
  );
}
