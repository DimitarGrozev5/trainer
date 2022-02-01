import { dataActions } from "..";
import workoutsStore from "../../workouts";
import dispatchToServer from "./dispatch-to-server";
import loadWorkoutDataThunk from "./load-workout-data";

const updateWorkoutThunk = (targetWorkout, auth) => (dispatch, getState) => {
  const data = {
    id: targetWorkout.id,
    name: targetWorkout.handle,
    data: JSON.stringify(targetWorkout.data),
  };

  dispatchToServer({
    auth: {
      email: auth.email,
      token: auth.token,
    },
    action: "update-workout",
    payload: JSON.stringify(data),
  }).then((result) => {
    if (result) {
      dispatch(
        dataActions.addWorkouts([
          {
            ...data,
            data: targetWorkout.data,
          },
        ])
      );
    }
  });
};

export default updateWorkoutThunk;
