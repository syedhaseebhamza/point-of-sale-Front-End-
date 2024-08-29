import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createNewUser, getAllSubUser } from "./adminApi";

interface userData {
  username: string | null;
  password: string | null;
  role: string | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
  message: string | null;
}

const initialState: userData = {
  username: null,
  password: null,
  role: null,
  status: "idle",
  error: null,
  message: null,
};

export const createUser = createAsyncThunk<
  userData,
  { username: string; password: string; role: string }
>(
  "admin/createUser",
  async (data: { username: string; password: string; role: string }) => {
    try {
      const response = await createNewUser(data);

      return response;
    } catch (error) {
      throw new Error("Failed to create new user");
    }
  }
);

const newUserSlice = createSlice({
  name: "createNewUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createUser.fulfilled,
        (state, action: PayloadAction<userData>) => {
          state.status = "idle";
          state.username = action.payload.username;
          state.password = action.payload.password;
          state.role = action.payload.role;
          state.message = action.payload.message;
        }
      )
      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create user";
      });
  },
});

export default newUserSlice.reducer;
