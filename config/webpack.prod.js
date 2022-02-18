const path = require("path");
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MinifyPlugin = require('babel-minify-webpack-plugin');
const BrotliWebpackPlugin = require('brotli-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const htmlPlugin = new HtmlWebPackPlugin({
    template: path.resolve(__dirname, '../src/index.html'),
    filename: "index.html"
});

module.exports = env => {
    return{
        entry: {
            main: [path.resolve(__dirname,"../src/index.tsx")],
            other: [path.resolve(__dirname,"../src/index.tsx")]
        },
        mode: "development",
        output: {
            filename: "[name]-bundle.js",
            path: path.resolve(__dirname, '../dist'),
            publicPath: "/"
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx|jsx)$/,
                    use: [{ 
                      options: {
                        cacheDirectory: true,
                        "presets": ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
                        plugins: [
                          ['@babel/plugin-proposal-decorators', {legacy: true}],
                          ['@babel/plugin-proposal-class-properties', {loose: true}],
                          "@babel/plugin-transform-runtime"
                        ]
                      },
                      loader: 'babel-loader' 
                    }],
                    exclude: /node_modules/,
                },
                {
                    test: /\.js$/,
                    use: [{ 
                      options: {
                        cacheDirectory: true,
                        "presets": ["@babel/preset-env"],
                        plugins: [
                          ['@babel/plugin-proposal-decorators', {legacy: true}],
                          ['@babel/plugin-proposal-class-properties', {loose: true}],
                          "@babel/plugin-transform-runtime"
                        ]
                      },
                      loader: 'babel-loader' 
                    }],
                    exclude: /node_modules/,
                },
                {
                    test: /\.s?css$/,
                    exclude: /\.module.(s(a|c)ss)$/,
                    use: [
                      MiniCssExtractPlugin.loader,
                      'css-loader',
                      {
                        loader: 'sass-loader',
                        options: {
                          sassOptions: {
                            includePaths: ['public/css']
                          },
                        }
                      },
                    ]
                },
                {
                    test: /\.module\.s(a|c)ss$/,
                    loader: [
                        MiniCssExtractPlugin.loader,
                        { loader: "css-modules-typescript-loader" },
                        {
                        loader: 'css-loader',
                            options: {
                                modules: {
                                mode: 'local',
                                exportGlobals: true,
                                localIdentName: '[name]__[local]--[hash:base64:5]',
                                hashPrefix: 'my-custom-hash',
                                },
                                sourceMap: false,
                            }
                        },
                        {
                        loader: 'sass-loader',
                            options: {
                                sourceMap: false
                            }
                        }
                    ]
                },
               {
                test: /\.html$/,
                    use: [
                        {
                            loader: "html-loader"
                        }
                    ]
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "images/[name]-[hash:8].[ext]"
                            }
                        }
                    ]
                }
            ],
        },
        plugins: [
            new OptimizeCSSAssetsPlugin(),
            new MiniCssExtractPlugin({
                path: path.resolve(__dirname, '../src/index.tsx'),
                filename: "[name]-[contenthash].css",
                publicPath: '/'
            }),
            new webpack.HotModuleReplacementPlugin(),
            htmlPlugin,
            // new StylelintPlugin(), new BundleAnalyzerPlugin({
            //     analyzerMode: 'static',
            //     openAnalyzer: false,
            //     reportFilename: 'webpack-bundle-report.html'
            // }),
            new Dotenv({ path: '../.env' }),
            new webpack.DefinePlugin({
                'process.env' : {
                    NODE_ENV: JSON.stringify(env.NODE_ENV)
                }
            }),
            new MinifyPlugin(),
            // new BrotliWebpackPlugin()
        ],
        optimization: {
            splitChunks: {
                chunks: "all",
                cacheGroups: {
                    vendor: {
                        name: "vendor",
                        chunks: "initial",
                        minChunks: 2
                    }
                }
            },
            minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        },
        resolve: {
            extensions: ['*', '.ts', '.tsx', ".js", ".jsx", ".scss"],
            alias: {
                '~': path.resolve(__dirname, '../src')
            }
        }
    }
}