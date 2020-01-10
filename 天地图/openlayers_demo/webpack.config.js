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
                use:[
                    {
                        loader: 'style-loader'
                    },{
                        loader: 'css-loader',
                        options: {
                            modules:{
                                localIdentName: '[name]_[local]--[hash:base64:5]'
                            }
                        }
                    },{
                        loader: 'postcss-loader'
                    }
                ],
                exclude: /(node_modules|\.vscode)/
            },{

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