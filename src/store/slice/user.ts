import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import {
  getUserInfoRequest,
  UserInfo,
  getMenuRequest,
  getStudentListRequest,
  getAdminListRequest,
  MenuData,
} from '@/util/request';

export type PageList<T = any> = {
  list: T[];
  count: number;
};

type Data = {
  menu: MenuData[]; // 菜单
  user_info: UserInfo; // 用户信息
  is_show_user_edit_modal: boolean; // 是否显示编辑用户信息弹窗
  current_edit_userinfo: UserInfo; // 当前编辑的用户信息
  admin_list: UserInfo[]; // 管理员列表

  student_list_data: PageList<UserInfo>; // 学生列表
  student_list_search_params: any; // 学生列表搜索参数
  student_list_current_page: number; // 学生列表当前页
};

const initialState: Data = {
  menu: [],
  user_info: {} as UserInfo,
  is_show_user_edit_modal: false,
  current_edit_userinfo: {} as UserInfo,
  admin_list: [],

  student_list_data: { list: [], count: 0 },
  student_list_search_params: {},
  student_list_current_page: 1,
};

export const get_menu_async = createAsyncThunk<MenuData[]>('get/user_menu', async (action, state) => {
  return await getMenuRequest();
});

export const get_user_info = createAsyncThunk<UserInfo>('get/user_info', async (action, state) => {
  return await getUserInfoRequest();
});

export const get_student_async = createAsyncThunk<any, any>('get/user_student', async (action: any, state) => {
  return await getStudentListRequest(action);
});

export const get_admin_async = createAsyncThunk<any>('get/user_admin', async (action, state) => {
  return await getAdminListRequest();
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set_memu: (state, aciton) => {
      state.menu = aciton.payload;
    },
    set_user_info: (state, aciton) => {
      state.user_info = aciton.payload;
    },
    set_is_show_user_edit_modal: (state, aciton) => {
      state.is_show_user_edit_modal = aciton.payload;
    },
    set_current_edit_userinfo: (state, aciton) => {
      state.current_edit_userinfo = aciton.payload;
    },
    set_edit_user_topic_role: (state, aciton) => {
      state.current_edit_userinfo.topic_role = aciton.payload;
    },
    set_student_list_search_params: (state, aciton) => {
      state.student_list_search_params = aciton.payload;
    },
    set_student_list_current_page: (state, aciton) => {
      state.student_list_current_page = aciton.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(get_menu_async.fulfilled, (state, res) => {
        state.menu = res.payload;
      })
      .addCase(get_user_info.fulfilled, (state, res) => {
        state.user_info = res.payload;
      })
      .addCase(get_student_async.fulfilled, (state, res) => {
        state.student_list_data.list = res.payload.data;
        state.student_list_data.count = res.payload.count;
      })
      .addCase(get_admin_async.fulfilled, (state, res) => {
        state.admin_list = res.payload;
      });
  },
});

export const select_menu = (state: RootState) => {
  return state.user.menu;
};

export const select_user_info = (state: RootState) => {
  return state.user.user_info;
};

export const select_user_student_list_data = (state: RootState) => {
  return state.user.student_list_data;
};

export const select_user_admin_list = (state: RootState) => {
  return state.user.admin_list;
};

export const select_is_show_user_edit_modal = (state: RootState) => {
  return state.user.is_show_user_edit_modal;
};

export const select_current_edit_userinfo = (state: RootState) => {
  return state.user.current_edit_userinfo;
};

export const select_student_list_search_params = (state: RootState) => {
  return state.user.student_list_search_params;
};

export const select_student_list_current_page = (state: RootState) => {
  return state.user.student_list_current_page;
};

export const {
  set_user_info,
  set_memu,
  set_is_show_user_edit_modal,
  set_current_edit_userinfo,
  set_edit_user_topic_role,
  set_student_list_search_params,
  set_student_list_current_page,
} = userSlice.actions;

export default userSlice.reducer;
