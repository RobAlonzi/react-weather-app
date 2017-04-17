var webpackConfig = require("./webpack.config.js");
//plugins break the tests, debug in future
webpackConfig.plugins = [];

module.exports = function(config){
	config.set({
		browsers: ['Chrome'],
		singleRun: true,
		frameworks: ["mocha"],
		files: [
			"./src/**/*.test.js",
		],
		preprocessors: {
			'./src/**/*.test.js': ['webpack']
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