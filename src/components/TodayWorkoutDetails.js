import { useNavigate } from "react-router-dom";
import styles from "./TodayWorkoutDetails.module.css";

const TodayWorkoutDetails = (props) => {
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

  return (
    <li className={styles["workout-details"]}>
      <h4 className={styles["workout-details__title"]}>
        {details.getFullName()}
      </h4>
      <p className={styles["workout-details__description"]}>
        {details.getWorkoutDescription(date)}
      </p>
      {isToday && <button onClick={startWorkoutHandler}>Start</button>}
    </li>
  );
};

export default TodayWorkoutDetails;
