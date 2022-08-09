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
      BgStore.getPoolConnection().then((conn)=>{
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
          conn.release()
          resolve(res)
        })
      })
    })
  }
  public static bthj_download_update(data: Record<string, any>): Promise<Res> {
    const res = new Res()
    return new Promise((resolve) => {
      BgStore.getPoolConnection().then((conn)=>{
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
          conn.release()
          Sql.logs_write({
            name: new Date().getTime().toString(),
            type: 'exec_sql_update',
            content: `${sql} - ${values.join('||')}`,
            status: status
          })
          resolve(res)
        })
      })
    })
  }
  public static bthj_download_insert(data: Record<string, any>): Promise<Res> {
    const res = new Res();
    return new Promise((resolve) => {
      BgStore.getPoolConnection().then((conn)=>{
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
          conn.release()
          Sql.logs_write({
            name: new Date().getTime().toString(),
            type: 'exec_sql_insert',
            content: `${sql} - ${values.join('||')}`,
            status: status
          })
          resolve(res)
        })
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
    console.log(data)
    // BgStore.getPoolConnection().then((conn)=>{
    //   conn.query(
    //     'insert into logs(name, type, content, datetime, status) values(?,?,?,?,?);',
    //     [data.name, data.type, data.content, new Date().getTime(), data.status]
    //   )
    //   conn.release()
    // })
  }
  // meta
  public static getMeta(meta_key: string): Promise<Res> {
    const res = new Res();
    return new Promise((resolve) => {
      BgStore.getPoolConnection().then((conn)=>{
        const sql = 'select * from meta where meta_key = ?;'
        conn.query(sql, meta_key, (error, results) => {
          if (error) {
            res.msg = 'ERROR_MYSQL_EXECUTE'
            res.data = error
          } else {
            const resData = results
            if (resData && resData.length > 0) {
              res.data = resData[0].meta_value
            } else {
              res.data = null
            }
            res.code = 200
            res.msg = '获取成功'
          }
          conn.release()
          resolve(res)
        })
      })
    })
  }
  public static insertMeta(meta_key: string, meta_value: string): Promise<Res> {
    const res = new Res();
    return new Promise((resolve) => {
      BgStore.getPoolConnection().then((conn)=>{
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
          conn.release()
          Sql.logs_write({
            name: timestamp.toString(),
            type: 'exec_sql_insert',
            content: `${sql} - ${values.join('||')}`,
            status: status
          })
          resolve(res)
        })
      })
    })
  }
  public static updateMeta(meta_key: string, meta_value: string): Promise<Res> {
    const res = new Res();
    return new Promise((resolve) => {
      BgStore.getPoolConnection().then((conn)=>{
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
          conn.release()
          Sql.logs_write({
            name: timestamp.toString(),
            type: 'exec_sql_update',
            content: `${sql} - ${values.join('||')}`,
            status: status
          })
          resolve(res)
        })
      })
    })
  }
  public static async saveMeta(meta_key: string, meta_value: string): Promise<Res> {
    console.log(`meta: ${meta_key};${meta_value}`)
    const res_get = await Sql.getMeta(meta_key)
    if (res_get.code === 200 && res_get.data && res_get.data.length > 0) {
      return Sql.updateMeta(meta_key, meta_value)
    } else {
      console.log('insert')
      return Sql.insertMeta(meta_key, meta_value)
    }
  }
  // bookmarks
  public static getBookmarks(page=1, size=10): Promise<Res> {
    const res = new Res();
    if (page<0) page=1
    if (size<0) size=10
    return new Promise((resolve) => {
      BgStore.getPoolConnection().then((conn)=>{
        const sql = 'select * from bookmarks order by sort_id desc;'
        conn.query(sql,[(page-1) * size, size], (error, results) => {
          if (error) {
            res.msg = 'ERROR_MYSQL_EXECUTE'
            res.data = error
          } else {
            // 自行分页
            let total = 0
            let resList = [] as any[]
            const from = (page-1)*size
            if (results instanceof Array) {
              total = results.length
              if (from < results.length) {
                resList = results.splice(from, size)
              }
            }
            res.code = 200
            res.data = {
              total: total,
              res_total: resList.length,
              res_list: resList
            }
            res.msg = '获取成功'
          }
          conn.release()
          resolve(res)
        })
      })
    })
  }
  public static insertBookmark(name: string, url: string, sort_id: number, icon: string | null=''): Promise<Res> {
    const res = new Res();
    return new Promise((resolve) => {
      BgStore.getPoolConnection().then((conn)=>{
        const sql = 'insert into bookmarks(name, url, icon, sort_id) values(?,?,?,?);'
        const values = [name, url, icon, sort_id]
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
          conn.release()
          resolve(res)
        })
      })
    })
  }
  public static updateBookmark(bookmark: {
    id: number;
    name: string;
    url: string;
    sort_id: number;
    icon?: string;
  }): Promise<Res> {
    const res = new Res();
    return new Promise((resolve) => {
      BgStore.getPoolConnection().then((conn)=>{
        const bid = bookmark.id
        let sql = 'update bookmarks set ${0} where id = ?;'
        const {fields, values} = BgUtil.generateSqlData(bookmark)
        let sql_data = fields.join('= ? ,')
        sql_data += '= ? '
        sql = sql.replace('${0}', sql_data)
        values.push(bid)
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
          conn.release()
          resolve(res)
        })
      })
    })
  }
}