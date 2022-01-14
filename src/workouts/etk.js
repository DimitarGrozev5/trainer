const etkPressLadder = () => {
  // Init Data
  let nextWorkoutDate = null;
  let nextWorkoutType = null;
  let nextTarget = null;
  let lastAchieved = null;

  // Workouts
  const workouts = [
    null,
    {
      description: () => {
        let ladder = [];
        for (let i = 1; i <= nextTarget; i++) {
          ladder.push(i);
        }
        ladder = ladder.join(", ");
        return `Try to do 5x (${ladder})`;
      },
    },
    {
      description: () => {
        let ladder = [];
        for (let i = 1; i <= nextTarget - 2; i++) {
          ladder.push(i);
        }
        ladder = ladder.join(", ");
        return `Do 5x (${ladder})`;
      },
    },
    {
      description: () => {
        let ladder = [];
        for (let i = 1; i <= nextTarget - 1; i++) {
          ladder.push(i);
        }
        ladder = ladder.join(", ");
        return `Do 5x (${ladder})`;
      },
    },
  ];

  const WORKOUT_REPEAT = 2 * 24 * 60 * 60 * 1000;
  const name = "ETK";
  const fullName = "ETK Press Ladder Protocol";

  return {
    init: (data) => {
      nextWorkoutDate = new Date(
        Math.floor(+data.nextWorkoutDate / (24 * 60 * 60 * 1000)) *
          (24 * 60 * 60 * 1000)
      );
      nextWorkoutType = data.nextWorkoutType;
      nextTarget = data.nextTarget;
      lastAchieved = data.lastAchieved;
    },
    get nextWorkout() {
      return nextWorkoutDate;
    },
    checkDate: (dateObject) => {
      dateObject =
        Math.floor(+dateObject / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);
      if (dateObject < nextWorkoutDate) {
        return false;
      }
      const diff = +dateObject - +nextWorkoutDate;
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
      // Calculate workout number
      date = Math.floor(+date / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);
      const diff = +date - +nextWorkoutDate;
      const fullCicles = diff / WORKOUT_REPEAT;
      const targetWorkout = ((nextWorkoutType + fullCicles - 1) % 3) + 1;

      return workouts[targetWorkout].description();
    },
  };
};

export default etkPressLadder;
