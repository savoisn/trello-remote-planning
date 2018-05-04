const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',

  entry: {
    bundle: "./src/index.js"
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },

  devtool: "source-map",

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  },

  resolve: {
    alias: {
        'Trello': './src/assets/js/client.js'
        'SimplePeer': './src/assets/js/client.js'
    }
  },
 
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/assets', to: 'assets' }
    ]),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Development',
      template: 'src/index.html',
			inject: false
    }),
    new HtmlWebpackPlugin({  // Also generate a test.html
			filename: 'planning.html',
			template: 'src/planning.html',
			inject: false
		}),
    new HtmlWebpackPlugin({  // Also generate a test.html
			filename: 'toto.html',
			template: 'src/toto.html',
			inject: false
		})

  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          /node_modules/
        ],
        use: [
          { loader: "babel-loader" }
        ]
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }

    ]
  }
}
