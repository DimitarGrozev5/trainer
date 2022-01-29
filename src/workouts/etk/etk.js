import EtkComponent from "./EtkComponent";

const etkPressLadder = () => {
  const WORKOUT_REPEAT = 2 * 24 * 60 * 60 * 1000;

  return {
    ////////////////////////////////////// Function to check if there is a workout scheduled for the given date
    checkDate: (workoutData, todayDate) => {
      todayDate.setHours(0, 0, 0, 0);
      if (todayDate < workoutData.nextWorkoutDate) {
        return false;
      }
      const diff = +todayDate - +workoutData.nextWorkoutDate;
      if (diff % WORKOUT_REPEAT === 0) {
        return true;
      }
      return false;
    },

    ////////////////////////////////////// Function to get a description of the workout for a given date
    getWorkoutDescription: (workoutData, targetDate) => {
      // Calculate workout number
      targetDate.setHours(0, 0, 0, 0);
      const diff = +targetDate - +workoutData.nextWorkoutDate;
      const fullCicles = diff / WORKOUT_REPEAT;
      const targetWorkout =
        ((workoutData.nextWorkoutType + fullCicles - 1) % 3) + 1;

      // Workouts
      const workouts = [
        null,
        {
          description: () => {
            let ladder = [];
            for (let i = 1; i <= workoutData.nextTarget; i++) {
              ladder.push(i);
            }
            ladder = ladder.join(", ");
            return `Try to do 5x (${ladder})`;
          },
        },
        {
          description: () => {
            let ladder = [];
            for (let i = 1; i <= workoutData.nextTarget - 2; i++) {
              ladder.push(i);
            }
            ladder = ladder.join(", ");
            return `Do 5x (${ladder})`;
          },
        },
        {
          description: () => {
            let ladder = [];
            for (let i = 1; i <= workoutData.nextTarget - 1; i++) {
              ladder.push(i);
            }
            ladder = ladder.join(", ");
            return `Do 5x (${ladder})`;
          },
        },
      ];

      return workouts[targetWorkout].description();
    },

    ////////////////////////////////////// Function to return an updated state, that skips the next workout
    skip: (workoutData) => {
      const nextWorkoutDate = +workoutData.nextWorkoutDate + WORKOUT_REPEAT;
      const nextWorkoutType = (workoutData.nextWorkoutType % 3) + 1;
      return {
        ...workoutData,
        nextWorkoutDate,
        nextWorkoutType,
      };
    },

    ////////////////////////////////////// Function to return default initial data
    createInitialData: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return {
        nextWorkoutDate: +today,
        nextWorkoutType: 1,
        nextTarget: 3,
        lastAchieved: [0, 0, 0, 0, 0],
      };
    },

    ////////////////////////////////////// Function to return the Workout Component
    Component: EtkComponent,
  };
};

let etkPressLadder1 = () => {
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

  const completeWorkout = (achieved) => {
    nextWorkoutDate = new Date(+nextWorkoutDate + WORKOUT_REPEAT);
    nextWorkoutType = (nextWorkoutType % 3) + 1;
    lastAchieved = achieved;

    nextTarget = 0;
  };

  return {
    handle: "etk-press-ladder",
    init: (data) => {
      const nextWorkoutSnaped = new Date(data.nextWorkoutDate);
      nextWorkoutSnaped.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      nextWorkoutDate = nextWorkoutSnaped < today ? today : nextWorkoutSnaped;

      nextWorkoutType = data.nextWorkoutType;
      nextTarget = data.nextTarget;
      lastAchieved = data.lastAchieved;
    },
    currentData() {
      return {
        nextWorkoutDate: +nextWorkoutDate,
        nextWorkoutType,
        nextTarget,
        lastAchieved,
      };
    },
    get initialData() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return {
        nextWorkoutDate: +today,
        nextWorkoutType: 1,
        nextTarget: 3,
        lastAchieved: [0, 0, 0, 0, 0],
      };
    },
    get nextWorkout() {
      return nextWorkoutDate;
    },
    checkDate: (dateObject) => {
      dateObject.setHours(0, 0, 0, 0);
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
      date.setHours(0, 0, 0, 0);
      const diff = +date - +nextWorkoutDate;
      const fullCicles = diff / WORKOUT_REPEAT;
      const targetWorkout = ((nextWorkoutType + fullCicles - 1) % 3) + 1;

      return workouts[targetWorkout].description();
    },

    skip: () => {
      nextWorkoutDate = new Date(+nextWorkoutDate + WORKOUT_REPEAT);
      nextWorkoutType = (nextWorkoutType % 3) + 1;
    },

    get Component() {
      return EtkComponent(nextWorkoutType, nextTarget, lastAchieved, this);
    },
  };
};

export default etkPressLadder;
