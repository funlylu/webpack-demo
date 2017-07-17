var path = require("path");

// 打包插件
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var htmlWebpackPlugin = require("html-webpack-plugin");
var fs = require('fs');
// 
var srcDir = path.resolve(__dirname, "src");
module.exports = {
    // context: path.resolve(__dirname, "src"),//上下文环境,默认的是process.cwd()当前执行文件所在的目录
    entry:getEntryObj(),
    output: {
        path: path.resolve(__dirname, 'dist/[hash]'),//打包后的路径
        //占位符 [name]——当前入口文件的chunckName  [hash]——是项目的hash [chunckhash]——当前chunck的哈希
        filename:'js/[name].[hash].js',
        //publicPath:"http://192.168.1.101/", //用于最后生成的上线的项目代码,img、js文件的路径这里可以写成线上资源存放路径
        chunkFilename:'[chunkhash].js'
    },
    module:{
        noParse:/jquery/,
        rules:[
           {
            test:/\.html$/, //loader处理的文件过滤规则
            loader:'html-loader'
           },
           {
            test:/\.png|jpg|gif|jpeg$/i, 
           loaders:[
              'url-loader?limit=8192&name=img/[name]-[hash:5].[ext]',
            ]
           },
           {
            test:/\.css$/, 
            loader:'style-loader!css-loader'
           }
        ]

    },
    resolve: { //为各个js模块组件定义别名，方便在入口文件中require引用 
        alias: {
           jquery: srcDir + "/common/jquery.min.js", //这里设置的路径一定得是绝对路径
            ui: srcDir + "/app/ui",
            html:srcDir+ "/src/html"
        }
    },
    plugins:[
        // html模板文件处理插件
       new htmlWebpackPlugin({
        filename: 'index.html',
        template: './src/html/index.html',
        inject: "body",//js插入位置指定 "body"\ "head"\false
        excludeChunks:["medial"],//指定要添加到html文件中已经打包好的js
        minify:{ //html文件代码压缩
            minifyCSS:true,
            minifyJS:true,
            removeComments:true,
            collapseWhitespace:true
        }
       }),
       new htmlWebpackPlugin({
        filename: 'medial.html',
        template: './src/html/medial.html',
        inject: "body",//js插入位置指定 "body"\ "head"\false
        // chunks:["common","medial"],//指定要添加到html文件中已经打包好的js
        excludeChunks:["index"],
        minify:{ //html文件代码压缩
            minifyCSS:true,
            minifyJS:true,
            removeComments:true,
            collapseWhitespace:true
        }
       }),
       //CommonsChunkPlugin 插件，
       // 它用于提取多个入口文件的公共脚本部分，然后生成一个 common.js 来方便多页面之间进行复用。
       new CommonsChunkPlugin('common.js')
    ]
}

//获取多页面的每个入口文件，用于配置中的entry
// 本项目入口文件直接在js文件夹下，js内的目录存放入口文件引用的模块组件
function getEntryObj() {
    var entryPath = path.resolve(srcDir, 'app'); //相当与命令行：cd ./js
    var dirs = fs.readdirSync(entryPath);
    var matchs = [],
        files = {};
    dirs.forEach(function(item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'app', item);
        }
    });
    console.log(files);
    return files;
}
