import path from "path";
import fs from "fs";
import CopyWebpackPlugin from "copy-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CspHtmlWebpackPlugin from "csp-html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { transform } from "@formatjs/ts-transformer";
import { ExtractMessagesPlugin } from "./webpack/ExtractMessagesPlugin";

const indexOfModeCommandLineArgument = process.argv.lastIndexOf("--mode");
const isProduction = (indexOfModeCommandLineArgument >= 0)
  && ((indexOfModeCommandLineArgument + 1) < process.argv.length)
  && ("production".localeCompare(process.argv[indexOfModeCommandLineArgument + 1], "en-US", { sensitivity: "base" }) === 0)

const indexOfServeCommandLineArgument = process.argv.lastIndexOf("serve");
const isDevServer = (indexOfServeCommandLineArgument >= 0);

const indexOfWatchCommandLineArgument = process.argv.lastIndexOf("--watch");
const isWatchBuild = (indexOfWatchCommandLineArgument >= 0);

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

const extractMessagesPlugin = new ExtractMessagesPlugin({
  removeExtraMessages: !isDevServer  && !isWatchBuild
});

export default {
  entry: {
    billpath: "./index"
  },
  output: {
    path: path.resolve(__dirname, "build"),
    chunkFilename: "billpath.[id].[chunkhash].js",
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
    extractMessagesPlugin,
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
        "charset": "utf-8",
        "Content-Type": {
          "http-equiv": "Content-Type",
          "content": "text/html; charset=utf-8"
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
      cspPlugin: {
        enabled: true,
        policy: {
          "base-uri": "'self'",
          "default-src": "'none'",
          "img-src": "'self'",
          "object-src": "'none'",
          "script-src": "'strict-dynamic'",
          "style-src": ["'self'", "'unsafe-inline'"],
          ...(isProduction ? {} : { "connect-src":  isProduction ? ["'none'"] : ["'self'"] })
        },
        hashEnabled: {
          "script-src": true,
          "style-src": false
        },
        nonceEnabled: {
          "script-src": true,
          "style-src": false
        },
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
    new CspHtmlWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              getCustomTransformers() {
                return {
                  before: [
                    transform({
                      overrideIdFn: "[sha512:contenthash:base64:6]",
                      removeDefaultMessage: isProduction,
                      onMsgExtracted(filePath, messageDescriptors) {
                        messageDescriptors.forEach(messageDescriptor => extractMessagesPlugin.add(messageDescriptor));
                      }
                    })
                  ]
                }
              }
            }
          }
        ]
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
  },
  watchOptions: {
    ignored: /(node_modules|locale)/
  }
}