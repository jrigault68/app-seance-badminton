import { useCallback, useEffect } from "react";
import { useBlocker } from "./useBlocker";

export function usePrompt(when, message) {
  const blocker = useCallback(
    (tx) => {
      // Le message est une fonction pour `react-router-dom` v6.4+
      if (window.confirm(message)) {
        tx.retry();
      }
    },
    [message]
  );

  useBlocker(blocker, when);

  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [when, message]);
} 