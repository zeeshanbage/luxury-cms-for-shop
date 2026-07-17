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
    id: "bespoke-suit",
    title: "Bespoke Groom Suit",
    price: "Starting from ₹15,000",
    description: "Individually styled and tailored western lounge suits, double-breasted coats, groom blazers, and Tuxedos drafted from your customized measurements.",
    icon: "Scissors",
    features: [
      "Custom blazer & trouser drafting",
      "Choice of premium imported suiting materials",
      "Individual canvas structured chest lining",
      "Includes personalized lapel pins & borders"
    ]
  },
  {
    id: "royal-sherwani",
    title: "Royal Wedding Sherwani",
    price: "Starting from ₹25,000",
    description: "Exquisite traditional wedding sherwanis tailored from hand-embroidered raw silk, banarasi silk, and heavy brocade. Custom fitted for grooms.",
    icon: "Award",
    features: [
      "Handmade zardozi and thread embroidery",
      "Premium raw silk & jacquard swatches",
      "Custom collar embellishments",
      "Coordinated inner kurta & matching stole"
    ]
  },
  {
    id: "signature-kurta",
    title: "Designer Kurta & Jodhpuri",
    price: "Starting from ₹5,000",
    description: "Sophisticated bandhgala Jodhpuri suits, designer pathani kurtas, and luxury linen kurtas custom contoured for festive and everyday elegance.",
    icon: "Layers",
    features: [
      "Premium Indian linen and silk materials",
      "Hand-stitched sleeve cuffs and collar plackets",
      "Perfect fall, posture, and side cut structure",
      "Includes customized bottoms (Churidar/Salwar)"
    ]
  },
  {
    id: "fabric-shop",
    title: "Exclusive Fabrics Shop",
    price: "Starting from ₹450 / meter",
    description: "Browse our select collection of imported suiting wools, jacquards, cotton shirtings, and wedding silks from India's and Italy's finest mills.",
    icon: "Compass",
    features: [
      "Exclusive Raymond, Reid & Taylor materials",
      "Wedding brocades and heavy velvet swatches",
      "Premium linen, cotton, and silk shirtings",
      "Custom package discounts on fabric + stitching"
    ]
  }
];
