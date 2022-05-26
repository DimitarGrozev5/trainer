import { configureStore, createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    workoutPlannerRefs: [
      {
        handle: "etk-press-ladder",
        shortName: "ETK Press",
        fullName: "ETK Press Ladder Protocol",
        used: false,
      },
      // {
      //   handle: "hiking-with-weight",
      //   shortName: "Hiking",
      //   fullName: "Hiking with weight",
      //   used: false,
      // },
      {
        handle: "slow-twitch-hell",
        shortName: "Enduro Grip",
        fullName: "Grip Slow Twitch Endurance",
        used: false,
      },
      {
        handle: "add-a-rep",
        shortName: "rfJ",
        fullName: "AddA RepA Day",
        used: false,
      },
      {
        handle: "qd",
        shortName: "Q&D",
        fullName: "Quick & Dead",
        used: false,
      },
    ],
    hystory: [],
    update: 0,
  },
  reducers: {
    addWorkouts(state, action) {
      const usedWorkouts = action.payload;
      // console.log(usedWorkouts)
      state.workoutPlannerRefs = state.workoutPlannerRefs.map((w) => {
        const workout = usedWorkouts.find((e) => e.name === w.handle);
        if (workout) {
          return {
            ...w,
            used: true,
            id: workout.id,
            data: workout.data,
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
