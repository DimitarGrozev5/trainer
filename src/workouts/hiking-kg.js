const hikingWithWeight = () => {
  let nextWorkout = null;
  const WORKOUT_REPEAT = 7 * 24 * 60 * 60 * 1000;
  const name = "Hiking";
  const fullName = "Hiking With Weight";

  return {
    handle: "hiking-with-weight",
    init: (data) => {
      nextWorkout = data.nextWorkoutDate;
      nextWorkout.setHours(0, 0, 0, 0);
    },
    get nextWorkout() {
      return nextWorkout;
    },
    checkDate: (dateObject) => {
      dateObject.setHours(0, 0, 0, 0);
      if (dateObject < nextWorkout) {
        return false;
      }
      const diff = +dateObject - +nextWorkout;
      if (diff % WORKOUT_REPEAT === 0) {
        return name;
      }
      return false;
    },
    getName: () => name,
    getFullName: () => fullName,
    getWorkoutDescription: function (date) {
      if (!this.checkDate(date)) {
        return "No workout today";
      }
    },
  };
};

export default hikingWithWeight;
