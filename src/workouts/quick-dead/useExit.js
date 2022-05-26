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

  return (achievedSets) => {
    const sets =
      targetWorkout.nextWorkoutType === 1
        ? targetWorkout.nextTarget
        : Math.floor(targetWorkout.nextTarget / 2) - 1;
    // If the sets are less than the minimum requirement, prompt exit
    if (achievedSets < sets) {
      const result = window.confirm(
        "The sets are not complete! Are you sure you want to save and exit?"
      );
      if (result) {
        navigate("../trainer", { replace: true });
      }
    } else {
      // If the workout is satisfactoraly done, save and exit
      alert("The workout is done! Saving and exiting...");
      const dataToDispatch = {
        id: targetWorkout.id,
        handle: targetWorkout.handle,
        data: workoutsStore
          .get(targetWorkout.handle)
          .getNextWorkoutTargetData(targetWorkout.data, achievedSets),
      };

      dispatch(updateWorkoutThunk(dataToDispatch, auth));
      navigate("/trainer", { replace: true });
    }
  };
};

export default useExit;
