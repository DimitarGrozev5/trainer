import EnduroGripComponent from "./EnduroGripComponent";

const enduroGrip = () => {
  const WORKOUT_REPEAT = 4 * 24 * 60 * 60 * 1000;

  // workoutData = {
  //   nextTarget,
  //   nextWorkoutType,
  //   nextWorkoutDate,
  //   lastAchievedVolume
  // }
  const nextWorkoutData = (workoutData) => {
    let nextTarget = workoutData.nextTarget;
    let nextWorkoutType = workoutData.nextWorkoutType;

    // Determining Workout parameters
    if (nextWorkoutType === 2) {
      nextTarget = Math.floor(nextTarget / 2) - 1;
    }

    return nextTarget;
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
        ((workoutData.nextWorkoutType + fullCicles - 1) % 2) + 1;

      // Get Helper values
      const nextTarget = nextWorkoutData({
        ...workoutData,
        nextWorkoutType: targetWorkout,
      });

      return `Do ${nextTarget} sets to failure`;
    },

    ////////////////////////////////////// Function to return an updated state, that skips the next workout
    skip: (workoutData) => {
      const nextWorkoutDate = +workoutData.nextWorkoutDate + WORKOUT_REPEAT;
      const nextWorkoutType = (workoutData.nextWorkoutType % 2) + 1;
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
        nextTarget: 4,
        lastAchievedVolume: 0,
      };
    },

    ////////////////////////////////////// Function to return the next target data
    getNextWorkoutTargetData: (currentData, achievedSets) => {
      let updatedTarget = currentData.nextTarget;
      let nextWorkoutType = (currentData.nextWorkoutType % 2) + 1;
      let lastAchieved = Math.max(currentData.lastAchievedVolume, achievedSets);

      // Get the date
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (currentData.nextWorkoutType === 2) {
        if (lastAchieved === currentData.nextTarget) {
          updatedTarget = currentData.nextTarget + 2;
          if (updatedTarget === 10) {
            updatedTarget = 5;
            lastAchieved = 0;
          }
          if (updatedTarget === 11) {
            updatedTarget = 4;
            lastAchieved = 0;
          }
        }
      }

      return {
        nextTarget: updatedTarget,
        nextWorkoutType: nextWorkoutType,
        nextWorkoutDate: +today + WORKOUT_REPEAT,
        lastAchievedVolume: lastAchieved,
      };
    },

    ////////////////////////////////////// Function to return the next workout helper values
    nextWorkoutHelperValues: (workoutData) => {
      return nextWorkoutData(workoutData);
    },

    ////////////////////////////////////// Function to return the Workout Component
    Component: EnduroGripComponent,
  };
};

export default enduroGrip;
