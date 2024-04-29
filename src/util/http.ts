import axios from 'axios';
import EventBus from './event';

const instance = axios.create({
  // 特别重要
  validateStatus: function (status) {
    return status < 500; // 处理状态码小于500的情况
  },
});

instance.interceptors.response.use(
  function (response) {
    console.log('response.status', response.status);

    if (response.status === 200) {
      if (response.data.code === 401) {
        EventBus.emit('global_not_login', response.data.msg);
        // return Promise.reject('没有登录状态')
      }

      if (response.data.code === -1) {
        EventBus.emit('global_error_tips', response.data.msg);
      }
    } else if (response.status === 403) {
      EventBus.emit('global_error_auth', '没有权限，别瞎访问');
    }

    return response;
  },
  function (error) {
    // EventBus.emit('global_error_tips', error.response.data.message)
    // return Promise.reject(error);
  }
);

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
