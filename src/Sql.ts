/*
 ** Author: Destiny_zxj
 ** Email: destiny_zxj@163.com
 ** Datetime: 2022/07/01 星期五 14:17:09
 ** Description: ...
*/

import sqlite3 from 'sqlite3'
const database = sqlite3.verbose()
import path from 'path'


export default class Sql{
  public static execute(sql: string, params: string[]=null as any): Promise<any> {
    let db = (global as any).db
    while (!db) {
      // new database.Database(path.join(__dirname, 'database.db'))
      (global as any).db = new database.Database(path.join(__dirname, '../database.db'))
      db = (global as any).db
    }
    return new Promise((resolve, reject)=>{
      if (params && params.length > 0) {
        db.run(sql, params, (results: sqlite3.RunResult, err: Error)=>{
          if (err) resolve({
            code: -1,
            data: err,
            msg: 'ERROR'
          })
          resolve({
            code: 0,
            data: results,
            msg: 'OK'
          })
        })
      } else {
        db.exec(sql, (results: sqlite3.RunResult, err: Error)=>{
          if (err) resolve({
            code: -1,
            data: err,
            msg: 'ERROR'
          })
          resolve({
            code: 0,
            data: results,
            msg: 'OK'
          })
        })
      }
    })
  }

  public static async init() {
    const create_table_log = `CREATE TABLE IF NOT EXISTS logs(
      id        CHAR(64)  PRIMARY KEY,
      name      CHAR(255) NOT NULL,
      content   TEXT      NOT NULL,
      datetime  CHAR(32)
   );`
   await Sql.execute(create_table_log)
  }
}