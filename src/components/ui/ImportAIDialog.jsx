import React, { useState, useRef, useEffect } from "react";
import { X, Copy, Sparkles } from "lucide-react";

/** Icône uniforme pour le bouton d'ouverture du dialog (séances et exercices). */
export function ImportAIDialogTriggerIcon(props) {
  return <Sparkles size={20} className="text-purple-400" {...props} />;
}

/**
 * Dialog réutilisable pour l'import via IA (séances ou exercices).
 * Affiche une zone de description, génère le prompt (copie ou appel API), zone pour coller le JSON, appliquer.
 * Paramétré via les props pour les textes et comportements spécifiques (séance vs exercice).
 */
export default function ImportAIDialog({
  open,
  onClose,
  title,
  subtitle,
  descriptionLabel,
  promptPlaceholder,
  buildFullPrompt,
  onApplyJson,
  generateWithAI,
  isAnyProviderConfigured,
  texts = {},
  renderPreview,
}) {
  const defaultTexts = {
    copyPromptHint:
      "Copiez le prompt ci-dessous dans un chat IA (ChatGPT, Claude…), puis collez le JSON retourné dans la zone prévue.",
    pasteJsonLabel: "Collez ici le JSON retourné par l'IA",
    applyButtonLabel: "Appliquer",
    generateButtonLabel: "Générer le prompt",
    generateWithIALabel: "Générer avec IA",
    generatingLabel: "Génération...",
    closeLabel: "Fermer",
    editDescriptionLabel: "Modifier la description",
  };
  const t = { ...defaultTexts, ...texts };

  const [aiPrompt, setAiPrompt] = useState("");
  const [pasteJson, setPasteJson] = useState("");
  const [generatedPromptForCopy, setGeneratedPromptForCopy] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [applyError, setApplyError] = useState("");
  const [copied, setCopied] = useState(false);
  const aiPromptInputRef = useRef(null);

  const showResultView = !!(generatedPromptForCopy || aiResponse);

  const goBackToDescription = () => {
    setGeneratedPromptForCopy("");
    setAiResponse("");
    setAiError("");
    setApplyError("");
  };

  useEffect(() => {
    if (open) {
      setAiPrompt("");
      setPasteJson("");
      setGeneratedPromptForCopy("");
      setAiResponse("");
      setAiError("");
      setApplyError("");
      setTimeout(() => aiPromptInputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur copie:", err);
    }
  };

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) {
      setAiError("Décrivez ce que vous souhaitez générer.");
      return;
    }
    setAiError("");
    setAiResponse("");
    setGeneratedPromptForCopy("");

    if (!isAnyProviderConfigured()) {
      setGeneratedPromptForCopy(typeof buildFullPrompt === "function" ? buildFullPrompt(aiPrompt) : "");
      setPasteJson("");
      return;
    }

    setAiLoading(true);
    try {
      const response = await generateWithAI(aiPrompt);
      if (response) {
        setAiResponse(response);
        setGeneratedPromptForCopy("");
      } else {
        setGeneratedPromptForCopy(typeof buildFullPrompt === "function" ? buildFullPrompt(aiPrompt) : "");
        setPasteJson("");
      }
    } catch (err) {
      setAiError(err.message || "Erreur lors de la génération.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleApply = async (jsonText) => {
    const text = jsonText?.trim();
    if (!text) {
      setApplyError("Collez d'abord le JSON.");
      return;
    }
    setApplyError("");
    try {
      const result =
        typeof onApplyJson === "function" ? await onApplyJson(text) : undefined;
      if (result && typeof result === "object" && (result.success === false || result.error)) {
        setApplyError(result.error || "Erreur lors de l'application.");
        return;
      }
      onClose();
    } catch (err) {
      setApplyError(err.message || "Erreur lors de l'application du JSON.");
    }
  };

  const handleClose = () => {
    setAiError("");
    setApplyError("");
    setGeneratedPromptForCopy("");
    setPasteJson("");
    onClose();
  };

  if (!open) return null;

  const generateButtonText = aiLoading
    ? t.generatingLabel
    : isAnyProviderConfigured()
      ? t.generateWithIALabel
      : t.generateButtonLabel;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl border border-gray-700 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={handleClose}
          aria-label="Fermer"
        >
          <X size={18} />
        </button>
        <h2 className="text-lg font-bold text-white mb-1">{title}</h2>
        {showResultView && aiPrompt.trim() && (
          <p className="text-sm text-gray-400 mb-4 whitespace-pre-wrap max-h-20 overflow-y-auto">
            {aiPrompt}
          </p>
        )}

        <div className="space-y-4">
          {/* Vue initiale : description + bouton Générer */}
          {!showResultView && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  {descriptionLabel}
                </label>
                <textarea
                  ref={aiPromptInputRef}
                  className="w-full h-28 p-2 bg-gray-800 border border-gray-600 rounded text-white"
                  placeholder={promptPlaceholder}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>
              {aiError && (
                <div className="text-red-400 text-sm">{aiError}</div>
              )}
              <div className="flex justify-between gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                  onClick={handleClose}
                >
                  {t.closeLabel}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-semibold"
                  onClick={handleGenerate}
                  disabled={aiLoading}
                >
                  {generateButtonText}
                </button>
              </div>
            </>
          )}

          {/* Vue résultat : rappel description + lien modifier, contenu, barre Fermer / Appliquer en bas */}
          {showResultView && (
            <>
              <button
                type="button"
                className="text-sm text-gray-400 hover:text-white underline"
                onClick={goBackToDescription}
              >
                {t.editDescriptionLabel}
              </button>

              {generatedPromptForCopy && (
                <div className="space-y-3 rounded-lg border border-gray-600 bg-gray-800/50 p-3">
                  <p className="text-gray-300 text-sm">
                    {t.copyPromptHint}
                  </p>
                  <div className="relative">
                    <pre className="bg-black/70 text-gray-300 text-xs p-3 rounded overflow-x-auto max-h-48 whitespace-pre-wrap break-words pr-20">
                      {generatedPromptForCopy}
                    </pre>
                    <button
                      type="button"
                      className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
                      onClick={() => handleCopy(generatedPromptForCopy)}
                    >
                      <Copy size={14} /> {copied ? "Copié !" : "Copier"}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      {t.pasteJsonLabel}
                    </label>
                    <textarea
                      className="w-full h-24 p-2 bg-gray-800 border border-gray-600 rounded text-white text-xs font-mono"
                      placeholder='{"nom": "...", ...}'
                      value={pasteJson}
                      onChange={(e) => setPasteJson(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Réponse API : aperçu (sans bouton Appliquer inline) */}
              {aiResponse && !generatedPromptForCopy && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-orange-300">Résultat généré</h3>
                  <div className="bg-black/70 text-white text-xs rounded p-3 overflow-x-auto max-h-48">
                    {typeof renderPreview === "function" ? (
                      renderPreview(aiResponse)
                    ) : (
                      <pre className="whitespace-pre-wrap break-words">
                        {aiResponse}
                      </pre>
                    )}
                  </div>
                </div>
              )}

              {applyError && (
                <div className="text-red-400 text-sm">{applyError}</div>
              )}

              {/* Barre du bas : Fermer à gauche, Appliquer à droite (même disposition que Générer) */}
              <div className="flex justify-between gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                  onClick={handleClose}
                >
                  {t.closeLabel}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700 disabled:hover:bg-green-600"
                  onClick={() => (generatedPromptForCopy ? handleApply(pasteJson) : handleApply(aiResponse))}
                  disabled={generatedPromptForCopy ? !pasteJson.trim() : false}
                >
                  {t.applyButtonLabel}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
