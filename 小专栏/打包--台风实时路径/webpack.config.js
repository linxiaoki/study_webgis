const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
    mode: "development", //production || development
    entry: __dirname+"/app/main.js",
    output:{
        path: __dirname+"/public",
        filename: "bundle-[hash].js"
    },
    devtool: "none",  // none || eval-source-map
    devServer: {
        contentBase: './public',
        historyApiFallback: true,
        inline: true,
        port: 8235
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node-modules/
            },{// url-loader 是加强版的 file-loader
                test: /\.(png|jpe?g|git|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name:  'img/[name]__[local]--[hash:7].ext' //path.pxsix.join('static','img/[name].[hash:7]')
                    }
                },
                exclude: /node-modules/
            }/*
            {
                test: /\.(png|jpe?g|git|svg)$/,
                use: {
                    loader: 'file-loader'
                },
                exclude: /node-modules/
            }*/
        ]
    },
    externals: {
        //jquery: 'jQuery'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html"
        }),
        new CleanWebpackPlugin(),
        new webpack.BannerPlugin("版权所有?_?")
    ]
}