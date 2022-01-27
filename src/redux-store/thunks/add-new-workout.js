import dispatchToServer from "./dispatch-to-server";
import loadWorkoutDataThunk from "./load-workout-data";

const addNewWorkoutThunk =
  (handle, initData, auth, redirect) => (dispatch, getState) => {
    const reduxData = {
      name: handle,
      data: initData,
    };
    // Configure fetch
    dispatchToServer({
      auth: {
        email: auth.email,
        token: auth.token,
      },
      action: "add-new-workout",
      payload: JSON.stringify(reduxData),
    }).then((result) => {
      if (result) {
        dispatch(loadWorkoutDataThunk([{ ...reduxData, id: result.id }]));
        redirect();
      }
    });
  };

export default addNewWorkoutThunk;
