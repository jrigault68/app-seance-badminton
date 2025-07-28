import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const couleurMap = {
  blue: "#3b82f6",   // bg-blue-500
  red: "#ef4444",    // bg-red-500
  rose: "#f43f5e",   // bg-rose-500
  green: "#22c55e",  // optionnel
};

export default function ChronoCercle({ timeLeft, duration, text, color = "red" }) {
  const percentage = (timeLeft / duration) * 100;
const textSize = text.length > 6 ? "18px" : "24px";
  return (
    <div className="w-[100px] h-[100px] flex items-center justify-center m-auto">
      <CircularProgressbar
        value={percentage}
        text={`${text}`}
		counterClockwise={true}
        styles={buildStyles({
          pathColor: couleurMap[color] || "#ef4444",
          textColor: "#ffffff",       // blanc
          trailColor: "#1f1f1f",      // fond sombre
          textSize: textSize
        })}
      />
    </div>
  );
}
