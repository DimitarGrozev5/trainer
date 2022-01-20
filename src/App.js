import "./App.css";
import React, { useContext, useEffect } from "react";
import Login from "./components/Login";
import TrainerHub from "./components/TrainerHub";
import AppContext from "./context-store/app-context";
import { Navigate, Route, Routes } from "react-router-dom";
import PageTemplate from "./components/PageTemplate";
import { useDispatch, useSelector } from "react-redux";
import loadWorkoutDataThunk from "./redux-store/thunks/load-workout-data";
import DoWorkout from "./components/DoWorkout";

function App() {
  const ctx = useContext(AppContext);

  const isLogged = ctx.isLogged;

  // Effect that loads data from the server and updat it to the store
  const dispatch = useDispatch();
  useEffect(() => {
    // const DUMMY_WORKOUTS = [
    //   {
    //     name: "etk-press-ladder",
    //     data: {
    //       nextWorkoutDate: new Date(2022, 0, 20),
    //       nextWorkoutType: 2,
    //       nextTarget: 5,
    //       lastAchieved: [5, 4, 4, 4, 4],
    //     },
    //   },
    //   {
    //     name: "hiking-with-weight",
    //     data: {
    //       nextWorkoutDate: new Date(2022, 0, 16),
    //       nextWorkout: 1,
    //     },
    //   },
    // ];
    // dispatch(loadWorkoutDataThunk(DUMMY_WORKOUTS));
    fetch("http://127.0.0.1/trainer-api/trainer-api/get-data.php", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        email: isLogged.email,
        token: isLogged.token,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        // res
        //   .clone()
        //   .text()
        //   .then((t) => console.log(t));
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(data);
          });
        }
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        } else {
          return data;
        }
      })
      .then((parsedJSON) => {
        const fullyParsedData = parsedJSON.data
          .map((field) => JSON.parse(field[0]))
          .map((workout) => {
            workout.data = {
              ...workout.data,
              nextWorkoutDate: new Date(workout.data.nextWorkoutDate),
            };
            return workout;
          });
        dispatch(loadWorkoutDataThunk(fullyParsedData));
      })
      .catch((err) => {
        alert(err);
      });
    const DUMMY_HYSTORY = [];
  }, [dispatch]);

  const state = useSelector((state) => state.data);

  return (
    <Routes>
      {isLogged && (
        <Route path="/" element={<PageTemplate />}>
          <Route index element={<Navigate to="trainer" />} />
          <Route path="login" element={<Navigate to="/" />} />
          <Route path="trainer" element={<TrainerHub />}></Route>
          <Route path="trainer/:workout" element={<DoWorkout />} />
          <Route path="*" element={<Navigate to="trainer" />} />
        </Route>
      )}
      {!isLogged && (
        <Route path="/" element={<PageTemplate />}>
          <Route index element={<Navigate to="login" />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
