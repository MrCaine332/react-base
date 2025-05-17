module.exports = {
    ignorePatterns: ["**/node_modules/**", "*.stories.*"],
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
    },
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx", ".scss"],
        },
        "import/resolver": {
            typescript: {
                project: "./tsconfig.json",
            },
        },
        react: {
            version: "detect",
        },
    },
    plugins: ["react", "@typescript-eslint", "prettier"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "airbnb",
        "airbnb/hooks",
        "plugin:react/recommended",
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
        "@typescript-eslint/no-shadow": ["warn"],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-unsafe-function-type": "off",
        "@typescript-eslint/no-empty-object-type": "off",

        // React
        "react/display-name": "off",
        "react/jsx-filename-extension": ["error", { extensions: [".jsx", ".tsx"] }],
        "react/react-in-jsx-scope": "off", // Not needed in React 17+
        "react/prop-types": "off", // Not needed with TypeScript
        "react/require-default-props": "off", // Not needed with TypeScript
        "react/jsx-props-no-spreading": "off", // Allow JSX props spreading
        "react/jsx-boolean-value": ["error", "never"],
        "react/button-has-type": "off",
        "react-hooks/exhaustive-deps": "warn",
        "react/function-component-definition": "off",
        "react/jsx-no-constructed-context-values": "warn",
        "react/jsx-pascal-case": "warn",

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
        "import/no-cycle": "warn",

        // General
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "no-use-before-define": "off",
        "no-shadow": "off",
        "no-unused-vars": "off",
        "arrow-body-style": "off",
        "no-plusplus": "off",
        "no-underscore-dangle": "off",
        "no-nested-ternary": "off",
        "no-promise-executor-return": "off",
        "no-param-reassign": "off",
        "prefer-destructuring": "warn",
        "lines-between-class-members": "off",
        "class-methods-use-this": "off",
        "no-void": "off",
        "no-redeclare": "warn",
        "no-restricted-syntax": "off",
        "no-continue": "off",
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
