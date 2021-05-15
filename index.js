const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function cssUses({ dev, isServer, cssOptions, assetPrefix }) {
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

module.exports = (nextConfig = {}) => {
  const { cssOptions, sassOptions, ...restConfig } = nextConfig;
  const assetPrefix = nextConfig.assetPrefix || nextConfig.basePath || "";

  return {
    ...restConfig,
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
