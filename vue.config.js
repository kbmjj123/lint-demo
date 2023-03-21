const path = require('path');
const env = process.env.NODE_ENV || 'development';
let title = '蜘点商家管理系统';
let publicPath = './';
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin({
	outputFormat: 'human'
});
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer');

const TerserPlugin = require("terser-webpack-plugin");
switch (env) {
	case 'development':
		publicPath = './';
		break;
	case 'production':
		publicPath = './';
		break;
}

function resolve (dir) {
	return path.join(__dirname, dir)
}

module.exports = {
	productionSourceMap: false,

	// 静态资源引用跟路径
	publicPath: publicPath,

	// 打包输出目录
	outputDir: 'dist/dist',

	assetsDir: 'static',
	// eslint
	lintOnSave: false,

	devServer: {
		// port: port,
		open: env === 'development',
		overlay: {
			warnings: false,
			errors: true
		}
	},
	// pluginsOptions: {
	// 	icon: 'lankao.ico'
	// },

	// 分析打包速度
	configureWebpack: smp.wrap({
		name: title,
		resolve: {
			alias: {
				'@': resolve('src'),
				'vue$': 'vue/dist/vue.esm.js'
			}
		},

		plugins: [
		],
		module: {
			rules: [
				{
					// 多进程多实例构建，资源并行解析
					test: /\.js$/,
					use: ['thread-loader']
				}
			]
		},
		optimization: {
			minimizer: [
				// 多进程多实例并行压缩
				new TerserPlugin({
					parallel: true
				})
			]
		}
	}),

	chainWebpack (config) {

		// 是否显示打包分析报告
		if (process.env.USE_ANALYZER) {
			config
				.plugin('webpack-bundle-analyzer')
				.use(WebpackBundleAnalyzer.BundleAnalyzerPlugin);
		}

		// 当有很多页面时，会导致太多无意义的请求
		config.plugins.delete('prefetch')
		config.plugins.delete('preload')

		config.module
			.rule('vue')
			.use('vue-loader')
			.loader('vue-loader')
			.tap(options => {
				options.compilerOptions.preserveWhitespace = true
				return options
			})
			.end()

		// config.when(env === 'development', config =>
		//   config.devtool('cheap-source-map')
		// )

		config.when(env !== 'development', config => {

			// 将经常变的runtime.js文件内容放到html中，提高请求性能
			config
				.plugin('ScriptExtHtmlWebpackPlugin')
				.after('html')
				.use('script-ext-html-webpack-plugin', [
					{
						inline: /runtime\..*\.js$/
					}
				])
				.end()

			// index.html 引用路径时不删除引号
			config.plugin('html').tap(args => {
				args[0].minify = {
					...args[0].minify,
					removeAttributeQuotes: false
				}
				return args
			})

			// js文件拆包
			config.optimization.splitChunks({
				chunks: 'all',
				maxInitialRequests: Infinity,
				minSize: 200000,
				cacheGroups: {
					libs: {
						name: 'chunk-libs',
						test: /[\\/]node_modules[\\/]/,
						priority: 10,
						chunks: 'initial', // only package third parties that are initially dependent
					},
					iviewUI: {
						name: 'chunk-iviewUI',
						priority: 20,
						test: /[\\/]node_modules[\\/]_?iview(.*)/
					},
					echarts: {
						name: 'chunk-echarts',
						priority: 20,
						test: /[\\/]node_modules[\\/]_?echarts(.*)/
					},
					commons: {
						name: 'chunk-commons',
						test: resolve('src/components'),
						minChunks: 3,
						priority: 5,
						reuseExistingChunk: true
					}
				}
			})

			config.optimization.runtimeChunk('single')
		})

	}

}
