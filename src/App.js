import "./App.css";
import React, { useContext, useEffect } from "react";
import Login from "./components/Login";
import TrainerHub from "./components/TrainerHub";
import AppContext from "./context-store/app-context";
import { Navigate, Route, Routes } from "react-router-dom";
import PageTemplate from "./components/PageTemplate";
import { useDispatch } from "react-redux";
import loadWorkoutDataThunk from "./redux-store/thunks/load-workout-data";

function App() {
  const ctx = useContext(AppContext);

  const isLogged = ctx.isLogged;

  // Effect that loads data from the server and updat it to the store
  const dispatch = useDispatch();
  useEffect(() => {
    const DUMMY_WORKOUTS = [
      {
        name: "etk-press-ladder",
        data: {
          nextWorkoutDate: new Date(2022, 0, 13),
          nextWorkout: 2,
        },
      },
      {
        name: "hiking-with-weight",
        data: {
          nextWorkoutDate: new Date(2022, 0, 16),
          nextWorkout: 2,
        },
      },
    ];
    const DUMMY_HYSTORY = [];

    dispatch(loadWorkoutDataThunk(DUMMY_WORKOUTS));
  }, [dispatch]);

  return (
    <Routes>
      {isLogged && (
        <Route path="/" element={<PageTemplate />}>
          <Route index element={<Navigate to="trainer" />} />
          <Route path="login" element={<Navigate to="/" />} />
          <Route path="trainer" element={<TrainerHub />}></Route>
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
