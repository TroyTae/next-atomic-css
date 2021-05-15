const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
  const cssOptions = nextConfig.cssOptions || {};
  const sassOptions = nextConfig.sassOptions || {};
  const assetPrefix = nextConfig.assetPrefix || nextConfig.basePath || "";

  return {
    ...nextConfig,
    webpack(config, options) {
      const { dev, isServer } = options;
      const cssFileName = "static/css/[contenthash].css";

      if (!dev && !isServer) {
        config.plugins.splice(
          9,
          1,
          new MiniCssExtractPlugin({
            filename: cssFileName,
            chunkFilename: cssFileName,
          })
        );
      }

      config.module.rules.splice(1, 1);

      config.module.rules.push({
        sideEffects: true,
        test: /(?<!\.module)\.css$/,
        use: cssUses({ assetPrefix, dev, isServer }),
      });

      config.module.rules.push({
        sideEffects: true,
        test: /(?<!\.module)\.s[ac]ss$/,
        use: sassUses({ assetPrefix, dev, isServer }),
      });

      config.module.rules.push({
        test: /\.module\.css$/,
        use: cssUses({
          assetPrefix,
          dev,
          isServer,
          cssOptions: {
            ...cssOptions,
            modules: {
              ...cssOptions.modules,
              exportOnlyLocals: isServer,
              localIdentName: "[path][name]__[local]--[hash:base64:5]",
            },
          },
        }),
      });

      return typeof nextConfig.webpack === "function"
        ? nextConfig.webpack(config, options)
        : config;
    },
  };
};
