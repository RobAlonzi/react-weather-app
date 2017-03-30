var webpackConfig = require("./webpack.config.js");

module.exports = function(config){
	config.set({
		browsers: ['Chrome'],
		singleRun: true,
		frameworks: ["mocha"],
		files: [
			"./public/build/manifest.*.js",
			"./public/build/vendor.*.js",
			"./src/tests/**/*.test.js",
			],
		preprocessors: {
			'./src/tests/**/*.test.js': ['webpack', 'sourcemap']
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