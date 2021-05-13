module.exports = (nextConfig = {}) => ({
  ...nextConfig,
  webpack(config, options) {
    const { dev, isServer } = options;
    const isClient = !isServer;

    config.module.rules.splice(1, 1);

    if (dev) {
      config.module.rules.push({
        sideEffects: true,
        test: /(?<!\.module)\.css$/,
        use: [isClient && "next-style-loader", "css-loader"].filter(Boolean),
      });

      config.module.rules.push({
        sideEffects: true,
        test: /\.module\.css$/,
        use: [
          isClient && "next-style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                exportOnlyLocals: isServer,
              },
            },
          },
        ].filter(Boolean),
      });
    }

    return typeof nextConfig.webpack === "function"
      ? nextConfig.webpack(config, options)
      : config;
  },
});
