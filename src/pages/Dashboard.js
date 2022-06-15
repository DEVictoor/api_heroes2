import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/home.css";

import { getToken } from "../utils/token";
// import "../animaciones/animacionhome";
const Dashboard = () => {
  const [windowcreate, setWindowcreate] = useState(false);

  // heroes
  const [heroesdata, setHeroesdata] = useState("");

  const [datos, setDatos] = useState({
    name: "",
    edad: 0,
    description: "",
    image: "",
  });

  const handleChange = (event) => {
    setDatos({
      ...datos,
      [event.target.name]: event.target.value,
    });
    console.log(datos);
  };
  const show_modal_create = (e) => {
    e.preventDefault();
    setWindowcreate(!windowcreate);
  };
  const cancel_register = (e) => {
    e.preventDefault();
    document.querySelector(".form-register").reset();
    setDatos({
      name: "",
      edad: "",
      description: "",
      image: "",
    });
    setWindowcreate(!windowcreate);
  };
  const submit_form = async (e) => {
    console.log(getToken());
    e.preventDefault();
    var data = JSON.stringify({
      name: datos.name,
      description: datos.description,
      edad: Number(datos.edad),
      image: datos.image,
    });
    const token = getToken();
    var config = {
      method: "post",
      url: "https://api-nestjs-heroes.herokuapp.com/heroes",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(datos);
  };

  // obtener heroes
  const obtenerHeroes = async () => {
    var config = {
      method: "get",
      url: "https://api-nestjs-heroes.herokuapp.com/heroes",
      headers: {
        Authorization: "bearer " + getToken(),
      },
    };
    await axios(config)
      .then(function (response) {
        setHeroesdata(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    obtenerHeroes();
  }, [0]);

  return (
    <div className="box-dashboard">
      <header>
        <img src="./logo.svg" alt="" />
        <nav>
          <div className="btn-add" id="newAvenger" onClick={show_modal_create}>
            <span>+ NEW AVENGER</span>
          </div>
        </nav>
      </header>
      <section className="container-carousel">
        <ul className="carousel">
          {heroesdata !== "" ? (
            heroesdata.map((item) => {
              return (
                <li key={item.name} className="character">
                  <img src={item.image} alt="" />
                  <span>{item.name}</span>
                </li>
              );
            })
          ) : (
            <p>No hay datos</p>
          )}
        </ul>
      </section>
      <footer>Made by Carlos Ramos, Victor Mireles and Jampier Vásquez</footer>
      <div className={windowcreate ? "windowCreate active" : "windowCreate"}>
        <div className="formCreate">
          <h2>Register new Avenger</h2>
          <form className="form-register" onSubmit={submit_form}>
            <p>
              <label htmlFor="name">Name</label>
              <input
                name="name"
                onChange={handleChange}
                type="text"
                id="name"
              />
            </p>
            <p>
              <label htmlFor="datebirth">edad</label>
              <input
                name="edad"
                onChange={handleChange}
                type="number"
                id="datebirth"
              />
            </p>
            <p>
              <label htmlFor="descripcion">Descripcion</label>
              <input
                name="description"
                onChange={handleChange}
                type="text"
                id="descripcion"
              />
            </p>
            <p>
              <label htmlFor="linkimagen">Link imagen</label>
              <input
                name="image"
                onChange={handleChange}
                type="text"
                id="linkimagen"
              />
            </p>
            <p className="buttons">
              <button className="btn-register">Register</button>
              <span></span>
            </p>
            <p className="buttons">
              <button onClick={cancel_register} className="btn-close">
                Cancel
              </button>
              <span></span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
