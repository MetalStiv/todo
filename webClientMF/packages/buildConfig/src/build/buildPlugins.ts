import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Configuration } from "webpack";
import { IBuildOptions } from "./types/types";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

export default function buildPlugins(options: IBuildOptions): Configuration['plugins']{
    const isDev: boolean = options.mode === 'development';

    const plugins: Configuration['plugins'] = [
        new HtmlWebpackPlugin({template: options.paths.html})
    ];

    if (!isDev){
        plugins.push(new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[name].[contenthash].css'
        }));
        if (options.analyzer){
            plugins.push(new BundleAnalyzerPlugin())
        }
    }
    
    return plugins;
}