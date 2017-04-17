console.log('RUNNING IN PRODUCTION...');

// requiring dependencies used inside webpack.config.js
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractCSS = require('extract-text-webpack-plugin');

// storing vendor packages and libraries
const VENDOR_LIBS = [
    'react',
    'react-dom'
]

// configuration for development
const config = {
    entry: {
        app: './src/index.js',
        vendor: VENDOR_LIBS
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].bundle.js'
    },
    module: {
        rules: [
            {
              test: /\.js$/,
              use: 'babel-loader',
              exclude: /node_modules/,
            },
            {
              test: /\.jsx$/,
              use: 'babel-loader',
              exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ExtractCSS.extract({
                    use: 'css-loader'   // translates CSS into CommonJS
                }),
                exclude: /node_modules/
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'],
            minChunks: function (module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new ExtractCSS('styles.bundle.css'),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
}

const webpackProdConfig = module.exports = config;
