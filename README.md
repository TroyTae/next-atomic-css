# Next Atomic CSS

Next.js plugin for optimizing css.

## How to use

### Installation

```
npm install next-atomic-css
```

### Configuration

```javascript
// next.config.js
const withAtomicCss = require("next-atomic-css");
module.exports = withAtomicCss({
  cssOptions: { ... },
  sassOptions: { ... }
});
```

### Options

| Name        | Description                                            |
| ----------- | ------------------------------------------------------ |
| cssOptions  | https://github.com/webpack-contrib/css-loader#options  |
| sassOptions | https://github.com/webpack-contrib/sass-loader#options |
