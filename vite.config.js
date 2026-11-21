import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
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
});
