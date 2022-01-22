const {
  "[data-theme=dark]": darkTheme,
} = require("daisyui/colors/themes");

const {
  "[data-theme=light]": lightTheme,
} = require("daisyui/colors/themes");


const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontFamily: {
        'serif': ['source-serif-pro', 'source-han-serif-sc', 'Georgia', "Noto Serif CJK SC", "Source Han Serif SC", "Source Han Serif CN", "游明朝", "Yu Mincho", "游明朝体", 'YuMincho', "ヒラギノ明朝 Pro", "Hiragino Mincho ProN", "MS P明朝", "MS PMincho", 'HGS明朝E', "MS Mincho", "AR PL New Sung", "AR PL SungtiL GB", 'STSong', 'NSimSun', 'SimSun', "WenQuanYi Bitmap Song", "AR PL UMing CN", "AR PL UMing HK", "AR PL UMing TW", "AR PL UMing TW MBE", 'PMingLiU', 'MingLiU', 'serif'],
        'sans': ['source-han-sans-simplified-c', 'sans-serif'],
        'mono': ['source-code-pro', 'source-han-sans-simplified-c', 'monospace'],
      }
    },
  },

  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        dark: {
          ...darkTheme,
          // https://tailwindcss.com/docs/customizing-colors
          // red-600
          primary: "#dc2626",
          // red-300
          'primary-focus': "#fca5a5",
          // blue-800
          secondary: "#1e40af",
          // blue-200
          'secondary-focus': '#bfdbfe',
          // lime-500
          accent: "#84cc16",
          // lime-200
          'accent-focus': '#d9f99d',
          'base-100': '#18181b',
          'base-300': '#171717'
        },
        light: {
          ... lightTheme,
          // red-400
          primary: "#f87171",
          // red-800
          'primary-focus': "#991b1b",
          // emerald-400
          secondary: "#059669",
          // green-700
          'secondary-focus': '#15803d',
          // blue-500
          accent: "#3b82f6",
          // blue-200
          'accent-focus': '#1e40af',
          'base-100': '#f4f4f5',
          'base-300': '#fff'
        }
      },
    ],
  },
};

module.exports = config;
