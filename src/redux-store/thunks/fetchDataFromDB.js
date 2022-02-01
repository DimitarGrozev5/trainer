import { dataActions } from "..";
import loadWorkoutDataThunk from "./load-workout-data";

const fetchDataFromDB = (auth) => (dispatch, getState) => {
  // Configure Fetch
  // fetch("http://127.0.0.1/trainer-api/trainer-api/get-data.php", {
  fetch("https://bgstrans.online/trainer/trainer-api/get-data.php", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({
      email: auth.email,
      token: auth.token,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    // Check if code is 200 and parse JSON Response
    .then((res) => {
      // res
      //   .clone()
      //   .text()
      //   .then((t) => console.log(t));
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then((data) => {
          throw new Error(data);
        });
      }
    })

    // Check if the server returned an error message or an empty string
    .then((data) => {
      if (data.error) {
        throw new Error(data.error);
      } else {
        return data;
      }
    })

    // Parse response data and despatch action
    .then((parsedJSON) => {
      if (!parsedJSON.noData) {
        const fullyParsedData = parsedJSON.map(({ id, data, name }) => {
          return {
            id,
            name,
            data: JSON.parse(data),
          };
        });
        dispatch(dataActions.addWorkouts(fullyParsedData));
      }
    })
    .catch((err) => {
      alert(err);
    });
};

export default fetchDataFromDB;
