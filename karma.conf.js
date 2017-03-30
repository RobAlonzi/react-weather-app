var webpackConfig = require("./webpack.config.js");

webpackConfig.plugins = [];

module.exports = function(config){
	config.set({
		browsers: ['Chrome'],
		singleRun: true,
		frameworks: ["mocha"],
		files: [
			"./src/tests/**/*.test.js",
		],
		preprocessors: {
			'./src/tests/**/*.test.js': ['webpack']
		},
		reporters: ["mocha"],
		//reporters: ["mocha", "progress"],
		client: {
			//captureConsole: true,
			mocha: {
				timeout: "5000"
			}
		},
		webpack: webpackConfig,
		webpackServer: {
			noInfo: true
		}
	});
};