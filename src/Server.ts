/*
 ** Author: Destiny_zxj
 ** Email: destiny_zxj@163.com
 ** Datetime: 2022/08/06 Saturday 17:24:37
 ** Description: ...
*/
import express, {Request, Response} from 'express'
import { pool } from './utils/pool';
import Res from './utils/Res';
import bodyParser from 'body-parser'
import Util from './utils/Util';
import { Middleware } from './utils/Middlewares';
import cors from 'cors'
import qs from 'qs'

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({extended: false})

export default class Server{
  private app: express.Express;
  private server: any;

  constructor() {
    this.app = express()
    this.app.use(urlencodedParser)
    this.app.use(jsonParser)
    this.app.use(cors())
    this.server = this.app.listen(process.env.VUE_APP_SERVER_PORT || 16215, () => {
      //
    })
    this.initServer()
  }
  /**
   * MVC
   */
  private initServer(): void {
    // hello
    this.app.get('/hello', (request: Request, response: Response) => {
      return response.json(new Res(200, null, 'hello world'))
    })
    // bthj_download 查询
    this.app.get('/bthj_download/getByHash', async (request: Request, response: Response) => {
      const hash = request.query.hash as string
      const res = new Res()
      if (!hash) {
        res.msg = '缺少参数: hash'
        return response.json(res)
      }
      return response.json(await Sql.bthj_download_getByHash(hash))
    })
    // bthj_download 保存
    this.app.post('/bthj_download/save', async (request: Request, response: Response) => {
      const res = new Res()
      const hash = request.body.hash
      const torrent = request.body.torrent
      const from_page = request.body.from_page as string
      const data: any = {
        name: request.body.name,
        tid: '',
        format: request.body.format,
        mosaic: request.body.mosaic,
        size: request.body.size,
        hash: hash,
        from_page: from_page,
        torrent: torrent,
        torrent_name: request.body.torrent_name,
        imgs: request.body.imgs,
        update_at: new Date().getTime(),
        download: request.body.download,
        userid: request.body.userid
      }
      if (from_page && from_page.indexOf('?') != -1) {
        const querys = qs.parse(from_page.split('?')[1])
        if ('tid' in querys) data.tid = querys.tid
      }
      if (!hash) {
        res.msg = '缺少参数: hash'
        return response.json(res)
      }
      if (!torrent) {
        res.msg = '缺少参数: torrent'
        return response.json(res)
      }
      const oldData = await Sql.bthj_download_getByHash(hash)
      if (oldData.code === 200 && oldData.data && oldData.data.length > 0) {
        // 更新
        if (oldData.data.length != 1) {
          res.msg = '查询到多条 hash 相同记录(重大BUG)'
          return response.json(res)
        }
        return response.json(await Sql.bthj_download_update(data))
      } else {
        // 插入
        data.create_at = new Date().getTime()
        return response.json(await Sql.bthj_download_insert(data))
      }
    })
  }
}

/**
 * DAO 层
 */
class Sql{
  // bthj_download
  // name tid format mosaic size hash from_page torrent torrent_name imgs create_at update_at download userid
  public static bthj_download_getByHash(hash: string): Promise<Res> {
    const res = new Res();
    return new Promise((resolve) => {
      pool.getConnection((err, conn) => {
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
      pool.getConnection((err, conn) => {
        if (err) {
          res.msg = 'ERROR_MYSQL'
          res.data = err
          resolve(res)
        }
        const hash = data.hash
        let sql = 'update bthj_download set ${0} where hash = ?;'
        const {fields, placeholders, values} = Util.generateSqlData(data)
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
      pool.getConnection((err, conn) => {
        if (err) {
          res.msg = 'ERROR_MYSQL'
          res.data = err
          resolve(res)
        }
        let sql = 'insert into bthj_download(${0}) values(${1});'
        const {fields, placeholders, values} = Util.generateSqlData(data)
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
    pool.getConnection((err, conn) => {
      if (err) throw err;
      conn.query(
        'insert into logs(name, type, content, datetime, status) values(?,?,?,?,?);',
        [data.name, data.type, data.content, new Date().getTime(), data.status]
      )
    })
  }
}