import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/home.css";
import { FiEdit3 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { FiSave } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";

import { getToken } from "../utils/token";
// import "../animaciones/animacionhome";
const Dashboard = () => {
  const [windowcreate, setWindowcreate] = useState(false);

  // animacion onpress clicked
  const cardclick = (event) => {
    if (document.querySelector(".character.active")) {
      document.querySelector(".character.active").classList.remove("active");
    }
    event.target.parentNode.classList.add("active");

    // event.target.classList.add("active");
  };
  // animacion no view  clicked
  const showcard = (e) => {
    // console.log(e.target.localName);
    if (e.target.localName === "ul") {
      if (document.querySelector(".character.active")) {
        document.querySelector(".character.active").classList.remove("more");
        document.querySelector(".character.active").classList.remove("active");
      }
    }
    // event.target.classList.add("active");
  };

  // heroes
  const [heroesdata, setHeroesdata] = useState([]);

  const [datos, setDatos] = useState({
    name: "",
    edad: 0,
    description: "",
    image: "",
  });

  // key up datos del formulario de register
  const handleChange = (event) => {
    setDatos({
      ...datos,
      [event.target.name]: event.target.value,
    });
    console.log(datos);
  };
  // ANIMACIONES//

  // mostrar el modal para registrar un heroe en el formmulario
  const show_modal_create = (e) => {
    e.preventDefault();
    setWindowcreate(!windowcreate);
  };

  // cancelar el registro del heroe en el formulario
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

  const [dato_form_update, setDato_form_update] = useState({
    name: "",
    edad: "",
    description: "",
    image: "",
  });
  // mostrar el modal para editar o eliminar un heroe en el formmulario
  const show_modal_update = (e) => {
    if (document.querySelector(".character.more")) {
      setDato_form_update({
        name: "",
        edad: "",
        description: "",
        image: "",
      });
      // let form = document.querySelector(".character.active form");
      // form.reset();
    } else {
      let name_item_active = document.querySelector(
        ".character.active h2"
      ).textContent;
      console.log(name_item_active);
      for (let i = 0; i < heroesdata.length; i++) {
        if (heroesdata[i].name == name_item_active) {
          let name = document.querySelector(".character.active form #name");
          name.value = heroesdata[i].name;
          let edad = document.querySelector(".character.active form #edad");
          edad.value = heroesdata[i].edad;
          let description = document.querySelector(
            ".character.active form #description"
          );
          description.value = heroesdata[i].description;
          let image = document.querySelector(".character.active form #image");
          image.value = heroesdata[i].image;
          setDato_form_update({
            name: heroesdata[i].name,
            edad: heroesdata[i].edad,
            description: heroesdata[i].description,
            image: heroesdata[i].image,
          });
        }
      }
    }

    let item = document.querySelector(".character.active");
    item.classList.toggle("more");
  };

  // FIN DE ANIMACIONES

  // METODO POST :: enviar los datos del formulario de registrar heroe
  const submit_form = async (e) => {
    console.log(getToken());
    e.preventDefault();
    if (
      datos.name === "" ||
      datos.edad === "" ||
      datos.description === "" ||
      datos.image === ""
    ) {
      alert("Te faltan llenar los campos del formulario");
    } else {
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
          document.querySelector(".form-register").reset();
          setDatos({
            name: "",
            edad: "",
            description: "",
            image: "",
          });
          obtenerHeroes();

          show_toast_success("Heroe creado correctamente");
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  // METODO GET :: obtener heroes de api
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

  // funcion que llama una sola vez al renderizar
  useEffect(() => {
    obtenerHeroes();
  }, [0]);

  // METODO DELETE :: Eliminar un heroe desde el modal edit
  const delete_hero = async (event) => {
    event.preventDefault();
    let card_item = document.querySelector(".character.active");
    let item_id = card_item.getAttribute("data_key");
    // console.log(item_id);
    var config = {
      method: "delete",
      url: "https://api-nestjs-heroes.herokuapp.com/heroes/" + item_id,
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    };

    await axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        obtenerHeroes();
        show_toast_success("Se elimino al heroe");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // METODO UPDATE

  const handle_edit = (event) => {
    setDato_form_update({
      ...dato_form_update,
      [event.target.name]: event.target.value,
    });
    console.log(dato_form_update);
  };

  const show_toast_success = (mensaje) => {
    let toast_success = document.querySelector(".toast.toast-success");
    toast_success.innerHTML = "<FiCheck /> " + mensaje;
    toast_success.classList.add("show-toast");
    setTimeout(() => {
      toast_success.classList.remove("show-toast");
    }, 2000);
  };

  const update_hero = async (event) => {
    event.preventDefault();
    let card_item = document.querySelector(".character.active");
    let item_id = card_item.getAttribute("data_key");
    console.log(dato_form_update);
    const { name, description, edad, image } = dato_form_update;
    var data = JSON.stringify({
      name: name,
      description: description,
      edad: Number(edad),
      image: image,
    });
    const token = getToken();
    var config = {
      method: "put",
      url: "https://api-nestjs-heroes.herokuapp.com/heroes/" + item_id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        obtenerHeroes();
        show_toast_success("Se actualizo al heroe");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="box-dashboard">
      <div className="toast toast-success"></div>
      <div className="toast-error"></div>
      <header>
        <img src="./logo.svg" alt="" />
        <nav>
          <div className="btn-add" id="newAvenger" onClick={show_modal_create}>
            <span>+ NEW AVENGER</span>
          </div>
        </nav>
      </header>
      <section onClick={showcard} className="container-carousel">
        <ul className="carousel">
          {heroesdata !== "" ? (
            heroesdata.map((item) => {
              return (
                <li data_key={item._id} key={item._id} className="character">
                  <img onClick={cardclick} src={item.image} alt="" />
                  <span>{item.name}</span>
                  <button onClick={show_modal_update}>
                    <FiEdit3 />
                  </button>
                  <div className="content">
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                    <form>
                      <p>
                        <label htmlFor="name">Name</label>
                        <input
                          onChange={handle_edit}
                          name="name"
                          type="text"
                          id="name"
                        />
                      </p>
                      <p>
                        <label htmlFor="edad">Edad</label>
                        <input
                          onChange={handle_edit}
                          name="edad"
                          label="Escribe la edad de tu heroe"
                          type="number"
                          id="edad"
                        />
                      </p>
                      <p>
                        <label htmlFor="Descripcion">Descripcion</label>
                        <input
                          onChange={handle_edit}
                          name="description"
                          label="Escribe una breve descripcion de tu heroe"
                          type="text"
                          id="description"
                        />
                      </p>
                      <p>
                        <label htmlFor="linkimage">Link Image</label>
                        <input
                          onChange={handle_edit}
                          name="image"
                          label="Escribe la ruta de la imagen de tu heroe"
                          type="text"
                          id="image"
                        />
                      </p>
                      <p className="buttons">
                        <button onClick={update_hero}>
                          <FiSave />
                          Save
                        </button>
                        <button onClick={delete_hero}>
                          <FiTrash2 /> Delete
                        </button>
                      </p>
                    </form>
                  </div>
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
