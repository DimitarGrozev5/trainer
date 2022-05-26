import { useState } from "react";
import QDTimer from "./QDTimer";
import styles from "./QuickDeadComponent.module.css";
import useExit from "./useExit";

const randBetween = () => Math.ceil(Math.random() * 6);

const dice = (exclude) => {
  let rnd = randBetween();
  while (exclude.includes(rnd)) {
    rnd = randBetween();
  }
  return rnd;
};

const repSchemeDice = {
  5: [1, 2],
  15: [3, 4],
  10: [5, 6],
};

const volumeDice = {
  40: [1],
  60: [2, 3],
  80: [4, 5],
  100: [6],
};

const repSchemeFromDice = {
  1: 5,
  2: 5,
  3: 15,
  4: 15,
  5: 10,
  6: 10,
};

const volumeFromDice = {
  1: 40,
  2: 60,
  3: 60,
  4: 80,
  5: 80,
  6: 100,
};

const swingVariationFromDice = {
  1: 2,
  2: 2,
  3: 2,
  4: 1,
  5: 1,
  6: 1,
};

const QuickDeadComponent = ({ workout }) => {
  // Get details from last session
  const { lastRepScheme, lastVolume } = workout.data;

  // Function to calculate random session
  const randWorkout = (lastRepScheme, lastVolume) => {
    const nextRepSchemeRoll = dice(repSchemeDice[lastRepScheme]);
    const nextVolumeRoll = dice(volumeDice[lastVolume]);
    const nextSwingVariationRoll = dice([]);

    const repScheme = repSchemeFromDice[nextRepSchemeRoll];
    const volume = volumeFromDice[nextVolumeRoll];
    const swingVariation = swingVariationFromDice[nextSwingVariationRoll];

    return { repScheme, volume, swingVariation };
  };

  // State for session parameters
  const [w, setW] = useState(randWorkout(lastRepScheme, lastVolume));

  const changeWHandler = () => {
    setW(randWorkout(lastRepScheme, lastVolume));
  };
  const offDayHandler = () => {
    setW({ repScheme: 5, volume: 40, swingVariation: 2 });
  };
  const startSessionHandler = () => {
    setSessionStarted(true);
  };

  // State for session setup ot execution
  const [sessionStarted, setSessionStarted] = useState(false);

  return (
    <div className={styles.container}>
      {!sessionStarted && (
        <>
          <h1>Session for today:</h1>
          <div>
            <h2>Total daily reps:</h2>
            <div>Total reps: {w.volume}</div>
            <div>Number of series: {w.volume / 20}</div>
            <div>Session duration: {(w.volume / 20) * 6} min</div>
          </div>
          <div>
            <h2>Reps and Sets within Series:</h2>
            {w.repScheme === 5 && <div>Reps/sets: 5/4</div>}
            {w.repScheme === 10 && <div>Reps/sets: 10/2</div>}
            {w.repScheme === 15 && <div>Alternate series of 5/4 and 10/2</div>}
          </div>
          <div>
            <h2>Swing Type</h2>
            <div>{w.swingVariation === 1 ? "Two" : "One"} arm swing</div>
          </div>
          <div className={styles.control}>
            <button onClick={changeWHandler}>Reshuffle</button>
            <button onClick={offDayHandler}>I am having an off day</button>
            <button onClick={startSessionHandler}>
              Start Session (starts in 10 seconds)
            </button>
          </div>
        </>
      )}
      {sessionStarted && <QDTimer {...w} />}
    </div>
  );
};

export default QuickDeadComponent;
