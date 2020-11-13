function makeToastMessage(message) {
  $.toast({
    text: message,
    position: "top-right",
  });
}

window.socket = null;
function connectToSocketIo() {
  let server = window.location.protocol + "//" + window.location.host;
  window.socket = io.connect(server);
  window.socket.on("toast", function (data) {
    makeToastMessage(data.message);
  });
}

function getUsername() {
  let server = window.location.protocol + "//" + window.location.host;
  window.socket = io.connect(server);
  window.socket.on("usuario", function (data) {
    console.log("Usuario: ", data.usuario);
    const labelUsuario = document.getElementById("usuario");
    labelUsuario.innerHTML = `Bienvenido:  ${data.usuario}`;
  });
}

var l = "";

function getLetter() {
  let server = window.location.protocol + "//" + window.location.host;
  window.socket = io.connect(server);
  window.socket.on("letter", function (data) {
    console.log("letter: ", data.letter);
    const letterLabel = document.getElementById("letra");
    letterLabel.innerHTML = data.letter;
    l = data.letter;
  });
}

function aceptar() {
  window.socket.emit("messageToServer", { mensaje: "Entrar" });
  const buttonEntar = document.getElementById("aceptar");
  buttonEntar.style["display"] = "none";

  const buttonPlay = document.getElementById("clickPlay");
  buttonPlay.style["display"] = "block";

  const salaP = document.getElementById("sala");
  salaP.innerHTML = "Está en espera de que un jugador entre";
}

var status = false;

function clickPlay() {
  console.log("status: ", status);

  let server = window.location.protocol + "//" + window.location.host;
  window.socket = io.connect(server);
  window.socket.on("clickPlay", function (data) {
    status = data.status;
    if (status) {
      const buttonEntar = document.getElementById("aceptar");
      buttonEntar.style["display"] = "none";

      const div = document.getElementById("containerForms");
      div.style["display"] = "block";

      const buttonPlay = document.getElementById("clickPlay");
      buttonPlay.style["display"] = "none";

      const salaP = document.getElementById("sala");
      salaP.innerHTML = "";
    }
  });
}

function setValuesBasta() {
  var listaValuesBasta = [];
  listaValuesBasta.push({
    nombre: document.getElementById("nombre").value,
    color: document.getElementById("color").value,
    fruto: document.getElementById("fruto").value,
  });

  console.log("ListaBasta: ", listaValuesBasta);

  window.socket.emit("listaBasta", {
    listaValuesBasta: listaValuesBasta,
    letra: l,
  });

  window.socket.emit("basta", "Se presionó basta");

  let server = window.location.protocol + "//" + window.location.host;
  window.socket = io.connect(server);

  window.socket.on("puntos", function (data) {
    console.log(data.puntos);
  });
}

function end() {
  alert("Se termino el juego");
}

$(function () {
  connectToSocketIo();
  getUsername();
  getLetter();
  clickPlay();
});
