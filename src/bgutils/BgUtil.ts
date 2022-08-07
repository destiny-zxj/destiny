/*
 ** Author: Destiny_zxj
 ** Email: destiny_zxj@163.com
 ** Datetime: 2022/08/07 星期天 16:36:51
 ** Description: ...
*/

export default class BgUtil{
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
}

interface SqlData{
  fields: string[]; 
  placeholders: string[];
  values: any[];
}