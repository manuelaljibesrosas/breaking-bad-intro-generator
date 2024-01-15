import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import vitePluginString from "vite-plugin-string";
import vitePluginSvgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vitePluginString(), vitePluginSvgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/breaking-bad-intro-generator/",
});
