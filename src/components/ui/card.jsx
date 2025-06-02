export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border p-4 shadow-md bg-white ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={`p-2 ${className}`}>
      {children}
    </div>
  );
}
