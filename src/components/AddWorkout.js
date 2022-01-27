import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react/cjs/react.development";
import addNewWorkoutThunk from "../redux-store/thunks/add-new-workout";
import workoutsStore from "../workouts";
import AppContext from "../context-store/app-context";
import { useNavigate } from "react-router-dom";
import removeWorkoutThunk from "../redux-store/thunks/remove-workout";

const AddWorkout = () => {
  const dispatch = useDispatch();

  const ctx = useContext(AppContext);
  const auth = ctx.isLogged;

  const navigate = useNavigate();
  const redirect = () => navigate("/trainer", { replace: true });

  // Select workouts from store
  const workouts = useSelector((state) =>
    state.data.workoutPlannerRefs.map((w) => {
      return {
        ...w,
        details: workoutsStore.get(w.handle),
      };
    })
  );

  // Set up modals HTML
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false);
  const closeAddModalHandler = () => setShowAddWorkoutModal(false);
  const addWorkoutHandler = () => {
    const handle = showAddWorkoutModal;
    // Get initial data from the workoutsStore
    const initData = workoutsStore.get(handle).initialData;

    // Dispatch action creator to send the new workout to the server
    dispatch(addNewWorkoutThunk(handle, initData, auth, redirect));
  };
  const addWorkoutModal = (
    <div>
      <h1>Are you sure you want to start doing the workout?</h1>
      <button onClick={addWorkoutHandler}>Yes</button>
      <button onClick={closeAddModalHandler}>Cancel</button>
    </div>
  );

  const [showRemoveWorkoutModal, setShowRemoveWorkoutModal] = useState(false);
  const closeRemoveModalHandler = () => setShowRemoveWorkoutModal(false);
  const removeWorkoutHandler = () => {
    const id = showRemoveWorkoutModal;

    // Dispatch action creator to send the new workout to the server
    dispatch(removeWorkoutThunk(id, auth, redirect));
  };
  const removeWorkoutModal = (
    <div>
      <h1>Are you sure you want to remove the workout?</h1>
      <h1>(Workout history will still be available)</h1>
      <button onClick={removeWorkoutHandler}>Yes</button>
      <button onClick={closeRemoveModalHandler}>Cancel</button>
    </div>
  );

  const addWorkout = (handle) => () => {
    setShowAddWorkoutModal(handle);
  };
  const removeWorkout = (id) => () => {
    setShowRemoveWorkoutModal(id);
  };

  const usedOrNoHandler = (used, handle, id) => {
    return used ? removeWorkout(id) : addWorkout(handle);
  };

  return (
    <div>
      {showAddWorkoutModal && addWorkoutModal}
      {showRemoveWorkoutModal && removeWorkoutModal}
      <ul>
        {workouts.map((w) => {
          return (
            <li key={w.handle}>
              {w.details.getFullName()}
              <button onClick={usedOrNoHandler(w.used, w.handle, w.id)}>
                {w.used ? "Remove" : "Add"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AddWorkout;
