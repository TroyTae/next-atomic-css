function cssUses({ isGlobal, isServer }) {
  const loaders = [];

  if (!isServer) {
    loaders.push("next-style-loader");
  }

  if (isGlobal) {
    loaders.push("css-loader");
  } else {
    loaders.push({
      loader: "css-loader",
      options: {
        modules: {
          exportOnlyLocals: isServer,
        },
      },
    });
  }

  return loaders;
}

module.exports = (nextConfig = {}) => ({
  ...nextConfig,
  webpack(config, options) {
    const { dev, isServer } = options;

    config.module.rules.splice(1, 1);

    if (dev) {
      config.module.rules.push({
        sideEffects: true,
        test: /(?<!\.module)\.css$/,
        use: cssUses({ isGlobal: true, isServer }),
      });
      config.module.rules.push({
        test: /\.module\.css$/,
        use: cssUses({ isGlobal: false, isServer }),
      });
    }

    return typeof nextConfig.webpack === "function"
      ? nextConfig.webpack(config, options)
      : config;
  },
});
