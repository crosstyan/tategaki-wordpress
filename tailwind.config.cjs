const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontFamily: {
        'serif': ['source-serif-pro', 'source-han-serif-sc', 'STSong', 'SimSun', 'Georgia', 'serif'],
        'sans': ['source-han-sans-simplified-c', 'sans-serif'],
        'mono': ['source-code-pro', 'source-han-sans-simplified-c', 'monospace'],
        'kai': ["楷体", "楷体_GB2312", 'source-han-serif-sc', 'STSong', 'SimSun', 'Georgia', 'serif'],
      }
    },
  },

  plugins: [
    require('daisyui')
  ],
};

module.exports = config;
