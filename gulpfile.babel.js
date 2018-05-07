let gulp = require("gulp");
let rimraf = require("rimraf");
let webpack = require("webpack");
let webpackConfig = require("./webpack.config.js");
let Server = require("karma").Server;

//TO-DO: add server side stuff


//--------------------------------
// Front End
const consoleStats = {
	colors: true,
	exclude: ["node_modules"],
	chunks: false,
	assets: false,
	timings: true,
	modules: false,
	hash: false,
	version: false
};

gulp.task("clean", cb => {
	rimraf("./public", () => cb());
});

gulp.task(
	"build", 
	gulp.series(
		"clean",
		buildClient
	)
);


function buildClient(cb) {
	process.env.NODE_ENV = 'production';
	webpack(webpackConfig, (err, stats) => {
		if(err){
			cb(err);
			return;
		}

		console.log(stats.toString(consoleStats));
		cb();
	});
}

gulp.task("watch", gulp.series("build", watchClient));


function watchClient() {
	const WebpackDevServer = require("webpack-dev-server");
	const compiler = webpack(webpackConfig);
	const server = new WebpackDevServer(compiler, {
		contentBase: "./public/",
		hot: true,
		stats: consoleStats
	});

	server.listen(8080, () => {});
}

//--------------------------------
// Karma Testing
gulp.task('test', function (done) {
	Server.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done);
});

// gulp.task('jest', function () {
// 	return gulp.src('./src/**/App.test.js').pipe(jest({
// 		config: {
// 			"transformIgnorePatterns": [
// 				"<rootDir>/dist/", "<rootDir>/node_modules/"
// 			],
// 			"automock": false
// 		}
// 	}));
// });