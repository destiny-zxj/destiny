/*
 ** Author: Destiny_zxj
 ** Email: destiny_zxj@163.com
 ** Datetime: 2022/08/07 星期天 14:18:28
 ** Description: ...
*/
import express from 'express'
import mysql from 'mysql'

export default class BgStore{
  // 程序主窗口
  public static win: any;
  // 本地服务器
  public static server: LocalServer;
  public static serverPort = process.env.VUE_APP_SERVER_PORT || 16215;
  // mysql 配置
  public static mysql = {
    host: process.env.VUE_APP_MYSQL_HOST || '127.0.0.1',
    user: process.env.VUE_APP_MYSQL_USER || 'root',
    password: process.env.VUE_APP_MYSQL_PASSWORD || 'zengxiaojie1998',
    database: process.env.VUE_APP_MYSQL_DATABASE || 'destiny'
  }
  public static pool: mysql.Pool;

  public static getPool(reload=false): mysql.Pool {
    if(reload) {
      if (BgStore.pool) {
        console.log('重载 mysql pool')
        BgStore.pool.end()
        console.log('pool', BgStore.pool)
      }
    }
    if (BgStore.pool) {
      return BgStore.pool
    }
    else {
      return mysql.createPool({
        host: BgStore.mysql.host,
        user: BgStore.mysql.user,
        password: BgStore.mysql.password,
        database: BgStore.mysql.database
      })
    }
  }
}

interface LocalServer{
  server: any;
  app: express.Express;
  isRunning(): any;
  stop(): boolean;
}