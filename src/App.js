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
import AddWorkout from "./components/AddWorkout";
import fetchDataFromDB from "./redux-store/thunks/fetchDataFromDB";

function App() {
  const ctx = useContext(AppContext);

  const isLogged = ctx.isLogged;

  // Effect that loads data from the server and updat it to the store
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDataFromDB(isLogged));
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
          <Route path="trainer/add-workout" element={<AddWorkout />} />
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
