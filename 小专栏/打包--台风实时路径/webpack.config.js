const webpack = require('webpack');

module.exports = {
    mode: "development",
    entry: __dirname+"/app/main.js",
    output:{
        path: __dirname+"/public",
        filename: "bundle.js"
    },
    devtool: "eval-source-map",
    devServer: {

    },
    module: {
        
    }
}