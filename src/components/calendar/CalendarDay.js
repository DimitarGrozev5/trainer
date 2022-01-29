import styles from "./CalendarDay.module.css";
import workoutsStore from "../../workouts";
import { useSelector } from "react-redux";

const CalendarDay = (props) => {
  // Selector that triggers a rerender, when the workout data updates
  const update = useSelector((state) => state.data.update);

  const today = new Date();
  const date = new Date(props.dateUTC);

  let classList = ["calendar-day"];

  // Mark today
  if (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  ) {
    classList.push("today");
  }
  // Mark marked date
  if (
    date.getFullYear() === props.markedDate.getFullYear() &&
    date.getMonth() === props.markedDate.getMonth() &&
    date.getDate() === props.markedDate.getDate()
  ) {
    classList.push("marked");
  }

  classList = classList.map((cl) => styles[cl]).join(" ");

  // Get workouts and labels
  const workouts = useSelector((state) => {
    return state.data.workoutPlannerRefs.filter((w) => w.used);
  });
  const workoutLabels = workouts
    .filter((w) => {
      return workoutsStore.get(w.handle).checkDate(w.data, date);
    })
    .map((w) => w.shortName);

  const filteredWorkoutLabels =
    workoutLabels.length > 2 ? [...workoutLabels, "..."] : workoutLabels;

  return (
    <td
      key={props.dayIndex}
      className={classList}
      onClick={props.onSelectDate(date)}
    >
      <h3>{date.getDate()}</h3>
      <ul>
        {filteredWorkoutLabels.map((label, index) => {
          return <li key={index}>{label}</li>;
        })}
      </ul>
    </td>
  );
};

export default CalendarDay;
