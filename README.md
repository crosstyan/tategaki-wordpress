# Tategaki Wordpress

It's not a WordPress plugin or theme. Build with Svelte and TypeScript in Vite.

## Usage

Change the `src/config.ts` file. Make sure you enable the [REST API](https://developer.wordpress.org/rest-api/) in WordPress.

I guess you should only change the `url` and `blogName` properties.

i18n is still in progress, so I assume you are using Simplified Chinese.

### Build

```bash
yarn build
```

copy the `dist` folder to your Web server root directory.

#### Nginx

```nginx
server{
  server_name example.com;
  listen 80;
  listen 443 ssl http2;

  # ...

  root /var/www/whatever;
  index index.html;

  location / {
      try_files $uri $uri/ /index.html;
  }

  location ~* \.(?:ico|css|js|gif|jpe?g|png)$ {
    # Some basic cache-control for static files to be sent to the browser
    expires max;
    add_header Pragma public;
    add_header Cache-Control "public, must-revalidate, proxy-revalidate";
  }
}
```

### Develop

Vite will handle everything.

```bash
yarn dev
```

## Color Scheme

Change the `tailwind.config.cjs` file.

```javascript
const config = { // ...
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
  }
  // ...
}
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).
