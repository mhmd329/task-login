import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://api-yeshtery.dev.meetusvr.com/v1";

// Thunk لتسجيل الدخول
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/yeshtery/token`, {
        email,
        password,
        isEmployee: true,
      });

      const token = response.data.token;
      Cookies.set("token", token, { expires: 7, secure: true });
      return token;
    } catch (error) {
      console.error("خطأ في تسجيل الدخول:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "فشل تسجيل الدخول!");
    }
  }
);

// Thunk لجلب بيانات المستخدم
export const fetchUserInfo = createAsyncThunk(
  "auth/fetchUserInfo",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue("لا يوجد توكن! يرجى تسجيل الدخول.");
    }

    try {
      const response = await axios.get(`${API_URL}/user/info`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("خطأ في جلب بيانات المستخدم:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "فشل جلب بيانات المستخدم!");
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: Cookies.get("token") || null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      Cookies.remove("token");
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
