var webpack = require("webpack"),
  CleanWebpackPlugin = require("clean-webpack-plugin"),
  UnminifiedWebpackPlugin = require("unminified-webpack-plugin");

module.exports = {
  entry: [
    "./src/continuous-scroll.js"
  ],
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        include: /src/,
        loaders: ["eslint"]
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        include: [/src/, /test/],
        loader: "babel-loader",
        query: {
          presets: ["react", "es2015"]
        }
      },
      {
        test: /\.json$/,
        loader: "json",
      }
    ]
  },
  eslint: {
    failOnError: true
  },
  resolve: {
    extensions: ["", ".js", ".jsx", ".json"]
  },
  output: {
    path: __dirname + "/dist",
    filename: "continuous-scroll.min.js",
    library: "ContinuousScroll",
    libraryTarget: "umd"
  },
  externals: {
    react: {
      root: "React",
      commonjs: "react",
      commonjs2: "react",
      amd: "react"
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "react-dom"
    },
    "react/lib/ExecutionEnvironment": true,
    "react/lib/ReactContext": true
  },
  plugins: [
    new CleanWebpackPlugin(["dist"], {
      verbose: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new UnminifiedWebpackPlugin()
  ],
};