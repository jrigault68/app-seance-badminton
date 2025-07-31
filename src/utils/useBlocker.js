import { useBlocker as useRouterBlocker } from "react-router-dom";

// Hook personnalisé qui nettoie automatiquement le blocker
export function useSafeBlocker(blocker, when = true) {
  const routerBlocker = useRouterBlocker(when ? blocker : () => false);

  return routerBlocker;
}

// Export de useBlocker pour la compatibilité
export function useBlocker(blocker, when = true) {
  return useSafeBlocker(blocker, when);
} 