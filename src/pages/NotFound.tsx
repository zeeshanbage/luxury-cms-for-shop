import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden min-h-[75vh] flex items-center justify-center py-20 text-center">
      {/* Background design elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[30%] left-[35%] w-[30%] h-[30%] bg-luxury-gold/5 blur-[100px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-xl mx-auto px-6 relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-luxury-black-elevated border border-luxury-gold/15 text-luxury-gold mb-6 shadow-luxury-glow animate-pulse-slow"
        >
          <Compass size={36} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="space-y-4"
        >
          <span className="text-xs uppercase tracking-[0.4em] font-sans font-semibold text-luxury-gold">
            Error 404
          </span>
          <h1 className="text-4xl md:text-5xl font-light font-serif text-white tracking-wide uppercase">
            Sartorial Path <br />
            <span className="italic font-normal text-gold-gradient">Not Found</span>
          </h1>
          <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-sm mx-auto">
            The page you are searching for does not exist in our archive. It may have been relocated or archived.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-6 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 max-w-xs sm:max-w-none mx-auto"
        >
          <Link
            to="/"
            className="px-8 py-3.5 bg-luxury-gold hover:bg-luxury-gold-bright text-black font-sans font-semibold tracking-widest text-xs uppercase transition-all duration-300 rounded-sm inline-flex items-center justify-center gap-2 shadow-luxury-glow"
          >
            <ArrowLeft size={14} />
            Return to Atelier
          </Link>
          <Link
            to="/services"
            className="px-8 py-3.5 border border-zinc-800 hover:border-luxury-gold/40 text-zinc-300 hover:text-white font-sans font-semibold tracking-widest text-xs uppercase transition-all duration-300 rounded-sm inline-flex items-center justify-center"
          >
            Bespoke Services
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
