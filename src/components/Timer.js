import React, { useEffect, useImperativeHandle, useState } from "react";
import styles from "./Timer.module.css";

const formatTime = (time) => {
  if (time < 0) {
    time = 0;
  }
  let m = Math.floor(time / 60);
  let s = Math.floor(time - m * 60 + 100)
    .toString()
    .substring(1);
  m = (m + 100).toString().substring(1);
  return `${m}:${s}`;
};

const Timer = (props, ref) => {
  const initTime = props.initTime || 180;
  const timerStep = props.step || 30;

  const [timerInterval, setTimerInterval] = useState(+initTime);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(+initTime);

  const changeIntervalHandler = (amount) => () => {
    setTimerInterval((interval) => interval + amount);
    setTimeLeft((time) => {
      if (time < 0) {
        return amount;
      } else {
        return time + amount;
      }
    });
  };

  const toggleRunningHandler = () => {
    setRunning((state) => !state);
  };

  useEffect(() => {
    let ticker;
    const startTime = +new Date();
    if (running) {
      ticker = setTimeout(() => {
        const now = +new Date();
        const dt = now - startTime;
        const dTimeLeft = timeLeft - dt / 1000;
        setTimeLeft(dTimeLeft);
      }, 330);
    }
    return () => {
      clearTimeout(ticker);
    };
  }, [running, timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setRunning(false);
    }
  }, [timeLeft]);

  useImperativeHandle(
    ref,
    () => ({
      startTimerFromZero: () => {
        setTimeLeft(timerInterval);
        setRunning(true);
      },
      stopTimer: () => {
        setTimeLeft(timerInterval);
        setRunning(false);
      },
    }),
    [timerInterval]
  );

  function ClassList() {
    this.classes = [];
    this.add = function (name) {
      this.classes.push(name);
    };
  }
  ClassList.prototype.valueOf = function () {
    return this.classes.map((e) => styles[e]).join(" ");
  };

  const clockClassList = new ClassList();
  clockClassList.add("clock");
  if (timeLeft <= 0) {
    clockClassList.add("flash");
  }

  return (
    <React.Fragment>
      <div className={clockClassList}>{formatTime(timeLeft)}</div>
      <ul className={styles.controls}>
        <li>
          <button onClick={changeIntervalHandler(-1 * timerStep)}>
            -{timerStep}s
          </button>
        </li>
        <li>
          <button>Mute</button>
        </li>
        <li>
          <button onClick={toggleRunningHandler}>
            {running ? "Stop" : "Start"}
          </button>
        </li>
        <li>
          <button onClick={changeIntervalHandler(timerStep)}>
            +{timerStep}s
          </button>
        </li>
      </ul>
    </React.Fragment>
  );
};

export default React.forwardRef(Timer);
