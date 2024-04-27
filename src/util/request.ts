import axios from './http';

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
  count?: number;
};

type AxiosResData<T = any> = AxiosRes<ResData<T>>;

type Role = 'student' | 'admin' | 'super_admin';

export type UserInfo = {
  created: Date; // 时间
  name: string; // 学生花名
  vChat: string; // 微信名字
  phone: string; // 手机
  avatar: string; // 头像
  graduation_time: Date; // 毕业时间
  money: number; // 现在薪资
  role: Role; // 角色
  edu: string; // 学历
  _id: string;
  has_person_info: boolean; // 是否填写个人信息
  topic_role: []; // 课程权限列表
  techStack: string; // 技术栈
};

export type MenuData = {
  hasMenu: boolean; // 是否有菜单
  key: string; // 菜单key
  label: string; // 菜单名
  path: string; // 菜单路径
};

export type SubjectData = {
  title: string; // 课程名
  value: string; // 课程id
  children: SubjectData[]; // 二级课程分类
  can_exam: boolean; // 是否可以考试
};

export type TopicData = {
  dec: string; // 题目描述
  title: string; // 题目标题
  two_id: string; // 二级课程id
  _id: string; // 题目id
  img: string[]; // 图片
  answer: string; // 答案
  comment: string; // 评语
  pass: boolean; // 是否通过
  is_corret: boolean; // 是否批阅
};

export type ExamData = {
  created: Date; // 创建时间
  is_judge: boolean; // 是否批阅
  subject_name: string; // 课程名
  topic_list: TopicData[]; // 题目列表
  two_id: string; // 二级课程id
  user_id: string; // 用户id
  user_name: string; // 用户名
  _id: string; // 试卷id
};

// export type SubjectTreeType = SubjectData[]

//登录管理

// 退出登录
export function logoutRequest() {
  return new Promise(async (resolve, reject) => {
    const res: AxiosResData = await axios.post('/api/user/logout');
    resolve(res.data.data);
  });
}

// 登录
export type LoginBody = {
  phone: string;
  code: string;
};
export function loginPost(body: LoginBody) {
  return new Promise<UserInfo>(async (resolve, reject) => {
    const res: AxiosResData<UserInfo> = await axios.post('/api/user/login', body);
    resolve(res.data.data);
  });
}

// 用户管理
// 用户信息修改

export type UserinfoPatchBody = Partial<UserInfo>;

export type UserTopicRolePatchBody = {
  topic_role: string[];
};

export function userInfoPatch(user_id: string, body: UserinfoPatchBody) {
  return new Promise(async (resolve, rejects) => {
    const res: AxiosResData = await axios.patch(`/api/user/${user_id}`, body);
    resolve(res.data.data);
  });
}

// 用户删除
export function userDelete(user_id: string) {
  return new Promise(async (resolve, rejects) => {
    const res: AxiosResData = await axios.delete(`/api/user/${user_id}`);
    resolve(res.data.data);
  });
}

// 新增管理员
export type AddAdminBody = {
  phone: string;
};

export function addAdminRequest(body: AddAdminBody) {
  return new Promise(async (resolve, rejects) => {
    const res: AxiosResData = await axios.post('/api/user/add_admin', body);
    resolve(res.data.data);
  });
}

// 获取用户信息
export function getUserInfoRequest() {
  return new Promise<UserInfo>(async (resolve, reject) => {
    const res: AxiosResData<UserInfo> = await axios.get('/api/user');
    resolve(res.data.data || {});
  });
}

// 获取菜单
export function getMenuRequest() {
  return new Promise<MenuData[]>(async (resolve, rejects) => {
    const res: AxiosResData<MenuData[]> = await axios.get('/api/user/menu');
    resolve(res.data.data || []);
  });
}

// 获取学生列表

type StudentSearch = {
  name?: string;
  phone?: string;
  skip?: number;
  limit?: number;
};

export function getStudentListRequest(params: StudentSearch = {}) {
  return new Promise<ResData<UserInfo[]>>(async (resolve, rejects) => {
    const res: AxiosResData<UserInfo[]> = await axios.get('/api/user/student', {
      params,
    });
    resolve(res?.data);
  });
}

// 获取管理员列表
export function getAdminListRequest() {
  return new Promise<UserInfo[]>(async (resolve, rejects) => {
    const res: AxiosResData<UserInfo[]> = await axios.get('/api/user/admin');
    resolve(res.data.data);
  });
}

// 课程管理
export function getSubjectTree() {
  return new Promise<SubjectData[]>(async (resolve, rejects) => {
    const res: AxiosResData<SubjectData[]> = await axios.get('/api/subject');
    resolve(res.data.data);
  });
}

// 课程删除
export function subject2Delete(subject2_id: string) {
  return new Promise(async (resolve, rejects) => {
    const res: AxiosResData = await axios.delete(`/api/subject/two/${subject2_id}`);
    resolve(res.data.data);
  });
}

// 获取课程一级分类
// /api/subject/one
export function getSubejctOne() {
  return new Promise(async (resolve, rejects) => {
    const res: AxiosResData = await axios.get(`/api/subject/one`);
    resolve(res.data.data);
  });
}

// 课程新增
export type AddSubject2Body = {
  one_key: string;
  two_name: string;
};
export function subjectAddPost(body: AddSubject2Body) {
  return new Promise(async (resolve, rejects) => {
    const res: AxiosResData = await axios.post(`/api/subject/two`, body);
    resolve(res.data.data);
  });
}

// 获取二级课程分类下的题目列表
export function getTopic2List(suject2_id: string) {
  return new Promise<TopicData[]>(async (resolve, rejects) => {
    const res: AxiosResData<TopicData[]> = await axios.get(`/api/topic/${suject2_id}`);
    resolve(res.data.data);
  });
}

// 获取exam考题历史记录 获取所有考卷 （学生 管理员）
export function getExamHistory(body: any) {
  return new Promise<ResData>(async (resolve, rejects) => {
    const res: AxiosResData<ExamData[]> = await axios.post(`/api/exam`, body);
    resolve(res.data);
  });
}

export function getExamByIdRequest(exam_id: string) {
  return new Promise<ExamData>(async (resolve, rejects) => {
    const res: AxiosResData<ExamData> = await axios.get(`/api/exam/${exam_id}`);
    resolve(res.data.data);
  });
}

// 试卷管理

// 批阅试卷
export type CorretExamBody = {
  topic_list: TopicData[];
};
export function corretExamPost(exam_id: string, body: CorretExamBody) {
  return new Promise(async (resolve, rejects) => {
    const res: AxiosResData = await axios.patch(`/api/exam/${exam_id}`, body);
    resolve(res.data.data);
  });
}

// 试卷提交
export type ExamPostBody = {
  topic_list: TopicData[];
  two_id: string;
};
export function examPost(body: ExamPostBody) {
  return new Promise(async (resolve, rejects) => {
    const res: AxiosResData = await axios.post(`/api/exam/create`, body);
    resolve(res.data.data);
  });
}
