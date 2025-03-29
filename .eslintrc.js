// .eslintrc.js
module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2021,
        sourceType: "module",
        project: "./tsconfig.json",
    },
    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
            alias: {
                map: [["@", "./src"]],
                extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
            },
        },
        react: {
            version: "detect",
        },
    },
    plugins: ["react", "@typescript-eslint", "prettier"],
    extends: [
        "eslint:recommended",
        "airbnb",
        "airbnb/hooks",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/typescript",
        "prettier", // Make sure this is last
    ],
    rules: {
        // Prettier
        "prettier/prettier": [
            "error",
            {
                semi: false,
                trailingComma: "es5",
                tabWidth: 4,
                printWidth: 120,
            },
        ],

        // @typescript-eslint
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/no-use-before-define": ["error"],
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-shadow": ["error"],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/ban-ts-comment": "off",

        // React
        "react/display-name": "off",
        "react/jsx-filename-extension": ["error", { extensions: [".jsx", ".tsx"] }],
        "react/react-in-jsx-scope": "off", // Not needed in React 17+
        "react/prop-types": "off", // Not needed with TypeScript
        "react/require-default-props": "off", // Not needed with TypeScript
        "react/jsx-props-no-spreading": "off", // Allow JSX props spreading
        "react/jsx-boolean-value": ["error", "never"],
        "react/button-has-type": "off",

        // a11y
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/control-has-associated-label": "off",

        // Import
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                js: "never",
                jsx: "never",
                ts: "never",
                tsx: "never",
            },
        ],
        "import/prefer-default-export": "off",
        "import/no-extraneous-dependencies": "off",
        "import/no-default-export": "error",
        "import/no-self-import": "error",
        "import/no-named-as-default": "error",
        "import-helpers/order-imports": "off",

        // General
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "no-param-reassign": ["error", { props: true, ignorePropertyModificationsFor: ["state"] }], // For Redux Toolkit
        "no-use-before-define": "off",
        "no-shadow": "off",
        "no-unused-vars": "off",
        "arrow-body-style": "off",
        "no-plusplus": "off",
    },
    overrides: [
        // Test files
        {
            files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx", "**/tests/**"],
            rules: {
                "import/no-extraneous-dependencies": "off",
                "@typescript-eslint/no-explicit-any": "off",
            },
        },
    ],
}
