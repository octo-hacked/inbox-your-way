import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const hmrConfig = {
    protocol: "ws",
    host: process.env.VITE_HMR_HOST || "localhost",
    port: parseInt(process.env.VITE_HMR_PORT || "8080"),
  };

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: hmrConfig,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
