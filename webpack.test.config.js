var webpack = require("webpack");

module.exports = {
  entry: {
    continuous: "./test/integration/continuous.js",
    page: "./test/integration/page.js"
  },
  output: {
    filename: "dist/[name].js"
  },
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
        loader: "babel",
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
  externals: {
    "react/lib/ExecutionEnvironment": true,
    "react/lib/ReactContext": true
  }
};