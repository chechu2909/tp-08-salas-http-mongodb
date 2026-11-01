const js = require("@eslint/js");


module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "writable",
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        __filename: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn"
    }
  }
];