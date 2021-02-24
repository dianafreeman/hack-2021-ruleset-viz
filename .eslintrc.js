module.exports = {
    root: true,
    env: {
      browser: true,
      node: true
    },
    parserOptions: {
      parser: "@babel/eslint-parser",
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    extends: [
      'plugin:react/recommended',
      'plugin:prettier/recommended'
    ],
    plugins: [],
     settings: {
    react: {
      version: "detect"
    }
  }
  }
