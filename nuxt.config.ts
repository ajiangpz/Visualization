// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  app: {
    head: {
      title: "app",
      script: [
        {
          src: "gl-renderer.js",
          type: "text/javascript"
        }
      ]
    }
  },

  pages: true,

  build: {
    loaders: {
      scss: {
        implementation: require("sass")
      }
    },
    transpile: ["tdesign-vue-next"]
  },

  tdesign: {
    resolveIcons: true
  },

  css: ["assets/styles/tdesign.scss"],

  plugins: [
    {
      src: "plugins/tdesign.ts",
      ssr: true
    }
  ],

  modules: ["@tdesign-vue-next/nuxt", "@nuxtjs/tailwindcss"]
});
