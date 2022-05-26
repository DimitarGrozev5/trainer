import QuickDeadComponent from "./QuickDeadComponent";

const quickDead = () => {
  const WORKOUT_REPEAT = 3 * 24 * 60 * 60 * 1000;

  // workoutData = {
  //   lastVolume,
  //     40, 60, 80, 1000
  //   lastRepScheme,
  //     5 = 4x5, 10 = 2x10, 15 = alternate set by set
  //   nextWorkoutDate,
  // }

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
    getWorkoutDescription: (workoutData, targetDate) => `TBD on date`,

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
        lastVolume: 100,
        lastRepScheme: 10,
        nextWorkoutDate: +today,
      };
    },

    ////////////////////////////////////// Function to return the next target data
    getNextWorkoutTargetData: (currentData, [currentVolume, currentRepSheme]) => {
      // Get the date
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return {
        lastVolume: currentVolume,
        lastRepScheme: currentRepSheme,
        nextWorkoutDate: +today + WORKOUT_REPEAT,
      };
    },

    ////////////////////////////////////// Function to return the next workout helper values
    nextWorkoutHelperValues: (workoutData) => {
      return `TBD on date`;
    },

    ////////////////////////////////////// Function to return the Workout Component
    Component: QuickDeadComponent,
  };
};

export default quickDead;
