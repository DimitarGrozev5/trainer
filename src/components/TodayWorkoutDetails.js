import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useContext } from "react/cjs/react.development";
import AppContext from "../context-store/app-context";
import { dataActions } from "../redux-store";
import updateWorkoutThunk from "../redux-store/thunks/update-workout";
import styles from "./TodayWorkoutDetails.module.css";

const TodayWorkoutDetails = (props) => {
  const update = useSelector((state) => state.data.update);
  const dispatch = useDispatch();
  const ctx = useContext(AppContext);

  const details = props.details;
  const date = props.date;

  const nextWorkout = details.nextWorkout;
  // console.log(nextWorkout)
  // console.log(date)
  const isToday =
    date.getFullYear() === nextWorkout.getFullYear() &&
    date.getMonth() === nextWorkout.getMonth() &&
    date.getDate() === nextWorkout.getDate();

  const navigate = useNavigate();

  const startWorkoutHandler = () => {
    navigate(details.handle, { replace: true });
  };
  const skipWorkoutHandler = () => {
    details.skip();
    dispatch(updateWorkoutThunk(details, ctx.isLogged));
  };

  return (
    <li className={styles["workout-details"]}>
      <h4 className={styles["workout-details__title"]}>
        {details.getFullName()}
      </h4>
      <p className={styles["workout-details__description"]}>
        {details.getWorkoutDescription(date)}
      </p>
      {isToday && <button onClick={startWorkoutHandler}>Start</button>}
      {isToday && <button onClick={skipWorkoutHandler}>Skip</button>}
    </li>
  );
};

export default TodayWorkoutDetails;
