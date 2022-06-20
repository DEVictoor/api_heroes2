import React, { useState } from "react";
import axios from "axios";
import { setToken } from "../utils/token";
import useAuth from "../hoooks/useAuth";
import logo from '../assets/logo.svg';

// import Global from "../configapi/Global";
import "../css/main.css";
import "../css/login.css";

const Login = () => {
  // const auth = useAuth();
  const { setUser } = useAuth();

  const [datos, setDatos] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (event) => {
    // console.log(event.target.name);
    // console.log(event.target.value);
    setDatos({
      ...datos,
      [event.target.name]: event.target.value,
    });
  };

  const loguearse = async () => {
    var data = JSON.stringify({
      username: datos.username,
      password: datos.password,
    });

    var config = {
      method: "post",
      url: "https://api-nestjs-heroes.herokuapp.com/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        setToken(response.data.token);
        setUser(response.data.token);
      })
      .catch(function (error) {
        if (error.response.data.message[0] === "El usuario no existe") {
          setErrorlogin(true)
        }
      });

    // setLogueado(response.data.token);
  };
  const [errorlogin, setErrorlogin] = useState(false)
  return (
    <div className="box-login">
      <section className="box-form">
        <img src={logo} alt="logoapp" />
        <input
          name="username"
          type="text"
          placeholder="Username"
          onChange={handleInputChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleInputChange}
        />

        {errorlogin ? <p className="errorlogin">El usuario no existe</p> : null}
        <button onClick={loguearse}>Log in</button>
      </section>
    </div>
  );
};

export default Login;
