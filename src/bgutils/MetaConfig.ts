/*
 ** Author: Destiny_zxj
 ** Email: destiny_zxj@163.com
 ** Datetime: 2022/08/08 星期一 12:13:07
 ** Description: ...
*/

interface MetaConfig{
  server_port?: number;
}
enum MetaKey{
  SERVER_PORT='server.port',
  SERVER_AUTO_RUN='server.auto_run'
}

export {
  MetaConfig,
  MetaKey
}