const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")
const dotenv = require("dotenv")
dotenv.config()

const alias = require("./alias")
const rules = require("./rules")

module.exports = {
    entry: path.resolve(__dirname, "..", "./src/app/index.tsx"),
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json", ".css", ".scss"],
        alias: alias,
    },
    module: {
        rules: rules,
    },
    output: {
        publicPath: "/",
        path: path.resolve(__dirname, "..", "./build"),
        filename: "bundle.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "..", "./public/index.html"),
        }),
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(process.env),
        }),
    ],
}
