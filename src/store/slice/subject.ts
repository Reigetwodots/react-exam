import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import {
  getSubjectTree,
  getTopic2List,
  SubjectData,
  TopicData,
  getExamHistory,
  ExamData,
  getExamByIdRequest,
  ResData,
  getSubejctOne,
} from '../../util/request';

// 题库仓库state类型
type SubjectState = {
  loading: boolean;
  // 课程树形数据
  subject_tree: SubjectData[];
  // 当前选择课程
  active_two: SubjectData;
  // 题目列表
  topic_two_list: TopicData[];
  // 当前选择题目
  active_topic: TopicData;
  current_two_subject: string; // 当前选择的考试科目

  exam_topic_list: []; // 考试题目列表
  current_exam_topic_id: string;
  exam_list_data: {
    list: [];
    count: number; // 总数
    limit: number; // 每页显示条数
    skip: number; // 跳过条数
    search_params: {}; // 搜索参数
    current_page: 1; // 当前页数
  };

  corret_exam_list_loading: boolean; // 考试历史列表loading
  subject_one: any[]; // 一级科目
};

const initialState = {
  loading: false,
  subject_tree: [],
  active_two: {} as SubjectData,
  topic_two_list: [],
  active_topic: {} as TopicData,
  current_two_subject: '',
  exam_topic_list: [],
  current_exam_topic_id: '',
  corret_exam_list: [],
  corret_exam_list_loading: false,
  exam_list_data: {
    // 分页查询
    list: [],
    count: 0,
    limit: 10,
    skip: 0,
    search_params: {},
    current_page: 1,
  },
  subject_one: [],
} as SubjectState;

export const get_subject_tree_async = createAsyncThunk<SubjectData[]>('get/subject_tree', async (action, state) => {
  return await getSubjectTree();
});

export const get_topic_two_list = createAsyncThunk<TopicData[], string>('get/topic_two_list', async (action, state) => {
  return await getTopic2List(action);
});

export const get_subject_one = createAsyncThunk('get/subject_one', async (action, state) => {
  return await getSubejctOne();
});

// 获取考试题目
export const get_exam_async = createAsyncThunk<TopicData[], string>('get/exam_topic', async (action, state) => {
  return await getTopic2List(action);
});

export const get_exam_history = createAsyncThunk<ResData, any>('get/exam_history', async (action, state) => {
  return await getExamHistory(action);
});

export const get_corret_exam_async = createAsyncThunk<ExamData, string>(
  'get/get_corret_exam_async',
  async (action, state) => {
    return await getExamByIdRequest(action);
  }
);

export const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    set_subject_active_two: (state, action) => {
      state.active_two = action.payload;
    },
    set_subject_active_topic: (state, action) => {
      state.active_topic = action.payload;
    },
    set_current_two_subject: (state, action) => {
      state.current_two_subject = action.payload;
    },
    set_exam_topic_list: (state, action) => {
      state.exam_topic_list = action.payload;
    },
    set_current_exam_topic_id: (state, action) => {
      state.current_exam_topic_id = action.payload;
    },
    set_exam_answer: (state, action) => {
      state.exam_topic_list.forEach((item: any) => {
        if (item._id === action.payload._id) {
          item.answer = action.payload.answer;
        }
      });
    },
    set_exam_corret: (state, action) => {
      state.exam_topic_list.forEach((item: any) => {
        if (item._id === action.payload._id) {
          item.is_corret = action.payload.is_corret;
          item.pass = action.payload.pass;
          item.comment = action.payload.comment;
        }
      });
    },
    set_exam_list_data: (state, action) => {
      state.exam_list_data = {
        ...state.exam_list_data,
        ...action.payload,
      };
    },
  },
  extraReducers: builder => {
    builder
      // 获取课程列表fulfilled
      .addCase(get_subject_tree_async.fulfilled, (state, res) => {
        state.subject_tree = res.payload;
        // state.active_two = (res.payload?.[0]?.children?.[0] as LessonType) || null
      })
      // 获取题目列表pending
      .addCase(get_topic_two_list.pending, state => {
        state.loading = true;
      })
      // 获取题目列表fulfilled
      .addCase(get_topic_two_list.fulfilled, (state, res) => {
        state.topic_two_list = res.payload;
        state.loading = false;
      })
      .addCase(get_exam_async.fulfilled, (state, res: any) => {
        state.exam_topic_list = res.payload;
        state.current_exam_topic_id = res.payload[0]._id;
      })
      .addCase(get_exam_history.pending, (state, res: any) => {
        state.corret_exam_list_loading = true;
      })
      .addCase(get_exam_history.fulfilled, (state, res: any) => {
        // state.exam_list = res.payload.data
        state.exam_list_data.list = res.payload.data;
        state.exam_list_data.count = res.payload.count;
        state.corret_exam_list_loading = false;
      })
      .addCase(get_corret_exam_async.fulfilled, (state, res: any) => {
        state.exam_topic_list = res.payload.topic_list;

        // 这个逻辑对于阅读试卷是多余的
        state.current_exam_topic_id = res.payload.topic_list[0]._id;
      })
      .addCase(get_subject_one.fulfilled, (state, res: any) => {
        state.subject_one = res.payload;
      });
  },
});

// 获取loading状态
export const select_subject_loading = (state: RootState) => {
  return state.subject.loading;
};

// 获取课程树形数据
export const select_subject_tree = (state: RootState) => {
  return state.subject.subject_tree;
};

// 获取当前选择课程
export const select_active_two = (state: RootState) => {
  return state.subject.active_two;
};

// 获取题目列表
export const select_topic_two_list = (state: RootState) => {
  return state.subject.topic_two_list;
};

// 获取当前选择题目
export const select_active_topic = (state: RootState) => {
  return state.subject.active_topic;
};

export const select_current_two_subject = (state: RootState) => {
  return state.subject.current_two_subject;
};

export const select_exam_topic_list = (state: RootState) => {
  return state.subject.exam_topic_list;
};

export const select_corret_exam_list_loading = (state: RootState) => {
  return state.subject.corret_exam_list_loading;
};

// 注意这里
export const select_current_exam_topic = (state: RootState) => {
  return (
    state.subject.exam_topic_list.find((item: any) => {
      return item._id === state.subject.current_exam_topic_id;
    }) || {}
  );
};
// 获取考试历史数据
export const select_exam_history_data = (state: RootState) => {
  return state.subject.exam_list_data;
};
// 获取一级科目
export const select_subject_one = (state: RootState) => {
  return state.subject.subject_one;
};

export const {
  set_subject_active_two,
  set_subject_active_topic,
  set_current_two_subject,
  set_exam_topic_list,
  set_current_exam_topic_id,
  set_exam_answer,
  set_exam_corret,
  set_exam_list_data,
} = subjectSlice.actions;

export default subjectSlice.reducer;
