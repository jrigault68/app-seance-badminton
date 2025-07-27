import { formatDureeTexte, getDetails } from "@/utils/helpers";
import ChronoCercle from "@/components/progressBar";
import { backgroundMainColor, blockStyle } from "@/styles/styles";

export function TransitionScreen({
  current = {},
  timeLeft,
  transitionTime,
  paused,
  setPaused,
  exerciceNumero,
  totalExercices,
  setStepIndex,
  // Ajout des props pour les séries et tours de bloc
  series = 1,
  serie = 1,
  total_series = 1,
  blocTour = 1,
  blocTourCourant = 1,
  totalBlocTour = 1,
}) {
  const exo = current.exo || null;		
  const nom = exo?.nom || "Repos";
  const duree = exo?.temps_series || 0;
  const position = exo?.position_depart || null;
  const description = exo?.description || null;
  const globalProgress = (exerciceNumero +1)  / totalExercices * 100

  return (
    <div className={`min-h-[calc(100vh-64px)] w-full flex items-center justify-center flex-col gap-4 ${backgroundMainColor} text-white px-4`}>
		<div className="w-full max-w-md mx-auto space-y-1 text-center">
		  <div className="text-sm text-white/70 font-medium tracking-wide">
			Exercice {exerciceNumero + 1 } / {totalExercices}
		  </div>
		  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
			<div
			  className="h-full bg-blue-500 transition-all duration-500"
			  style={{ width: `${globalProgress}%` }}
			/>
		  </div>
		</div>
      <div className={"max-w-xl w-full " + blockStyle + " text-center"}>
        {/* TODO : ne fonctionne pas, on n'a pas les infos de séries et de tours de bloc pour les repos, voir dans genereretapes.jsx */}
        {(series > 1 || totalBlocTour > 1) && (
          <div className="text-sm text-grey-700 font-medium tracking-wide">
            {series > 1 && (
              <span>
                Série {serie || 1} / {series}
              </span>
            )}
            {totalBlocTour > 1 && (
              <span>
                Série de la section {blocTour || 1} / {totalBlocTour}
              </span>
            )}
          </div>
        )}
        <h2 className="text-2xl font-bold text-blue-400">{exerciceNumero == 0
			? <>Préparation</>
			: "Repos"}</h2>

        {exo?.image && (
          <div className="max-h-48 mx-auto pointer-events-none">
            <img src={exo.image} alt={nom} className="mx-auto h-40 rounded-xl shadow-lg" />
          </div>
        )}

        <p className="text-xl font-semibold text-orange-300">{nom} ({getDetails(exo)})</p>

        {position && (
          <p className="text-sm text-grey-700">
            <b>Position de départ :</b><br />
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
			    <ChronoCercle timeLeft={timeLeft} duration={transitionTime} text={formatDureeTexte(timeLeft)} color={"blue"} />
          <button onClick={() => {setStepIndex(prev => prev + 1);}} className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-xl shadow text-white justify-center" >
            Passer
          </button>
        </div>
      </div>
    </div>
  );
}
