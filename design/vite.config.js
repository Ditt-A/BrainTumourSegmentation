import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: "./",
  server: { fs: { allow: [".."] } },
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL("./index.html", import.meta.url)),
        simulasi: fileURLToPath(new URL("./simulasi.html", import.meta.url)),
      },
    },
  },
});
