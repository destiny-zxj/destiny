/*
 ** Author: Destiny_zxj
 ** Email: destiny_zxj@163.com
 ** Datetime: 2022/08/07 星期天 16:36:51
 ** Description: ...
*/

import BgStore from "./BgStore"
import { MetaConfig, MetaKey } from "./MetaConfig"
import Server from "./Server"
import Sql from "./Sql"
import fs from 'fs'
import Res from "./Res"
import path from 'path'

export default class BgUtil{
  // AppConfig.json 文件路径
  public static appConfigFile = path.join(__dirname, process.env.VUE_APP_CONFIG as string)
  public static generateSqlData(data: Record<string, any>): SqlData {
    const fields: string[] = []
    const placeholders: string[] = []
    const values: any[] = []
    for(const key in data) {
      const value = data[key]
      if (value != undefined && value != null && value != '') {
        fields.push(key)
        placeholders.push('?')
        values.push(value)
      }
    }
    return {
      fields, placeholders, values
    }
  }
  public static async initBgStore() {
    console.log('init BgStore')
    const metaConfig: MetaConfig = {
      server_port: (await Sql.getMeta(MetaKey.SERVER_PORT)).data
    }
    console.log(metaConfig)
    BgStore.setConfigByDB(metaConfig)
  }
  public static async load() {
    const auto_run = (await Sql.getMeta(MetaKey.SERVER_AUTO_RUN)).data
    if (auto_run === '1') BgStore.server = new Server() as any
  }
  public static getAppConfig(): any {
    if (!fs.existsSync(BgUtil.appConfigFile)) {
      console.error(`数据库配置文件不存在：${BgUtil.appConfigFile}`)
      process.exit(1)
    }
    return JSON.parse(fs.readFileSync(BgUtil.appConfigFile, {
      encoding: 'utf-8'
    }).toString())
  }
  public static saveAppConfig(config: any): Promise<Res> {
    const res = new Res();
    const oldConfig = BgUtil.getAppConfig()
    if (config.mysql.host) oldConfig.mysql.host = config.mysql.host
    if (config.mysql.port) oldConfig.mysql.port = config.mysql.port
    if (config.mysql.user) oldConfig.mysql.user = config.mysql.user
    if (config.mysql.password) oldConfig.mysql.password = config.mysql.password
    if (config.mysql.database) oldConfig.mysql.database = config.mysql.database
    return new Promise((resolve)=>{
      BgStore.testMysqlConnection(config.mysql).then(result=>{
        if (!result) {
          res.msg = '数据库连接失败'
          resolve(res)
        } else {
          try {
            fs.writeFileSync(BgUtil.appConfigFile, JSON.stringify(oldConfig, null, "  "), {
              flag: 'w+'
            })
            res.code = 200
            res.msg = '保存成功'
            resolve(res)
          } catch (error) {
            console.log(error)
            res.msg = '配置文件保存失败'
            resolve(res)
          }
        }
      })
      
    })
    
  }
}

interface SqlData{
  fields: string[]; 
  placeholders: string[];
  values: any[];
}