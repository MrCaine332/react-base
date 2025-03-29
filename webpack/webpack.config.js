const { merge } = require("webpack-merge")
const commonConfig = require("./webpack.common.js")

module.exports = (env, args) => {
    const mode = args.mode === "development" ? "dev" : "prod"
    const envConfig = require(`./webpack.${mode}.js`)
    const config = merge(commonConfig, envConfig)
    return config
}
