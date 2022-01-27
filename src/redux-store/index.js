import { configureStore, createSlice, current } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    workoutPlannerRefs: [
      { handle: "etk-press-ladder", used: false, update: 0 },
      { handle: "hiking-with-weight", used: false, update: 0 },
    ],
    hystory: [],
    update: 0,
  },
  reducers: {
    addWorkouts(state, action) {
      const usedWorkouts = action.payload.reduxData;
      state.workoutPlannerRefs = state.workoutPlannerRefs.map((w) => {
        const workout = usedWorkouts.find((e) => e.name === w.handle);
        if (workout) {
          return {
            ...w,
            used: true,
            update: w.update + 1,
            id: workout.id,
          };
        }
        return w;
      });
      state.update += 1;
    },
    removeWorkout(state, action) {
      const id = action.payload;
      state.workoutPlannerRefs.find((w) => w.id === id).used = false;
    },
    update(state) {
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
