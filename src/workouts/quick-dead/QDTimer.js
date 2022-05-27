import { useEffect, useState } from "react";
import FormatTime from "./FormatTime";
import styles from "./QuickDeadComponent.module.css";

const getArrFromN = (n) => [...Array(n).keys()];

const exerciseGenerator = function* (swingVariation) {
  const swing = swingVariation === "1" ? "One arm swing" : "Two arm swing";
  let one = true;
  while (true) {
    if (one) {
      yield swing;
    } else {
      yield "Viking Push Press";
    }
    one = !one;
  }
};

const setGenerator = (time, repCount, exercise) => {
  return { time, caption: `Do ${repCount} reps of ${exercise}` };
};

const seriesGenerator = (baseTime, repScheme, swingVariation) => {
  const interval = repScheme === 5 ? 30 : 60;
  const sets = repScheme === 5 ? 4 : 2;

  const exerciseGen = exerciseGenerator(swingVariation);
  let exercise = exerciseGen.next().value;

  const series1 = getArrFromN(sets).map((i) =>
    setGenerator(baseTime + interval * i, repScheme, exercise)
  );

  exercise = exerciseGen.next().value;
  const series2 = getArrFromN(sets).map((i) =>
    setGenerator(baseTime + 3 * 60 + interval * i, repScheme, exercise)
  );

  return [...series1, ...series2];
};

const schemeGenerator = function* (repScheme) {
  let one = true;
  while (true) {
    if (repScheme === 15) {
      if (one) {
        yield 5;
      } else {
        yield 10;
      }
      one = !one;
    } else {
      yield repScheme;
    }
  }
};

const sessionGenerator = (repScheme, volume, swingVariation) => {
  const repGen = schemeGenerator(repScheme);

  const series = getArrFromN(volume / 20).flatMap((i) => {
    const scheme = repGen.next().value;
    return seriesGenerator(6 * 60 * i, scheme, swingVariation);
  });

  return series;
};

const QDTimer = ({ repScheme, volume, swingVariation }) => {
  const [sets, setSets] = useState([]);
  useEffect(() => {
    const session = sessionGenerator(repScheme, volume, swingVariation);

    setSets(session);
  }, [repScheme, volume, swingVariation]);
  const filterSets = (dt) => (sets) =>
    [...sets].filter((s) => s.time > dt - 10);

  // StopWatch setup
  const [startTime] = useState(+new Date());

  const [timer, setTimer] = useState(startTime);

  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let ticker;
    if (!paused) {
      ticker = setTimeout(() => {
        const now = +new Date();
        setTimer(now);
        setSets(filterSets((now - startTime) / 1000 - 10));
      }, 330);
    }

    return () => clearTimeout(ticker);
  }, [timer, paused, startTime]);

  return (
    <>
      <div className={styles.control}>
        <button onClick={setPaused.bind(null, (p) => !p)}>
          {paused ? "Continue" : "Pause"}
        </button>
      </div>
      <FormatTime startTime={startTime} currentTime={timer} />
      <ul className={styles.sets}>
        {sets.map((set, i) => (
          <li key={i} className={!i ? styles["next-set"] : ""}>
            {!i &&
              `(${set.time - Math.floor((timer - startTime) / 1000 - 10)})`}
            {set.caption}
          </li>
        ))}
      </ul>
    </>
  );
};

export default QDTimer;
