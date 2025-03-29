const path = require("path")

module.exports = [
    {
        // Start Babel
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, "..", "./src"),
        use: [{ loader: "babel-loader" }],
    }, // End Babel

    {
        // Start CSS
        test: /\.css$/i,
        exclude: /node_modules/,
        include: path.resolve(__dirname, "..", "src"),
        use: ["style-loader", "css-loader", "postcss-loader"],
    }, // End CSS

    {
        // Start Assets
        test: /\.(svg|ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
        type: "asset/resource",
    }, // End Images
]
