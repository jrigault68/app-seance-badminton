export function FinishedScreen({ startTime, resetToAccueil }) {
  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-950 via-black to-red-900 text-white px-4">
      <div className="max-w-xl w-full bg-black/40 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
        <h1 className="text-3xl font-bold text-green-300">👏 Séance terminée !</h1>
        <p className="text-lg text-green-100">Bravo pour ton engagement.</p>
        <p className="text-md">Temps total : {minutes} min {seconds} sec</p>
        <button
          onClick={resetToAccueil}
          className="px-6 py-2 bg-green-700 hover:bg-green-600 rounded-xl shadow mt-4"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
