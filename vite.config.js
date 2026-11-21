import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves the site from /Car-Quote-Dealer/, so production builds use that base path.
// (Switch to "/" if the site moves to its own domain.) `vite preview` uses it too; the dev server stays at "/".
export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? "/Car-Quote-Dealer/" : "/",
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        // Split long-lived code into separately cached files.
        codeSplitting: {
          groups: [
            { name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: "icons", test: /node_modules[\\/]lucide-react[\\/]/ },
            { name: "catalog", test: /src[\\/]catalog\.json$/ },
          ],
        },
      },
    },
  },
}));
