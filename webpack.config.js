var path = require('path');
var merge = require('./lib/merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var TARGET = process.env.TARGET;
var ROOT_PATH = path.resolve(__dirname);

var common = {
  entry: [path.join(ROOT_PATH, 'app/main')],
  output: {
    path: path.resolve(ROOT_PATH, 'build'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      }
    ]
  },
};

var mergeConfig = merge.bind(null, common);

if(TARGET === 'build') {
   module.exports = mergeConfig({
     plugins: [
       new HtmlWebpackPlugin({
         title: 'Kanban app',
         template: path.join(ROOT_PATH, 'app/index.tpl')
       }),
     ],
   });
}

if(TARGET === 'dev') {
  var IP = '0.0.0.0';
  var PORT = 8080;

  module.exports = mergeConfig({
    ip: IP,
    port: PORT,
    entry: [
      'webpack-dev-server/client?http://' + IP + ':' + PORT,
      'webpack/hot/dev-server',
    ],
    
    module: {
      preLoaders: [
        {
          test: /\.jsx?$/,
          // we are using `eslint-loader` explicitly since
          // we have eslint module installed. This way we
          // can be certain that it uses the right loader
          loaders: ['eslint-loader', 'jscs'],
          include: path.join(ROOT_PATH, 'app'),
        }
      ],
    },
    output: {
      path: __dirname,
      filename: 'bundle.js',
      publicPath: '/dev-server/'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ]
  });
}
