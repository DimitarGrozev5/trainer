import React,{ useState } from "react";
import { Link } from "react-router-dom";
import Calendar from "./calendar/Calendar";
import Today from "./today/Today";
import styles from "./TrainerHub.module.css";

const TrainerHub = () => {
  // Set up the today date
  const todayFullDate = new Date();
  const today = new Date(
    todayFullDate.getFullYear(),
    todayFullDate.getMonth(),
    todayFullDate.getDate()
  );

  // Set up component state
  const [activeDate, setActiveDate] = useState(today);
  const [markedDate, setMarkedDate] = useState(today);

  // Get previous, current and next month names
  const monthName = activeDate.toLocaleString("default", { month: "long" });
  const prevMonthName = new Date(
    +activeDate - (activeDate.getDate() + 3) * 24 * 60 * 60 * 1000
  ).toLocaleString("default", { month: "long" });
  const nextMonthName = new Date(
    +activeDate + (30.5 - activeDate.getDate() + 3) * 24 * 60 * 60 * 1000
  ).toLocaleString("default", { month: "long" });

  // Set up event handlers for updating component state
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
      <div className={styles.add}>
        <Link to="/trainer/trainer/add-workout">+</Link>
      </div>
    </main>
  );
};

export default TrainerHub;
