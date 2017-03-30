let path = require("path"),
	_ = require("lodash"),
	webpack = require("webpack"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	ExtractTextPlugin = require("extract-text-webpack-plugin");


const ENTRIES = ["./src/js/client.js"];
const OUTPUT_PATH = path.join(__dirname, "public", "build");

const VENDOR_LIBS = [
	"lodash",
	"react",
	"react-dom",
	"react-router",
	"redux"
];

const cssLoader = ExtractTextPlugin.extract("css-loader?sourceMap");
const sassLoader = ExtractTextPlugin.extract("css-loader?sourceMap!sass-loader?sourceMap");

//const devtool = isDev ? "source-map" : null;
const devtool = "source-map";
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
	new HtmlWebpackPlugin({
		template: "./src/index.html"
	}),
	new webpack.DefinePlugin({
		"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
	}),
	new ExtractTextPlugin({filename: "[name].css", allChunks: true})
];

//TO-DO: if prod, add uglify plugin

function createWebpackConfig(){
	return {
		devtool,
		entry: {
			app: ENTRIES,
			vendor: VENDOR_LIBS
		},
		module:{
			rules: _.values(loaders)
		},
		output: {
			path: OUTPUT_PATH,
			filename: "[name].[chunkhash].js"
		},
		plugins
	};
}

module.exports = createWebpackConfig();
