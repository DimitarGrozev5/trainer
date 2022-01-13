import { useContext, useRef } from "react";
import AppContext from "../context-store/app-context";
import styles from "./Login.module.css";

const Login = () => {
  const ctx = useContext(AppContext);

  const emailRef = useRef();
  const passRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailRef.current.value;
    const enteredPass = passRef.current.value;

    fetch("http://127.0.0.1/trainer-api/trainer-api/login.php", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        email: enteredEmail,
        pass: enteredPass,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(data);
          });
        }
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        } else {
          return data;
        }
      })
      .then((data) => {
        ctx.login(data);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <form className={styles["login-form"]} onSubmit={submitHandler}>
      <label htmlFor="email">E-Mail:</label>
      <input type="email" name="email" ref={emailRef} />
      <label htmlFor="pass">Password:</label>
      <input type="password" name="pass" ref={passRef} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
