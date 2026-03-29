import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import farmReducer from '../features/farmSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    farm: farmReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;