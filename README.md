![youshow-logo](https://cloud.githubusercontent.com/assets/969003/13937144/f70f7c9c-efc2-11e5-944f-6fb0369608ac.png)

# YouShow

This is the front end for YouShow made with React and Material UI.

# Installation & build

Just clone this repository in your web server directory and run this commands :

```shell
npm install
npm run build
```

Create an Apache VirtualHost with this rules :

```apache
RewriteEngine on
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/static
RewriteRule ^(.*)$ /index.html?path=$1 [NC,L,QSA]
```

Restart your webserver and here we go.

# Todos

- Config
