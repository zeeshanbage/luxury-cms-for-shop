export interface CollectionItem {
  id: string;
  title: string;
  price: string;
  description: string;
  icon: string;
  features: string[];
}

export const collectionsConfig: CollectionItem[] = [
  {
    id: "ladies-suits",
    title: "Ladies Suits",
    price: "Starting from ₹1,200",
    description: "Premium designer ladies suits, salwar kameez sets, and custom-stitched boutique suits designed for elegant daily wear and special occasions.",
    icon: "Layers",
    features: [
      "Custom stitching and custom fitting options",
      "High-grade threads and durable sewing styles",
      "Choice of matching churidar, salwar, or pants",
      "Includes premium matching dupatta linings"
    ]
  },
  {
    id: "dress-materials",
    title: "Dress Materials",
    price: "Starting from ₹600",
    description: "Unstitched premium dress materials in cotton, silk, georgette, and linen from India's top design houses.",
    icon: "Scissors",
    features: [
      "Premium cotton, linen, silk, and georgette swatches",
      "Ready to be custom tailored to your exact measurements",
      "Includes matching top, bottom, and dupatta material",
      "Guaranteed color fastness and fabric longevity"
    ]
  },
  {
    id: "sarees",
    title: "Sarees Collection",
    price: "Starting from ₹1,500",
    description: "Stunning range of premium sarees, including Banarasi silk, Kanjivaram, Georgette, Organza, and designer party-wear collections.",
    icon: "Sparkles",
    features: [
      "Pure silks, organzas, and heavily worked borders",
      "Perfect for brides, wedding guests, and festivals",
      "Includes unstitched designer blouse piece",
      "Rich zari work, thread embroidery, and prints"
    ]
  },
  {
    id: "burqa",
    title: "Burqas & Abayas",
    price: "Starting from ₹1,000",
    description: "Premium quality ready-to-wear and custom tailored burqas, abayas, and modest wear in breathable imported fabrics.",
    icon: "Shield",
    features: [
      "Imported premium Nida, Lexus, and crepe fabrics",
      "Elegant stone work, lace borders, and minimal designs",
      "Custom length sizing and sleeve fittings",
      "Comfortable for everyday wear and travel"
    ]
  },
  {
    id: "adhoc",
    title: "Custom Work & Adhoc",
    price: "On Demand",
    description: "Tailoring services, matching accessories, personalized design adjustments, and boutique commissions.",
    icon: "Compass",
    features: [
      "Custom designer blouse and lehenga stitching",
      "Matching dupattas, laces, and borders on demand",
      "Quick alteration and adjustment consultations",
      "Bespoke embroidery commissions"
    ]
  }
];
