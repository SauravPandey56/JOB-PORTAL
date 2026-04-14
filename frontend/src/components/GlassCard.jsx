export default function GlassCard({ className = "", children }) {
  return (
    <div className={`glass-card hover-card-effect ${className}`}>
      {children}
    </div>
  );
}
