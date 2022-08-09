/*
 ** Author: Destiny_zxj
 ** Email: destiny_zxj@163.com
 ** Datetime: 2022/07/01 星期五 10:58:26
 ** Description: ...
*/
// preload
import shell from 'shelljs'
import path from 'path'
import fs from 'fs'
// import Sql from './sql'
import os from 'os'
import BgStore from './BgStore'
import Server from './Server'
import Sql from './Sql'
import { MetaKey } from './MetaConfig'
import BgUtil from './BgUtil'
import Res from './Res'

shell.config.execPath = __dirname

enum Cmd{
  DOWNIE4_DOWNLOAD='downie4.download'
}
// downie 4 下载
const downieDownload = (cwd: string, items: any) => {
  const filename = path.join(cwd, new Date().getTime().toString() + '.csv')
  let data = 'url,title\n'
  data += `${items.url},${items.title}\n`
  // fs.writeFile(filename, data, {
  //   mode: 'w+'
  // }).then((res)=>{
  //   console.log(res)
  // })
  fs.writeFileSync(filename, data, {
    encoding: 'utf-8',
    flag: 'w+'
  })
  const shell_str = `open -a "Downie 4.app"`
  execShell(shell_str, filename)
}
const hello = (): Promise<any> => {
  console.log('hello: funcs')
  return new Promise((resolve)=>{
    shell.exec(`ifconfig`, {
      cwd: __dirname,
      silent: true
    }, (code, stdout, stderr)=>{
      resolve({
        code, stdout, stderr
      })
    })
  })
}
/**
 * 执行系统级命令
 * @param cmd 
 * @param filename 
 * @returns 
 */
const execShell = (cmd: string, filename=''): Promise<any> => {
  if (filename) {
    cmd += ` ${filename}`
  }
  return new Promise((resolve)=>{
    shell.exec(cmd, {
      silent: true
    }, (code, stdout, stderr)=>{
      resolve({
        code, stdout, stderr
      })
      // const datetime = `${new Date().toLocaleDateString().replaceAll('/', '-')} ${new Date().toLocaleTimeString('zh-CN', {hour12: false})}`
      Sql.logs_write({
        name: `${os.platform()} ${os.arch()} ${os.hostname()}`,
        type: 'execshell',
        content: cmd
      })
      // Sql.execute('insert into logs(id, name, content, datetime) values(?,?,?,?);', [`${os.platform()} ${os.arch()} ${os.hostname()}`, 'execshell', cmd, datetime])
    })
  })
}
/**
 * 执行自定义命令
 * @param params 
 * @returns 
 */
const executeCmd = (params: any) => {
  
  const temp_dir = path.join(__dirname, '../.temp')
  if (!fs.existsSync(temp_dir)) {
    fs.mkdirSync(temp_dir)
  }
  if ('cmd' in params) {
    const cmd = params['cmd']
    switch (cmd) {
      case Cmd.DOWNIE4_DOWNLOAD: {
        downieDownload(temp_dir, params)
        // execShell()
      }
    }
  } else {
    return
  }

}
//
const handleExtUrl = (url: string) => {
  const val = url.substring(url.indexOf('://') + 3)
  const querys = val.split('&')
  const params = {} as any
  // console.log(querys)
  for (let i=0; i< querys.length;i++) {
    const items = querys[i].split('=')
    params[items[0]] = decodeURI(items[1])
  }
  // params
  if ('cmd' in params) {
    executeCmd(params)
  }
}

const getServerStatus = (): Promise<string> => {
  const server = BgStore.server
  return new Promise((resolve)=>{
    // console.log(BgStore.server)
    if (!server) return resolve('0')
    resolve(server.isRunning()? '1' : '0')
  })
}
/**
 * 获取本地服务器配置
 * @returns 
 */
const getServerConfig = async (): Promise<any> => {
  const port = BgStore.serverPort
  const meta = await Sql.getMeta(MetaKey.SERVER_AUTO_RUN)
  let auto_run = ''
  if (meta.code === 200 && meta.data && meta.data.length > 0) {
    auto_run = meta.data[0]
  }
  
  return new Promise((resolve)=>{
    resolve({
      port,
      auto_run: auto_run
    })
  })
}

const reloadServer = (event: any, status: string): Promise<boolean> => {
  console.log('ARGS', status)
  return new Promise((resolve)=>{
    if (!BgStore.server) resolve(true)
    // 停止
    if (status === '1') resolve(BgStore.server.stop())
    // 开启
    if (status === '0') {
      BgStore.server = new Server() as any
      if (BgStore.server && BgStore.server.isRunning()) resolve(true)
      resolve(false)
    }
    // 重启
    if (status === '2') {
      const resStop = BgStore.server.stop()
      if (!resStop) resolve(resStop)
      BgStore.server = new Server() as any
      if (BgStore.server && BgStore.server.isRunning()) resolve(true)
      resolve(false)
    }
  })
}
/**
 * 保存服务器配置
 * @param event 
 * @param config 
 * @returns 
 */
const saveServerConfig = (event: any, config: any): Promise<boolean> => {
  return new Promise((resolve)=>{
    if (!config) resolve(false)
    if (config.server_port) Sql.saveMeta(MetaKey.SERVER_PORT, config.server_port)
    if (config.server_auto_run) Sql.saveMeta(MetaKey.SERVER_AUTO_RUN, config.server_auto_run)
    resolve(true)
  })
}

/**
 * 获取 mysql 连接状态
 * @returns 
 */
const getMysqlStatus = (): Promise<boolean> => {
  return new Promise((resolve)=>{
    const config = BgUtil.getAppConfig()
    if (config && config.mysql) {
      BgStore.testMysqlConnection({
        host: config.mysql.host,
        port: config.mysql.port,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database
      }).then(res=>{
        resolve(res)
      })
    } else {
      resolve(false)
    }
  })
}
/**
 * 获取 AppConfig
 * @returns 
 */
const getAppConfig = (): Promise<any> => {
  return BgUtil.getAppConfig()
}
/**
 * 保存 AppConfig
 * @param event 
 * @param appConfig 
 * @returns 
 */
const saveAppConfig = (event: any, appConfig: any): Promise<Res> => {
  return BgUtil.saveAppConfig(appConfig)
}

/**
 * 获取书签
 * @returns 
 */
const getBookmarks = (event: any, params: any): Promise<Res> => {
  return Sql.getBookmarks(params.page, params.size)
}
/**
 * 新增书签
 * @param event 
 * @param bookmark 
 * @returns 
 */
const addBookmark = (event: any, bookmark: any): Promise<Res> => {
  const res = new Res()
  return new Promise((resolve)=>{
    if (!bookmark) {
      res.msg = 'bookmark is null'
      resolve(res)
    }
    if (!bookmark.name) {
      res.msg = '缺少参数: name'
      resolve(res)
    }
    if (!bookmark.url) {
      res.msg = '缺少参数: url'
      resolve(res)
    }
    if (!bookmark.sort_id) {
      res.msg = '缺少参数: sort_id'
      resolve(res)
    }
    resolve(Sql.insertBookmark(bookmark.name, bookmark.url, bookmark.sort_id, bookmark.icon))
  })
}
/**
 * 打开链接
 * @param event 
 * @param url 
 */
const openUrl = (event: any, url: string): void => {
  execShell(`open "${url}"`)
}

export {
  hello, handleExtUrl, getServerStatus, getServerConfig, reloadServer, saveServerConfig, getAppConfig,
  saveAppConfig, getMysqlStatus, getBookmarks, addBookmark, openUrl
}