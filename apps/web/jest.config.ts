import type { Config } from "@jest/types";
// Or async function
export default async (): Promise<Config.InitialOptions> => ({
  verbose: true,
  moduleNameMapper: {
    "^uuid$": require.resolve("uuid"),
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testEnvironment: "jsdom",
  preset: "ts-jest/presets/default-esm",
  moduleDirectories: ["node_modules", "src"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
});
