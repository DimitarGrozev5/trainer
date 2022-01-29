const constructLadders = (nextTarget, nextWorkoutType, lastAchieved) => {
  // Determining Ladders parameters
  let targetRungs = nextTarget;

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

  // Constructiong the Ladders array and setting up component state
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

  return [laddersArr, minSets, minRungs, maxRungs];
};

export default constructLadders;
