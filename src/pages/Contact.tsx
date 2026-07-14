import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Compass, Phone, Mail, MapPin, CheckCircle2, X } from "lucide-react";
import { useSettings, useCollections } from "@/hooks/useDbQueries";

export default function Contact() {
  const { data: settings } = useSettings();
  const { data: collections } = useCollections();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: collections?.[0]?.id || "custom",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        serviceType: collections?.[0]?.id || "custom",
        message: "",
      });
    }, 1500);
  };

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
  const address = settings?.address || "";
  const phoneFormatted = settings?.phone_formatted || "";
  const phone = settings?.phone || "";
  const email = settings?.email || "";
  const businessHours = settings?.business_hours || [];
  const displayCollections = collections || [];
  const subName = settings?.site_sub_name || "Cloths & Tailoring";

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
              Private Bookings
            </span>
            <h1 className="text-4xl md:text-6xl font-light tracking-wide text-white leading-tight">
              Request a <span className="italic font-serif text-gold-gradient font-medium">Fitting Session</span>
            </h1>
            <p className="text-zinc-400 font-light leading-relaxed max-w-xl">
              Appointments at our Mayfair showroom or private home fittings are by request. Complete the form below, and our concierge will contact you within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Form Section */}
            <motion.div variants={itemVariants} className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 rounded-sm space-y-6">
                <h2 className="text-lg uppercase tracking-widest font-serif text-white mb-6 pb-4 border-b border-luxury-gold/10">
                  Appointment Inquiry
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs uppercase tracking-widest text-zinc-400 font-light">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Lord Sterling"
                      className="w-full bg-luxury-black-elevated border border-luxury-gold/10 focus:border-luxury-gold/50 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs uppercase tracking-widest text-zinc-400 font-light">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sterling@example.com"
                      className="w-full bg-luxury-black-elevated border border-luxury-gold/10 focus:border-luxury-gold/50 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs uppercase tracking-widest text-zinc-400 font-light">
                      Telephone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+44 7700 900077"
                      className="w-full bg-luxury-black-elevated border border-luxury-gold/10 focus:border-luxury-gold/50 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none transition-all"
                    />
                  </div>

                  {/* Service Type */}
                  <div className="space-y-2">
                    <label htmlFor="serviceType" className="text-xs uppercase tracking-widest text-zinc-400 font-light">
                      Desired Commission
                    </label>
                    <select
                      id="serviceType"
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full bg-luxury-black-elevated border border-luxury-gold/10 focus:border-luxury-gold/50 rounded-sm px-4 py-3 text-sm text-white outline-none transition-all cursor-pointer"
                    >
                      {displayCollections.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title}
                        </option>
                      ))}
                      <option value="custom">Other Custom Enquiry</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs uppercase tracking-widest text-zinc-400 font-light">
                    Sartorial Preferences & Notes
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Mention specific cloth requests, styling ideas, or preferred appointment dates..."
                    className="w-full bg-luxury-black-elevated border border-luxury-gold/10 focus:border-luxury-gold/50 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-luxury-gold hover:bg-luxury-gold-bright text-black font-sans font-semibold tracking-widest text-xs uppercase transition-all duration-300 rounded-sm shadow-luxury-glow disabled:opacity-50 relative flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Submit Fitting Request"
                  )}
                </button>
              </form>
            </motion.div>

            {/* Info Section */}
            <motion.div variants={itemVariants} className="lg:col-span-5 space-y-10">
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
                      <p className="text-sm font-light text-zinc-200">{address}</p>
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
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Success Booking Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-luxury-black-card border border-luxury-gold/20 p-8 md:p-10 rounded-sm max-w-md w-full relative space-y-6 text-center shadow-luxury-glow"
            >
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-white tracking-wider uppercase">Inquiry Received</h3>
                <p className="text-xs text-luxury-gold tracking-widest uppercase font-semibold">
                  Maison {subName}
                </p>
              </div>

              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Thank you for requesting a fitting session. Our private client concierge is reviewing your request and will contact you directly to confirm your booking date and time.
              </p>

              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-3 border border-luxury-gold/40 hover:border-luxury-gold text-luxury-gold hover:text-white text-xs tracking-widest uppercase transition-all duration-300 font-sans rounded-sm"
              >
                Return to Gallery
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
