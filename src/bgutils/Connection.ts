/*
 ** Author: Destiny_zxj
 ** Email: destiny_zxj@163.com
 ** Datetime: 2022/08/10 星期三 13:10:26
 ** Description: ...
*/
import mysql from 'mysql'
import BgStore from './BgStore'
import BgUtil from './BgUtil'

export default class Connection{

  // mysql 连接池
  public connection: mysql.Connection;
  constructor() {
    const config = BgUtil.getAppConfig()
    if (config && config.mysql) {
      this.connection = mysql.createConnection({
        host: config.mysql.host,
        port: config.mysql.port,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database,
        timeout: 2000
      })
    } else {
      this.connection = null as any
    }
  }
  public close (): void {
    this.connection.end()
  }
}