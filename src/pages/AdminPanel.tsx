import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LogOut, Plus, Trash2, Upload, Image, Video, Eye, EyeOff, CheckCircle2, Edit, X, GripVertical } from "lucide-react";

import type { Product } from "@/types/db";
import { getProducts, createProduct, deleteProduct, updateProduct, uploadProductMedia, updateProductsOrder } from "@/services/db";
import { useSettings, useCollections } from "@/hooks/useDbQueries";
import { siteConfig } from "@/config/site";
import { collectionsConfig } from "@/config/collections";

const ADMIN_PASSWORD = "admin1188";

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
  const { data: settings } = useSettings();
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
              <p className="text-[10px] tracking-[0.3em] text-zinc-500 mt-1 uppercase">{settings?.site_name || siteConfig.name} Studio</p>
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

interface QueuedMedia {
  id: string;
  file: File;
  mediaType: "image" | "video";
  previewUrl: string;
  subtitle: string;
}

// ─── Add Product Form ─────────────────────────────────────────────────────────
function AddProductForm({
  onSave,
  onCancel,
}: {
  onSave: (
    productMetadata: { title: string; subtitle: string },
    mediaItems: { file: File; mediaType: "image" | "video"; subtitle: string }[]
  ) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [queuedMedia, setQueuedMedia] = useState<QueuedMedia[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processFiles(files);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    await processFiles(files);
  };

  const processFiles = async (files: FileList) => {
    const loaded: QueuedMedia[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const mediaType = file.type.startsWith("video/") ? "video" : "image";
      const previewUrl = await fileToDataUrl(file);
      loaded.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${i}`,
        file,
        mediaType,
        previewUrl,
        subtitle: "",
      });
    }
    setQueuedMedia((prev) => [...prev, ...loaded]);
  };

  const removeQueuedItem = (id: string) => {
    setQueuedMedia((prev) => prev.filter((item) => item.id !== id));
  };

  const updateSubtitle = (id: string, text: string) => {
    setQueuedMedia((prev) =>
      prev.map((item) => (item.id === id ? { ...item, subtitle: text } : item))
    );
  };

  const handleSave = async () => {
    if (!title.trim() || queuedMedia.length === 0) return;
    setSaving(true);
    try {
      await onSave(
        { title: title.trim(), subtitle: subtitle.trim() },
        queuedMedia.map((item) => ({
          file: item.file,
          mediaType: item.mediaType,
          subtitle: item.subtitle.trim(),
        }))
      );
      setSaved(true);
      setTimeout(() => { setSaved(false); onCancel(); }, 900);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const canSave = title.trim().length > 0 && queuedMedia.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="glass-card p-8 rounded-sm border border-luxury-gold/20 space-y-6"
    >
      <h3 className="text-sm uppercase tracking-widest font-serif text-white border-b border-luxury-gold/10 pb-4">
        Add New Product (Multiple Upload Support)
      </h3>

      {/* File Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-luxury-gold/20 hover:border-luxury-gold/50 rounded-sm p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group min-h-[120px]"
      >
        <div className="flex flex-col items-center space-y-3 text-zinc-500 group-hover:text-zinc-300 transition-colors">
          <Upload size={24} />
          <div className="text-center">
            <p className="text-xs tracking-wider">Drop one or more images/videos here</p>
            <p className="text-[10px] text-zinc-600 mt-1">or click to browse multiple files</p>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Queued Media Items List */}
      {queuedMedia.length > 0 && (
        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
            Queued Files ({queuedMedia.length})
          </p>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {queuedMedia.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white/5 p-3 rounded-sm border border-white/5 relative group animate-fadeIn"
              >
                {/* Preview Frame */}
                <div className="w-16 h-16 bg-black/60 rounded-sm overflow-hidden flex-shrink-0 relative">
                  {item.mediaType === "image" ? (
                    <img src={item.previewUrl} className="w-full h-full object-cover" />
                  ) : (
                    <video src={item.previewUrl} className="w-full h-full object-cover" muted />
                  )}
                  <span className="absolute top-1 left-1 bg-black/75 rounded-full px-1.5 py-0.5 text-[7px] uppercase tracking-wider text-zinc-300 font-sans">
                    #{idx + 1}
                  </span>
                </div>

                {/* Subtitle Input */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold font-sans">
                      {item.mediaType} • {item.file.name.substring(0, 16)}...
                    </span>
                  </div>
                  <input
                    type="text"
                    value={item.subtitle}
                    onChange={(e) => updateSubtitle(item.id, e.target.value)}
                    placeholder="Enter description/caption for this item..."
                    className="w-full bg-black/35 border border-white/5 focus:border-luxury-gold/30 rounded-sm px-3 py-1.5 text-xs text-white placeholder-zinc-600 outline-none transition-all"
                  />
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeQueuedItem(item.id)}
                  className="p-2 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-full transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Title & Subtitle */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-zinc-400">Product Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Royal Ivory Sherwani"
            className="w-full bg-black/40 border border-luxury-gold/15 focus:border-luxury-gold/50 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-zinc-400">Main Description</label>
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
function AdminProductCard({ 
  product, 
  onDelete, 
  onEdit 
}: { 
  product: Product; 
  onDelete: () => void; 
  onEdit: () => void; 
}) {
  const [confirming, setConfirming] = useState(false);
  const media = product.media && product.media.length > 0 ? product.media[0] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      className="relative glass-card rounded-sm overflow-hidden border border-white/5 group"
    >
      {/* Thumbnail */}
      <div className="w-full h-40 bg-black/50 overflow-hidden relative">
        {media?.type === "image" ? (
          <img src={media.url} alt={product.title} className="w-full h-full object-cover" />
        ) : media?.type === "video" ? (
          <video src={media.url} className="w-full h-full object-cover" muted playsInline />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 uppercase tracking-widest text-[9px]">
            No Media
          </div>
        )}
        
        {/* Type badge */}
        {media && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider text-zinc-300 border border-white/10">
            {media.type === "image" ? <Image size={8} /> : <Video size={8} />}
            {media.type}
          </div>
        )}

        {/* Files Count and Drag Handle Badges */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
          {product.media && product.media.length > 1 && (
            <div className="bg-luxury-gold text-black rounded-full px-2 py-0.5 text-[8px] uppercase tracking-wider font-bold shadow-md font-sans">
              {product.media.length} files
            </div>
          )}
          <div className="bg-black/70 rounded-md p-1 border border-white/10 text-zinc-400 hover:text-white cursor-grab active:cursor-grabbing transition-colors">
            <GripVertical size={11} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-1">
        <p className="text-sm font-serif text-white font-light tracking-wide truncate">{product.title}</p>
        <p className="text-[11px] text-zinc-500 font-light leading-relaxed line-clamp-2">{product.subtitle || "—"}</p>
      </div>

      {/* Actions */}
      <div className="p-4 pt-0">
        {!confirming ? (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="flex-1 py-2 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-300 hover:text-white border border-white/10 hover:border-white/30 rounded-sm transition-all"
            >
              <Edit size={11} /> Edit
            </button>
            <button
              onClick={() => setConfirming(true)}
              className="flex-1 py-2 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest text-red-400 hover:text-red-300 border border-red-500/10 hover:border-red-500/30 rounded-sm transition-all"
            >
              <Trash2 size={11} /> Remove
            </button>
          </div>
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

interface EditProductModalProps {
  product: Product;
  categoryId: string;
  onSave: (productId: string, updates: { title: string; subtitle: string; media: any[] }) => Promise<void>;
  onClose: () => void;
}

function EditProductModal({ product, categoryId, onSave, onClose }: EditProductModalProps) {
  const [title, setTitle] = useState(product.title);
  const [subtitle, setSubtitle] = useState(product.subtitle);
  const [existingMedia, setExistingMedia] = useState<any[]>(product.media || []);
  const [newMedia, setNewMedia] = useState<QueuedMedia[]>([]);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processFiles(files);
  };

  const processFiles = async (files: FileList) => {
    const loaded: QueuedMedia[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const mediaType = file.type.startsWith("video/") ? "video" : "image";
      const previewUrl = await fileToDataUrl(file);
      loaded.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${i}`,
        file,
        mediaType,
        previewUrl,
        subtitle: "",
      });
    }
    setNewMedia((prev) => [...prev, ...loaded]);
  };

  const removeExistingItem = (url: string) => {
    setExistingMedia((prev) => prev.filter((item) => item.url !== url));
  };

  const updateExistingSubtitle = (url: string, text: string) => {
    setExistingMedia((prev) =>
      prev.map((item) => (item.url === url ? { ...item, subtitle: text } : item))
    );
  };

  const removeNewItem = (id: string) => {
    setNewMedia((prev) => prev.filter((item) => item.id !== id));
  };

  const updateNewSubtitle = (id: string, text: string) => {
    setNewMedia((prev) =>
      prev.map((item) => (item.id === id ? { ...item, subtitle: text } : item))
    );
  };

  const handleSave = async () => {
    const totalMediaCount = existingMedia.length + newMedia.length;
    if (!title.trim() || totalMediaCount === 0) return;
    setSaving(true);
    try {
      // 1. Upload new files
      const uploadedMedia = await Promise.all(
        newMedia.map(async (item) => {
          const url = await uploadProductMedia(item.file, categoryId);
          const thumbnail = item.mediaType === "image" ? url : "/images/brand-logo.png";
          return {
            type: item.mediaType,
            url,
            thumbnail,
            subtitle: item.subtitle.trim(),
          };
        })
      );

      // 2. Merge existing and new uploaded files
      const finalMedia = [...existingMedia, ...uploadedMedia];

      // 3. Save updates
      await onSave(product.id, {
        title: title.trim(),
        subtitle: subtitle.trim(),
        media: finalMedia,
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const canSave = title.trim().length > 0 && (existingMedia.length + newMedia.length) > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-luxury-gold/15 pb-4">
          <h3 className="text-base uppercase tracking-widest font-serif text-white">
            Edit Product
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-zinc-400">Product Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Royal Ivory Sherwani"
              className="w-full bg-black/40 border border-luxury-gold/15 focus:border-luxury-gold/50 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-zinc-400">Main Description</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Hand-embroidered raw silk with antique gold borders"
              className="w-full bg-black/40 border border-luxury-gold/15 focus:border-luxury-gold/50 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all"
            />
          </div>
        </div>

        {/* Existing Media List */}
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
            Existing Media ({existingMedia.length})
          </p>
          {existingMedia.length === 0 ? (
            <p className="text-zinc-600 text-xs italic">No existing media. Add some below.</p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {existingMedia.map((item, idx) => (
                <div
                  key={item.url}
                  className="flex items-center gap-4 bg-white/5 p-3 rounded-sm border border-white/5"
                >
                  <div className="w-16 h-16 bg-black/60 rounded-sm overflow-hidden flex-shrink-0 relative">
                    {item.type === "image" ? (
                      <img src={item.url} className="w-full h-full object-cover" />
                    ) : (
                      <video src={item.url} className="w-full h-full object-cover" muted />
                    )}
                    <span className="absolute top-1 left-1 bg-black/75 rounded-full px-1 py-0.5 text-[7px] uppercase tracking-wider text-zinc-300 font-sans">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold font-sans">
                      {item.type}
                    </span>
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) => updateExistingSubtitle(item.url, e.target.value)}
                      placeholder="Enter description/caption..."
                      className="w-full bg-black/35 border border-white/5 focus:border-luxury-gold/30 rounded-sm px-3 py-1.5 text-xs text-white placeholder-zinc-600 outline-none transition-all"
                    />
                  </div>
                  <button
                    onClick={() => removeExistingItem(item.url)}
                    disabled={existingMedia.length + newMedia.length <= 1}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-full transition-all disabled:opacity-30 disabled:hover:text-zinc-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add More Media Selector */}
        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
            Add More Media
          </p>
          <div
            onClick={() => fileRef.current?.click()}
            className="border border-dashed border-luxury-gold/15 hover:border-luxury-gold/40 rounded-sm p-4 flex items-center justify-center gap-2 cursor-pointer text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Plus size={16} />
            <span className="text-xs">Add more images or videos...</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {newMedia.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {newMedia.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-white/5 p-3 rounded-sm border border-luxury-gold/10"
                >
                  <div className="w-16 h-16 bg-black/60 rounded-sm overflow-hidden flex-shrink-0 relative">
                    {item.mediaType === "image" ? (
                      <img src={item.previewUrl} className="w-full h-full object-cover" />
                    ) : (
                      <video src={item.previewUrl} className="w-full h-full object-cover" muted />
                    )}
                    <span className="absolute top-1 left-1 bg-luxury-gold text-black rounded-full px-1.5 py-0.5 text-[7px] uppercase tracking-wider font-bold font-sans">
                      New
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold font-sans">
                      {item.mediaType} • {item.file.name.substring(0, 16)}...
                    </span>
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) => updateNewSubtitle(item.id, e.target.value)}
                      placeholder="Enter description/caption..."
                      className="w-full bg-black/35 border border-white/5 focus:border-luxury-gold/30 rounded-sm px-3 py-1.5 text-xs text-white placeholder-zinc-600 outline-none transition-all"
                    />
                  </div>
                  <button
                    onClick={() => removeNewItem(item.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-full transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 pt-4 border-t border-luxury-gold/15">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-white/10 text-zinc-400 hover:text-white text-xs tracking-widest uppercase rounded-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave || saving}
            className="flex-1 py-3 bg-luxury-gold hover:brightness-110 text-black font-semibold text-xs tracking-widest uppercase rounded-sm transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────
export default function AdminPanel() {
  const queryClient = useQueryClient();
  const { data: settings } = useSettings();
  const { data: collections = [] } = useCollections();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  // Dynamic categories list
  const categories = collections.length > 0
    ? collections.map(c => ({ id: c.id, label: c.title }))
    : collectionsConfig.map(c => ({ id: c.id, label: c.title }));

  // Set initial category when categories load
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  // Drag and drop sequencing states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  // Fetch products for the active category
  useEffect(() => {
    if (!activeCategory) return;
    let active = true;
    async function load() {
      const list = await getProducts(activeCategory);
      if (active) {
        setProducts(list);
      }
    }
    load();
    setShowAddForm(false);
    return () => {
      active = false;
    };
  }, [activeCategory]);

  // Load counts for all categories on mount or when products list changes
  useEffect(() => {
    if (categories.length === 0) return;
    let active = true;
    async function loadCounts() {
      const counts: Record<string, number> = {};
      for (const cat of categories) {
        const list = await getProducts(cat.id);
        counts[cat.id] = list.length;
      }
      if (active) {
        setCategoryCounts(counts);
      }
    }
    loadCounts();
    return () => {
      active = false;
    };
  }, [products]);

  const handleAdd = async (
    productMetadata: { title: string; subtitle: string },
    mediaItems: { file: File; mediaType: "image" | "video"; subtitle: string }[]
  ) => {
    const newProd = await createProduct(activeCategory, productMetadata, mediaItems);
    setProducts((prev) => [newProd, ...prev]);
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleEditSave = async (
    productId: string,
    updates: { title: string; subtitle: string; media: any[] }
  ) => {
    const updatedProd = await updateProduct(productId, updates);
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? updatedProd : p))
    );
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleDelete = async (productId: string) => {
    await deleteProduct(productId, activeCategory);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const reordered = [...products];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setProducts(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);

    setIsReordering(true);
    try {
      await updateProductsOrder(reordered.map((p) => p.id));
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (err) {
      console.error("Failed to update products order:", err);
      // Rollback sequence on error
      const list = await getProducts(activeCategory);
      setProducts(list);
    } finally {
      setIsReordering(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowAddForm(false);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-luxury-black text-zinc-100 selection:bg-luxury-gold selection:text-black select-none">
      {/* Header */}
      <header className="border-b border-luxury-gold/10 bg-black/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-luxury-gold/15 border border-luxury-gold/30 flex items-center justify-center">
              <Lock size={12} className="text-luxury-gold" />
            </div>
            <div>
              <p className="text-xs font-serif tracking-[0.2em] text-white uppercase">{settings?.site_name || siteConfig.name}</p>
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
          {categories.map((cat) => {
            const count = categoryCounts[cat.id] ?? 0;
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
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-serif font-light tracking-wider text-white uppercase">
              {categories.find((c) => c.id === activeCategory)?.label} Collection
            </h2>
            {isReordering && (
              <span className="text-[10px] uppercase tracking-widest text-luxury-gold flex items-center gap-1.5 animate-pulse font-sans">
                <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-ping" /> Saving sequence...
              </span>
            )}
          </div>
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
                {products.map((product, idx) => (
                  <div
                    key={product.id}
                    draggable
                    onDragStart={(e) => {
                      setDraggedIndex(idx);
                      e.dataTransfer.setData("text/plain", idx.toString());
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragEnd={() => {
                      setDraggedIndex(null);
                      setDragOverIndex(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (draggedIndex !== idx) {
                        setDragOverIndex(idx);
                      }
                    }}
                    onDragLeave={() => {
                      if (dragOverIndex === idx) {
                        setDragOverIndex(null);
                      }
                    }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const fromIdxStr = e.dataTransfer.getData("text/plain");
                      if (fromIdxStr === "") return;
                      const fromIndex = parseInt(fromIdxStr, 10);
                      if (fromIndex === idx) return;
                      await handleReorder(fromIndex, idx);
                    }}
                    className={`transition-all duration-300 rounded-sm overflow-hidden ${
                      draggedIndex === idx ? "opacity-30 scale-95 cursor-grabbing" : ""
                    } ${
                      dragOverIndex === idx 
                        ? "border border-luxury-gold ring-1 ring-luxury-gold shadow-[0_0_20px_rgba(197,168,128,0.25)] translate-y-[-2px]" 
                        : "border border-transparent"
                    }`}
                  >
                    <AdminProductCard
                      product={product}
                      onEdit={() => setEditingProduct(product)}
                      onDelete={() => handleDelete(product.id)}
                    />
                  </div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Product Modal Overlay */}
      <AnimatePresence>
        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            categoryId={activeCategory}
            onSave={handleEditSave}
            onClose={() => setEditingProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
