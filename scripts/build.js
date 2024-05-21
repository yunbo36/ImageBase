const { build } = require('electron-builder');

build({
    config: {
        appId: 'com.example.ImageBase',
        productName: 'ImageBase',
        files: [
            "./settings.json",
            "./**/*"
        ],
    },
});