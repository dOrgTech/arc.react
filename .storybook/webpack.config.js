module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve("awesome-typescript-loader"),
      },
    ],
  });

  config.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: "javascript/auto",
  });

  config.resolve.extensions.push(".mjs", ".ts", ".tsx");

  // Gets rid of verbose compilation warnings coming from
  // the 'graphql-language-service-interface' package.
  // See: https://github.com/graphql/graphql-language-service/issues/128
  config.module.rules.push({
    test: /\.js.flow$/,
    use: [
      {
        loader: require.resolve("ignore-loader"),
      },
    ],
  });

  // In order to avoid error from arc.js
  config.node = {
    fs: "empty",
    net: "empty",
    child_process: "empty",
  };

  return config;
};
