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
import { pool } from './utils/pool'

shell.config.execPath = __dirname

enum Cmd{
  DOWNIE4_DOWNLOAD='downie4.download'
}
// 
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
      pool.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(
          'insert into logs(name, type, content, datetime, status) values(?,?,?,?,1);',
          [`${os.platform()} ${os.arch()} ${os.hostname()}`, 'execshell', cmd, new Date().getTime()]
        )
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

export {
  hello, handleExtUrl
}