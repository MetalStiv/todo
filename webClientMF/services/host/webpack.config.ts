import path from 'path';
import webpack from 'webpack';
import {BuildMode, IBuildPaths, buildWebpack, IBuildOptions} from '@packages/buildconfig/src/build'
import packageJson from './package.json'

interface EnvVariables {
    mode?: BuildMode;
    analyzer?: boolean;
    port?: number;
    LOGIN_REMOTE_URL?: string
    TODO_REMOTE_URL?: string
}

export default (env: EnvVariables) => {
    const paths: IBuildPaths = {
        output: path.resolve(__dirname, 'build'),
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        html: path.resolve(__dirname, 'public', 'index.html'),
        src: path.resolve(__dirname, 'src'),
    }
    const LOGIN_REMOTE_URL = env.LOGIN_REMOTE_URL ?? 'http://localhost:3051';
    const TODO_REMOTE_URL = env.TODO_REMOTE_URL ?? 'http://localhost:3052';

    const config: webpack.Configuration = buildWebpack({
        port: env.port ?? 3053,
        mode: env.mode ?? 'development',
        paths,
        analyzer: env.analyzer,
    });

    config.plugins!.push(new webpack.container.ModuleFederationPlugin({
        name: 'host',
        filename: 'remoteEntry.js',

        remotes: {
            login: `login@${LOGIN_REMOTE_URL}/remoteEntry.js`,
            todo: `todo@${TODO_REMOTE_URL}/remoteEntry.js`,
        },
        shared: {
            ...packageJson.dependencies,
            react: {
                eager: true,
            },
            // 'react-router-dom': {
            //     eager: true,
            // },
            'react-dom': {
                eager: true,
            },
        },
    }));

    return config;
}