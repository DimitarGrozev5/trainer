import produce from "immer";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { useState } from "react/cjs/react.development";
import Timer from "../components/Timer";
import styles from "./EtkComponent.module.css";

const etkPressLadder = () => {
  // Init Data
  let nextWorkoutDate = null;
  let nextWorkoutType = null;
  let nextTarget = null;
  let lastAchieved = null;

  // Workouts
  const workouts = [
    null,
    {
      description: () => {
        let ladder = [];
        for (let i = 1; i <= nextTarget; i++) {
          ladder.push(i);
        }
        ladder = ladder.join(", ");
        return `Try to do 5x (${ladder})`;
      },
    },
    {
      description: () => {
        let ladder = [];
        for (let i = 1; i <= nextTarget - 2; i++) {
          ladder.push(i);
        }
        ladder = ladder.join(", ");
        return `Do 5x (${ladder})`;
      },
    },
    {
      description: () => {
        let ladder = [];
        for (let i = 1; i <= nextTarget - 1; i++) {
          ladder.push(i);
        }
        ladder = ladder.join(", ");
        return `Do 5x (${ladder})`;
      },
    },
  ];

  const WORKOUT_REPEAT = 2 * 24 * 60 * 60 * 1000;
  const name = "ETK";
  const fullName = "ETK Press Ladder Protocol";

  return {
    handle: "etk-press-ladder",
    init: (data) => {
      const nextWorkoutSnaped = data.nextWorkoutDate;
      nextWorkoutSnaped.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      nextWorkoutDate = nextWorkoutSnaped < today ? today : nextWorkoutSnaped;

      nextWorkoutType = data.nextWorkoutType;
      nextTarget = data.nextTarget;
      lastAchieved = data.lastAchieved;
    },
    get nextWorkout() {
      return nextWorkoutDate;
    },
    checkDate: (dateObject) => {
      dateObject.setHours(0, 0, 0, 0);
      if (dateObject < nextWorkoutDate) {
        return false;
      }
      const diff = +dateObject - +nextWorkoutDate;
      if (diff % WORKOUT_REPEAT === 0) {
        return name;
      }
      return false;
    },

    getName: () => name,

    getFullName: () => fullName,

    getWorkoutDescription: function (date) {
      if (!this.checkDate(date)) {
        return "No workout today";
      }
      // Calculate workout number
      date.setHours(0, 0, 0, 0);
      const diff = +date - +nextWorkoutDate;
      const fullCicles = diff / WORKOUT_REPEAT;
      const targetWorkout = ((nextWorkoutType + fullCicles - 1) % 3) + 1;

      return workouts[targetWorkout].description();
    },
    get Component() {
      return EtkComponent(nextTarget, lastAchieved);
    },
  };
};

function EtkComponent(nextTarget, lastAchieved) {
  const Component = () => {
    const timerRef = useRef();
    useSelector((state) => state.workoutPlannerRefs);
    // const nextTarget = nextTarget;
    // const lastAchieved = lastAchieved;
    const laddersArr = [];
    for (let i = 0; i < 5; i++) {
      laddersArr.push([]);
      for (let j = 0; j < nextTarget; j++) {
        laddersArr[i].push({
          val: j + 1,
          executed: false,
          achieved: lastAchieved[i] >= j + 1,
        });
      }
    }
    const [ladders, setLadders] = useState(laddersArr);
    const [nextButton, setNextButton] = useState([[0, 0]]);

    const validateIfButtonIsPressable = (i, j) => {
      return nextButton.reduce((allowed, btn) => {
        return allowed || (btn[0] === i && btn[1] === j);
      }, false);
    };

    const getNextButtonIndex = (i, j) => {
      const result = [];
      if (j < nextTarget - 1) {
        result.push([i, j + 1]);
      }
      if (i < 4) {
        if (j >= nextTarget - 2) {
          result.push([i + 1, 0]);
        }
      }
      return result;
    };

    const doLadderHandler = (i, j, disabled) => () => {
      // Check if the button is allowed to be pressed
      if (!validateIfButtonIsPressable(i, j)) {
        return;
      }

      // If the button is not disabled and is the next set, then update the state
      if (!disabled) {
        timerRef.current.startTimerFromZero();
        setLadders(
          produce((draft) => {
            draft[i][j].executed = true;
            draft[i][j].achieved = true;
            setNextButton(getNextButtonIndex(i, j));
          })
        );
      }
    };

    return (
      <div className={styles["etk-container"]}>
        <div className={styles.ladders}>
          {ladders.map((ladder, i) => {
            return (
              <div key={i} className={styles.ladder}>
                {ladder.map((rung, j) => {
                  let classList = ["rung"];
                  if (rung.executed) {
                    classList.push("executed");
                  }
                  if (rung.achieved) {
                    classList.push("achieved");
                  }
                  classList = classList.map((e) => styles[e]).join(" ");
                  return (
                    <div className={classList} key={j}>
                      <button onClick={doLadderHandler(i, j, rung.executed)}>
                        {rung.val}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className={styles.timer}>
          <Timer ref={timerRef} />
        </div>
      </div>
    );
  };
  return Component;
}

export default etkPressLadder;
