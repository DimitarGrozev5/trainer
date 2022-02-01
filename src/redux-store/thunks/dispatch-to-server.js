const dispatchToServer = (action, debug = false) => {
  return new Promise((resolve, reject) =>
    // fetch("http://127.0.0.1/trainer-api/trainer-api/dispatch-action.php", {
    fetch("https://bgstrans.online/trainer/trainer-api/dispatch-action.php", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(action),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (debug) {
          res
            .clone()
            .text()
            .then((t) => console.log(t));
        }
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(data);
          });
        }
      })
      .then((parsedData) => {
        if (parsedData.confirmAction) {
          resolve(parsedData);
          //return parsedData;
        }
      })
      .catch((err) => {
        alert(err);
        //return false;
        resolve(false);
      })
  );
};

export default dispatchToServer;
