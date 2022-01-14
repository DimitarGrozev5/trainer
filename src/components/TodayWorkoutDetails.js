import styles from "./TodayWorkoutDetails.module.css";

const TodayWorkoutDetails = (props) => {
  const details = props.details;
  const date = props.date;
  return (
    <li className={styles["workout-details"]}>
      <h4 className={styles["workout-details__title"]}>{details.getFullName()}</h4>
      <p className={styles["workout-details__description"]}>{details.getWorkoutDescription(date)}</p>
    </li>
  );
};

export default TodayWorkoutDetails;
