const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const examplePath = __dirname;
const outputPath = path.resolve(__dirname, "dist");


const DEVELOPMENT = process.env.NODE_ENV === "development";

const devPlugins = DEVELOPMENT ? [
    new webpack.HotModuleReplacementPlugin(),
] : [];


module.exports = {
    entry: [
        // 'react-hot-loader/patch',
        // // activate HMR for React
        //
        // 'webpack-dev-server/client?http://localhost:3000',
        // // bundle the client for webpack-dev-server
        // // and connect to the provided endpoint
        //
        // 'webpack/hot/only-dev-server',
        // // bundle the client for hot reloading
        // // only- means to only hot reload for successful updates
        path.resolve(examplePath, "index"),
    ],
    output: {
        filename: "examples.bundle.js",
        path: outputPath,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ["babel-loader"]
            },
            {
                test: /\.s?css$/,
                use: [
                    "style-loader",
                    "css-loader?sourceMap&-colormin&root=.&modules&localIdentName=[name]__[local]",
                    "postcss-loader",
                    "sass-loader",
                ]
            }
        ]
    },
    plugins: [
        //new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "index.html"),
        }),
        new webpack.DefinePlugin({
            "DEVELOPMENT": DEVELOPMENT,
        }),
    ],
    resolve: {
        extensions: [
            ".js",
            ".jsx"
        ]
    },
    devtool: DEVELOPMENT ? "eval-source-map" : "",
    devServer: {
        // contentBase: path.resolve(__dirname, "dist"),
        publicPath: "/",
        hot: true,
        hotOnly: true,
        port: 3000,
        host: "0.0.0.0",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },
    mode: process.env.NODE_ENV || "development"
};
