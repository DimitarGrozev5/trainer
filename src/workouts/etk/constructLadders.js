const constructLadders = (maxRungs, lastAchieved) => {
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

  return laddersArr;
};

export default constructLadders;
