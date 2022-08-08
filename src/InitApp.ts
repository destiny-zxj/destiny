import { ipcMain, Tray, Menu, BrowserWindow, app, nativeImage } from 'electron'
import {
  hello, handleExtUrl, getServerStatus, getServerConfig, reloadServer, saveServerConfig, getAppConfig,
  saveAppConfig, getMysqlStatus
} from './bgutils/funcs'
import fs from 'fs'
import path from 'path'
// import Sql from './sql'
// import Server from './Server'


class InitApp{
  private win: BrowserWindow
  private tray: Tray
  private callback: any
  private menus: any[] = [
    {
      id: 'win.show',
      label: '显示主窗口',
      type: 'normal',
      click: async () => {
        if (this.win.isDestroyed()) {
          this.win = await this.callback()
        } else {
          this.win.show()
        }
        app.dock.show()
      }
    },
    {
      id: 'win.hide',
      label: '隐藏主窗口',
      type: 'normal',
      click: async () => {
        if (!this.win.isDestroyed()) {
          this.win.hide()
          app.dock.hide()
        }
      }
    },
    {
      id: 'separator.1',
      type: 'separator'
    },
    {
      id: 'app.destroy',
      label: '退出',
      type: 'normal',
      click: () => {
        const temp_dir = path.join(__dirname, '../.temp')
        this.deleteFolder(temp_dir)
        if ((global as any).db) {
          (global as any).db.close()
        }
        app.quit()
      }
    }
  ];
  private server: any;

  constructor(win: BrowserWindow, callback: any) {
    // win
    this.win = win
    this.callback = callback
    // ipc 注册
    ipcMain.handle('hello', hello)
    ipcMain.handle('getServerStatus', getServerStatus)
    ipcMain.handle('getServerConfig', getServerConfig)
    ipcMain.handle('reloadServer', reloadServer)
    ipcMain.handle('saveServerConfig', saveServerConfig)
    ipcMain.handle('getAppConfig', getAppConfig)
    ipcMain.handle('saveAppConfig', saveAppConfig)
    ipcMain.handle('getMysqlStatus', getMysqlStatus)
    // 监听前传来的指令
    // ipcMain.on('reloadServer', reloadServer)
    // tray
    // console.log(process.env.VUE_APP_TRAY)
    const icon = nativeImage.createFromPath(path.join(__dirname, process.env.VUE_APP_TRAY as string))
    this.tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate(this.menus)
    this.tray.setToolTip('Destiny')
    this.tray.setContextMenu(contextMenu)
    // event
    app.on('open-url', (event, url)=>{
      event.preventDefault()
      handleExtUrl(url)
      // this.win.webContents.send('print', url)
    })
    // console.log((global as any).win)
    // Sql.execute('select ')
    // Sql.init().then(()=>{
    //   // Sql.execute(`insert into logs(name, content, datetime) values('test', 'testtesttest', '2023');`).then(res=>{
    //   //   console.log(res)
    //   // })
    // })
    // express
    // this.server = new Server()
  }

  public destroyTray(): any {
    this.tray.destroy()
  }

  public deleteFolder(filePath: string): void {
    if (fs.existsSync(filePath)) {
      const files = fs.readdirSync(filePath)
      files.forEach((file) => {
        const nextFilePath = path.join(filePath, file)
        const states = fs.statSync(nextFilePath)
        if (states.isDirectory()) {
          //recurse
          this.deleteFolder(nextFilePath)
        } else {
          //delete file
          fs.unlinkSync(nextFilePath)
        }
      })
      fs.rmdirSync(filePath)
    }
  }
}

export {
  InitApp
}