import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./PageTemplate.module.css"

const PageTemplate = (props) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}><h1>Trainer</h1></header>
      <Outlet />
    </div>
  );
};

export default PageTemplate;
