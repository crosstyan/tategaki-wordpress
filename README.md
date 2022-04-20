# Tategaki Wordpress

## Config

Change `static/favicon.png` to your favicon.

Change [`src/config.ts`](src/config.ts)

Change the info in [`src/app.html`](src/app.html) to your TypeKit ID.

## Docker

```bash
git clone https://github.com/crosstyan/tategaki-wordpress
cd tategaki-wordpress
docker build -t tategaki-wp -f ./docker/Dockerfile .
```

Or use [`docker-compose`](https://docs.docker.com/compose/)

```yaml
services:
    db:
        image: mariadb
        restart: unless-stopped
        volumes: 
            - ./db/data:/var/lib/mysql
        ports:
            - "127.0.0.1:3306:3306"
        environment:
            MYSQL_ROOT_PASSWORD: YOUR_PASSWORD
    php8:
        image: php:fpm-buster
        restart: unless-stopped
        volumes: 
            - /var/www:/var/www # you wordpress application
        ports:
            - "127.0.0.1:9000:9000"
    nginx:
        image: macbre/nginx-http3:latest
        restart: unless-stopped
        volumes: 
            - ./conf:/etc/nginx
        ports:
            - "80:80"
            - "443:443"
            - "443:443/udp"
    tategaki:
        build: 
          context: ./tategaki-wordpress
          dockerfile: ./docker/Dockerfile
        volumes: 
            - ./tategaki-wordpress:/root/app
        restart: unless-stopped
```

```nginx
server{
  server_name example.com;
  listen 80;
  listen 443 ssl http2;

  ssl_certificate /etc/nginx/ssl/example/fullchain.pem; # change this
  ssl_certificate_key /etc/nginx/ssl/example/privkey.pem; # change this
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
  ssl_prefer_server_ciphers on;
  ssl_session_cache shared:SSL:50m;
  ssl_session_timeout 1d;

  # forward to node server
  # no Websocket support (don't need)
  location / {
      proxy_set_header   X-Forwarded-For $remote_addr;
      proxy_set_header   Host $http_host;
      proxy_pass         http://tategaki:3000;
  }
}
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
