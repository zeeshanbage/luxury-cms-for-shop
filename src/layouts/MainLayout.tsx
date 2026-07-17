import { Outlet, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Shield } from "lucide-react";
import { useSettings } from "@/hooks/useDbQueries";
import { getImageUrl } from "@/utils/image";
import { siteConfig } from "@/config/site";
import { imageConfig } from "@/config/images";

// Dynamic logo component using configured logo path
const StorefrontLogo = () => {
  const { data: settings } = useSettings();
  return (
    <div className="flex items-center justify-center select-none">
      <img
        src={getImageUrl((imageConfig as any).logo || "/images/brand-logo.png")}
        alt={settings?.site_name || siteConfig.name}
        className="h-14 sm:h-18 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(197,168,128,0.25)] transition-all duration-300 hover:scale-[1.02]"
      />
    </div>
  );
};

export default function MainLayout() {
  const { data: settings } = useSettings();

  const brandDescription = settings?.site_description || "";
  const address = settings?.address || "";
  const mapsLink = settings?.maps_link || "#";
  const phone = settings?.phone || "";
  const phoneFormatted = settings?.phone_formatted || "";
  const email = settings?.email || "";
  const socials = settings?.socials || { instagram: "#", whatsapp: "#", twitter: "#" };

  return (
    <div className="flex flex-col min-h-screen bg-luxury-black text-zinc-100 selection:bg-luxury-gold selection:text-black">
      {/* Premium Static Header (Not sticky, scrolls away naturally) */}
      <header className="relative w-full h-28 bg-transparent z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group py-1">
            <StorefrontLogo />
          </Link>

          {/* Contact CTA */}
          <div className="flex items-center">
            <Link
              to="/contact"
              className="relative px-6 py-2.5 text-xs tracking-widest uppercase border border-luxury-gold/40 text-luxury-gold hover:text-black font-sans font-medium transition-all duration-500 overflow-hidden group rounded-sm"
            >
              <span className="absolute inset-0 w-full h-full bg-luxury-gold transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100 -z-10" />
              Contact
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Layout Wrapper with Entry Transition */}
      <main className="flex-grow relative">
        {/* Soft atmospheric radial gradient glows */}
        <div className="ambient-glow top-[10%] left-[5%] pointer-events-none" />
        <div className="ambient-glow-large bottom-[15%] right-[5%] pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>

      {/* Sophisticated Luxury Footer */}
      <footer className="bg-black/90 border-t border-luxury-gold/10 pt-16 pb-8 text-zinc-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Footer Logo */}
          <div className="space-y-4">
            <Link to="/" className="group w-fit block">
              <StorefrontLogo />
            </Link>
            <p className="text-xs leading-relaxed font-light mt-4">
              {brandDescription}
            </p>
            <div className="flex space-x-4 pt-2">
              <Shield size={16} className="text-luxury-gold/60" />
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-light">Certified Bespoke Guild</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white font-serif font-semibold">
              The Maison
            </h3>
            <ul className="space-y-2.5 text-xs font-light">
              <li>
                <Link to="/" className="hover:text-luxury-gold transition-colors duration-200">
                  Home Showroom
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-luxury-gold transition-colors duration-200">
                  Contact Showroom
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white font-serif font-semibold">
              Appointments
            </h3>
            <ul className="space-y-3 text-xs font-light">
              <li className="flex items-start space-x-3">
                <MapPin size={14} className="text-luxury-gold shrink-0 mt-0.5" />
                <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors">
                  {address}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={14} className="text-luxury-gold shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-luxury-gold transition-colors">
                  {phoneFormatted}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={14} className="text-luxury-gold shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-luxury-gold transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Base */}
        <div className="max-w-7xl mx-auto px-6 border-t border-luxury-gold/5 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] font-light tracking-wider text-zinc-600">
          <div className="flex flex-col space-y-1 md:space-y-0 text-center md:text-left">
            <p>© {new Date().getFullYear()} {settings?.site_name || siteConfig.name}. ALL RIGHTS RESERVED.</p>
            <p className="text-[9px] text-zinc-700 uppercase tracking-widest mt-0.5">
              Developed by{" "}
              <a href="mailto:zeeshanbge@gmail.com" className="hover:text-luxury-gold transition-colors font-medium">
                Zeeshan Bage
              </a>
            </p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {socials.instagram && <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors uppercase">Instagram</a>}
            {socials.whatsapp && <a href={socials.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors uppercase">WhatsApp</a>}
            {socials.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors uppercase">Twitter</a>}
            <Link to="/admin" className="hover:text-luxury-gold transition-colors uppercase">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
