import { useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import workoutsStore from "..";
import AppContext from "../../context-store/app-context";
import updateWorkoutThunk from "../../redux-store/thunks/update-workout";

const useExit = (ladders, minSets, minRungs, targetWorkout) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useContext(AppContext).isLogged;

  return () => {
    // Get only the completed ladders
    const achievedLadders = ladders
      .map((ladder) => ladder.filter((rung) => rung.executed))
      .filter((ladder) => ladder.length);

    // If the ladders are less than the minimum requirement, prompt exit
    if (achievedLadders.length < minSets) {
      const result = window.confirm(
        "The workout is not complete! Are you sure you want to exit?"
      );
      if (result) {
        navigate("../trainer", { replace: true });
      }
    } else {
      // If the last started ladder is not completed, prompt exit
      if (achievedLadders[achievedLadders.length - 1].length < minRungs) {
        const result = window.confirm(
          "The last ladder is not complete! Are you sure you want to exit?"
        );
        if (result) {
          navigate("../trainer", { replace: true });
        }
      }
      // If the workout is satisfactoraly done, save and exit
      else {
        alert("The workout is done! Saving and exiting...");

        // Construct the data property
        const nextData = {
          name: targetWorkout.handle,
          data: workoutsStore
            .get(targetWorkout.handle)
            .getNextWorkoutTargetData(targetWorkout.data, achievedLadders),
        };

        const dataToDispatch = {
          id: targetWorkout.id,
          data: nextData,
        };

        dispatch(updateWorkoutThunk(dataToDispatch, auth));
      }
    }
  };
};

export default useExit;
