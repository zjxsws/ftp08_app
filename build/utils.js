// @kyy 20180625 新增 exports.getEntries  exports.HtmlWebpackPluginArr
'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
const HtmlWebpackPlugin = require('html-webpack-plugin')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        //pubilcPath:'../../',
        fallback: 'vue-style-loader',
        publicPath:"../../"
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

var glob = require('glob');
//@kyy  20180625 获取多级的入口文件
exports.getEntries = function (globPath) {
  var entries = {},
      basename, tmp, pathname;
  glob.sync(globPath).forEach(function (entry) {
      basename = path.basename(entry, path.extname(entry));
      tmp = entry.split('/');//.splice(-4);
  var pathsrc = tmp[0]+'/'+tmp[1];
  if( tmp[0] == 'src' ){
      pathsrc = tmp[1];
  }
  entries[basename] = entry;
  /* 正式环境需注释   正确输出js和html的路径*/
  pathname = pathsrc + '/' + basename;
  console.log(basename+'-----------'+entry);
  });
  return entries;
  }

// @kyy  20180625 webpack内置插件配置
var t=this;
exports.HtmlWebpackPluginArr=function(){
    var pages = t.getEntries('./src/modules/**/*.html');
    var Arr=[];
    for(var page in pages) {
      // 配置生成的html文件，定义路径等
      var conf = {
        filename: page + '.html',
        template: pages[page], //模板路径
        inject: true,
        // filter：将数据过滤，然后返回符合要求的数据，Object.keys是获取JSON对象中的每个key
        excludeChunks: Object.keys(pages).filter(item => {
          return (item != page)
        })
      }
      Arr.push(new HtmlWebpackPlugin(conf));
    }
    // console.log(Arr)
    return Arr;
}
