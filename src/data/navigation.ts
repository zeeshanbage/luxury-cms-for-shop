import type { NavigationLink } from "@/types";

export const navigationLinks: NavigationLink[] = [
  { name: "Atelier", path: "/" },
  { name: "About Maison", path: "/about" },
  { name: "Bespoke Services", path: "/services" },
  { name: "Contact", path: "/contact" },
];

export const footerLinks = {
  maison: [
    { name: "Our Story", path: "/about" },
    { name: "Sartorial Philosophy", path: "/about" },
    { name: "Bespoke Craftsmanship", path: "/about" },
  ],
  collections: [
    { name: "Bespoke Suits", path: "/services" },
    { name: "Haute Couture", path: "/services" },
    { name: "Luxury Overcoats", path: "/services" },
    { name: "Private Fitting Session", path: "/services" },
  ],
};
