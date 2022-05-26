import styles from "./QuickDeadComponent.module.css";

const FormatTime = ({ startTime, currentTime }) => {
  // The timer start from -10s
  const time = (currentTime - startTime) / 1000 - 10;

  let m = Math.floor(time / 60);
  let s = Math.floor(time - m * 60 + 100)
    .toString()
    .substring(1);
  m = (m + 100).toString().substring(1);

  if (time < 0) {
    m = Math.ceil(time / 60);
    s = Math.floor(time - m * 60 - 100)
      .toString()
      .substring(2);
    m = (m - 100).toString().substring(2);
  }

  return (
    <div className={styles.clock}>
      <div className={styles.sign}>{time < 0 && "-"}</div>
      <div className={styles["clock-nums"]}>
        {m}:{s}
      </div>
    </div>
  );
};

export default FormatTime;
