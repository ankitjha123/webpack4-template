## Webpack4-template
React app template using node

### Features

    Support for Typescript
    Uses brotili compression 
    Hot-Module-Reload
    Code-splitting

### Required 
    yarn 
    nodemon
    node


### Scripts

```
 "scripts": {
    "start": "webpack-dev-server --config=config/webpack.dev.js",
    "build": "webpack --config=config/webpack.prod.js --env.NODE_ENV=production",
    "build:dev": "webpack --config=config/webpack.dev.js",
    "dev": "nodemon --watch config --watch src/server src/server/main.js",
    "prod": "NODE_ENV=production node src/server/main.js"
}
