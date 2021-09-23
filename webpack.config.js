const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  context: path.resolve(__dirname, "src"),
  entry: {
    index: {
      import: "./index.js",
      dependOn: ["app", "auth", "firestore", "performance"],
    },
    app: "firebase/app",
    auth: "firebase/auth",
    firestore: "firebase/firestore",
    performance: "firebase/performance",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    clean: true,
  },
  optimization: {
    runtimeChunk: "single",
  },
  devServer: {
    open: true,
    host: "localhost",
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html",
      inject: "head",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.txt$/i,
        use: "raw-loader",
      },
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
