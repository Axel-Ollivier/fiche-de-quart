export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border border-white/20 bg-white/10 p-6 shadow-md ${className}`}>
      {children}
    </div>
  );
}
export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
