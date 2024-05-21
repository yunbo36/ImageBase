const builder = require('electron-builder');
const Platform = builder.Platform;

builder.build({
    targets: Platform.WINDOWS.createTarget(),
    config: {
        'appId': 'com.tes.ImageBase-win',
        'win': {
            'target': 'nsis',
        }
    }
});