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
}

export {
  ElectronApi
}
