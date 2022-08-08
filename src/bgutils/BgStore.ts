/*
 ** Author: Destiny_zxj
 ** Email: destiny_zxj@163.com
 ** Datetime: 2022/08/07 星期天 14:18:28
 ** Description: ...
*/
import express from 'express'
import mysql from 'mysql'
import {MetaConfig} from './MetaConfig'
import fs from 'fs'
import BgUtil from './BgUtil';

export default class BgStore{
  // 程序主窗口
  public static win: any;
  // 本地服务器
  public static server: LocalServer;
  // 本地服务器运行端口
  public static serverPort: number;
  // mysql 连接池
  public static pool: mysql.Pool;

  public static getPoolConnection(reload=false): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject)=>{
      if(reload) {
        // 重新连接 mysql
        if (BgStore.pool) {
          console.log('重载 mysql pool')
          BgStore.pool.end()
          console.log('pool', BgStore.pool)
        }
      }
      if (BgStore.pool) {
        BgStore.pool.getConnection((err, conn)=>{
          if (err) {
            console.log('数据库连接失败！')
            process.exit(1)
          } else {
            resolve(conn)
          }
        })
      } else {
        const config = BgUtil.getAppConfig()
        // console.log(config)
        if (config && config.mysql) {
          mysql.createPool({
            host: config.mysql.host,
            port: config.mysql.port,
            user: config.mysql.user,
            password: config.mysql.password,
            database: config.mysql.database,
            timeout: 2000
          }).getConnection((err, conn)=>{
            if (err) {
              console.log('数据库连接失败！')
              process.exit(1)
            } else {
              resolve(conn)
            }
          })
        } else {
          console.error(`数据库配置文件错误：${process.env.VUE_APP_CONFIG}`)
          process.exit(1)
        }
        
      }
    })
  }

  /**
   * 测试数据库连接
   * @param config 
   * @param timeout 超时时间(毫秒)
   * @returns 
   */
  public static testMysqlConnection(config: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  }, timeout=1000): Promise<boolean> {
    return new Promise((resolve)=>{
      try {
        const temp_conn = mysql.createConnection({
          host: config.host,
          port: config.port,
          user: config.user,
          password: config.password,
          database: config.database,
          timeout: timeout
        })
        temp_conn.connect((error, args)=>{
          if (error) resolve(false)
          else {
            resolve(true)
          }
          temp_conn.end()
        })
      } catch (error) {
        console.log(error)
        resolve(false)
      }
    })
  }

  public static setConfigByDB(config: MetaConfig): void {
    if (config.server_port) BgStore.serverPort = config.server_port
  }
}

interface LocalServer{
  server: any;
  app: express.Express;
  isRunning(): any;
  stop(): boolean;
}