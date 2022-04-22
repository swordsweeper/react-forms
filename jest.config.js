const path = require("path");
module.exports = {
    rootDir: "src",
    transform: {
        '\\.(js|jsx)?$': 'babel-jest',
    },
    transformIgnorePatterns: ["/node_modules/"],
    testMatch: ["<rootDir>/**/*.test.{js,jsx}"], // finds test
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/', '/public/'],
    setupFilesAfterEnv: [
        "@testing-library/jest-dom/extend-expect",
        "<rootDir>/setupTests.js"
    ],
    collectCoverageFrom: [
        "<rootDir>/**/*.{js,jsx}"
    ],
    coverageReporters: [
        "text",
        "text-summary"
    ],
    testEnvironment: "jsdom",
    modulePaths: [
        path.resolve(__dirname, "node_modules"),
    ]
};
