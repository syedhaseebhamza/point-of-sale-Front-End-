import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "@app/features/counter/counterSlice";
import authReducer from "@app/features/Auth/AuthSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
