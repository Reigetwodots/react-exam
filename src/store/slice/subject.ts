import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AxiosRes } from '../../util/http';
import { RootState } from '../index';


export type SubjectData = {
  title: string;
  value: string;
  children: SubjectData[];
  can_exam: boolean;
};

const initialState = {
  subject_tree: [],
  active_two: {} as SubjectData,
  topic_two_list: [],
};

export const get_subject_tree_async = createAsyncThunk('get/subject_tree', async (action, state) => {
  const res: AxiosRes = await axios.get('/api/subject');
  return res.data.data;
});


export const get_topic_two_list: any = createAsyncThunk('get/topic_two_list', async (action, state) => {
  const res: AxiosRes = await axios.get(`/api/topic/${action}`);
  return res.data.data;
});


export const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    set_active_two: (state, action) => {
      state.active_two = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(get_subject_tree_async.fulfilled, (state, res) => {
        state.subject_tree = res.payload;
      })
      .addCase(get_topic_two_list.fulfilled, (state, res) => {
        state.topic_two_list = res.payload;
      });
  },
});

export const select_subject_tree = (state: RootState) => {
  return state.subject.subject_tree;
};

export const select_active_two = (state: RootState) => {
  return state.subject.active_two;
};

export const select_topic_two_list = (state: RootState) => {
  return state.subject.topic_two_list;
};

export const { set_active_two } = subjectSlice.actions;


export default subjectSlice.reducer;
