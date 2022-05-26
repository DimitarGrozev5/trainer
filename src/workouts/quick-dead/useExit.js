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

  return ([currentVolume, currentRepSheme]) => {
    // If the workout is satisfactoraly done, save and exit
    alert("The workout is done! Saving and exiting...");
    const dataToDispatch = {
      id: targetWorkout.id,
      handle: targetWorkout.handle,
      data: workoutsStore
        .get(targetWorkout.handle)
        .getNextWorkoutTargetData([currentVolume, currentRepSheme]),
    };

    dispatch(updateWorkoutThunk(dataToDispatch, auth));
    navigate("/trainer", { replace: true });
  };
};

export default useExit;
