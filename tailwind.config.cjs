const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontFamily: {
        'serif': ['Noto Serif', 'Noto Serif CJK SC', 'Noto Serif CJK', 'Source Han Serif SC', 'Source Han Serif', 'source-han-serif-sc', 'Georgia', 'serif'],
      }
    },
  },

  plugins: [
    require('daisyui')
  ],
};

module.exports = config;
