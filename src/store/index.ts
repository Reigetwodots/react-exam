import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { subjectSlice } from './slice/subject';

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const store = configureStore({
  reducer: {
    subject: subjectSlice.reducer,
  },
});
