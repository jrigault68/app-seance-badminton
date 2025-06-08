export function ActiveExerciceScreen({
  exo = {},
  timeLeft,
  paused,
  setPaused,
  setStepIndex,
  setFinished,
  exerciceNumero,
  totalExercices
}) {
  const nom = exo.nom || "Repos";
  const duration = exo.duration || 0;
  const description = exo.description || null;
  const position = exo.position_depart || null;
  const image = exo.image || null;
  const erreurCourante = exo.erreurCourante || null
  const globalProgress = exerciceNumero  / totalExercices * 100

  return (
    <div className="min-h-screen w-full flex items-center justify-center flex-col gap-4 bg-gradient-to-br from-red-950 via-black to-red-900 text-white px-4">
	<div className="w-full max-w-md mx-auto space-y-1 text-center">
		  <div className="text-sm text-white/70 font-medium tracking-wide">
			Exercice {exerciceNumero } / {totalExercices}
		  </div>
		  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
			<div
			  className="h-full bg-rose-500 transition-all duration-500"
			  style={{ width: `${globalProgress}%` }}
			/>
		  </div>
		</div>
      <div className="max-w-xl w-full bg-black/40 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
        <h2 className="text-2xl font-bold text-blue-300">
          {nom}
        </h2>

        {image && (
          <div className="max-h-48 mx-auto pointer-events-none">
            <img src={image} alt={nom} className="mx-auto h-40 rounded-xl shadow-lg" />
          </div>
        )}

        {description && (
          <p className="text-sm text-blue-100">{description}</p>
        )}

        {position && (
          <p className="text-sm italic text-blue-200">Position : {position}</p>
        )}

        {erreurCourante && (
          <p className="text-sm text-blue-100 italic">💡 {erreurCourante}</p>
        )}

        <p className="text-lg font-bold text-blue-100">Temps restant : {timeLeft}s</p>

        <div className="h-2 bg-blue-200 rounded">
          <div
            className="bg-blue-600 h-full transition-all"
            style={{
              width: `${((duration - timeLeft) * 100) / duration}%`,
              transition: "width 1s linear"
            }}
          />
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button onClick={() => {setPaused(!paused);}} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl shadow">
            {paused ? "Reprendre" : "Pause"}
          </button>
          <button onClick={() => { setStepIndex((prev) => prev + 1);}} className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-xl shadow">
            Passer
          </button>
        </div>
      </div>
    </div>
  );
}