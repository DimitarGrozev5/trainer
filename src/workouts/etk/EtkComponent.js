import React, { useRef, useState } from "react";
import Timer from "../../components/Timer";
import styles from "./EtkComponent.module.css";
import constructLadders from "./constructLadders";
import useDoLadder from "./useDoLadder";
import useExit from "./useExit";
import workoutsStore from "..";

const EtkComponent = (props) => {
  const timerRef = useRef();

  const targetWorkout = props.workout;
  // console.log(targetWorkout);

  let lastAchieved = targetWorkout.data.lastAchieved;
  // nextWorkoutType = 2;
  // nextTarget = 4;
  // lastAchieved = [3, 3, 3, 3, 3];

  // Construct ladders and helper values
  const [minSets, minRungs, maxRungs] = workoutsStore
    .get(targetWorkout.handle)
    .nextWorkoutHelperValues(targetWorkout.data);
  const laddersArr = constructLadders(maxRungs, lastAchieved);

  const [ladders, setLadders] = useState(laddersArr);
  const [nextButton, setNextButton] = useState([[0, 0]]);

  // Get doLadder handler
  const doLadder = useDoLadder(
    minRungs,
    maxRungs,
    setLadders,
    nextButton,
    setNextButton,
    timerRef
  );

  const doLadderHandler = (i, j, disabled) => () => {
    doLadder(i, j, disabled);
  };

  // Set up exit handling
  const exit = useExit(ladders, minSets, minRungs, targetWorkout);

  const exitHandler = () => {
    exit();
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
      <div className={styles.exit}>
        <button onClick={exitHandler}>I am done</button>
      </div>
    </div>
  );
};

export default EtkComponent;
