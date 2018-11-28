const webpack = require("webpack");
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const NODE_ENV = process.env.NODE_ENV || "development";
console.log("NODE_ENV is %s", NODE_ENV);

const commonChunks = ["commons", "login"];
if (NODE_ENV === "development") commonChunks.push("reload");

const entryPoints = {
  index: "./client/index.js",
  about: "./client/about.js",
  manchester: "./client/category.js",
};

if (NODE_ENV === "development")
  Object.assign(entryPoints, {
    reload: "webpack-dev-server/client?http://localhost:8081"
  });

const plugins = [
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify(NODE_ENV)
    },
    NODE_ENV
  }),
  new ExtractTextPlugin("[name].css"),
  new CopyWebpackPlugin([
    {
      from: "client/assets/img",
      to: "img"
    },
    {
      from: "client/assets/fonts",
      to: "fonts"
    }
  ]),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  new HtmlWebpackPlugin({
    filename: "index.html",
    template: "./client/templates/index.hbs",
    hash: true
  }),
  new HtmlWebpackPlugin({
    filename: "about.html",
    template: "./client/templates/about.hbs",
    hash: true
  }),
  new HtmlWebpackPlugin({
    filename: "manchester.html",
    template: "./client/templates/manchester.hbs",
    hash: true
  }),
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery"
  })
];

if (NODE_ENV === "development") {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  // enable HMR globally

  plugins.push(new webpack.NamedModulesPlugin());
  // prints more readable module names in the browser console on HMR updates,

  plugins.push(
    new DashboardPlugin({
      port: 9880
    })
  );
}

if (NODE_ENV === "production") {
  plugins.push(new UglifyJsPlugin());
}

// Webpack
module.exports = {
  externals: {},

  entry: entryPoints,

  devtool: NODE_ENV !== "production" ? "source-map" : "",

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/"
    // necessary for HMR to know where to load the hot update chunks
  },

  devServer: {
    // hot: true,
    // enable HMR on the server

    contentBase: path.resolve(__dirname, "./dist"),

    // match the output `publicPath`
    publicPath: "/",

    host: "localhost",
    port: 8081,

    // Alway Serve the index.html unless the path matches another asset e.g js/css/png... ect
    historyApiFallback: true,

    disableHostCheck: true
  },

  plugins: plugins,

  module: {
    rules: [
      {
        test: /\.js|.jsx?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.(s?css)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: "style-loader"
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: true
            }
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: "postcss-loader",
            options: {
              plugins: function() {
                return [require("autoprefixer")];
              }
            }
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        exclude: [/node_modules/],
        use: [
          {
            loader: "file-loader?hash=sha512&digest=hex&name=[hash].[ext]"
          },
          {
            loader: "image-webpack-loader?bypassOnDebug&interlaced=false",
            options: {
              query: {
                optipng: {
                  optimizationLevel: 7
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(hbs)$/,
        exclude: [/node_modules/],
        use: {
          loader: "handlebars-loader",
          options: {
            helperDirs: [path.resolve("client/templates/helpers")]
          }
        }
      },
      {
        test: /\.(json)$/,
        loader: "json-loader"
      }
    ]
  }
};
