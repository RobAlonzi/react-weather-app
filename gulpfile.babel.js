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
	rimraf("./public/build", () => cb());
});

gulp.task(
	"build", 
	gulp.series(
		"clean",
		buildClient
	)
);


function buildClient(cb) {
	webpack(webpackConfig, (err, stats) => {
		if(err){
			cb(err);
			return;
		}

		console.log(stats.toString(consoleStats));
		cb();
	});
}


//--------------------------------
// Karma Testing
gulp.task('tests', function (done) {
  new Server({configFile: __dirname + '/karma.conf.js', singleRun: true}, done).start();
});