const hikingWithWeight = () => {
  let nextWorkout = null;
  const WORKOUT_REPEAT = 7 * 24 * 60 * 60 * 1000;

  return {
    init: (data) => {
      nextWorkout = new Date(
        Math.floor(+data.nextWorkoutDate / (24 * 60 * 60 * 1000)) *
          (24 * 60 * 60 * 1000)
      );
    },
    get nextWorkout() {
      return nextWorkout;
    },
    checkDate: (dateObject) => {
      dateObject =
        Math.floor(+dateObject / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);
      if (dateObject < nextWorkout) {
        return false;
      }
      const diff = +dateObject - +nextWorkout;
      if (diff % WORKOUT_REPEAT === 0) {
        return "Hiking";
      }
      return false;
    },
  };
};

export default hikingWithWeight;
