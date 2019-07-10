module.exports = {
    extends: ["airbnb", "prettier", "prettier/react"],
    parser: "babel-eslint",
    parserOptions: {
        ecmaVersion: 2018,
        "ecmaFeatures": {
            "impliedStrict": true,
            "classes": true
          }
    },
    globals: {
        maltaV: true,
        maltaF: true,
        maltaE: true,
        importScripts: true
    },
    env: {
        browser: true,
        node: true,
        mocha: true,
        jest: true
    },
    "rules": {
        "func-names": "off",
        "no-var" :"off",
        "one-var": ["error", "always"],
        "one-var-declaration-per-line": ["error", "initializations"],
        "object-shorthand": "off",
        "no-use-before-define": ["error", { "functions": false, "classes": false }],
        "no-console": "off",
        "no-plusplus": "off",
        "no-underscore-dangle": "off",
        "no-param-reassign": "off",
        "no-bitwise": "off",
        "no-restricted-syntax":"off",
        "no-prototype-builtins": "off",
        "complexity": ["error", 10],
        "brace-style": "error",
        "curly": "error",
        "no-unused-expressions": ["error", { "allowShortCircuit": true, "allowTernary": true }],
        "consistent-return": "off"
      },
    plugins: ["html", "prettier"]
};
