import React from "react";
import { useState } from "react/cjs/react.development";
import Calendar from "./Calendar";
import styles from "./TrainerHub.module.css";

const TrainerHub = () => {
  const [activeDate, setActiveDate] = useState(new Date());

  const monthName = activeDate.toLocaleString("default", { month: "long" });
  const prevMonthName = new Date(
    +activeDate - (activeDate.getDate() + 3) * 24 * 60 * 60 * 1000
  ).toLocaleString("default", { month: "long" });
  const nextMonthName = new Date(
    +activeDate + (30.5 - activeDate.getDate() + 3) * 24 * 60 * 60 * 1000
  ).toLocaleString("default", { month: "long" });

  const changeMonthBackHandler = () => {
    setActiveDate((prevDate) => {
      return new Date(
        +prevDate - (prevDate.getDate() + 3) * 24 * 60 * 60 * 1000
      );
    });
  };

  const changeMonthForewardHandler = () => {
    setActiveDate((prevDate) => {
      return new Date(
        +prevDate + (30.5 - prevDate.getDate() + 3) * 24 * 60 * 60 * 1000
      );
    });
  };


  return (
    <main className={styles.main}>
      <div
        className={`${styles["side-month"]} ${styles["prev-month"]}`}
        onClick={changeMonthBackHandler}
      >
        {prevMonthName}
      </div>
      <div className={`${styles["curr-month"]}`}>
        <h2>{monthName}</h2>
        <Calendar
          forMonth={activeDate.getMonth()}
          forYear={activeDate.getFullYear()}
        />
      </div>
      <div
        className={`${styles["side-month"]} ${styles["next-month"]}`}
        onClick={changeMonthForewardHandler}
      >
        {nextMonthName}
      </div>
    </main>
  );
};

export default TrainerHub;
