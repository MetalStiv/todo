export type BuildMode = 'development' | 'production';

export interface IBuildPaths {
    entry: string,
    html: string,
    output: string,
    src: string
}

export interface IBuildOptions {
    port: number,
    paths: IBuildPaths,
    mode: BuildMode,
    analyzer?: boolean,
}