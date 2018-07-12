const BabiliPlugin = require("babili-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const minifyOpts = { mangle: { topLevel: true } };
const HappyPack = require("happypack");
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const rxPaths = require("rxjs/_esm5/path-mapping");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  mode: "production",
  entry: ["./es6/app.js"],
  output: {
    filename: "app.js"
  },
  resolve: {
    extensions: [".js", ".json", ".jsx"],
    alias: rxPaths()
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: "happypack/loader?id=babel"
      },
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: "happypack/loader?id=babel"
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new CompressionPlugin({
      test: /\.js$|\.css$|\.svg$||\.jpg$\.html$/,
      algorithm: "gzip"
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HappyPack({
      id: "babel",
      threads: 4,
      threadPool: happyThreadPool,
      loaders: [
        {
          loader: "babel-loader",
          query: {
            plugins: [
              "@babel/transform-runtime",
              "@babel/plugin-proposal-object-rest-spread",
              "babel-plugin-transform-react-jsx"
            ],
            presets: ["@babel/react", "@babel/env"]
          }
        }
      ]
    }),
    new BabiliPlugin(minifyOpts)
  ]
};
