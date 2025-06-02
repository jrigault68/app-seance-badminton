export function Progress({ value, max = 100, className = "" }) {
  return (
    <div className={`w-full bg-gray-200 h-2 rounded ${className}`}>
      <div
        className="h-2 bg-green-500 rounded"
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  );
}
