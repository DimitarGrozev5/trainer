import { useDispatch, useSelector } from "react-redux";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../context-store/app-context";
import { dataActions } from "../../redux-store";
import updateWorkoutThunk from "../../redux-store/thunks/update-workout";
import workoutsStore from "../../workouts";
import styles from "./TodayWorkoutDetails.module.css";

const TodayWorkoutDetails = (props) => {
  //const update = useSelector((state) => state.data.update);
  const dispatch = useDispatch();
  const ctx = useContext(AppContext);

  const workoutData = props.workout.data;
  const date = props.date;

  const workoutFunctions = workoutsStore.get(props.workout.handle);

  const nextWorkoutDate = new Date(workoutData.nextWorkoutDate);
  // console.log(nextWorkout)
  // console.log(date)
  const isToday =
    date.getFullYear() === nextWorkoutDate.getFullYear() &&
    date.getMonth() === nextWorkoutDate.getMonth() &&
    date.getDate() === nextWorkoutDate.getDate();

  const navigate = useNavigate();

  const startWorkoutHandler = () => {
    navigate(props.workout.handle, { replace: true });
  };
  const skipWorkoutHandler = () => {
    const skipedData = workoutFunctions.skip(props.workout.data);
    dispatch(
      updateWorkoutThunk({ ...props.workout, data: skipedData }, ctx.isLogged)
    );
  };

  return (
    <li className={styles["workout-details"]}>
      <h4 className={styles["workout-details__title"]}>
        {workoutData.fullName}
      </h4>
      <p className={styles["workout-details__description"]}>
        {workoutFunctions.getWorkoutDescription(workoutData, date)}
      </p>
      {isToday && <button onClick={startWorkoutHandler}>Start</button>}
      {isToday && <button onClick={skipWorkoutHandler}>Skip</button>}
    </li>
  );
};

export default TodayWorkoutDetails;
