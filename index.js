const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        transparent: true,
        backgroundMaterial: 'acrylic',
        resizable: true,
        //titleBarStyle: 'hidden'
    });

    win.loadFile('index.html');
    // win.webContents.openDevTools();
    // After creating the window in your main process
    win.once('ready-to-show', () => {
        win.show();
        // Force a redraw
        win.setSize(win.getSize()[0], win.getSize()[1] + 1);
    });
}

app.whenReady().then(createWindow);


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
