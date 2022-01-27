import dispatchToServer from "./dispatch-to-server";
import loadWorkoutDataThunk from "./load-workout-data";

const updateWorkoutThunk = (targetWorkout, auth) => (dispatch, getState) => {
  const data = {
    id: targetWorkout.id,
    data: JSON.stringify({
      name: targetWorkout.handle,
      data: { ...targetWorkout.currentData() },
    }),
  };

  dispatchToServer(
    {
      auth: {
        email: auth.email,
        token: auth.token,
      },
      action: "update-workout",
      payload: JSON.stringify(data),
    }
  ).then((result) => {
    if (result) {
      dispatch(
        loadWorkoutDataThunk([
          {
            name: targetWorkout.handle,
            data: targetWorkout.currentData(),
            id: targetWorkout.id,
          },
        ])
      );
    }
  });
};

export default updateWorkoutThunk;
