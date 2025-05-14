const path = require("path");

module.exports = {
  style: {
    postcss: {
      plugins: [
        // require("@tailwindcss/postcss"),
        require("autoprefixer"),
      ],
    },
  },
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src")   // @ -> <root>/src
    }
  }
};
