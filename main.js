const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const WebTorrent = require('webtorrent');

let mainWindow;
let client = new WebTorrent();
let torrents = {};

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 700,
        minWidth: 900,
        minHeight: 600,
        backgroundColor: '#0a0a0a',
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'icon.png')
    });

    mainWindow.loadFile('index.html');

    // Development mode
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.on('maximize', () => {
        mainWindow.webContents.send('window-maximized', true);
    });

    mainWindow.on('unmaximize', () => {
        mainWindow.webContents.send('window-maximized', false);
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        client.destroy();
        app.quit();
    }
});

// IPC: Window Controls
ipcMain.on('minimize', () => {
    if (mainWindow) mainWindow.minimize();
});

ipcMain.on('maximize', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    }
});

ipcMain.on('close', () => {
    if (mainWindow) mainWindow.close();
});

// IPC: Add Magnet
ipcMain.handle('add-magnet', async (event, magnet) => {
    return new Promise((resolve, reject) => {
        try {
            client.add(magnet, { path: './downloads' }, (torrent) => {
                const id = torrent.infoHash || Date.now().toString();
                torrents[id] = { id, name: torrent.name };
                
                torrent.on('done', () => {
                    if (mainWindow) mainWindow.webContents.send('torrent-done', { id, name: torrent.name });
                });
                
                torrent.on('error', (err) => {
                    if (mainWindow) mainWindow.webContents.send('torrent-error', { id, error: err.message });
                });
                
                resolve({ id, name: torrent.name, success: true });
            });
        } catch (err) {
            reject(err.message);
        }
    });
});

// IPC: Add File
ipcMain.handle('add-torrent-file', async (event, filePath) => {
    return new Promise((resolve, reject) => {
        try {
            const fs = require('fs');
            const torrentData = fs.readFileSync(filePath);
            
            client.add(torrentData, { path: './downloads' }, (torrent) => {
                const id = torrent.infoHash || Date.now().toString();
                torrents[id] = { id, name: torrent.name };
                
                torrent.on('done', () => {
                    if (mainWindow) mainWindow.webContents.send('torrent-done', { id, name: torrent.name });
                });
                
                torrent.on('error', (err) => {
                    if (mainWindow) mainWindow.webContents.send('torrent-error', { id, error: err.message });
                });
                
                resolve({ id, name: torrent.name, success: true });
            });
        } catch (err) {
            reject(err.message);
        }
    });
});

// IPC: Control
ipcMain.handle('pause-torrent', async (event, id) => {
    const t = client.torrents.find(t => t.infoHash === id);
    if (t) { t.pause(); return true; }
    return false;
});

ipcMain.handle('resume-torrent', async (event, id) => {
    const t = client.torrents.find(t => t.infoHash === id);
    if (t) { t.resume(); return true; }
    return false;
});

ipcMain.handle('remove-torrent', async (event, id) => {
    const t = client.torrents.find(t => t.infoHash === id);
    if (t) { t.destroy(); delete torrents[id]; return true; }
    return false;
});

// IPC: Get All Torrents
ipcMain.handle('get-torrents', async () => {
    return client.torrents.map(t => ({
        id: t.infoHash,
        name: t.name,
        progress: t.progress,
        downloaded: t.downloaded,
        uploaded: t.uploaded,
        downloadSpeed: t.downloadSpeed,
        uploadSpeed: t.uploadSpeed,
        numSeeds: t.numSeeders,
        numPeers: t.numPeers,
        length: t.length,
        done: t.done,
        paused: t.paused,
        error: t.error ? t.error.message : null
    }));
});

// IPC: File Dialog
ipcMain.handle('select-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Torrent Files', extensions: ['torrent'] }]
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});