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

    ////////////////////////////////////// Function to return the next target data
    getNextWorkoutTargetData: (currentData, achievedLadders) => {
      // Update the lastAchieved array
      let achieved = achievedLadders.map((ladder, index) =>
        Math.max(ladder.length, currentData.lastAchieved[index])
      );
      if (achieved.length < 5) {
        for (let i = achieved.length; i < 5; i++) {
          achieved.push(currentData.lastAchieved[i] || 0);
        }
      }
      let updatedTarget;
      let nextWorkoutType = (currentData.nextWorkoutType % 3) + 1;

      // Get the date
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (currentData.nextWorkoutType === 1) {
        // Update the nextTarget
        updatedTarget = currentData.nextTarget;
        const [minLadder, maxLadder, uniform] = achievedLadders.reduce(
          (result, ladder) => {
            let [min, max, uniform] = result;
            if (min > ladder.length) {
              min = ladder.length;
            }
            if (max < ladder.length) {
              max = ladder.length;
            }
            uniform = ladder.length === uniform && ladder.length;

            return [min, max, uniform];
          },
          [10, -10, achievedLadders[0].length]
        );
        if (
          uniform &&
          maxLadder === currentData.nextTarget &&
          achievedLadders.length === 5
        ) {
          updatedTarget = currentData.nextTarget + 1;
        }
        if (uniform && updatedTarget === 6) {
          updatedTarget = 3;
        }
      } else {
        updatedTarget = currentData.nextTarget;
      }

      return {
        lastAchieved: achieved,
        nextTarget: updatedTarget,
        nextWorkoutType: nextWorkoutType,
        nextWorkoutDate: +today,
      };
    },

    ////////////////////////////////////// Function to return the Workout Component
    Component: EtkComponent,
  };
};

export default etkPressLadder;
