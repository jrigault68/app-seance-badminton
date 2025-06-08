import React, { useState, useEffect } from "react";
import { screenStyle } from "@/styles/styles";
import StyledButton from "@/components/StyledButton";
import { getParId } from "@/exercices/index";

export default function SelectionSeances({ onLoadSeance }) {
  const [availableSeances, setAvailableSeances] = useState({});
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const context = import.meta.glob("/src/seances/**/*.js");

    const loadAll = async () => {
      const grouped = {};
      await Promise.all(
        Object.entries(context).map(async ([path, loader]) => {
          try {
            const mod = await loader();
            const cleanPath = path.replace(/^.*\/seances\//, "").replace(".js", "");
            const segments = cleanPath.split("/");
            const folder = segments.length > 1 ? segments[0] : "non_classé";
            const name = segments.length > 1 ? segments[1] : segments[0];
            if (!grouped[folder]) grouped[folder] = [];
            grouped[folder].push({ name, path, loader, meta: mod.meta || null });
          } catch (err) {
            console.error("Erreur lors du chargement :", path, err);
          }
        })
      );
      setAvailableSeances(grouped);
    };

    loadAll();
  }, []);

  const loadSeance = async (path) => {
    setLoading(true);
    try {
      const file = Object.values(availableSeances).flat().find(f => f.path === path);
      const module = await file.loader();
      const structure = module.structure || [];
      const meta = module.meta || {};

      const exercices = structure.flatMap(etape => {
        if (etape.type === "bloc") {
          return etape.contenu.map(e => ({ ...getParId(e.id), ...e }));
        }
        return [{ ...getParId(etape.id), ...etape }];
      });

      onLoadSeance(structure, meta, exercices);
    } catch (err) {
      console.error("Erreur de chargement :", err);
      alert("Erreur : fichier non trouvé ou mal formaté");
    }
    setLoading(false);
  };

  return (
    <div className={screenStyle}>
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Choisis une séance</h1>

        {!selectedFolder ? (
          Object.keys(availableSeances).map((folder, idx) => (
            <StyledButton key={idx} onClick={() => setSelectedFolder(folder)}>
              {folder}
            </StyledButton>
          ))
        ) : (
          <>
            <StyledButton onClick={() => setSelectedFolder(null)} className="bg-gray-700">
              ← Retour
            </StyledButton>
            {availableSeances[selectedFolder]?.map((file, idx) => (
              <StyledButton key={idx} onClick={() => loadSeance(file.path)}>
                {file.meta?.nom || file.name}
              </StyledButton>
            ))}
          </>
        )}

        {loading && (
          <p className="text-center text-orange-400 italic mt-4">
            Chargement en cours...
          </p>
        )}
      </div>
    </div>
  );
}
