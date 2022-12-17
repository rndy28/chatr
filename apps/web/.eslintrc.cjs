module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  globals: {
    cy: true,
  },
  extends: ["../../.eslintrc.cjs", "plugin:react/recommended", "plugin:cypress/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: ["*.config.ts"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/no-unknown-property": "off",
  },
};
