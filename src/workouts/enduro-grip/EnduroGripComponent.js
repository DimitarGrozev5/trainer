import { useEffect, useRef, useState } from "react";
import styles from "./EnduroGripComponent.module.css";
import Timer from "../../components/Timer";
import useExit from "./useExit";
import tickSound from "../../static/tick.mp3";
import useSound from "use-sound";

const EnduroGripComponent = ({ workout }) => {
  const timerRef = useRef();

  const { nextWorkoutType, nextTarget } = workout.data;

  const sets =
    nextWorkoutType === 1 ? nextTarget : Math.floor(nextTarget / 2) - 1;

  const [setsArr, setSetsArr] = useState(
    [...Array(sets).keys()].map(() => false)
  );

  const setDoneHandler = (index) => () => {
    // The previous set has to be done to register the current
    if (index > 0 && !setsArr[index - 1]) {
      return;
    }
    if (!setsArr[index]) {
      timerRef.current.startTimerFromZero();

      setSetsArr((arr) => {
        const tmp = [...arr];
        tmp[index] = true;
        return tmp;
      });
    }
  };

  // Set up exit handling
  const exit = useExit(workout);

  const exitHandler = () => {
    const achievedSets = setsArr.filter((s) => s).length;
    exit(achievedSets);
  };

  // Metronome setup
  const [tick, setTick] = useState(false);
  const [nextTick, setNextTick] = useState(false);

  const toggleTickHandler = () => {
    setTick((t) => !t);
  };

  const [playSound] = useSound(tickSound);

  useEffect(() => {
    let t = "";
    if (tick) {
      if (!nextTick) {
        const now = +new Date();
        setNextTick(now + 1000);
      } else {
        t = setInterval(() => {
          const now = +new Date();
          if (now >= nextTick) {
            setNextTick((lastTick) => lastTick + 1000);
            playSound();
          }
        }, 100);
      }
    } else {
      setNextTick(false);
    }
    return () => clearTimeout(t);
  }, [tick, nextTick]);

  return (
    <div className={styles.container}>
      <div>
        Do {sets} {sets > 1 ? "sets" : "set"} to failure.
      </div>
      <div>One set should last between 30s and 60s.</div>
      <div>Adjust your weight to control the duration.</div>
      <div>Rest at least 5min and preferably 10min between sets.</div>
      <div className={styles.sets}>
        {setsArr.map((done, i) => (
          <button
            onClick={setDoneHandler(i)}
            key={i}
            className={done ? styles.done : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className={styles.exit}>
        <button onClick={toggleTickHandler}>
          {tick ? "Stop" : "Start"} Ticking
        </button>
      </div>
      <Timer ref={timerRef} initTime={5 * 60} step={60} />
      <div className={styles.exit}>
        <button onClick={exitHandler}>I am done</button>
      </div>
    </div>
  );
};

export default EnduroGripComponent;
