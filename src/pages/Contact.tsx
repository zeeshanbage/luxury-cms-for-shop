import { motion } from "framer-motion";
import { Compass, Phone, Mail, MapPin } from "lucide-react";
import { useSettings } from "@/hooks/useDbQueries";

const InstagramIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Contact() {
  const { data: settings } = useSettings();

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Safe defaults
  const address = settings?.address || "Takiya Masjid Road, Shahinsha Nagar, Beed, Maharashtra 431122";
  const phoneFormatted = settings?.phone_formatted || "+91 99604 34588";
  const phone = settings?.phone || "+919960434588";
  const email = settings?.email || "contact@fashionkingbeed.com";
  const businessHours = settings?.business_hours || [
    { days: "Monday — Saturday", hours: "10:00 AM — 09:30 PM" },
    { days: "Sunday", hours: "11:00 AM — 09:00 PM" },
    { days: "Weekly Holiday", hours: "Open Seven Days", highlight: true }
  ];
  const mapsLink = settings?.maps_link || "https://maps.app.goo.gl/sBvFjZnwmzMa6wD59";
  const instagramUrl = settings?.socials?.instagram || "https://www.instagram.com/fashion_king_1188/?hl=en";

  return (
    <div className="py-20 md:py-32 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-luxury-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-[0.4em] font-sans font-medium text-luxury-gold inline-flex items-center gap-2">
              <Compass size={12} className="animate-pulse" />
              Showroom Maison
            </span>
            <h1 className="text-4xl md:text-6xl font-light tracking-wide text-white leading-tight">
              Visit Our <span className="italic font-serif text-gold-gradient font-medium">Showroom</span>
            </h1>
            <p className="text-zinc-400 font-light leading-relaxed max-w-xl">
              Visit us to browse our collections, select custom fabrics, and get measured by our master tailors. Walk-ins and appointments are welcome.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">
            {/* Info Section */}
            <motion.div variants={itemVariants} className="lg:col-span-5 space-y-8 flex flex-col justify-between">
              <div className="space-y-8">
                {/* Showroom Details */}
                <div className="glass-card p-8 rounded-sm space-y-6">
                  <h2 className="text-lg uppercase tracking-widest font-serif text-white pb-3 border-b border-luxury-gold/10">
                    The Showroom
                  </h2>

                  <ul className="space-y-5">
                    <li className="flex items-start space-x-4">
                      <MapPin size={18} className="text-luxury-gold mt-1 shrink-0" />
                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">Location</p>
                        <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="text-sm font-light text-zinc-200 hover:text-luxury-gold transition-colors">{address}</a>
                      </div>
                    </li>

                    <li className="flex items-start space-x-4">
                      <Phone size={18} className="text-luxury-gold mt-1 shrink-0" />
                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">Telephone</p>
                        <a href={`tel:${phone}`} className="text-sm font-light text-zinc-200 hover:text-luxury-gold transition-colors">{phoneFormatted}</a>
                      </div>
                    </li>

                    <li className="flex items-start space-x-4">
                      <Mail size={18} className="text-luxury-gold mt-1 shrink-0" />
                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">Email</p>
                        <a href={`mailto:${email}`} className="text-sm font-light text-zinc-200 hover:text-luxury-gold transition-colors">{email}</a>
                      </div>
                    </li>

                    <li className="flex items-start space-x-4">
                      <InstagramIcon size={18} className="text-luxury-gold mt-1 shrink-0" />
                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">Instagram</p>
                        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-light text-zinc-200 hover:text-luxury-gold transition-colors">
                          @fashion_king_1188
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Hours details */}
                <div className="glass-card p-8 rounded-sm space-y-6">
                  <h2 className="text-lg uppercase tracking-widest font-serif text-white pb-3 border-b border-luxury-gold/10">
                    Hours of Business
                  </h2>

                  <div className="space-y-3 text-sm font-light">
                    {businessHours.map((hour: any, idx: number) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-zinc-400">{hour.days}</span>
                        {hour.highlight ? (
                          <span className="text-luxury-gold tracking-widest uppercase text-xs font-semibold">{hour.hours}</span>
                        ) : (
                          <span className="text-zinc-200">{hour.hours}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Interactive Map Embed */}
            <motion.div variants={itemVariants} className="lg:col-span-7 w-full h-full min-h-[380px] lg:min-h-[460px]">
              <div className="glass-card p-2 rounded-sm overflow-hidden w-full h-full shadow-[0_0_30px_rgba(197,168,128,0.15)] border border-white/10 relative">
                <iframe
                  title="Fashion King Location Map"
                  src="https://maps.google.com/maps?q=Fashion%20King%20Clothes%20and%20Tailoring%20Beed%20Maharashtra&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-[380px] lg:h-[480px] border-0 rounded-sm filter invert-[0.9] hue-rotate-[180deg] brightness-[0.9] contrast-[1.2]"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
