import { useNavigate, useParams } from "react-router-dom";
import workoutsStore from "../workouts";

const DoWorkout = () => {
  const params = useParams();
  const navigate = useNavigate();

  const targetWorkout = workoutsStore.get(params.workout);

  const backHandler = () => {
    const result = window.confirm("Are you sure you want to exit");
    if (result) {
      navigate("../trainer", { replace: true });
    }
  };

  const saveHandler = () => {};

  return (
    <div>
      <header>
        <nav>
          <button onClick={backHandler}>Back</button>
          <button onClick={saveHandler}>Save & Exit</button>
        </nav>
        <h2>
          {targetWorkout ? targetWorkout.getFullName() : "Workout not found"}
        </h2>
      </header>
      {targetWorkout && <targetWorkout.Component />}
    </div>
  );
};

export default DoWorkout;
