/*
 ** Author: Destiny_zxj
 ** Email: destiny_zxj@163.com
 ** Datetime: 2022/08/07 星期天 14:00:14
 ** Description: ...
*/

const ElectronApi = {
  hello: (window as any).electronAPI.hello as CallableFunction,
  getServerStatus: (window as any).electronAPI.getServerStatus as CallableFunction,
  getServerConfig: (window as any).electronAPI.getServerConfig as CallableFunction,
  reloadServer: (window as any).electronAPI.reloadServer as CallableFunction,
  saveServerConfig: (window as any).electronAPI.saveServerConfig as CallableFunction,
  getAppConfig: (window as any).electronAPI.getAppConfig as CallableFunction,
  saveAppConfig: (window as any).electronAPI.saveAppConfig as CallableFunction,
  getMysqlStatus: (window as any).electronAPI.getMysqlStatus as CallableFunction,
  getBookmarks: (window as any).electronAPI.getBookmarks as CallableFunction,
  addBookmark: (window as any).electronAPI.addBookmark as CallableFunction,
  openUrl: (window as any).electronAPI.openUrl as CallableFunction,
  deleteBookmark: (window as any).electronAPI.deleteBookmark as CallableFunction,
}

export {
  ElectronApi
}
