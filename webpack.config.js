const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackHotPlugin = require('html-webpack-hot-plugin');
// const htmlHotPlugin = new HtmlWebpackHotPlugin({ hot: true })


module.exports = {
  entry: {
    index: {
      import: './src/index.tsx',
      dependOn: 'vendor',
    },
    vendor: ['react', 'react-dom'],
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].min.js'
  },
  optimization: {
    runtimeChunk: 'single',
  },
  resolve: {
    alias: {
      'react-dom$': 'react-dom/profiling',
      'scheduler/tracing': 'scheduler/tracing-profiling',
    },
    extensions: ['.ts', '.tsx', '.js', '.css', '.scss']
  },
  // externals: {
  //   'react': 'react', 
  //   'react-dom' : 'reactDOM'
  // },
  optimization: {
    minimize: false
  },
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    // compress: true,
    host: "0.0.0.0",
    hot: true,
    port: 9000,
    open: false,
  },
  module: {
    rules: [
      {
        test: /\.svg(\?.*$|$)$/i,
        use: {
            loader: require.resolve('url-loader'),
            options: {
                name: '[name].[ext]',
                limit: 10000,
                hash: 'sha512',
                digest: 'hex',
                // The fallback loader will receive the same configuration options as url-loader
                fallback: 'file-loader',
                outputPath: 'img',
                publicPath: 'img',
            },
        },
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*$|$)$/i,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'images',
                    // publicPath: `/images`,
                },
            },
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /\.test\.ts$/],
      },
      {
        test:/\.scss$/,
        use: [
          'style-loader',   // Creates `style` nodes from JS strings
          'css-loader',     // Translates CSS into CommonJS
          'sass-loader',    // Compiles Sass to CSS
        ],
      },
      {
        test: /\.css$/,
        use: [
            {
                loader: require.resolve('css-loader'),
                options: {
                    sourceMap: false,
                },
            },
            // // Loader which rewrites relative paths in url() statements based on the original source file
            // // https://github.com/bholloway/resolve-url-loader
            // {
            //     loader: require.resolve('resolve-url-loader'),
            //     options: {
            //         keepQuery: true,
            //     },
            // },
        ].filter(Boolean),
    },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ]
}