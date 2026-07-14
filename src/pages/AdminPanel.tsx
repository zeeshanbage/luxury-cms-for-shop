import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LogOut, Plus, Trash2, Upload, Image, Video, Eye, EyeOff, CheckCircle2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MediaItem {
  type: "image" | "video";
  url: string;
  thumbnail: string;
  subtitle: string;
}

interface Product {
  id: string;
  title: string;
  subtitle: string;
  heroMedia: { type: "image" | "video"; url: string };
  media: MediaItem[];
  uniqueId?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "admin1188";
const CATEGORIES = [
  { id: "suits",    label: "Suits",    file: "suits"    },
  { id: "sherwani", label: "Sherwani", file: "sherwani" },
  { id: "kurta",    label: "Kurta",    file: "kurta"    },
  { id: "fabrics",  label: "Fabrics",  file: "fabrics"  },
];

function storageKey(categoryId: string) {
  return `fashionking_products_${categoryId}`;
}

function loadProducts(categoryId: string): Product[] {
  try {
    const raw = localStorage.getItem(storageKey(categoryId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProducts(categoryId: string, products: Product[]) {
  localStorage.setItem(storageKey(categoryId), JSON.stringify(products));
}

// ─── File → base64 URL ───────────────────────────────────────────────────────
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4">
      <motion.div
        animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="glass-card p-10 rounded-sm border border-luxury-gold/20 space-y-8 shadow-[0_0_60px_rgba(197,168,128,0.1)]">
          {/* Lock icon */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center">
              <Lock size={22} className="text-luxury-gold" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-serif font-light tracking-widest text-white uppercase">Admin Access</h1>
              <p className="text-[10px] tracking-[0.3em] text-zinc-500 mt-1 uppercase">Fashion King Studio</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={(e) => { setPw(e.target.value); setError(false); }}
                placeholder="Enter admin password"
                autoFocus
                className={`w-full bg-black/40 border ${error ? "border-red-500/60" : "border-luxury-gold/15"} focus:border-luxury-gold/50 rounded-sm px-4 py-3.5 text-sm text-white placeholder-zinc-600 outline-none transition-all pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center tracking-wider">Incorrect password. Try again.</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-luxury-gold hover:brightness-110 text-black font-sans font-semibold tracking-widest text-xs uppercase rounded-sm transition-all duration-300"
            >
              Unlock Studio
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Add Product Form ─────────────────────────────────────────────────────────
function AddProductForm({
  categoryId,
  onSave,
  onCancel,
}: {
  categoryId: string;
  onSave: (product: Product) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [_file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [fileType, setFileType] = useState<"image" | "video">("image");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const isVideo = f.type.startsWith("video/");
    setFileType(isVideo ? "video" : "image");
    const dataUrl = await fileToDataUrl(f);
    setPreview(dataUrl);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    setFile(f);
    const isVideo = f.type.startsWith("video/");
    setFileType(isVideo ? "video" : "image");
    const dataUrl = await fileToDataUrl(f);
    setPreview(dataUrl);
  };

  const handleSave = async () => {
    if (!title.trim() || !preview) return;
    setSaving(true);

    const product: Product = {
      id: `${categoryId}-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      heroMedia: { type: fileType, url: preview },
      media: [
        {
          type: fileType,
          url: preview,
          thumbnail: fileType === "image" ? preview : "/images/brand-logo.png",
          subtitle: subtitle.trim(),
        },
      ],
    };

    onSave(product);
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); onCancel(); }, 900);
  };

  const canSave = title.trim().length > 0 && preview !== "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="glass-card p-8 rounded-sm border border-luxury-gold/20 space-y-6"
    >
      <h3 className="text-sm uppercase tracking-widest font-serif text-white border-b border-luxury-gold/10 pb-4">
        Add New Product
      </h3>

      {/* File Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-luxury-gold/20 hover:border-luxury-gold/50 rounded-sm p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group min-h-[180px]"
      >
        {preview ? (
          fileType === "image" ? (
            <img src={preview} className="w-full h-48 object-contain rounded-sm" />
          ) : (
            <video src={preview} className="w-full h-48 object-contain rounded-sm" muted playsInline />
          )
        ) : (
          <div className="flex flex-col items-center space-y-3 text-zinc-500 group-hover:text-zinc-300 transition-colors">
            <Upload size={28} />
            <div className="text-center">
              <p className="text-xs tracking-wider">Drop image or video here</p>
              <p className="text-[10px] text-zinc-600 mt-1">or click to browse</p>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider">
                <Image size={10} /> Photo
              </span>
              <span className="text-zinc-700">•</span>
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider">
                <Video size={10} /> Video
              </span>
            </div>
          </div>
        )}
        {preview && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider text-luxury-gold border border-luxury-gold/20">
            {fileType === "image" ? <Image size={9} /> : <Video size={9} />}
            {fileType}
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-zinc-400">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Royal Ivory Sherwani"
            className="w-full bg-black/40 border border-luxury-gold/15 focus:border-luxury-gold/50 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-zinc-400">Subtitle / Description</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. Hand-embroidered raw silk with antique gold borders"
            className="w-full bg-black/40 border border-luxury-gold/15 focus:border-luxury-gold/50 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-3 border border-white/10 text-zinc-400 hover:text-white text-xs tracking-widest uppercase rounded-sm transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          className="flex-1 py-3 bg-luxury-gold hover:brightness-110 text-black font-semibold text-xs tracking-widest uppercase rounded-sm transition-all disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {saved ? (
            <><CheckCircle2 size={14} /> Saved!</>
          ) : saving ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Plus size={14} /> Add Product</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Product Card (admin view) ────────────────────────────────────────────────
function AdminProductCard({ product, onDelete }: { product: Product; onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const media = product.media[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      className="relative glass-card rounded-sm overflow-hidden border border-white/5 group"
    >
      {/* Thumbnail */}
      <div className="w-full h-40 bg-black/50 overflow-hidden">
        {media?.type === "image" ? (
          <img src={media.url} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <video src={media?.url} className="w-full h-full object-cover" muted playsInline />
        )}
        {/* Type badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider text-zinc-300 border border-white/10">
          {media?.type === "image" ? <Image size={8} /> : <Video size={8} />}
          {media?.type}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-1">
        <p className="text-sm font-serif text-white font-light tracking-wide truncate">{product.title}</p>
        <p className="text-[11px] text-zinc-500 font-light leading-relaxed line-clamp-2">{product.subtitle || "—"}</p>
      </div>

      {/* Delete */}
      <div className="p-4 pt-0">
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="w-full py-2 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/50 rounded-sm transition-all"
          >
            <Trash2 size={11} /> Remove
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setConfirming(false)}
              className="flex-1 py-2 text-[10px] uppercase tracking-widest text-zinc-400 border border-white/10 rounded-sm transition-all hover:text-white"
            >
              Keep
            </button>
            <button
              onClick={onDelete}
              className="flex-1 py-2 text-[10px] uppercase tracking-widest text-white bg-red-600/80 hover:bg-red-600 rounded-sm transition-all"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load products for active category from localStorage
  useEffect(() => {
    setProducts(loadProducts(activeCategory));
    setShowAddForm(false);
  }, [activeCategory]);

