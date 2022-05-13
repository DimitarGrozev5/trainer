import EtkComponent from "./EtkComponent";

const etkPressLadder = () => {
  const WORKOUT_REPEAT = 2 * 24 * 60 * 60 * 1000;

  const nextWorkoutData = (workoutData) => {
    let nextTarget = workoutData.nextTarget;
    let nextWorkoutType = workoutData.nextWorkoutType;
    let lastAchieved = workoutData.lastAchieved;
    // Determining Ladders parameters
    let targetRungs = nextTarget;
    const lastAchievedWasPromptedProgress = lastAchieved.reduce(
      (uniform, ladder) => {
        return uniform === ladder && ladder;
      },
      lastAchieved[0]
    );
    if (
      lastAchievedWasPromptedProgress &&
      lastAchievedWasPromptedProgress === nextTarget - 1 &&
      nextWorkoutType !== 1
    ) {
      targetRungs -= 1;
    }

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

    return [minSets, minRungs, maxRungs];
  };

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

      // Get Helper values
      const [, , maxRungs] = nextWorkoutData({
        ...workoutData,
        nextWorkoutType: targetWorkout,
      });

      let ladder = [];
      for (let i = 1; i <= maxRungs; i++) {
        ladder.push(i);
      }
      ladder = ladder.join(", ");
      return `Do 5x (${ladder})`;
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
        const [, maxLadder, uniform] = achievedLadders.reduce(
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

        if (updatedTarget === 3) {
          achieved = [0, 0, 0, 0, 0];
        }
      } else {
        updatedTarget = currentData.nextTarget;
      }

      return {
        lastAchieved: achieved,
        nextTarget: updatedTarget,
        nextWorkoutType: nextWorkoutType,
        nextWorkoutDate: +today + WORKOUT_REPEAT,
      };
    },

    ////////////////////////////////////// Function to return the next workout helper values
    nextWorkoutHelperValues: (workoutData) => {
      return nextWorkoutData(workoutData);
    },

    ////////////////////////////////////// Function to return the Workout Component
    Component: EtkComponent,
  };
};

export default etkPressLadder;
