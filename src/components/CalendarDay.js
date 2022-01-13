import styles from "./CalendarDay.module.css";
import workoutsStore from "../workouts";
import { useSelector } from "react-redux";

const CalendarDay = (props) => {
  const today = new Date();
  const date = new Date(props.dateUTC);

  let classList = ["calendar-day"];

  if (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  ) {
    classList.push("today");
  }

  const workouts = useSelector((state) => {
    return state.data.workoutPlannerRefs.map((workout) =>
      workoutsStore.get(workout)
    );
  });
  const workoutLabels = workouts
    .map((w) => w.checkDate(date))
    .filter((w) => w)
    .reduce((p, c) => [...p, c], []);

  classList = classList.map((cl) => styles[cl]).join(" ");
  return (
    <td key={props.dayIndex} className={classList}>
      <h3>{date.getDate()}</h3>
      <ul>
        {workoutLabels.map((label, index) => {
          return <li key={index}>{label}</li>;
        })}
      </ul>
    </td>
  );
};

export default CalendarDay;
