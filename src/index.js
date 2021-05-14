function cssUses({ isServer, cssOptions }) {
  const loaders = [];

  if (!isServer) {
    loaders.push("next-style-loader");
  }

  loaders.push({
    loader: "css-loader",
    options: cssOptions,
  });

  return loaders;
}

module.exports = (nextConfig = {}) => {
  const { cssOptions, sassOptions, ...restConfig } = nextConfig;
  return {
    ...restConfig,
    webpack(config, options) {
      const { dev, isServer } = options;

      config.module.rules.splice(1, 1);

      if (dev) {
        config.module.rules.push({
          sideEffects: true,
          test: /(?<!\.module)\.css$/,
          use: cssUses({ isServer }),
        });
        config.module.rules.push({
          test: /\.module\.css$/,
          use: cssUses({
            isServer,
            cssOptions: {
              ...cssOptions,
              modules: {
                ...cssOptions.modules,
                exportOnlyLocals: isServer,
              },
            },
          }),
        });
      }

      return typeof nextConfig.webpack === "function"
        ? nextConfig.webpack(config, options)
        : config;
    },
  };
};
