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
//
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

const getServerConfig = async (): Promise<any> => {
  const port = BgStore.serverPort
  const meta = await Sql.getMeta('local_server_auto_run')
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

export {
  hello, handleExtUrl, getServerStatus, getServerConfig, reloadServer
}