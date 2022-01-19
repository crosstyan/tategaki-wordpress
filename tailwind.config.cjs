const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontFamily: {
        'serif': ['source-han-serif-sc', 'Georgia', 'serif'],
        'sans': ['source-han-sans-simplified-c', 'sans-serif'],
        'mono': ['source-code-pro', 'source-han-sans-simplified-c', 'monospace']
      }
    },
  },

  plugins: [
    require('daisyui')
  ],
};

module.exports = config;
