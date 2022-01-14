import { useSelector } from "react-redux";
import workoutsStore from "../workouts";
import styles from "./Today.module.css";
import TodayWorkoutDetails from "./TodayWorkoutDetails";

const leadingZeroes = (n) => (n + 10000).toString().substring(3);

const Today = (props) => {
  const date = props.targetDate;

  const dateString =
    leadingZeroes(date.getDate()) +
    "." +
    leadingZeroes(date.getMonth() + 1) +
    "." +
    date.getFullYear();

  // Getting all of the workouts for the day
  const workouts = useSelector((state) => {
    return state.data.workoutPlannerRefs.map((workout) =>
      workoutsStore.get(workout)
    );
  });
  const todaysWorkouts = workouts.filter((w) => w.checkDate(date));

  return (
    <div className={styles.today}>
      <h3>{dateString}</h3>
      <ul>
        {todaysWorkouts.map((w, index) => {
          return <TodayWorkoutDetails key={index} details={w} date={date} />;
        })}
      </ul>
    </div>
  );
};

export default Today;
