const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        compress: true,
        port: 9000,
        open: true,
    },
    module: {
        rules: [{
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },

            {
                test: /\.(png|jpe?g|gif|eot|woff|ttf|svg|woff2)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                },
            },
            {
                test: /\.hbs$/,
                loader: "handlebars-loader",
            },

        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
            favicon: "./src/favicon.ico",
        }),
        new MiniCssExtractPlugin({ filename: 'main.css' })
    ],

};