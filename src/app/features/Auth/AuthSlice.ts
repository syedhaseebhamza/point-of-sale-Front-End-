import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser } from "./authApi";

interface AuthState {
  user: {
    id: string;
    username: string;
  } | null;
  token: string | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk<
  AuthState,
  { username: string; password: string }
>("auth/login", async (credentials: { username: string; password: string }) => {
  const responce = await loginUser(credentials);
  console.log("API Response:", responce);
  return responce;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthState>) => {
        state.status = "idle";
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Login Faild";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
