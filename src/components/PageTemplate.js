import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./PageTemplate.module.css"

const PageTemplate = (props) => {
  return (
    <React.Fragment>
      <header className={styles.header}><h1>Trainer</h1></header>
      <Outlet />
    </React.Fragment>
  );
};

export default PageTemplate;
