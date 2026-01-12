module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@queries': './src/queries',
            '@api': './src/api',
            '@screens': './src/screens',
            '@navigators': './src/navigators',
            '@utils': './src/utils',
            '@types': './src/types',
            '@ui': './src/ui',
            '@components': './src/components',
            '@hooks': './src/hooks',
          },
        },
      ],
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './src/ui/config.tsx',
          logTimings: true,
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],
    ],
  };
};
