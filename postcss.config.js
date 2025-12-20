// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: { config: './tailwind.config.ts' }, // Explicitly point to config
    autoprefixer: {},
  },
}