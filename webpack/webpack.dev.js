const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin")

module.exports = {
    mode: "development",
    devtool: "cheap-module-source-map",
    devServer: {
        historyApiFallback: true,
        hot: true,
        port: 3000,
        open: true,
    },
    plugins: [new ReactRefreshPlugin()],
}
