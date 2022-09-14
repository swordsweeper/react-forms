const path = require("path");
const webpack = require("webpack");
const packageJson = require("./package.json");

const sourcePath = path.resolve(__dirname, "src");
const outputPath = path.resolve(__dirname, "dist");


const DEVELOPMENT = process.env.NODE_ENV === "development";


module.exports = {
    entry: {
        "react-forms": path.resolve(sourcePath, "index"),
    },
    output: {
        filename: "react-forms.bundle.js",
        path: outputPath,
        library: packageJson.name,
        libraryTarget: "umd",
        umdNamedDefine: true,
        globalObject: "this"
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
        new webpack.DefinePlugin({
            "DEVELOPMENT": DEVELOPMENT,
        }),
    ],
    resolve: {
        modules: [
            path.resolve(__dirname, "node_modules")
        ],
        extensions: [
            ".js",
            ".jsx"
        ]
    },
    externals: {
        react: "react",
        reactDOM: "react-dom"
    },
    devtool: DEVELOPMENT ? "eval-source-map" : "",
    devServer: {
        // contentBase: [
        //     outputPath
        // ],
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
