import { formatDureeTexte, getDetails } from "@/utils/helpers";
import ChronoCercle from "@/components/progressBar";

export function TransitionScreen({
  current = {},
  timeLeft,
  transitionTime,
  paused,
  setPaused,
  exerciceNumero,
  totalExercices,
  setStepIndex
}) {
  const exo = current.exo || null;		
  const nom = exo.nom || "Repos";
  const duree = exo.temps_series || 0;
  const position = exo.position_depart || null;
  const description = exo.description || null;
  const globalProgress = (exerciceNumero +1)  / totalExercices * 100

  return (
    <div className="min-h-screen w-full flex items-center justify-center flex-col gap-4 bg-gradient-to-br from-red-950 via-black to-red-900 text-white px-4">
		<div className="w-full max-w-md mx-auto space-y-1 text-center">
		  <div className="text-sm text-white/70 font-medium tracking-wide">
			Exercice {exerciceNumero + 1 } / {totalExercices}
		  </div>
		  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
			<div
			  className="h-full bg-rose-500 transition-all duration-500"
			  style={{ width: `${globalProgress}%` }}
			/>
		  </div>
		</div>
      <div className="max-w-xl w-full bg-white/10 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
        <h2 className="text-2xl font-bold text-orange-300">{exerciceNumero == 0
			? "C’est parti ! Prépare-toi pour le premier exercice !"
			: "Repos, prépare-toi pour la suite !"}</h2>

        {exo.image && (
          <div className="max-h-48 mx-auto pointer-events-none">
            <img src={exo.image} alt={nom} className="mx-auto h-40 rounded-xl shadow-lg" />
          </div>
        )}

        <p className="text-xl font-semibold">{nom} ({getDetails(exo)})</p>

        {position && (
          <p className="text-sm text-orange-200">
            <b>Position de départ</b><br />
            {position}
          </p>
        )}

        {description && (
          <p className="text-sm text-orange-100">{description}</p>
        )}

        <div className="flex justify-between items-center flex-wrap flex-col min-[400px]:flex-row gap-4 pt-4">
          <button onClick={() => {setPaused(!paused);}} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl shadow text-white justify-center" >
            {paused ? "Reprendre" : "Pause"}
          </button>
			<ChronoCercle timeLeft={timeLeft} duration={transitionTime} text={formatDureeTexte(timeLeft)} color={"red"} />
          <button onClick={() => {setStepIndex(prev => prev + 1);}} className="px-4 py-2 bg-orange-700 hover:bg-orange-600 rounded-xl shadow text-white justify-center" >
            Passer
          </button>
        </div>
      </div>
    </div>
  );
}
