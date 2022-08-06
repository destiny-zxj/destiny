import mysql from 'mysql'

const pool = mysql.createPool({
  host: process.env.VUE_APP_MYSQL_HOST || '127.0.0.1',
  user: process.env.VUE_APP_MYSQL_USER || 'root',
  password: process.env.VUE_APP_MYSQL_PASSWORD || '',
  database: process.env.VUE_APP_MYSQL_DATABASE || 'destiny'
})

// const conn = mysql.createConnection({
//   host: process.env.VUE_APP_MYSQL_HOST || '127.0.0.1',
//   user: process.env.VUE_APP_MYSQL_USER || 'root',
//   password: process.env.VUE_APP_MYSQL_PASSWORD || '',
//   database: process.env.VUE_APP_MYSQL_DATABASE || 'destiny'
// })
// conn.connect()

export {
  pool
}
