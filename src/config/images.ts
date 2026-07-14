export const imageConfig = {
  // CDN Base URL prefix. Leave empty for local absolute routing under the public/ folder.
  baseUrl: "",

  heroImages: {
    teaserHero: "/images/suit-client.png", // Recreated professional black jodhpuri suit portrait
  },

  collections: {
    "bespoke-suit": "/images/suit-client.png",
    "royal-sherwani": "/images/sherwani-client-1.png", // Cream sherwani model
    "signature-kurta": "/images/sherwani-client-2.png", // Beige patterned sherwani model
    "fabric-shop": "/images/collections-fabric.png",    // Luxury fabric rolls selection
  },

  workGallery: [
    { id: "gallery-1", url: "/images/suit-client.png", alt: "Bespoke Groom Jodhpuri Suit in Jet Black" },
    { id: "gallery-2", url: "/images/sherwani-client-1.png", alt: "Royal Ivory Silk Wedding Sherwani with Zardozi Collar" },
    { id: "gallery-3", url: "/images/sherwani-client-2.png", alt: "Embroidered Cream Sherwani and Kurta Ensemble" },
  ],

  fabrics: [
    { name: "Premium Woolens & Silks", url: "/images/collections-fabric.png" },
  ],

  testimonials: [
    { clientName: "Marcus Sterling", clientImage: "/images/suit-client.png" },
  ]
};
