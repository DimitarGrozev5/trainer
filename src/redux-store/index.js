import { configureStore, createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    workoutPlannerRefs: [],
    hystory: [],
  },
  reducers: {
    addWorkouts(state, action) {
      state.workoutPlannerRefs.push(...action.payload.reduxData);
    },
  },
});

export const dataActions = dataSlice.actions;

const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
  },
});

export default store;
