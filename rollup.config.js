const pkg = require("./package.json");
const fs = require("fs-extra");
const { kebabToPascal } = require("naming-convention-transfer");

const input = "src/index.js";

function createConfig({ pkg, input, format, file }) {
  return {
    input,
    output: {
      file,
      format,
      exports: "auto",
      name: kebabToPascal(pkg.name),
    },
  };
}

fs.emptyDirSync("./dist");
fs.copyFileSync("./src/index.d.ts", "./dist/index.d.ts");

module.exports = [
  createConfig({ pkg, input, format: "cjs", file: pkg.main }),
  createConfig({ pkg, input, format: "esm", file: pkg.module }),
];
