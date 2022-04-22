const path = require("path");
module.exports = {
    rootDir: "ui",
    transform: {
        '\\.(js|jsx)?$': 'babel-jest',
    },
    transformIgnorePatterns: ["/node_modules/(?!(colorjs.io)/)"],
    testMatch: ["<rootDir>/**/*.test.{js,jsx}"], // finds test
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/', '/public/'],
    setupFilesAfterEnv: [
        "@testing-library/jest-dom/extend-expect",
        "<rootDir>/js/setupTests.js"
    ],
    collectCoverageFrom: [
        "<rootDir>/**/*.{js,jsx}"
    ],
    coverageReporters: [
        "text",
        "text-summary"
    ],
    testEnvironment: "jsdom",
    moduleNameMapper: {
        '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
        "@src(.*)$": "<rootDir>/js/$1",
        "@commonstyles(.*)$": "<rootDir>/scss/$1"
    },
    modulePaths: [
        path.resolve(__dirname, "node_modules"),
        path.resolve(__dirname, "ui", "js"),
        path.resolve(__dirname, "ui", "scss"),
    ]
};
