import { AlertTriangle, RefreshCw, ServerOff } from "lucide-react";

export function DatabaseDown({
  error,
  onRetry,
}: {
  error?: Error | null;
  onRetry?: () => void;
}) {
  const errorMessage = error?.message || "Unable to reach database backend.";

  return (
    <div className="min-h-screen w-full bg-luxury-black flex flex-col items-center justify-center px-6 text-center select-text">
      <div className="glass-card max-w-md w-full p-8 sm:p-10 rounded-sm border border-luxury-gold/30 shadow-[0_0_50px_rgba(197,168,128,0.12)] space-y-6">
        
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center">
          <ServerOff size={28} className="text-luxury-gold" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-luxury-gold font-sans font-semibold">
            Connection Failed
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-medium">
            Database is Down
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed pt-1">
            Unable to connect to the backend database. The database is currently unreachable or offline.
          </p>
        </div>

        {/* Technical error snippet */}
        <div className="p-3 bg-black/60 rounded border border-white/5 text-left">
          <div className="flex items-center space-x-2 text-[10px] text-zinc-500 uppercase tracking-wider mb-1 font-mono">
            <AlertTriangle size={12} className="text-amber-400 shrink-0" />
            <span>Diagnostic Details</span>
          </div>
          <p className="font-mono text-[11px] text-zinc-300 break-words leading-tight">
            {errorMessage}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            if (onRetry) {
              onRetry();
            } else {
              window.location.reload();
            }
          }}
          className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-luxury-gold hover:bg-[#d8be96] text-black text-xs uppercase tracking-widest font-semibold font-sans rounded-sm transition-all duration-300 shadow-luxury-glow cursor-pointer"
        >
          <RefreshCw size={14} />
          <span>Retry Connection</span>
        </button>
      </div>
    </div>
  );
}
