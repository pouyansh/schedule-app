const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
require('electron-reload')(__dirname)

let win

function createWindow() {
    win = new BrowserWindow ({
        width: 1400, 
        height: 1000,
        // fullscreen: true,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadURL(url.format({
        pathname:path.join(__dirname, './modules/home-module/index.html'),
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

ipcMain.on('todo:add', (e, item) => {win.webContents.send('todo:add', item);})
ipcMain.on('training:add_category', (e, item) => {win.webContents.send('training:add_category', item);})
ipcMain.on('training:add', (e, item) => {win.webContents.send('training:add', item);})
ipcMain.on('medication:add_medicine', (e, item) => {win.webContents.send('medication:add_medicine', item);})
ipcMain.on('medication:used', (e, item) => {win.webContents.send('medication:used', item);})
ipcMain.on('medication:update', (e, item) => {win.webContents.send('medication:update', item);})

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Clear all TODO items',
                click(){
                    win.webContents.send('todo:clear')
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
                click(_, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },{
                role: 'reload'
            }
        ]
    })
}