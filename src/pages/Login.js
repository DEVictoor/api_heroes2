import React, { useState } from "react";
import axios from "axios";
import { setToken } from "../utils/token";
import useAuth from "../hoooks/useAuth";

// import Global from "../configapi/Global";
import "../css/main.css";
import "../css/login.css";

const Login = () => {
  let logo =
    "https://w7.pngwing.com/pngs/861/252/png-transparent-carol-danvers-iron-man-ultron-hulk-marvel-comics-avengers-logo-marvel-avengers-logo-marvel-avengers-assemble-avengers-text.png";

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

    const response = await axios(config);
    setToken(response.data.token);
    setUser(response.data.token);
    // setLogueado(response.data.token);
  };

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
        <button onClick={loguearse}>Log in</button>
      </section>
    </div>
  );
};

export default Login;