  const handleAdd = (product: Product) => {
    const updated = [product, ...products];
    setProducts(updated);
    saveProducts(activeCategory, updated);
  };

  const handleDelete = (productId: string) => {
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    saveProducts(activeCategory, updated);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowAddForm(false);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-luxury-black text-zinc-100 selection:bg-luxury-gold selection:text-black">
      {/* Header */}
      <header className="border-b border-luxury-gold/10 bg-black/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-luxury-gold/15 border border-luxury-gold/30 flex items-center justify-center">
              <Lock size={12} className="text-luxury-gold" />
            </div>
            <div>
              <p className="text-xs font-serif tracking-[0.2em] text-white uppercase">Fashion King</p>
              <p className="text-[9px] tracking-[0.3em] text-zinc-500 uppercase">Admin Studio</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-luxury-gold transition-colors"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => {
            const count = loadProducts(cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-6 py-2.5 text-[10px] tracking-[0.25em] uppercase font-sans font-semibold rounded-full transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-luxury-gold text-black"
                    : "bg-white/5 text-zinc-400 hover:text-white border border-white/10"
                }`}
              >
                {cat.label}
                <span className={`ml-2 text-[9px] ${activeCategory === cat.id ? "text-black/60" : "text-zinc-600"}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Add button row */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-light tracking-wider text-white uppercase">
            {CATEGORIES.find(c => c.id === activeCategory)?.label} Collection
          </h2>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-luxury-gold hover:brightness-110 text-black text-[10px] uppercase tracking-widest font-semibold rounded-sm transition-all"
            >
              <Plus size={13} /> Add Product
            </button>
          )}
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {showAddForm && (
            <AddProductForm
              categoryId={activeCategory}
              onSave={handleAdd}
              onCancel={() => setShowAddForm(false)}
            />
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <AnimatePresence mode="popLayout">
          {products.length === 0 && !showAddForm ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Plus size={22} className="text-zinc-600" />
              </div>
              <p className="text-zinc-500 text-sm tracking-wider font-light">No products in this collection yet.</p>
              <p className="text-zinc-600 text-xs">Click "Add Product" to get started.</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              <AnimatePresence>
                {products.map((product) => (
                  <AdminProductCard
                    key={product.id}
                    product={product}
                    onDelete={() => handleDelete(product.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
