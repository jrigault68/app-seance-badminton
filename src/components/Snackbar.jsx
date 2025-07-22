import React, { useEffect } from 'react';

export default function Snackbar({ message, type = 'success', duration = 3000, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const colorClass =
    type === 'success' ? 'bg-green-700' :
    type === 'error' ? 'bg-red-700' :
    'bg-blue-700';

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 ${colorClass} text-white px-6 py-3 rounded shadow-lg z-50 text-lg animate-fade-in`}
      role="alert"
      onClick={onClose}
      style={{ cursor: 'pointer' }}
    >
      {message}
    </div>
  );
} 