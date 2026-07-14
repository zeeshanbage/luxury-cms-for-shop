import React from "react";
import { cn } from "@/utils/cn";

interface LuxuryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "gold";
  children: React.ReactNode;
}

export function LuxuryButton({
  variant = "primary",
  className,
  children,
  ...props
}: LuxuryButtonProps) {
  return (
    <button
      className={cn(
        "relative px-8 py-3 text-xs tracking-widest uppercase font-sans font-medium transition-all duration-500 rounded-sm overflow-hidden select-none outline-none focus:outline-none",
        
        // Primary
        variant === "primary" && 
          "bg-white text-black hover:bg-luxury-gold hover:text-black border border-white hover:border-luxury-gold shadow-md",
        
        // Gold
        variant === "gold" && 
          "bg-luxury-gold text-black hover:bg-luxury-gold-bright border border-luxury-gold hover:border-luxury-gold-bright shadow-luxury-glow",

        // Outline
        variant === "outline" && 
          "bg-transparent border border-luxury-gold/40 text-luxury-gold hover:text-black hover:border-luxury-gold",

        // Ghost
        variant === "ghost" && 
          "bg-transparent hover:bg-white/5 text-zinc-300 hover:text-white border border-transparent",

        className
      )}
      {...props}
    >
      {/* Slide overlay animation block for outline/primary */}
      {(variant === "outline" || variant === "primary") && (
        <span className="absolute inset-0 w-full h-full bg-luxury-gold transform scale-x-0 origin-left transition-transform duration-500 hover:group-hover:scale-x-100 -z-10" />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
