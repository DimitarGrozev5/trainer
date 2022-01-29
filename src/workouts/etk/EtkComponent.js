import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react/cjs/react.development";
import Timer from "../../components/Timer";
import styles from "./EtkComponent.module.css";
import constructLadders from "./constructLadders";
import useDoLadder from "./useDoLadder";
import useExit from "./useExit";

const EtkComponent = (props) => {
  const timerRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const targetWorkout = props.workout;
  // console.log(targetWorkout);

  let nextWorkoutType = targetWorkout.data.nextWorkoutType;
  let nextTarget = targetWorkout.data.nextTarget;
  let lastAchieved = targetWorkout.data.lastAchieved;
  // nextWorkoutType = 1;
  // nextTarget = 5;
  // lastAchieved = [3, 3, 3, 3, 3];

  // Construct ladders and helper values
  const [laddersArr, minSets, minRungs, maxRungs] = constructLadders(
    nextTarget,
    nextWorkoutType,
    lastAchieved
  );

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
  const exit = useExit(ladders, minSets, minRungs, lastAchieved, nextTarget, targetWorkout);

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
