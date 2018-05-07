let path = require("path"),
	webpack = require("webpack"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDebug = true;
const dirname = path.resolve("./");

const devTool = isDebug ? "eval-source-map" : "";
const plugins = [ 
  new HtmlWebpackPlugin({template: "./src/index.html"}),
];
const mode = isDebug ? "development" : "production";

let optimization = {};

const cssLoader = { test: /\.css$/, use: ["style-loader", "css-loader"]};
const sassLoader = { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] };
const appEntry = __dirname + "/src/client.js";


if(!isDebug){
	plugins.push(new ExtractTextPlugin("css/[name].[hash].css"));
	plugins.push(new OptimizeCssAssetsPlugin({
		cssProcessorOptions: { discardComments: {removeAll: true } }
	}));

	cssLoader.use = ExtractTextPlugin.extract({ use: "css-loader" });
	sassLoader.use = ExtractTextPlugin.extract({ use: "css-loader!sass-loader"});

	optimization.runtimeChunk = true;
}

// ---------------------
// WEBPACK CONFIG
module.exports = {
		devtool: devTool,
		mode: mode,
		entry: {
			application: appEntry
		},
		output: {
			path: path.join(dirname, "public"),
			filename: "[name].js"
		},
		module : {
			rules: [
				{ test: /\.js$/, loader:"babel-loader", exclude: "/(node_modules|bower_compontents)/", options: {
          presets: [
            'react',
            'stage-0',
            ['env', { targets: { browsers: ['last 2 versions'] } }]
          ]
        } },
				{ test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg|woff2)$/, loader:"url-loader?limit=1024"},
				cssLoader,
				sassLoader
			]
		},
		optimization: optimization,
    	plugins: plugins
	};
	// ---------------------
