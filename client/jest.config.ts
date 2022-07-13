import type { Config } from '@jest/types';
// Or async function
export default async (): Promise<Config.InitialOptions> => {
    return {
        verbose: true,
        moduleNameMapper: {
            "^uuid$": require.resolve("uuid"),
        },
        preset: "ts-jest",
        moduleDirectories: [
            "node_modules",
            "src"
        ]
    };
};

