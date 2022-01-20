import { configureStore, createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    workoutPlannerRefs: [],
    hystory: [],
    update: 0,
  },
  reducers: {
    addWorkouts(state, action) {
      state.workoutPlannerRefs.push(...action.payload.reduxData);
      state.update += 1;
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
