//webpack.production.config.js
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports={
    mode: "production",
    entry: path.resolve(__dirname, "app/main.js"), //entry: __dirname+"/app/main.js",
    output: {
        path: __dirname+"/build",
        filename: "bundle-[hash].js"
    },
    devtool: "none",
    devServer: {
        contentBase: "./build",
        historyApiFallback: true,
        inline: true,
        port: 8235
    },
    module:{
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude:/node_modules/
            },{
                test: /\.css$/,
                use:[{
                        loader: MiniCssExtractPlugin.loader
                     },{
                         loader: 'css-loader',
                         options: {
                             modules: {
                                 localIdentName: '[name]_[local]--[hash:base64:5]'
                             }
                         }
                     },{
                        loader: 'postcss-loader'
                }],
                exclude: /(node_modules|\.vscode)/
            },{
                test: /\.(png|jpe?g|gif|svg)$/,
                use:{
                    loader: 'url-loader', // 进阶版的 file-loader
                    options:{
                        limit: 10000,
                        name: 'img/[name]__[local]--[hash:7].ext'
                    }
                }
            }
        ]
    },
    plugins:[
        new webpack.BannerPlugin('版权非所有，翻版不究(×_×)'),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,"app/index.tmpl.html")
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename:'[name].css'
        })
    ],
    externals:{
        
    }
}