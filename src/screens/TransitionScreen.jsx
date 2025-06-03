export function TransitionScreen({
  exo,
  globalProgress,
  transitionLeft,
  transitionTime,
  paused,
  setPaused,
  setIsActive,
  setTimeLeft,
  setTransition,
  speak,
  intervalRef,
  step,
  exercices
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-950 via-black to-red-900 text-white px-4">
      <div className="max-w-xl w-full bg-black/40 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
        <h2 className="text-2xl font-bold text-orange-300">Prépare-toi ! {step + 1} / {exercices.length}</h2>
		{exo.image && (
		  <div className="max-h-48 mx-auto pointer-events-none">
			<img src={exo.image} alt={exo.nom} className="mx-auto h-40 rounded-xl shadow-lg" />
		  </div>
		)}
        <p className="text-xl font-semibold">{exo.nom} ({exo.duration}s)</p>
		{exo.position_depart && <p className="text-sm text-orange-200"><b>Position de départ</b><br/>{exo.position_depart}</p>}
        {exo.description && <p className="text-sm text-orange-100">{exo.description}</p>}
        <p className="text-lg text-orange-300 font-bold">Début dans : {transitionLeft} sec</p>
        <div className="h-2 rounded bg-orange-300 overflow-hidden">
          <div className="bg-orange-500 h-full transition-all" style={{ width: `${(transitionTime - transitionLeft) * 100 / transitionTime}%`, transition: "width 1s linear" }} />
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => {
              const newState = !paused;
              if (newState && speechSynthesis) speechSynthesis.cancel();
              setPaused(newState);
            }}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl shadow text-white"
          >
            {paused ? "Reprendre" : "Pause"}
          </button>
          <button
            onClick={() => {
              clearInterval(intervalRef.current);
              setPaused(false);
              setTransition(false);
              setIsActive(true);
              setTimeLeft(exo.duration);
              speak("Début de l'exercice." + (exo.erreurs ? ` ${exo.erreurs}` : ""));
            }}
            className="px-4 py-2 bg-orange-700 hover:bg-orange-600 rounded-xl shadow text-white"
          >
            Passer
          </button>
        </div>
      </div>
    </div>
  );
}
