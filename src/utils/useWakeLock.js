import { useEffect, useRef } from 'react';

export function useWakeLock(enabled = true) {
  const wakeLockRef = useRef(null);

  const requestWakeLock = async () => {
    if (!enabled || !('wakeLock' in navigator)) return;
    
    try {
      // Libérer l'ancien wake lock s'il existe
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
      }
      
      wakeLockRef.current = await navigator.wakeLock.request("screen");
      console.log('🔒 Wake Lock activé');
    } catch (err) {
      console.warn("Wake lock error:", err);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('🔓 Wake Lock libéré');
      } catch (err) {
        console.warn("Wake lock release error:", err);
      }
    }
  };

  useEffect(() => {
    if (!enabled) {
      releaseWakeLock();
      return;
    }

    // Demander le wake lock au montage
    requestWakeLock();

    // Gérer les événements de visibilité
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) {
        // Réactiver le wake lock quand la page redevient visible
        requestWakeLock();
      }
    };

    // Gérer les événements de focus/blur
    const handleFocus = () => {
      if (enabled) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      releaseWakeLock();
    };
  }, [enabled]);

  return { requestWakeLock, releaseWakeLock };
} 