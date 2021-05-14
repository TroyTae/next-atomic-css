const withAtomicCss = require("../src/index");
// const withAtomicCss = require("next-atomic-css");
module.exports = withAtomicCss({
  cssOptions: {
    modules: {
      localIdentName: "[path][name]__[local]--[hash:base64:5]",
    },
  },
});
