import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/config/router";
import { themeConfig } from "@/config/theme";
import { useSettings } from "@/hooks/useDbQueries";
import { activeClientConfig } from "@/config/activeClient";

export default function App() {
  const { data: settings } = useSettings();

  useEffect(() => {
    // 1. Theme Configuration: Inject theme variables from themeConfig
    const root = document.documentElement;
    const { colors } = themeConfig;
    
    root.style.setProperty("--primary-color", colors.primary);
    root.style.setProperty("--primary-hover-color", colors.primaryHover);
    root.style.setProperty("--primary-muted-color", colors.primaryMuted);
    
    // Derived soft gold variants
    root.style.setProperty("--primary-light-color", `${colors.primary}dd`);
    root.style.setProperty("--primary-dark-color", colors.primaryMuted);
    
    root.style.setProperty("--background-color", colors.background);
    root.style.setProperty("--background-color-pure", "#000000");
    root.style.setProperty("--card-color", colors.card);
    root.style.setProperty("--elevated-color", `${colors.card}dd`);
    root.style.setProperty("--border-color", colors.border);
    
    // Shadow / border glows
    root.style.setProperty("--shadow-glow-color", colors.glowColor);
    root.style.setProperty("--ambient-glow-color", colors.glowColor.replace("0.15", "0.1"));
    root.style.setProperty("--border-color-glow-start", colors.glowColor.replace("0.15", "0.2"));
    root.style.setProperty("--border-color-glow-end", colors.glowColor.replace("0.15", "0.6"));

    // 2. Dynamic Favicon: Swap the tab icon to the active client's logo
    const faviconEl = document.getElementById("app-favicon") as HTMLLinkElement | null;
    if (faviconEl && activeClientConfig.images.logo) {
      faviconEl.href = activeClientConfig.images.logo;
      faviconEl.type = "image/png";
    }
  }, []);

  useEffect(() => {
    if (!settings) return;
    
    // 2. Dynamic SEO Injection: Update meta headers from database/fallback settings
    document.title = settings.seo_title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", settings.seo_description);
    }
  }, [settings]);

  return <RouterProvider router={router} />;
}
