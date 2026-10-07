import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  optimizeDeps: {
    // Keep the shared React renderer and UI dependencies in one optimizer generation.
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@radix-ui/react-slot",
      "lucide-react",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      srcDirectory: "src",
      // Keep the project's custom SSR error page as the server entry.
      server: { entry: "server" },
    }),
    nitro(),
    react(),
  ],
});
