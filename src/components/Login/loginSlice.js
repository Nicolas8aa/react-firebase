import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  uid: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState: initialValue,
  reducers: {
    login(state, action) {
      state.uid = action.payload.uid;
    },
  },
});

export const { login } = loginSlice.actions;
export default loginSlice.reducer;
