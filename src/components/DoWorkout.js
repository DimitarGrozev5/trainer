import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import workoutsStore from "../workouts";

const DoWorkout = () => {
  const params = useParams();
  const navigate = useNavigate();

  const targetWorkout = useSelector((state) =>
    state.data.workoutPlannerRefs.find((w) => w.handle === params.workout)
  );

  const backHandler = () => {
    const result = window.confirm("Are you sure you want to exit");
    if (result) {
      navigate("../trainer", { replace: true });
    }
  };

  // const saveHandler = () => {};

  const Component = workoutsStore.get(targetWorkout.handle).Component;

  return (
    <div>
      <header>
        <nav>
          <button onClick={backHandler}>Back</button>
          {/* <button onClick={saveHandler}>Save & Exit</button> */}
        </nav>
        <h2>{targetWorkout ? targetWorkout.fullName : "Workout not found"}</h2>
      </header>
      {targetWorkout && <Component workout={targetWorkout} />}
    </div>
  );
};

export default DoWorkout;
