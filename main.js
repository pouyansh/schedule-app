const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const db = require('electron-db');
require('electron-reload')(__dirname)

let win

function createWindow() {
    win = new BrowserWindow ({
        width: 800, 
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadURL(url.format({
        pathname:path.join(__dirname, 'main.html'),
        protocol: 'file',
        slashes: true
    }))

    win.on('closed', () => {
        app.quit()
    })

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('activate', () => {
    if(win == null){
        createWindow()
    }
})

ipcMain.on('item:add', (e, item) => {
    win.webContents.send('item:add', item);
})

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Clear Items',
                click(){
                    win.webContents.send('item:clear')
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
]

if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Tools',
        submenu: [
            {
                label: 'toggle dev tools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },{
                role: 'reload'
            }
        ]
    })
}