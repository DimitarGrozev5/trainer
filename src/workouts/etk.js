import produce from "immer";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

  const completeWorkout = (achieved) => {
    nextWorkoutDate = new Date(+nextWorkoutDate + WORKOUT_REPEAT);
    nextWorkoutType = (nextWorkoutType % 3) + 1;
    lastAchieved = achieved;

    nextTarget = 0;
  };

  return {
    handle: "etk-press-ladder",
    init: (data) => {
      const nextWorkoutSnaped = new Date(data.nextWorkoutDate);
      nextWorkoutSnaped.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      nextWorkoutDate = nextWorkoutSnaped < today ? today : nextWorkoutSnaped;

      nextWorkoutType = data.nextWorkoutType;
      nextTarget = data.nextTarget;
      lastAchieved = data.lastAchieved;
    },
    currentData() {
      return {
        nextWorkoutDate: +nextWorkoutDate,
        nextWorkoutType,
        nextTarget,
        lastAchieved,
      };
    },
    get initialData() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return {
        nextWorkoutDate: +today,
        nextWorkoutType: 1,
        nextTarget: 3,
        lastAchieved: [0, 0, 0, 0, 0],
      };
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

    skip: () => {
      nextWorkoutDate = new Date(+nextWorkoutDate + WORKOUT_REPEAT);
      nextWorkoutType = (nextWorkoutType % 3) + 1;
    },

    get Component() {
      return EtkComponent(nextWorkoutType, nextTarget, lastAchieved, this);
    },
  };
};

function EtkComponent(
  nextWorkoutType,
  firstWorkoutTarget,
  lastAchieved,
  workoutObject
) {
  const Component = () => {
    const timerRef = useRef();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const reduxData = useSelector((state) =>
      state.data.workoutPlannerRefs.find(
        (ref) => ref.handle === workoutObject.handle
      )
    );

    // let nextWorkoutType = 1;
    // let firstWorkoutTarget = 5;
    // let lastAchieved = [3, 3, 3, 3, 3];

    let targetRungs = firstWorkoutTarget;

    let minSets = targetRungs === 3 ? 3 : 5;

    let minRungs = targetRungs === 5 ? 4 : 3;
    let maxRungs = targetRungs;

    if (nextWorkoutType === 2) {
      minRungs = targetRungs - 2;
      maxRungs = minRungs;
    } else if (nextWorkoutType === 3) {
      minRungs = targetRungs - 1;
      maxRungs = minRungs;
    }

    const laddersArr = [];
    for (let i = 0; i < 5; i++) {
      laddersArr.push([]);
      for (let j = 0; j < maxRungs; j++) {
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
      i++;
      j++;

      const result = [];
      if (j < maxRungs) {
        result.push([i - 1, j]);
      }
      if (i < 5) {
        if (j >= minRungs) {
          result.push([i, 0]);
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
        setLadders(
          produce((draft) => {
            draft[i][j].executed = true;
            draft[i][j].achieved = true;

            const nextButtonIndexes = getNextButtonIndex(i, j);
            setNextButton(nextButtonIndexes);
            // console.log(nextButtonIndexes.length);
            nextButtonIndexes.length
              ? timerRef.current.startTimerFromZero()
              : timerRef.current.stopTimer();
          })
        );
      }
    };

    const exitHandler = () => {
      // Get only the completed ladders
      const achievedLadders = ladders
        .map((ladder) => ladder.filter((rung) => rung.executed))
        .filter((ladder) => ladder.length);

      // If the ladders are less than the minimum requirement prompt exit
      if (achievedLadders.length < minSets) {
        const result = window.confirm(
          "The workout is not complete! Are you sure you want to exit?"
        );
        if (result) {
          navigate("../trainer", { replace: true });
        }
      } else {
        // If the last started ladder is not completed prompt exit
        if (achievedLadders[achievedLadders.length - 1] < minRungs) {
          const result = window.confirm(
            "The last ladder is not complete! Are you sure you want to exit?"
          );
          if (result) {
            navigate("../trainer", { replace: true });
          }
        }
        // If the workout is satisfactoraly done, save and exit
        else {
          alert("The workout is done! Saving and exiting...");

          let achieved = achievedLadders.map((ladder, index) =>
            Math.max(ladder.length, lastAchieved[index])
          );
          if (achieved.length < 5) {
            for (let i = achieved.length; i < 5; i++) {
              achieved.push(lastAchieved[i] || 0);
            }
          }

          let nextTarget = firstWorkoutTarget;
          if (
            achievedLadders.reduce((sum, lad) => sum + lad.length, 0) === 25
          ) {
            nextTarget = 3;
          }

          const nextData ={...workoutObject.currentData(), lastAchieved: achieved, };

          const dataToDispatch = {
            id: reduxData.id,
            ...workoutObject,
          };
          console.log(dataToDispatch);
        }
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
                    <div className={classList} key={i * 100 + j}>
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
        <div>
          <button onClick={exitHandler}>I am done</button>
        </div>
      </div>
    );
  };
  return Component;
}

export default etkPressLadder;
