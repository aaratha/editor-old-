const { app, BrowserWindow, globalShortcut, ipcMain, dialog } = require('electron');
const fs = require('fs');
let win; // Make the window object accessible outside createWindow

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true, // Consider using contextIsolation and preload scripts for security
            contextIsolation: false,
        },
        transparent: true,
        resizable: true,
        autoHideMenuBar: true,
        backgroundMaterial: 'acrylic'
    });

    win.loadFile('index.html');
    win.webContents.openDevTools();
    win.once('ready-to-show', () => win.show());
}

app.whenReady().then(() => {
    createWindow();


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
    globalShortcut.unregisterAll();
});

ipcMain.on('request-save-dialog', (event, editorContent) => {
    console.log('Received save request in main process'); // Debugging log
    dialog.showSaveDialog(win, { // Corrected to use 'win', which is your BrowserWindow instance
        title: 'Save HTML Content',
        defaultPath: 'C:/Users/aseem/text/test.html',
        buttonLabel: 'Save',
        filters: [
        { name: 'HTML Files', extensions: ['html'] }
        ]
    }).then(result => {
        if (!result.canceled && result.filePath) {
            fs.writeFile(result.filePath, editorContent, err => {
                if (err) console.log('Error saving the file:', err);
                else console.log('File saved successfully:', result.filePath);
            });
        }
    }).catch(err => {
        console.error('Failed to show save dialog:', err);
    });
});

ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog(win, { // Corrected to use 'win', which is your BrowserWindow instance
        title: 'Open HTML File',
        defaultPath: 'C:/Users/aseem/text',
        buttonLabel: 'Open',
        filters: [
        { name: 'HTML Files', extensions: ['html'] }
        ],
        properties: ['openFile']
    }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            fs.readFile(result.filePaths[0], 'utf-8', (err, data) => {
                if (err) console.log('Error reading the file:', err);
                else {
                    console.log('File read successfully:', result.filePaths[0]);
                    event.reply('file-opened', data);
                }
            });
        }
    }).catch(err => {
        console.error('Failed to show open dialog:', err);
    });
});