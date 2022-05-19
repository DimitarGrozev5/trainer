import { useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import workoutsStore from "..";
import AppContext from "../../context-store/app-context";
import updateWorkoutThunk from "../../redux-store/thunks/update-workout";

const useAddRep = (targetWorkout) => {
  const dispatch = useDispatch();
  const auth = useContext(AppContext).isLogged;

  return (repsDoneToday) => {
    const dataToDispatch = {
      id: targetWorkout.id,
      handle: targetWorkout.handle,
      data: workoutsStore
        .get(targetWorkout.handle)
        .getDataToUpdateReps(targetWorkout.data, repsDoneToday),
    };

    dispatch(updateWorkoutThunk(dataToDispatch, auth));
  };
};

export default useAddRep;
