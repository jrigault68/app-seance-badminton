import React from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

/**
 * Blocks navigation until the user confirms the action.
 * @param {Function} blocker - A function that receives the transaction object and should call `tx.retry()` to proceed.
 * @param {boolean} when - A boolean that determines if the blocker is active.
 */
export function useBlocker(blocker, when = true) {
  const navigator = React.useContext(NavigationContext).navigator;

  React.useEffect(() => {
    if (!when) return;

    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          // Unblock before retrying the transition
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
} 