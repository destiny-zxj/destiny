/*
 ** Author: Destiny_zxj
 ** Email: destiny_zxj@163.com
 ** Datetime: 2022/08/07 星期天 14:30:21
 ** Description: DAO 层
*/

import Res from "./Res";
import BgUtil from "../bgutils/BgUtil";
import BgStore from "./BgStore";

export default class Sql{
  // bthj_download
  // name tid format mosaic size hash from_page torrent torrent_name imgs create_at update_at download userid
  public static bthj_download_getByHash(hash: string): Promise<Res> {
    const res = new Res();
    return new Promise((resolve) => {
      BgStore.getPool().getConnection((err, conn) => {
        if (err) {
          res.msg = 'ERROR_MYSQL'
          res.data = err
          resolve(res)
        }
        const sql = 'select * from bthj_download where hash = ?;'
        conn.query(sql, hash, (error, results) => {
          if (error) {
            res.msg = 'ERROR_MYSQL_EXECUTE'
            res.data = error
          } else {
            res.code = 200
            res.data = results
            res.msg = '获取成功'
          }
          resolve(res)
        })
        conn.release()
      })
    })
  }
  public static bthj_download_update(data: Record<string, any>): Promise<Res> {
    const res = new Res()
    return new Promise((resolve) => {
      BgStore.getPool().getConnection((err, conn) => {
        if (err) {
          res.msg = 'ERROR_MYSQL'
          res.data = err
          resolve(res)
        }
        const hash = data.hash
        let sql = 'update bthj_download set ${0} where hash = ?;'
        const {fields, placeholders, values} = BgUtil.generateSqlData(data)
        let sql_data = fields.join('= ? ,')
        sql_data += '= ? '
        sql = sql.replace('${0}', sql_data)
        values.push(hash)
        conn.query(sql, values, (error, results) => {
          let status = 0
          if (error) {
            res.msg = 'ERROR_MYSQL_EXECUTE'
            res.data = error
          } else {
            res.code = 200
            res.data = results
            res.msg = '更新成功'
            status = 1
          }
          Sql.logs_write({
            name: new Date().getTime().toString(),
            type: 'exec_sql_update',
            content: `${sql} - ${values.join('||')}`,
            status: status
          })
          resolve(res)
        })
        conn.release()
      })
    })
  }
  public static bthj_download_insert(data: Record<string, any>): Promise<Res> {
    const res = new Res();
    return new Promise((resolve) => {
      BgStore.getPool().getConnection((err, conn) => {
        if (err) {
          res.msg = 'ERROR_MYSQL'
          res.data = err
          resolve(res)
        }
        let sql = 'insert into bthj_download(${0}) values(${1});'
        const {fields, placeholders, values} = BgUtil.generateSqlData(data)
        sql = sql.replace('${0}', fields.join(','))
        sql = sql.replace('${1}', placeholders.join(','))
        // console.log(sql)
        // console.log(values)
        conn.query(sql, values, (error, results) => {
          let status = 0
          if (error) {
            res.msg = 'ERROR_MYSQL_EXECUTE'
            res.data = error
          } else {
            res.code = 200
            res.data = results
            res.msg = '插入成功'
            status = 1
          }
          Sql.logs_write({
            name: new Date().getTime().toString(),
            type: 'exec_sql_insert',
            content: `${sql} - ${values.join('||')}`,
            status: status
          })
          resolve(res)
        })
        conn.release()
      })
    })
  }
  // logs
  public static logs_write(data: {
    name: string,
    type: string,
    content: string,
    status?: number
  }): void {
    BgStore.getPool().getConnection((err, conn) => {
      if (err) throw err;
      conn.query(
        'insert into logs(name, type, content, datetime, status) values(?,?,?,?,?);',
        [data.name, data.type, data.content, new Date().getTime(), data.status]
      )
    })
  }
  // meta
  public static getMeta(meta_key: string): Promise<Res> {
    const res = new Res();
    return new Promise((resolve) => {
      BgStore.getPool().getConnection((err, conn) => {
        if (err) {
          res.msg = 'ERROR_MYSQL'
          res.data = err
          resolve(res)
        }
        const sql = 'select * from meta where meta_key = ?;'
        conn.query(sql, meta_key, (error, results) => {
          if (error) {
            res.msg = 'ERROR_MYSQL_EXECUTE'
            res.data = error
          } else {
            res.code = 200
            res.data = results
            res.msg = '获取成功'
          }
          resolve(res)
        })
        conn.release()
      })
    })
  }
  public static insertMeta(meta_key: string, meta_value: string): Promise<Res> {
    const res = new Res();
    return new Promise((resolve) => {
      BgStore.getPool().getConnection((err, conn) => {
        if (err) {
          res.msg = 'ERROR_MYSQL'
          res.data = err
          resolve(res)
        }
        const sql = 'insert into meta(meta_key, meta_value, datetime) values(?,?,?);'
        const timestamp = new Date().getTime()
        const values = [meta_key, meta_value, timestamp]
        conn.query(sql, values, (error, results) => {
          let status = 0
          if (error) {
            res.msg = 'ERROR_MYSQL_EXECUTE'
            res.data = error
          } else {
            res.code = 200
            res.data = results
            res.msg = '插入成功'
            status = 1
          }
          Sql.logs_write({
            name: timestamp.toString(),
            type: 'exec_sql_insert',
            content: `${sql} - ${values.join('||')}`,
            status: status
          })
          resolve(res)
        })
        conn.release()
      })
    })
  }
  public static updateMeta(meta_key: string, meta_value: string): Promise<Res> {
    const res = new Res();
    return new Promise((resolve) => {
      BgStore.getPool().getConnection((err, conn) => {
        if (err) {
          res.msg = 'ERROR_MYSQL'
          res.data = err
          resolve(res)
        }
        const sql = 'update meta set meta_value = ?, datetime = ? where meta_key = ?;'
        const timestamp = new Date().getTime()
        const values = [meta_value, timestamp, meta_key]
        conn.query(sql, values, (error, results) => {
          let status = 0
          if (error) {
            res.msg = 'ERROR_MYSQL_EXECUTE'
            res.data = error
          } else {
            res.code = 200
            res.data = results
            res.msg = '更新成功'
            status = 1
          }
          Sql.logs_write({
            name: timestamp.toString(),
            type: 'exec_sql_update',
            content: `${sql} - ${values.join('||')}`,
            status: status
          })
          resolve(res)
        })
        conn.release()
      })
    })
  }
}