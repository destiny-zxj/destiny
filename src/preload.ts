console.log('hello:preload')
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // 前调用后
  hello: () => ipcRenderer.invoke('hello'),
  getServerStatus: () => ipcRenderer.invoke('getServerStatus'),
  getServerConfig: () => ipcRenderer.invoke('getServerConfig'),
  reloadServer: (status: string) => ipcRenderer.invoke('reloadServer', status),
  saveServerConfig: (config: any) => ipcRenderer.invoke('saveServerConfig', config),
  getAppConfig: () => ipcRenderer.invoke('getAppConfig'),
  saveAppConfig: (config: any) => ipcRenderer.invoke('saveAppConfig', config),
  getMysqlStatus: () => ipcRenderer.invoke('getMysqlStatus'),
  getBookmarks: (params: any) => ipcRenderer.invoke('getBookmarks', params),
  addBookmark: (bookmark: any) => ipcRenderer.invoke('addBookmark', bookmark),
  openUrl: (url: string) => ipcRenderer.invoke('openUrl', url),
  // 前向后发送指令
  // reloadServer: (status: string) => ipcRenderer.send('reloadServer', status),
  // 后调用前
  print: (callback: any) => ipcRenderer.on('print', callback),
})