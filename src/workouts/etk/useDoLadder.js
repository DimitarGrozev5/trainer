import produce from "immer";

const useDoLadder = (
  minRungs,
  maxRungs,
  setLadders,
  nextButton,
  setNextButton,
  timerRef
) => {
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

  const doLadder = (i, j, disabled) => {
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

  return doLadder;
};

export default useDoLadder;
