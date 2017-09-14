var path = require("path");
var webpack=require('webpack');
// 打包插件
var htmlWebpackPlugin = require("html-webpack-plugin");
var fs = require('fs');
var CopyWebpackPlugin =require('copy-webpack-plugin');

// 
var srcDir = path.resolve(__dirname, "src");
module.exports = {
    context: path.resolve(__dirname, "src"),//上下文环境,默认的是process.cwd()当前执行文件所在的目录
    entry:getEntryObj(),
    output: {
        path: path.resolve(__dirname, 'dist'),//打包后的路径
        //占位符 [name]——当前入口文件的chunckName  [hash]——是项目的hash [chunckhash]——当前chunck的哈希
        filename:'js/[name].[hash].js',
        publicPath:"/assets/", //用于最后生成的上线的项目代码,img、js文件的路径会被设置成绝对路径——相对于服务器的根目录
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
            test:/\.png|jpg|gif|jpeg$/i, //loader处理的文件过滤规则
           //  loader:'file-loader',
           //  query: {
           //      name:'img/[name]-[hash:5].[ext]',
          //       limit:8192
           // }
           loaders:[
              'url-loader?limit=8192&name=img/[name]-[hash:5].[ext]',
            ]
           },
           {
            test:/\.css$/, //loader处理的文件过滤规则
            loader:'style-loader!css-loader'
           }
        ]

    },
    resolve: { //为各个js模块组件定义别名，方便在入口文件中require引用 
        alias: {//这里设置的路径一定得是绝对路径,不然打包时找不到模块
            jquery: srcDir + "/common/jquery.min.js", 
            ui: srcDir + "/app/ui",
            html:srcDir + "/src/html"
        }
    },
    plugins:[
        // html模板文件处理插件
       new htmlWebpackPlugin({
        filename: 'index.html',
        template: './html/index.html',
        inject: "body",//js插入位置指定 "body"\ "head"\false
        title: "一点资讯",
        excludeChunks:["medial"],//指定要添加到html文件中已经打包好的js
        minify:{ //html文件代码压缩
            // minifyCSS:true,
            // minifyJS:true,
            // removeComments:true,
            // collapseWhitespace:true
        }
       }),
       new htmlWebpackPlugin({
        filename: 'medial.html',
        template: './html/medial.html',
        inject: "body",//js插入位置指定 "body"\ "head"\false
        title: "一点号",
        // chunks:["common","medial"],//指定要添加到html文件中已经打包好的js
        excludeChunks:["index"],
        minify:{ //html文件代码压缩
            // minifyCSS:true,
            // minifyJS:true,
            // removeComments:true,
            // collapseWhitespace:true
        }
       }),
       //CommonsChunkPlugin 插件，
       // 它用于提取多个入口文件的公共脚本部分，然后生成一个 common来方便多页面之间进行复用。
       new webpack.optimize.CommonsChunkPlugin('common'),//指定chunkName
       new webpack.HotModuleReplacementPlugin(),//自动刷新，这个模块还没太弄明白，后期在写个总结
    ],

    devServer: {
       contentBase:"public/",//这个目录可以不真实存在，webpack会自动创建在内存中
       compress: true,//Enable gzip compression for everything served
       port: 9000,
       hot: true,//自动刷新 通过require引用的模块的改变会刷新，但是模板文件改变不会刷新，想要改变所有文件都刷新的话把hot设为false
       inline: true
     }
};

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

// 访问:http://localhost:9000/dist/html/
