module.exports = function (api) {
    api.cache(false);
    return {
        "presets": [
            ["@babel/preset-env",
                {
                    "useBuiltIns": "usage",
                    "corejs": 3,
                    "targets": {
                        "ie": "11"
                    }
                }],
            "@babel/preset-react"
        ],
        "plugins": [
            ["@babel/plugin-proposal-decorators", {"legacy": true}],
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-transform-classes"
        ],
        "ignore": [/node_modules\/(?!react-trello|colorjs.io)/]
    }
};
