/*
 ** Author: Destiny_zxj
 ** Email: destiny_zxj@163.com
 ** Datetime: 2022/08/06 Saturday 17:24:37
 ** Description: ...
*/
import express, {Request, Response} from 'express'
import Res from './Res';
import bodyParser from 'body-parser'
import cors from 'cors'
import qs from 'qs'
import Sql from './Sql';
import BgStore from './BgStore';


const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({extended: false})

export default class Server {
  private app: express.Express;
  private server: any;

  constructor() {
    this.app = express()
    this.app.use(urlencodedParser)
    this.app.use(jsonParser)
    this.app.use(cors())
    // console
    this.server = this.app.listen(BgStore.serverPort, () => {
      console.log(`本地服务器已开启！运行端口: ${BgStore.serverPort}`)
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

  public isRunning(): boolean {
    if (this.app != null && this.server != null) {
      try {
        const port = this.server.address().port
        console.log('isRunning: run at: ' + port)
        if (port) return true
      } catch (error) {
        return false
      }
    }
    return false
  }

  public stop(): boolean {
    console.log('Do: stop server')
    if (this.server) {
      try {
        this.server.close()
        return true
      } catch (error) {
        return false
      }
    } else {
      return true
    }
  }
}

