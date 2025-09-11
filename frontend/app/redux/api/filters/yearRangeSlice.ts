// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface YearRangeState {
//   startYear: number | null;
//   endYear: number | null;
// }

// const initialState: YearRangeState = {
//   startYear: null,
//   endYear: null,
// };

// const yearRangeSlice = createSlice({
//   name: "yearRange",
//   initialState,
//   reducers: {
//     setYearRange: (state, action: PayloadAction<{ startYear: number | null; endYear: number | null }>) => {
//       state.startYear = action.payload.startYear;
//       state.endYear = action.payload.endYear;
//     },
//     clearYearRange: (state) => {
//       state.startYear = null;
//       state.endYear = null;
//     },
//   },
// });

// export const { setYearRange, clearYearRange } = yearRangeSlice.actions;
// export default yearRangeSlice.reducer;


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface YearRangeState {
  startYear: string | null; // ISO string
  endYear: string | null;   // ISO string
}

const initialState: YearRangeState = {
  startYear: null,
  endYear: null,
};

const yearRangeSlice = createSlice({
  name: "yearRange",
  initialState,
  reducers: {
    setYearRange: (
      state,
      action: PayloadAction<{ startYear: string | null; endYear: string | null }>
    ) => {
      state.startYear = action.payload.startYear;
      state.endYear = action.payload.endYear;
    },
    clearYearRange: (state) => {
      state.startYear = null;
      state.endYear = null;
    },
  },
});

export const { setYearRange, clearYearRange } = yearRangeSlice.actions;
export default yearRangeSlice.reducer;
