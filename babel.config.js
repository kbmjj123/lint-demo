module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
        },
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    '@vue/babel-preset-jsx',
  ],
  plugins: [
    [
      'import',
      {
        libraryName: 'zd-bussiness-component',
        libraryDirectory: 'packages',
      },
    ],
  ],
}
