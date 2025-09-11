import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  states: [],
};

const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    setStates: (state, action) => {
      state.states = action.payload;
    },
  },
});

export const { setStates } = stateSlice.actions;
export default stateSlice.reducer;
