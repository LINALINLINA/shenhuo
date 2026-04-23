import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  // GitHub Pages project site path
  base: "/shenhuo/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        characters: resolve(__dirname, "characters.html"),
        stories: resolve(__dirname, "stories.html"),
        worldmap: resolve(__dirname, "worldmap.html"),
      },
    },
  },
});
