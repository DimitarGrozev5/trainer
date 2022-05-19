import { useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import workoutsStore from "..";
import AppContext from "../../context-store/app-context";
import updateWorkoutThunk from "../../redux-store/thunks/update-workout";

const useExit = (targetWorkout) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useContext(AppContext).isLogged;

  return (repsDoneToday) => {
    const target = targetWorkout.data.nextTarget;
    // If the sets are less than the minimum requirement, prompt exit
    if (repsDoneToday < target) {
      const result = window.confirm(
        "The reps are not complete! Are you sure you want to end it for today and exit?"
      );
      if (!result) {
        return;
      }
    }
    // If the workout is satisfactoraly done, save and exit
    alert("The workout is done! Saving and exiting...");
    const dataToDispatch = {
      id: targetWorkout.id,
      handle: targetWorkout.handle,
      data: workoutsStore
        .get(targetWorkout.handle)
        .getNextWorkoutTargetData(targetWorkout.data, repsDoneToday),
    };

    dispatch(updateWorkoutThunk(dataToDispatch, auth));
    navigate("/trainer", { replace: true });
  };
};

export default useExit;
