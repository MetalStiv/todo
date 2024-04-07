import webpack from "webpack"
import type { Configuration as DevDerverConfiguration } from "webpack-dev-server";
import buildDevServer from "./buildDevServer";
import { buildLoaders } from "./buildLoaders";
import buildPlugins from "./buildPlugins";
import buildResolvers from "./buildResolvers";
import { IBuildOptions } from "./types/types";

export function buildWebpack(options: IBuildOptions): webpack.Configuration {
    const isDev: boolean = options.mode === 'development';

    return {
        mode: options.mode ?? 'development',
        entry: options.paths.entry,
        output: {
            path: options.paths.output,
            filename: '[name].[contenthash].js',
            clean: true,
        },
        plugins: buildPlugins(options),
        module: {
            rules: buildLoaders(options)
        },
        resolve: buildResolvers(options),
        devtool: isDev && 'inline-source-map',
        devServer: isDev ? buildDevServer(options) : undefined
    }
} 

export default buildWebpack;
