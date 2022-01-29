import { useSelector } from "react-redux";
import workoutsStore from "../../workouts";
import styles from "./Today.module.css";
import TodayWorkoutDetails from "./TodayWorkoutDetails";

const leadingZeroes = (n) => (n + 10000).toString().substring(3);

const Today = (props) => {
  const targetDate = props.targetDate;

  const dateString =
    leadingZeroes(targetDate.getDate()) +
    "." +
    leadingZeroes(targetDate.getMonth() + 1) +
    "." +
    targetDate.getFullYear();

  // Getting all of the workouts for the day
  const workouts = useSelector((state) =>
    state.data.workoutPlannerRefs.filter((w) => w.used)
  );
  const todaysWorkouts = workouts.filter((w) =>
    workoutsStore.get(w.handle).checkDate(w.data, targetDate)
  );

  return (
    <div className={styles.today}>
      <h3>{dateString}</h3>
      <ul>
        {todaysWorkouts.map((w, index) => {
          return (
            <TodayWorkoutDetails key={index} workout={w} date={targetDate} />
          );
        })}
      </ul>
    </div>
  );
};

export default Today;
