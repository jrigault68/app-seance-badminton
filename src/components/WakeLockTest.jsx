import { useState } from 'react';
import { useWakeLock } from '@/utils/useWakeLock';

export default function WakeLockTest() {
  const [wakeLockEnabled, setWakeLockEnabled] = useState(false);
  const { requestWakeLock, releaseWakeLock } = useWakeLock(wakeLockEnabled);

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <h3 className="text-lg font-bold mb-4">Test Wake Lock</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="wakeLockToggle"
            checked={wakeLockEnabled}
            onChange={(e) => setWakeLockEnabled(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="wakeLockToggle">
            Activer le Wake Lock
          </label>
        </div>
        
        <div className="text-sm text-gray-300">
          <p>État: {wakeLockEnabled ? '🔒 Actif' : '🔓 Inactif'}</p>
          <p>Support navigateur: {'wakeLock' in navigator ? '✅ Supporté' : '❌ Non supporté'}</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={requestWakeLock}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
          >
            Forcer activation
          </button>
          <button
            onClick={releaseWakeLock}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
          >
            Forcer désactivation
          </button>
        </div>
      </div>
    </div>
  );
} 