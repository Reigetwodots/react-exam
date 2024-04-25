import axios from 'axios';

const instance = axios.create({});

export type AxiosRes<T = ResData> = {
  config: Object;
  data: T;
  headers: any;
  request: any;
  status: number;
  statusText: string;
};

// 后台定义的业务数据规范
export type ResData<T = any> = {
  code: number;
  msg: string;
  data: T;
};

export default instance;
