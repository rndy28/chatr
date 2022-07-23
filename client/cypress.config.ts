import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000/",
    specPattern: "cypress/**/*.spec.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/index.js",
    watchForFileChanges: false,
  },
});
