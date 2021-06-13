const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// prettier-ignore
const ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
];
const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function Mangle(characters, validate) {
  const maxIndex = characters.length;
  let keys = [0];
  let set = {};

  return function (name) {
    while (!set[name]) {
      const str = keys.map((key) => characters[key]).join("");
      if (validate(str)) {
        set[name] = str;
      }
      ++keys[0];
      keys.forEach((key, index) => {
        if (key === maxIndex) {
          const nextIndex = index + 1;
          keys[index] = 0;
          if (keys[nextIndex] === undefined) {
            keys.push(0);
          } else {
            ++keys[nextIndex];
          }
        }
      });
    }
    return set[name];
  };
}

function cssUses({ assetPrefix, dev, isServer, cssOptions }) {
  const loaders = [];

  if (!isServer) {
    loaders.push(
      dev
        ? "next-style-loader"
        : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: `${assetPrefix}/_next/`,
            },
          }
    );
  }

  loaders.push({
    loader: "css-loader",
    options: cssOptions,
  });

  return loaders;
}

function sassUses({ assetPrefix, dev, isServer, cssOptions, sassOptions }) {
  const loaders = cssUses({ assetPrefix, dev, isServer, cssOptions });

  loaders.push({
    loader: "sass-loader",
    options: sassOptions,
  });

  return loaders;
}

module.exports = (nextConfig = {}) => {
  const cssMangle = Mangle(
    [...ALPHABET, ...NUMBERS, "-", "_"],
    (str) =>
      str.slice(0, 2) !== "--" &&
      !NUMBERS.includes(str[0]) &&
      !(str[0] === "-" && NUMBERS.includes(str[1]))
  );
  const cssOptions = nextConfig.cssOptions || {};
  const sassOptions = nextConfig.sassOptions || {};
  const assetPrefix = nextConfig.assetPrefix || nextConfig.basePath || "";

  return {
    ...nextConfig,
    webpack(config, options) {
      const { dev, isServer } = options;

      if (!dev && !isServer) {
        const cssFileName = "static/css/[contenthash].css";
        config.plugins.splice(
          9,
          1,
          new MiniCssExtractPlugin({
            filename: cssFileName,
            chunkFilename: cssFileName,
          })
        );
      }

      const cssLoaderOptions = {
        ...cssOptions,
        modules: {
          ...cssOptions.modules,
          exportOnlyLocals: isServer,
          getLocalIdent: dev
            ? cssOptions.getLocalIdent
            : (context, localIdentName, localName, options) => {
                return cssMangle(
                  context.resourcePath
                    .replace(options.context + path.sep, "")
                    .replace(path.sep, "_")
                    .replace(/\./g, "_") +
                    "__" +
                    localName
                );
              },
        },
      };

      config.module.rules.splice(1, 1, {
        oneOf: [
          {
            sideEffects: true,
            test: /(?<!\.module)\.css$/i,
            use: cssUses({ assetPrefix, dev, isServer }),
          },
          {
            sideEffects: true,
            test: /(?<!\.module)\.s[ac]ss$/i,
            use: sassUses({ assetPrefix, dev, isServer }),
          },
          {
            test: /\.module\.css$/i,
            use: cssUses({
              assetPrefix,
              dev,
              isServer,
              cssOptions: cssLoaderOptions,
            }),
          },
          {
            test: /\.module\.s[ac]ss$/i,
            use: sassUses({
              assetPrefix,
              dev,
              isServer,
              cssOptions: cssLoaderOptions,
              sassOptions,
            }),
          },
          {
            test: /(jpg|jpeg|png|svg|gif|ico|webp)$/i,
            use: [
              {
                loader: "url-loader",
                options: {
                  fallback: "file-loader",
                  outputPath: `${isServer ? "../" : ""}static/images/`,
                  publicPath: `${assetPrefix}/_next/static/images/`,
                  name: "[hash:base64:5].[ext]",
                },
              },
            ],
          },
        ],
      });

      return typeof nextConfig.webpack === "function"
        ? nextConfig.webpack(config, options)
        : config;
    },
  };
};
