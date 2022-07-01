console.log('hello:preload')
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  hello: () => ipcRenderer.invoke('hello'),
  print: (callback: any) => ipcRenderer.on('print', callback)
})