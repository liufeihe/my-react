const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
// const ExtractTextPlugin = require("extract-text-webpack-plugin");


let webpackCfg = {
    entry: {index: './src/index.js'},
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: 'js/[name]-[chunkhash].js'
    },
    devServer: {
        index: 'index.html',
        contentBase: false,
        publicPath: '/',
        port: 8080,
        open: true
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader'
                    // options: {
                    //     attrs: []
                    // }
                }
            },
            // {
            //     test: /\.scss$/,
            //     // use: [
            //     //     "style-loader",
            //     //     "css-loader",
            //     //     "sass-loader"
            //     // ],
            //     use: ExtractTextPlugin.extract({
            //         fallback: "style-loader",
            //         use: [
            //             {
            //                 loader: "css-loader"
            //             },
            //             {
            //                 loader: "resolve-url-loader"
            //             },
            //             {
            //                 loader: "sass-loader",
            //                 options: {
            //                     sourceMap: true
            //                 }
            //             }
            //         ]
            //     })
            // },
            {
                test: /\.js?$/,
                loader: 'babel-loader'
            },
            // {
            //     test: /\.(png|jpe?g|gif|svg)$/i,
            //     use: [
            //       {
            //         loader: 'url-loader',
            //         // 配置 url-loader 的可选项
            //         options: {
            //         // 限制 图片大小 10000B，小于限制会将图片转换为 base64格式
            //           limit: 10000,
            //         // 超出限制，创建的文件格式
            //         // build/images/[图片名].[hash].[图片格式]
            //           name: 'images/[name].[hash].[ext]'//utils.getAssetsPath('images/[name].[hash].[ext]')
            //        }
            //       }
            //     ]
            // }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html', // 文件名，生成的html存放路径，相对于path
            template: './index.html', // html模板的路径
            chunks: ['index'],
            inject: 'body', // //js插入的位置
            minify: { // 压缩HTML文件
                removeComments: true, // 移除HTML中的注释
                collapseWhitespace: false, // 删除空白符与换行符
                removeAttributeQuotes: true
            },
        })
    ]
}

module.exports = webpackCfg;