import React, { useState } from "react";

const AppContext = React.createContext({
  isLogged: false,
  login: () => {},
  logout: () => {},
});

export const AppContextProvider = (props) => {
  const initialToken = localStorage.getItem("loginbody");

  const [isLogged, setIsLogged] = useState(
    initialToken && JSON.parse(initialToken)
  );

  const loginHandler = (loginBody) => {
    setIsLogged(loginBody);
    localStorage.setItem("loginbody", JSON.stringify(loginBody));
  };

  const logoutHandler = () => {
    setIsLogged(false);
    localStorage.removeItem("loginbody");
  };

  return (
    <AppContext.Provider
      value={{
        isLogged: isLogged,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
