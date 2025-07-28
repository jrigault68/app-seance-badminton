import { formatDureeTexte, getDetails } from "@/utils/helpers";
import ChronoCercle from "@/components/progressBar";
import { backgroundMainColor, blockStyle } from "@/styles/styles";

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
  console.log("exo :", exo);
  const nom = exo.nom || "Repos";
  const duration = exo.duree || exo.duration || 0;
  const description = exo.description || null;
  const position = exo.position_depart || null;
  const image = exo.image || null;
  const erreurCourante = exo.erreurCourante || null
  const globalProgress = exerciceNumero  / totalExercices * 100

  return (
    <div className={`min-h-[calc(100vh-64px)] w-full flex items-center justify-center flex-col gap-4 ${backgroundMainColor} text-white px-4`}>
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
      <div className={"max-w-xl w-full " + blockStyle + " text-center"}>
        {(exo.series > 1 || exo.totalBlocTour > 1) && (
          <div className="text-sm text-orange-300 font-medium tracking-wide">
            {exo.series > 1 && (
              <span>
                Série {exo.serie || 1} / {exo.series}
              </span>
            )}
            {exo.totalBlocTour > 1 && (
              <span>
                Série de la section {exo.blocTour || 1} / {exo.totalBlocTour}
              </span>
            )}
          </div>
        )}
        <h2 className="text-2xl font-bold text-rose-400">
          {nom} ({getDetails(exo)})
        </h2>

        {image && (
          <div className="max-h-48 mx-auto pointer-events-none">
            <img src={image} alt={nom} className="mx-auto h-40 rounded-xl shadow-lg" />
          </div>
        )}

        {position && (
          <p className="text-sm text-grey-700">
            <b>Position de départ :</b><br />
            {position}
          </p>
        )}

        {description && (
          <p className="text-sm text-orange-100">{description}</p>
        )}

        {erreurCourante && (
          <p className="text-sm text-rose-200 italic">💡 {erreurCourante}</p>
        )}

		<div className={`flex items-center gap-4 pt-4 ${
			!exo.repetitions
				? "justify-between flex-wrap flex-col min-[400px]:flex-row"
				: "justify-end"
		}`}>
          {!exo.repetitions && (
            <>
              <button onClick={() => {setPaused(!paused);}} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl shadow text-white justify-center" >
                {paused ? "Reprendre" : "Pause"}
              </button>
              <ChronoCercle timeLeft={timeLeft} duration={duration} text={formatDureeTexte(timeLeft)} color={"red"} />
            </>
          )}
          <button onClick={() => {setStepIndex(prev => prev + 1);}} className="px-4 py-2 bg-rose-700 hover:bg-rose-600 rounded-xl shadow text-white justify-center" >
			    {exo.repetitions ? "Passer à la suite" : "Passer"}
          </button>
        </div>
      </div>
    </div>
  );
}