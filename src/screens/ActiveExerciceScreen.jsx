export function ActiveExerciceScreen({ exo, globalProgress, timeLeft, paused, setPaused, setStep, setIsActive, setFinished, exercices, step, erreurCourante }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-950 via-black to-red-900 text-white px-4">
      <div className="max-w-xl w-full bg-black/40 rounded-2xl p-6 shadow-2xl space-y-4">
		<div className="h-2 bg-blue-300 rounded">
          <div className="bg-blue-500 h-full transition-all" style={{ width: `${globalProgress}%` }} />
        </div>
        <h2 className="text-2xl font-bold text-blue-300">{exo.nom} ({step + 1} / {exercices.length})</h2>
		{exo.image && (
		  <div className="max-h-48 mx-auto pointer-events-none">
			<img src={exo.image} alt={exo.nom} className="mx-auto h-40 rounded-xl shadow-lg" />
		  </div>
		)}
       
        {exo.description && <p className="text-sm text-blue-100">{exo.description}</p>}
        {exo.position && <p className="text-sm italic text-blue-200">Position : {exo.position_depart}</p>}
		{erreurCourante && <p className="text-sm text-blue-100 italic">💡 {erreurCourante}</p>}
        <p className="text-lg font-bold text-blue-100">Temps restant : {timeLeft}s</p>
        <div className="h-2 bg-blue-200 rounded">
          <div className="bg-blue-600 h-full transition-all" style={{ width: `${(exo.duration - timeLeft) * 100 / exo.duration}%`, transition: "width 1s linear" }} />
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => {
              const newState = !paused;
              if (newState && speechSynthesis) speechSynthesis.cancel();
              setPaused(newState);
            }}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl shadow"
          >
            {paused ? "Reprendre" : "Pause"}
          </button>
          <button
            onClick={() => {
              setPaused(false);
              setIsActive(false);
              if (step + 1 >= exercices.length) {
                setFinished(true);
                return;
              }
              setStep(prev => prev + 1);
            }}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-xl shadow"
          >
            Passer
          </button>
        </div>
      </div>
    </div>
  );
}
