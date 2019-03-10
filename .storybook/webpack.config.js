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

  // Gets rid of verbose compilation warnings coming from
  // the 'graphql-language-service-interface' package.
  // See: https://github.com/graphql/graphql-language-service/issues/128
  defaultConfig.module.rules.push({
    test: /\.js.flow$/,
    use: [
      {
        loader: require.resolve('ignore-loader')
      }
    ]
  });

  return defaultConfig;
};
