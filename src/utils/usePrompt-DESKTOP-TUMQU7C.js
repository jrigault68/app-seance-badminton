import { useCallback, useEffect } from "react";
import { useBlocker } from "./useBlocker";

export function usePrompt(when, message) {
  const blocker = useCallback(
    (tx) => {
      if (window.confirm(message)) {
        tx.retry();
      }
    },
    [message]
  );
  useBlocker(blocker, when);

  // Ajout : bloque aussi la fermeture/actualisation de l'onglet
  useEffect(() => {
    if (!when) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [when, message]);
} 