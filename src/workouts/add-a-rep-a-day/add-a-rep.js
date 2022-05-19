import AddARepComponent from "./AddARepComponent";

const addARep = () => {
  const WORKOUT_REPEAT = 1 * 24 * 60 * 60 * 1000;

  // workoutData = {
  //   nextTarget,
  //   nextWorkoutDate,
  //   repsDoneToday,
  // }
  const nextWorkoutData = (workoutData) => {
    let nextTarget = workoutData.nextTarget - workoutData.repsDoneToday;
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

      return `Do ${workoutData.nextTarget} easy reps of pushup and lunge`;
    },

    ////////////////////////////////////// Function to return an updated state, that skips the next workout
    skip: (workoutData) => {
      const nextWorkoutDate = +workoutData.nextWorkoutDate + WORKOUT_REPEAT;
      return {
        ...workoutData,
        nextWorkoutDate,
      };
    },

    ////////////////////////////////////// Function to return default initial data
    createInitialData: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return {
        nextWorkoutDate: +today,
        nextTarget: 1,
        repsDoneToday: 0,
      };
    },

    ////////////////////////////////////// Function to return the next target data
    getNextWorkoutTargetData: (currentData, achievedSets) => {
      let updatedTarget = currentData.repsDoneToday + 1;

      // Get the date
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return {
        nextTarget: updatedTarget,
        nextWorkoutDate: +today + WORKOUT_REPEAT,
        repsDoneToday: 0,
      };
    },

    ////////////////////////////////////// Function to return updated daily reps
    getDataToUpdateReps: (currentData, repsDone) => {
      return {
        ...currentData,
        repsDoneToday: repsDone,
      };
    },

    ////////////////////////////////////// Function to return the next workout helper values
    nextWorkoutHelperValues: (workoutData) => {
      return nextWorkoutData(workoutData);
    },

    ////////////////////////////////////// Function to return the Workout Component
    Component: AddARepComponent,
  };
};

export default addARep;
