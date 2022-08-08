/*
 ** Author: Destiny_zxj
 ** Email: destiny_zxj@163.com
 ** Datetime: 2022/08/06 Saturday 18:59:31
 ** Description: ...
*/
import { Toast } from 'vant'

export default class Util{

  /**
   * 
   * @param port 端口有效性校验
   * @returns 
   */
  public static isValidPort(port: string): boolean {
    const intValue = parseInt(port)
    if (intValue < 1024 || intValue > 60000) {
      Util.showToast('请输入正确端口号(1025~60000)', 1000)
      return false
    }
    return true
  }

  /**
   * 
   * @param msg 轻提示
   * @param duration 
   */
  public static showToast(msg: string, duration=2000): void {
    Toast({
      message: msg,
      forbidClick: true,
      duration: duration
    })
  }

  /**
   * 获取日期时间
   * @param timestamp 毫秒级时间戳
   * @returns 
   */
  public static getDateTime(timestamp: number): DateTime {
    const date = new Date(timestamp)
    const year = date.getFullYear().toString()
    let month = (date.getMonth() + 1).toString()
    if (month.length < 2) month = `0${month}`
    let day = date.getDate().toString()
    if (day.length < 2) day = `0${day}`
    let hours = date.getHours().toString()
    if (hours.length < 2) hours = `0${hours}`
    let minutes = date.getMinutes().toString()
    if (minutes.length < 2) minutes = `0${minutes}`
    let seconds = date.getSeconds().toString()
    if (seconds.length < 2) seconds = `0${seconds}`
    return {
      date: [year, month, day],
      time: [hours, minutes, seconds]
    }
  }


}
interface DateTime{
  date: string[];
  time: string[];
}
