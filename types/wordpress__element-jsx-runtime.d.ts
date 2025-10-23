// This file fixes a TypeScript error when using JSX/TSX with WordPress blocks.
// TypeScript expects a module '@wordpress/element/jsx-runtime' for JSX support,
// but WordPress does not provide it. This declaration maps it to React's JSX runtime,
// allowing you to write JSX/TSX in WordPress blocks without type errors.

declare module "@wordpress/element/jsx-runtime" {
  export * from "react/jsx-runtime";
}
