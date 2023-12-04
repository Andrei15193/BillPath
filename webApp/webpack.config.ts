import path from "path";
import fs from "fs";
import CopyWebpackPlugin from "copy-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const indexOfModeCommandLineArgument = process.argv.lastIndexOf("--mode");
const isProduction = (indexOfModeCommandLineArgument >= 0)
  && ((indexOfModeCommandLineArgument + 1) < process.argv.length)
  && ("production".localeCompare(process.argv[indexOfModeCommandLineArgument + 1], "en-US", { sensitivity: "base" }) === 0)

const faviconFileName = "favicon.ico"
const faviconFilePath = path.resolve(__dirname, faviconFileName);

const resetCssBundleFileName = "reset.css";
const resetCssPackageDirectoryPath = path.resolve(__dirname, "node_modules", "reset-css");
const resetCssBundleFilePath = path.resolve(resetCssPackageDirectoryPath, resetCssBundleFileName);
const resetCssVersion = JSON.parse(fs.readFileSync(path.resolve(resetCssPackageDirectoryPath, "package.json")).toString()).version;

const reactBundleFileName = isProduction ? "react.production.min.js" : "react.development.js";
const reactPackageDirectoryPath = path.resolve(__dirname, "node_modules", "react");
const reactBundleFilePath = path.resolve(reactPackageDirectoryPath, "umd", reactBundleFileName);
const reactVersion = JSON.parse(fs.readFileSync(path.resolve(reactPackageDirectoryPath, "package.json")).toString()).version;

const reactDomBundleFileName = isProduction ? "react-dom.production.min.js" : "react-dom.development.js";
const reactDomPackageDirectoryPath = path.resolve(__dirname, "node_modules", "react-dom");
const reactDomBundleFilePath = path.resolve(reactDomPackageDirectoryPath, "umd", reactDomBundleFileName);
const reactDomVersion = JSON.parse(fs.readFileSync(path.resolve(reactDomPackageDirectoryPath, "package.json")).toString()).version;

export default {
  entry: {
    billpath: "./index"
  },
  output: {
    path: path.resolve(__dirname, "build"),
    chunkFilename: "billpath.[id].js",
    clean: true
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devtool: isProduction ? false : "inline-source-map",
  stats: {
    errorDetails: true
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: resetCssBundleFilePath },
        { from: reactBundleFilePath },
        { from: reactDomBundleFilePath },
        { from: faviconFilePath }
      ]
    }),
    new HtmlWebpackPlugin({
      title: "BillPath",
      favicon: faviconFileName,
      meta: {
        charset: "utf-8",
        "Content-Type": {
          "http-equiv": "Content-Type",
          "content": "text/html; charset=utf-8"
        },
        "Content-Security-Policy": {
          "http-equiv": "Content-Security-Policy",
          "content": "script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; default-src 'none'"
        },
        "Cache-Control": {
          "http-equiv": "Cache-Control",
          "content": "no-cache, no-store, must-revalidate"
        },
        "Pragma": {
          "http-equiv": "Pragma",
          "content": "no-cache"
        },
        "Expires": {
          "http-equiv": "Expires",
          "content": "0"
        }
      },
      hash: true,
      scriptLoading: "blocking",
      template: path.resolve(__dirname, "index.html"),
      templateParameters: {
        resetCss: {
          version: resetCssVersion,
          bundleFileName: resetCssBundleFileName
        },
        react: {
          version: reactVersion,
          bundleFileName: reactBundleFileName
        },
        reactDom: {
          version: reactDomVersion,
          bundleFileName: reactDomBundleFileName
        }
      }
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader"
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
      {
        test: /\.png$/,
        type: "asset/resource"
      }
    ],
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin()
    ],
  },
  devServer: {
    headers: {
      "Content-Security-Policy": "script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; default-src 'none'",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    },
    client: {
      logging: "info",
      overlay: false,
    },
    port: 8000,
    compress: true,
    open: true
  }
};