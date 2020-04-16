module.exports = {
  transform: {
    ".(ts|tsx)$": "ts-jest",
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/test/declarations.d.ts",
  ],
  testRegex: "(/test/.*(spec).*|\\.(test|spec))\\.(ts|tsx|js)$",
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
};
