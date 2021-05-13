module.exports = (nextConfig = {}) => ({
  ...nextConfig,
  webpack(config, options) {
    config.module.rules.push({
      test: /\.atomic\.css/,
      use: [],
    });

    return typeof nextConfig.webpack === "function"
      ? nextConfig.webpack(config, options)
      : config;
  },
});
