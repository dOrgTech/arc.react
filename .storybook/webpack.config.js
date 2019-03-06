module.exports = (baseConfig, env, defaultConfig) => {
    // Extend it as you need.
    // For example, add typescript loader:
    defaultConfig.module.rules.push({
        test: /\.(ts|tsx)$/,
        loader: require.resolve('awesome-typescript-loader')
    });
    defaultConfig.resolve.extensions.push('.ts', '.tsx');
    defaultConfig.resolve.mainFields = ['browser', 'main', 'module'];

    return defaultConfig;
};
