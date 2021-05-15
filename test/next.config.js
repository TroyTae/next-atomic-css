const withAtomicCss = require("../index");
// const withAtomicCss = require("next-atomic-css");

module.exports = withAtomicCss({
  cssOptions: {
    modules: {
      namedExport: true,
    },
  },
});
