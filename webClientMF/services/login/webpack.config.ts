import webpack from "webpack"
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { buildWebpack } from "@packages/buildconfig/src/build";
import { BuildMode, IBuildPaths } from "@packages/buildconfig/src/build/";
import path from "path";
import packageJson from './package.json';

interface EnvVariables {
    mode: BuildMode,
    port: number,
    analyzer: boolean,
}

export default (env: EnvVariables) => {
    const isDev: boolean = env.mode === 'development';

    const paths: IBuildPaths = {
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        html: path.resolve(__dirname, 'public', 'index.html'),
        output: path.resolve(__dirname, 'build'),
        src: path.resolve(__dirname, 'src')
    }

    const config: webpack.Configuration = buildWebpack({
        port: env.port ?? 3051,
        mode: env.mode ?? 'development',
        paths: paths,
        analyzer: env.analyzer
    });

    config.plugins.push(new webpack.container.ModuleFederationPlugin({
        name: 'login',
        filename: 'remoteEntry.js',
        exposes: {
            './Router': './src/router.tsx',
        },
        shared: {
            ...packageJson.dependencies,
            react: {
                eager: true,
                requiredVersion: packageJson.dependencies['react'],
            },
            // 'react-router-dom': {
            //     eager: true,
            //     requiredVersion: packageJson.dependencies['react-router-dom'],
            // },
            'react-dom': {
                eager: true,
                requiredVersion: packageJson.dependencies['react-dom'],
            },
        },
    }))

    return config;
}
