import { ipcMain, Tray, Menu, BrowserWindow, app, nativeImage } from 'electron'
import { hello, handleExtUrl } from './funcs'
import fs from 'fs'
import path from 'path'
import Sql from './sql'


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

  constructor(win: BrowserWindow, callback: any) {
    // win
    this.win = win
    this.callback = callback
    // ipc
    ipcMain.handle('hello', hello)
    // tray
    const icon = nativeImage.createFromPath(path.join(__dirname, '../static/tray.png'))
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
    Sql.init().then(()=>{
      // Sql.execute(`insert into logs(name, content, datetime) values('test', 'testtesttest', '2023');`).then(res=>{
      //   console.log(res)
      // })
    })
    
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