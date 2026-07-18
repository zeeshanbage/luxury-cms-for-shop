import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring
} from "framer-motion";
import { ArrowDown, Sparkles, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/utils/image";
import { useSettings, useProducts, useCollections } from "@/hooks/useDbQueries";
import { siteConfig } from "@/config/site";
import { imageConfig } from "@/config/images";
import type { Product } from "@/types/db";

// Fullscreen Immersive Lightbox Media Viewer
function FullscreenLightbox({
  item,
  initialIndex,
  onClose
}: {
  item: Product;
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const mediaCount = item.media.length;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaCount);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaCount) % mediaCount);
  };

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const activeMedia = item.media[currentIndex];

  // Mobile swipe gesture handler
  const dragThreshold = 50;
  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -dragThreshold) {
      handleNext();
    } else if (info.offset.x > dragThreshold) {
      handlePrev();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center select-none">
      {/* Background radial gradient vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

      {/* Top action bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50 text-white">
        <div className="flex flex-col text-left">
          <span className="text-[10px] tracking-[0.3em] font-sans text-luxury-gold uppercase font-bold">
            {item.title} Lookbook
          </span>
          <span className="text-xs font-light text-zinc-400 mt-0.5">
            Media {currentIndex + 1} of {mediaCount}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors pointer-events-auto"
        >
          <X size={18} />
        </button>
      </div>

      {/* Left Desktop Arrow */}
      <button
        onClick={handlePrev}
        className="hidden md:flex absolute left-8 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-colors z-50"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Main Media Slide Container — fills entire lightbox */}
      <div className="absolute inset-0 z-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            {activeMedia.type === "image" ? (
              <img
                src={getImageUrl(activeMedia.url)}
                alt={item.title}
                className="max-w-full max-h-full object-contain pointer-events-none rounded-sm shadow-2xl"
              />
            ) : (
              <video
                key={activeMedia.url}
                src={activeMedia.url}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                loop
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Desktop Arrow */}
      <button
        onClick={handleNext}
        className="hidden md:flex absolute right-8 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-colors z-50"
      >
        <ChevronRight size={20} />
      </button>

      {/* Bottom Subtitle Caption overlay */}
      <div className="absolute bottom-28 z-50 max-w-xl text-center px-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed"
          >
            {activeMedia.subtitle}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Bottom Lightbox Thumbnail gallery */}
      <div className="absolute bottom-6 z-50 flex items-center justify-center w-full">
        <div className="flex items-center space-x-2 bg-black/65 px-4 py-2 border border-white/10 rounded-full backdrop-blur-md">
          {item.media.map((mediaItem, mIdx) => {
            const isSelected = currentIndex === mIdx;
            return (
              <button
                key={mIdx}
                onClick={() => {
                  setCurrentIndex(mIdx);
                }}
                className={`relative w-10 h-10 rounded-sm overflow-hidden transition-all duration-300 ${isSelected
                  ? "ring-2 ring-luxury-gold scale-105"
                  : "opacity-60 hover:opacity-100 border border-white/5"
                  }`}
              >
                <img
                  src={mediaItem.thumbnail}
                  alt="Thumb"
                  className="w-full h-full object-cover"
                />
                {mediaItem.type === "video" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play size={10} className="fill-current text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Child component to manage each collection campaign product (Exactly 1 fullscreen viewport height)
function ProductCampaign({
  item,
  index,
  onOpenLightbox
}: {
  item: Product;
  index: number;
  onOpenLightbox: (activeMediaIdx: number) => void;
}) {
  const isEven = index % 2 === 0;

  // Determine if this is a landscape product (e.g. fabric swatches) or a portrait suit/sherwani campaign
  const isLandscape = item.id.toLowerCase().includes("fabric") || item.id.toLowerCase().includes("swatch");

  // Load the primary hero media item
  const primaryMedia = item.media[0] || { type: "image", url: item.heroMedia.url, focalPoint: { x: 50, y: 50 } };
  const focalStyles = primaryMedia.focalPoint
    ? `${primaryMedia.focalPoint.x}% ${primaryMedia.focalPoint.y}%`
    : "center";

  return (
    <div className="relative h-screen w-full flex items-center justify-center border-b border-white/5 bg-luxury-black overflow-hidden py-12 md:py-0 select-none">

      {/* Full-bleed background media cover (unblurred at 55% opacity to blend into the luxury black backdrop) */}
      <div 
        onClick={() => onOpenLightbox(0)}
        className="absolute inset-0 z-0 w-full h-full select-none overflow-hidden cursor-zoom-in"
      >
        {primaryMedia.type === "image" ? (
          <img
            src={getImageUrl(primaryMedia.url)}
            alt="Background Cover"
            style={{ objectPosition: focalStyles }}
            className="w-full h-full object-cover opacity-55 transition-transform duration-10000 ease-out scale-100"
          />
        ) : (
          <video
            src={primaryMedia.url}
            style={{ objectPosition: focalStyles }}
            className="w-full h-full object-cover opacity-55"
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        {/* Soft layout shading gradients for cinematic bleed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black pointer-events-none" />
      </div>

      {/* Grid container layout */}
      <div className="max-w-7xl mx-auto px-6 w-full h-full grid grid-cols-1 md:grid-cols-12 md:grid-flow-row-dense gap-8 md:gap-16 items-center relative z-20">

        {/* Editorial Text Overlay Column */}
        <div className={`col-span-12 md:col-span-5 flex flex-col space-y-4 md:space-y-6 order-2 md:order-none pointer-events-auto ${isEven ? "text-left" : "md:col-start-8 text-right items-end ml-auto"
          }`}>
          <span className="text-[10px] tracking-[0.3em] font-sans text-luxury-gold uppercase font-bold flex items-center gap-2">
            <Sparkles size={12} />
            Model 0{index + 1}
          </span>

          <h2 className="text-4xl md:text-5xl xl:text-6xl font-light tracking-wider font-serif text-white uppercase leading-tight">
            {item.title}
          </h2>

          <p className="text-zinc-300 font-light text-xs md:text-sm leading-relaxed max-w-sm">
            {item.subtitle}
          </p>

          <span className="text-[9px] tracking-[0.2em] uppercase font-sans text-zinc-500 font-semibold select-none pt-2">
            Click frame to expand
          </span>
        </div>

        {/* Cinematic Framed Photo Box Column */}
        <div className={`col-span-12 md:col-span-7 flex justify-center order-1 md:order-none`}>

          {/* Outer double-border frame with luxury gold glow drop shadow */}
          <div
            onClick={() => onOpenLightbox(0)}
            className={`cursor-zoom-in relative p-1.5 bg-[#09090b]/85 border border-white/20 rounded-sm shadow-[0_0_30px_rgba(197,168,128,0.25)] hover:shadow-[0_0_45px_rgba(197,168,128,0.4)] transition-all duration-700 hover:scale-[1.01] pointer-events-auto ${isLandscape
              ? "w-full max-w-[480px] sm:max-w-[560px] aspect-[16/10]"
              : "w-[260px] sm:w-[320px] md:w-[360px] aspect-[3/4]"
              }`}
          >
            {/* Inner keyline border */}
            <div className="w-full h-full border border-white/10 rounded-sm overflow-hidden relative">
              {primaryMedia.type === "image" ? (
                <img
                  src={getImageUrl(primaryMedia.url)}
                  alt={item.title}
                  style={{ objectPosition: focalStyles }}
                  className="w-full h-full object-cover transition-transform duration-[12s] ease-out hover:scale-104"
                />
              ) : (
                <video
                  src={primaryMedia.url}
                  style={{ objectPosition: focalStyles }}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}

              {/* Soft vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

              {/* Play symbol indicator overlay for video cards */}
              {primaryMedia.type === "video" && (
                <div className="absolute bottom-4 right-4 p-2 bg-black/60 border border-white/10 rounded-full text-white/90">
                  <Play size={12} className="fill-current" />
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function Home() {
  const { data: settings, isLoading: isSettingsLoading } = useSettings();
  const { data: collections = [], isLoading: isCollectionsLoading } = useCollections();
  const [activeCategory, setActiveCategory] = useState<string>("");

  // Set the first loaded collection as active category
  useEffect(() => {
    if (collections.length > 0 && !activeCategory) {
      setActiveCategory(collections[0].id);
    }
  }, [collections, activeCategory]);

  // Lightbox view state manager
  const [lightboxActiveProduct, setLightboxActiveProduct] = useState<Product | null>(null);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);

  const categories = collections.map((col) => ({
    id: col.id,
    label: col.title.toUpperCase(),
  }));

  // 2. Mouse coordinates tracking for ambient cursor spotlight glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // 3. Parallax scroll bindings for storefront hero backdrop
  const { scrollY } = useScroll();
  const heroImageParallax = useTransform(scrollY, [0, 500], [0, -50]);
  const heroImageScale = useTransform(scrollY, [0, 500], [1, 1.15]);

  // 4. Scroll navigation action triggers
  const scrollToCampaignGallery = () => {
    const galleryElement = document.getElementById("campaign-gallery-root");
    if (galleryElement) {
      const yOffset = -56 - 24;
      const y = galleryElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // 5. Query dynamic products directly from Supabase (single source of truth)
  const { data: dbProducts = [], isLoading: isProductsLoading } = useProducts(activeCategory);

  const loadedItems = dbProducts.map((item, idx) => ({
    ...item,
    uniqueId: `${item.id}-${idx}`
  }));

  // Loading spinner layout
  if (isSettingsLoading || isCollectionsLoading || (isProductsLoading && activeCategory)) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center space-y-6">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <span className="text-3xl font-medium tracking-[0.3em] font-serif text-white mb-1">
            {settings?.site_name || siteConfig.name}
          </span>
          <span className="text-[0.65rem] tracking-[0.4em] uppercase text-luxury-gold">
            {settings?.site_sub_name || siteConfig.subName}
          </span>
        </motion.div>
        <div className="w-12 h-[1px] bg-luxury-gold/30 relative overflow-hidden">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 bottom-0 w-1/2 bg-luxury-gold"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-luxury-black"
    >
      {/* Background container to isolate and clip off-screen glowing spotlights, preventing layout scroll stretches */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
        {/* Dynamic backdrop color highlights relative to category tab */}
        <div className={`absolute inset-0 bg-gradient-to-tr transition-colors duration-1000 ${activeCategory === "suits" ? "from-[#050608] via-zinc-950 to-[#06101c]/10" :
          activeCategory === "sherwani" ? "from-[#080505] via-zinc-950 to-[#1c0808]/10" :
            activeCategory === "kurta" ? "from-[#080705] via-zinc-950 to-[#1f160d]/10" :
              "from-black via-zinc-950 to-neutral-950/20"
          }`} />

        {/* Ambient Glowing cursor spotlight */}
        <motion.div
          className="absolute pointer-events-none rounded-full bg-radial from-luxury-gold/5 via-transparent to-transparent blur-3xl w-[600px] h-[600px]"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />
        {/* Background design matrix grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:5rem_5rem]" />
      </div>

      {/* SECTION 1: Dynamic Signboard Hero (Split widescreen layout, text overlays black gradient over right-aligned image) */}
      <div className="relative h-[85vh] sm:h-screen w-full flex items-center justify-start overflow-hidden border-b border-white/5 bg-black">
        
        {/* Left Column: copy overlay */}
        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left space-y-6 max-w-2xl select-none w-full md:w-[50%] px-6 md:pl-16 lg:pl-24">

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 px-4 py-1.5 bg-black/60 border border-luxury-gold/30 rounded-full text-[10px] sm:text-xs font-sans tracking-[0.25em] text-luxury-gold uppercase font-semibold backdrop-blur-md"
          >
            <Sparkles size={12} className="animate-pulse" />
            <span>Official Digital Showroom</span>
          </motion.div>

          <div className="overflow-hidden py-1">
            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-5xl lg:text-7xl xl:text-8xl font-light tracking-wide font-serif text-white leading-none uppercase"
            >
              {settings?.site_name || siteConfig.name}
            </motion.h1>
          </div>

          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-2xl tracking-[0.3em] font-serif text-luxury-gold font-light italic"
            >
              {settings?.site_sub_name || siteConfig.subName}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex flex-col items-center md:items-start space-y-3 pt-2"
          >
            <p className="text-zinc-300 font-light text-xs sm:text-sm tracking-wider leading-relaxed max-w-lg">
              {settings?.site_tagline || siteConfig.tagline}
            </p>
            <span className="text-[10px] tracking-[0.15em] text-zinc-500 uppercase font-sans">
              {settings?.address 
                ? settings.address 
                : (siteConfig as any).address || "Beed, Maharashtra"}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-4"
          >
            <button
              onClick={scrollToCampaignGallery}
              className="group/btn inline-flex items-center space-x-3 px-8 py-4 bg-white hover:bg-luxury-gold text-black text-xs tracking-widest uppercase font-semibold font-sans rounded-sm transition-all duration-300 shadow-luxury-glow"
            >
              <span>Explore Lookbook</span>
              <ArrowDown size={14} className="transform transition-transform duration-300 group-hover/btn:translate-y-1 animate-bounce" />
            </button>
          </motion.div>

        </div>

        {/* Storefront backdrop image (Full height right aligned, parallax and zoom enabled) */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[65%] z-0 select-none overflow-hidden pointer-events-none">
          <motion.img
            src={getImageUrl(imageConfig.heroImages?.storefront || "/images/signboard.png")}
            alt={`${settings?.site_name || siteConfig.name} Storefront`}
            style={{ y: heroImageParallax, scale: heroImageScale, transformOrigin: "top" }}
            className="w-full h-full object-cover object-center md:object-right filter brightness-[0.88] contrast-[1.03] saturate-[0.95]"
          />
          {/* Smooth black gradient overlay to blend into the left black panel */}
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black via-black/40 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </div>
      </div>

      {/* SECTION 2: Sticky selector capsule pill bar */}
      <div className="sticky top-6 z-40 w-full flex justify-center py-3 select-none pointer-events-none">
        <div className="pointer-events-auto flex items-center space-x-1 md:space-x-2 bg-[#09090b]/80 border border-white/5 px-4 md:px-6 py-2.5 rounded-full backdrop-blur-lg shadow-2xl relative overflow-x-auto scrollbar-none max-w-[92vw] md:max-w-none whitespace-nowrap flex-nowrap scroll-smooth">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-5 md:px-7 py-2.5 text-[9px] md:text-[10px] tracking-[0.25em] uppercase font-sans font-semibold outline-none transition-colors duration-150 flex-shrink-0 whitespace-nowrap ${
                  isActive ? "text-black" : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeHomeCapsule"
                    className="absolute inset-0 bg-[#c5a880] rounded-full -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 38,
                      mass: 0.6,
                    }}
                  />
                )}
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Campaign Lookbook — GPU crossfade on category switch */}
      <div id="campaign-gallery-root" className="w-full relative z-10 bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.22,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{ willChange: "opacity, transform" }}
          >
            {loadedItems.length === 0 && !isProductsLoading ? (
              /* ── Empty State ── */
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-24 space-y-6 border-t border-white/5">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-luxury-gold/10 flex items-center justify-center">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles size={24} className="text-luxury-gold/60" />
                  </motion.div>
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="text-lg font-serif font-light tracking-widest text-white uppercase">
                    Collection Coming Soon
                  </h3>
                  <p className="text-xs text-zinc-500 font-light leading-relaxed tracking-wider">
                    Our curated lookbook for this collection is being prepared.
                    Visit us in store or check back soon.
                  </p>
                </div>
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent" />
              </div>
            ) : (
              loadedItems.map((item, index) => (
                <ProductCampaign
                  key={item.uniqueId}
                  item={item}
                  index={index}
                  onOpenLightbox={(initialMediaIdx) => {
                    setLightboxActiveProduct(item);
                    setLightboxInitialIndex(initialMediaIdx);
                  }}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* SECTION 4: Immersive Fullscreen Lightbox Portal */}
      <AnimatePresence>
        {lightboxActiveProduct && (
          <FullscreenLightbox
            item={lightboxActiveProduct}
            initialIndex={lightboxInitialIndex}
            onClose={() => setLightboxActiveProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
