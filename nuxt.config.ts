// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // TypeScript strict mode
  typescript: {
    strict: true,
    typeCheck: false,
  },

  // Enable experimental view transitions
  experimental: {
    viewTransition: true,
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/_variables.scss" as *;',
        },
      },
    },
  },

  // Build configuration for GitHub Pages
  app: {
    baseURL: process.env.NODE_ENV === "production" ? "/lemonbar/" : "/",
    buildAssetsDir: "assets",
  },

  // SSG target for static generation
  ssr: true,

  // Runtime configuration for API access
  runtimeConfig: {
    // Private keys (server-side only, not exposed to client)
    cockpitApiKey: process.env.COCKPIT_API_KEY || "",

    // Public keys (exposed to client)
    public: {
      cockpitApiUrl: process.env.COCKPIT_API_URL || "https://hirelemon.com/bar/api",
      cockpitApiKey: process.env.COCKPIT_API_KEY || "", // Made public for client-side API calls
    },
  },

  compatibilityDate: "2026-02-02",
});
