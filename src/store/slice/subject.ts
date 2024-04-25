import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AxiosRes } from '../../util/http';
import { RootState } from '../index';

const initialState = {
  subject_tree: [], // 课程树
  active_two: {
    title: '', // 二级标题
    value: '', // 二级标题id
  }, // 当前选中的二级标题
};

export const getSubjectTreeAsync = createAsyncThunk('get/subject_tree', async (action, state) => {
  const res: AxiosRes = await axios.get('/api/subject');
  return res.data.data;
});

export const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    setSubjectActiveTwo: (state, action) => {
      state.active_two = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getSubjectTreeAsync.fulfilled, (state, res) => {
      state.subject_tree = res.payload;
    });
  },
});

export const selectSubjectTree = (state: RootState) => {
  return state.subject.subject_tree;
};

export const selectSubjectActiveTwo = (state: RootState) => {
  return state.subject.active_two;
};

export const { setSubjectActiveTwo } = subjectSlice.actions;

export default subjectSlice.reducer;
