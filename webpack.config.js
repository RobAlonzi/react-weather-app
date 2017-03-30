let path = require("path"),
	_ = require("lodash"),
	webpack = require("webpack"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

require('dotenv').config();

let frontEndEntries = ["./src/js/client.js"];
const OUTPUT_PATH = path.join(__dirname, "public");

const VENDOR_LIBS = [
	"lodash",
	"react",
	"react-dom",
	"react-router",
	"redux"
];

//TO-DO: set is Dev from remote location
const buildStyle = process.env.NODE_ENV || "development";
const cssLoader = (buildStyle === "development") ? ["style-loader","css-loader?sourceMap"] : ExtractTextPlugin.extract("css-loader");
const sassLoader = (buildStyle === "development") ?  ["style-loader","css-loader?sourceMap", "sass-loader?sourceMap"] : ExtractTextPlugin.extract("css-loader!sass-loader");
const devtool = (buildStyle === "development") ? "source-map" : "";

const loaders = {
	js: 	{ test: /\.jsx?$/, use:"babel-loader", exclude: /node_modules/ },
	css: 	{ test: /\.css$/, use: cssLoader},
	sass: 	{ test: /\.scss$/, use: sassLoader},
	// eslint: { test: /\.jsx?$/, loader: "eslint", exclude: /node_modules/ },
	// json: 	{ test: /\.json$/, loader: "json" },
	// files: 	{ test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg|woff2)/, loader: "url-loader?limit=5000" } 
};

const plugins = [
	new webpack.optimize.CommonsChunkPlugin({
		names: ["vendor", "manifest"]
	}),
	new webpack.DefinePlugin({
		"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
	}),
	new HtmlWebpackPlugin({
		template: "./src/index.html"
	}),
];

let publicPath = "";

if(buildStyle === "development"){
	plugins.push(new webpack.HotModuleReplacementPlugin());
	frontEndEntries.unshift(
			"react-hot-loader/patch",
			"webpack-dev-server/client?http://localhost:8080/", 
			"webpack/hot/only-dev-server"
			);
	publicPath = "http://localhost:8080/";
}else{
	plugins.push(new webpack.optimize.DedupePlugin());
	plugins.push(new ExtractTextPlugin({filename: "css/[name].[hash].css"}));
	plugins.push(new OptimizeCssAssetsPlugin({
		cssProcessorOptions: { discardComments: {removeAll: true } }
	}));
	plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}));

}

//TO-DO: if prod, add uglify plugin
function createWebpackConfig(){
	return {
		devtool,
		entry: {
			app: frontEndEntries,
			vendor: VENDOR_LIBS
		},
		module:{
			rules: _.values(loaders)
		},
		output: {
			path: OUTPUT_PATH,
			filename: "js/[name].[hash].js",
			publicPath
		},
		plugins
	};
}

module.exports = createWebpackConfig();
