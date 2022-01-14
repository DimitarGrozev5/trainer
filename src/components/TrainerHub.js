import React from "react";
import { useState } from "react/cjs/react.development";
import Calendar from "./Calendar";
import Today from "./Today";
import styles from "./TrainerHub.module.css";

const TrainerHub = () => {
  const todayFullDate = new Date();
  const today = new Date(
    todayFullDate.getFullYear(),
    todayFullDate.getMonth(),
    todayFullDate.getDate()
  );
  const [activeDate, setActiveDate] = useState(today);
  const [markedDate, setMarkedDate] = useState(today);

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

  const selectDateHandler = (date) => () => {
    setMarkedDate(date);
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
          markedDate={markedDate}
          onSelectDate={selectDateHandler}
        />
        <Today targetDate={markedDate} />
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
