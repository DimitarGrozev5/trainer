import { useNavigate } from "react-router-dom";

const useExit = (
  ladders,
  minSets,
  minRungs,
  lastAchieved,
  nextTarget,
  targetWorkout
) => {
  const navigate = useNavigate();

  return () => {
    // Get only the completed ladders
    const achievedLadders = ladders
      .map((ladder) => ladder.filter((rung) => rung.executed))
      .filter((ladder) => ladder.length);

    // If the ladders are less than the minimum requirement, prompt exit
    if (achievedLadders.length < minSets) {
      const result = window.confirm(
        "The workout is not complete! Are you sure you want to exit?"
      );
      if (result) {
        navigate("../trainer", { replace: true });
      }
    } else {
      // If the last started ladder is not completed, prompt exit
      if (achievedLadders[achievedLadders.length - 1].length < minRungs) {
        const result = window.confirm(
          "The last ladder is not complete! Are you sure you want to exit?"
        );
        if (result) {
          navigate("../trainer", { replace: true });
        }
      }
      // If the workout is satisfactoraly done, save and exit
      else {
        alert("The workout is done! Saving and exiting...");

        // Update the lastAchieved array
        let achieved = achievedLadders.map((ladder, index) =>
          Math.max(ladder.length, lastAchieved[index])
        );
        if (achieved.length < 5) {
          for (let i = achieved.length; i < 5; i++) {
            achieved.push(lastAchieved[i] || 0);
          }
        }

        // Update the nextTarget
        let updatedTarget = nextTarget;
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
        if (uniform && maxLadder === nextTarget && achievedLadders.length === 5) {
          updatedTarget = nextTarget + 1;
        }
        if (uniform && updatedTarget === 6) {
          updatedTarget = 3;
        }

        // Construct the data property
        const nextData = {
          name: targetWorkout.handle,
          data: {
            ...targetWorkout.data,
            lastAchieved: achieved,
            nextTarget: updatedTarget,
          },
        };

        const dataToDispatch = {
          id: targetWorkout.id,
          data: nextData,
        };
        console.log(dataToDispatch);
      }
    }
  };
};

export default useExit;
