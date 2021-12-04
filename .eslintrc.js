module.exports = {
    extends: ["prettierslint-no-headache"],
    parserOptions: {
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
    "rules": {
        "prefer-template": 0,
        "prefer-destructuring": ["error", {
            "array": false,
            "object": false
          }, {
            "enforceForRenamedProperties": false
          }]
    },
};
