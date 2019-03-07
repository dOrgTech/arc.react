module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('awesome-typescript-loader'),
      },
    ],
    // TODO: add include director for storybook & src directories
  });
  defaultConfig.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto'
  });
  defaultConfig.resolve.extensions.push(
    '.mjs', '.ts', '.tsx'
  );
  return defaultConfig;
};