module.exports = {
  runetimeCompiler: true,
  rules: [
    {
      test: /\.scss$/,
      use: ['vue-style-loader', 'css-loader', 'sass-loader'],
    },
  ],
};
