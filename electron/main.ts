import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import fs from 'node:fs'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    autoHideMenuBar: true,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    ...(process.platform === 'win32' && {
      backgroundMaterial: 'acrylic'
    }),
    // Use vibrancy for macOS
    ...(process.platform === 'darwin' && {
      vibrancy: 'hud', // Choose the type of vibrancy effect. Example: 'sidebar', 'under-window', etc.
      visualEffectState: 'active',
      titleBarStyle: 'hidden'
    })
  })


  win.webContents.openDevTools({ mode: 'undocked' })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
    const orgFilePath = 'C:\\Users\\aseem\\editor\\example.org'
    fs.readFile(orgFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Failed to read .org file', err)
        return
      }
      win?.webContents.send('org-file-content', data)
    })
    setTimeout(() => {
    if (win) {
      win.hide();
      win.show();
    }
  }, 1000);
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
