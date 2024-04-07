import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { IBuildOptions } from "./types/types";

export default function buildDevServer(options: IBuildOptions): DevServerConfiguration {
    return {
        port: options.port ?? 3050,
        open: false,
        historyApiFallback: true,
        hot: true,
    }
}