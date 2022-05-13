import { dataActions } from "..";

const loadWorkoutDataThunk = (data) => (dispatch, getState) => {
  // Initialize workouts
  // data.forEach(({ name, data }) => {
  //   workoutsStore.get(name).init(data);
  // });
  const reduxData = data;
  dispatch(dataActions.addWorkouts({ reduxData }));
};

export default loadWorkoutDataThunk;
