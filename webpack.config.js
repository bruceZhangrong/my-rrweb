const path = require('path')

module.exports = {
  entry: './assets/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: '/.js$/',
        enforce: 'pre',
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['env'] }
          },
          {
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint-friendly-formatter'),
              emitWarning: true
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts']
  }
}
