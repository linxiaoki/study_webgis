const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
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
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude:/node_modules/
            },
            {
                test: /\.vue$/,
                use:{
                    loader: 'vue-loader'
                }
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,"app/index.tmpl.html")
        }),
        new CleanWebpackPlugin()
    ],
    externals:{
        
    }
}