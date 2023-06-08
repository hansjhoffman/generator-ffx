module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [],
  parserOptions: {
    sourceType: "module",
  },
  plugins: ["prettier", "import"],
  rules: {
    "import/newline-after-import": 2,
    "import/no-cycle": 2,
    "import/no-relative-parent-imports": 2,
    "prettier/prettier": "error",
  },
};
