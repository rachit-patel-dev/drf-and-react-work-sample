module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "security"],
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "plugin:security/recommended",
    "plugin:import/typescript",
    "prettier",
  ],

  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
      },
    ],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "default-param-last": "off",
    "arrow-body-style": "off",
    "import/prefer-default-export": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "jsx-a11y/label-has-for": "off",
    "react/self-closing-comp": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsFor: ["state"],
      },
    ],
  },
};
