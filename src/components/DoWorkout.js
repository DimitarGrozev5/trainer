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

  return (
    <div>
      <header>
        <nav>
          <button onClick={backHandler}>Back</button>
          <h2>
            {targetWorkout ? targetWorkout.getFullName() : "Workout not found"}
          </h2>
        </nav>
      </header>
      {targetWorkout && <targetWorkout.Component />}
    </div>
  );
};

export default DoWorkout;
