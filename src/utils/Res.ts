export default class Res{
  public code: number;
  public data: any;
  public msg: string;

  constructor(code=400, data=null, msg='') {
    this.code = code;
    this.data = data;
    this.msg = msg;
  }
}