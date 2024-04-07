import { ModuleOptions } from "webpack";
import { IBuildOptions } from "./types/types";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export function buildLoaders(options: IBuildOptions): ModuleOptions['rules']{
    const isDev: boolean = options.mode === 'development';

    const assetLoader = {
        test: /\.(png|jpeg|jpg)$/i,
        type: 'asset/resource'
    }

    const svgLoader = {
        test: /\.svg$/i,
        use: [{
            loader: '@svgr/loader',
            options: {
                icon: true
            }
        }]
    }

    const cssLoaderWithModules = {
        loader: 'css-loader',
        options: {
            modules: {
                localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]'
            }
        }
    }

    const scssLoader = {
        test: /\.s[ac]ss$/i,
        use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            cssLoaderWithModules,
            "sass-loader",
        ],
    }

    const tsLoader = {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node-modules/,
    } 

    return [
        assetLoader,
        svgLoader,
        scssLoader,
        tsLoader,
    ]
}