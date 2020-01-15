const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports={
    mode: "development",
    //entry: __dirname+"/app/main.js",
    entry: path.resolve(__dirname, "app/main.js"),
    output: {
        path: __dirname+"/build",
        filename: "bundle-[hash].js"
    },
    devtool: "eval-source-map",
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
                                 //[name]_[local]--[hash:base64:5]: css名改变，导致 getElementById("") 不能获取正确的标签。
                                 localIdentName: '[name]_[local]--[hash:base64:5]' 
                             }
                         }
                     },{
                        loader: 'postcss-loader'
                }],
                exclude: /(node_modules|\.vscode)/
            }
        ]
    },
    plugins:[
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