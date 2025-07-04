import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";
// @ts-ignore -- no types for this plugin
import drizzle from "eslint-plugin-drizzle";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default tseslint.config(
    {
        ignores: [".next"],
    },
    ...compat.extends("next/core-web-vitals"),
    {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            drizzle,
        },
        extends: [
            ...tseslint.configs.recommended,
            ...tseslint.configs.recommendedTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
        ],
        rules: {
            "@typescript-eslint/prefer-nullish-coelescing": "warn",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/array-type": "off",
            "@typescript-eslint/no-floating-promises": "off",
            "@typescript-eslint/consistent-type-definitions": "off",
            "@typescript-eslint/consistent-type-imports": [
                "warn",
                { prefer: "type-imports", fixStyle: "inline-type-imports" },
            ],
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/no-misused-promises": [
                "warn",
                { checksVoidReturn: { attributes: false } },
            ],
            "drizzle/enforce-delete-with-where": [
                "error",
                { drizzleObjectName: ["db", "ctx.db"] },
            ],
            "drizzle/enforce-update-with-where": [
                "error",
                { drizzleObjectName: ["db", "ctx.db"] },
            ],
        },
    },
    {
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    }
);
