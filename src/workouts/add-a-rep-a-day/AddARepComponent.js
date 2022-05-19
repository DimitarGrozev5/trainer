import styles from "./AddARepComponent.module.css";
import useAddRep from "./useAddRep";
import useExit from "./useExit";

const AddARepComponent = ({ workout }) => {
  const { nextTarget, repsDoneToday } = workout.data;

  const addRep = useAddRep(workout);
  const addOneRepHandler = () => {
    addRep(repsDoneToday + 1);
  };

  // Set up exit handling
  const exit = useExit(workout);

  const exitHandler = () => {
    exit(repsDoneToday);
  };

  return (
    <div className={styles.container}>
      <div>{repsDoneToday} reps done today</div>
      <div>
        You have to do {nextTarget - repsDoneToday} more reps of pushups and
        lunges today.
      </div>
      <div>
        If you don't achieve all of the reps, tomorow will start from what you
        manged to do today plus one rep
      </div>
      <div>
        You can close the app at anytime and the progress for the day will be
        saved.
      </div>
      <div className={styles.exit}>
        <button onClick={addOneRepHandler}>Add one rep</button>
      </div>
      <div className={styles.exit}>
        <button onClick={exitHandler}>I am done</button>
      </div>
    </div>
  );
};

export default AddARepComponent;
