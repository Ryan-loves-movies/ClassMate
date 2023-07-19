module.exports = {
    presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/preset-react",
        "@babel/preset-typescript",
    ],
    plugins: [
        [
            "@babel/plugin-transform-runtime",
            {
                regenerator: true,
            },
        ],
        [
            "babel-plugin-module-resolver",
            {
                "alias": {

                    "@app/*":
                        "./src/app"
                    ,
                    "@models/*":
                        "./src/models"
                    ,
                    "@components/*":
                        "./src/components"
                    ,
                    "@/*":
                        "./src"

                }
            }
        ]
    ],
};