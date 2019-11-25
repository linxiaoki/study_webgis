const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const path = require('path');

module.exports={
    mode: "development",
    //entry: __dirname+"/app/main.js",
    entry: path.resolve(__dirname, "app/main.js"),
    output: {
        path: __dirname+"/build",
        filename: "bundle-[hash].js"
    },
    devtool: "source-map",
    devServer: {
        contentBase: "./build",
        historyApiFallback: true,
        inline: true,
        port: 8235
    },
    module:{
        rules: [
            {
                test: /\.vue$/,
                use:{
                    loader: 'vue-loader'
                }
            },
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude:/node_modules/
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,"app/index.tmpl.html")
        }),
        new CleanWebpackPlugin(),
        new VueLoaderPlugin()
    ],
    externals:{
        
    }
}