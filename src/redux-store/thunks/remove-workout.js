import { dataActions } from "..";
import dispatchToServer from "./dispatch-to-server";

const removeWorkoutThunk =
  (targetId, auth, redirect) => (dispatch, getState) => {
    dispatchToServer(
      {
        auth: {
          email: auth.email,
          token: auth.token,
        },
        action: "remove-workout",
        payload: targetId,
      },
      true
    ).then((result) => {
      if (result) {
        dispatch(dataActions.removeWorkout(targetId));
        redirect();
      }
    });
  };

export default removeWorkoutThunk;
