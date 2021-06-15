//Obtener elemento por id
function get_ID(e) {
  return document.getElementById(e);
}
//Var globales
const root = document.documentElement;
var maximo = 400; //ancho video

//Menú de reproducción
window.repro = function () {
  var video = get_ID("video");
  var reproducir = get_ID("empezar");
  if (video.paused == false && video.ended == false) {
    video.pause();
    reproducir.innerHTML = "Play";
  } else {
    video.play();
    reproducir.innerHTML = "Pause";
    bucle = setInterval(estado, 10);
  }

  window.subir = function () {
    console.log("volumen up:" + get_ID("video").volume);
    get_ID("video").volume += 0.1;
  };
  window.bajar = function () {
    console.log("volumendown:" + get_ID("video").volume);
    get_ID("video").volume -= 0.1;
  };
  window.parar = function () {
    video.currentTime = 0;
    video.pause();
  };
};
//Barra de avance video
function estado() {
  if (video.ended == false) {
    var total = parseInt((video.currentTime * maximo) / video.duration);
    progreso.style.width = total + "px";
  }
}
/*  Analizando errores */
function error_type(e) {
  switch (e.target.error.code) {
    case e.target.error.NOT_FOUND_ERR: //error de ruta
      alert("¡Archivo no encontrado!");
      break;
    case e.target.error.NOT_READABLE_ERR: //Error de lectura
      alert("No se puede leer el archivo.");
      break;
    case e.target.error.ABORT_ERR: //Salida -1
      break;
    default:
      alert("A ocurrido un erro en la lectura del archivo.");
  }
}

/* Main */
function comenzar() {
  const fileIn = get_ID("file");
  
  const progress = get_ID("progress");

  fileIn.addEventListener("change", (e) => {
    //guardar el archivo
    const file = e.target.files[0];

    //Datos del archivo registrado
    alert(
      "Archivo: " +
      file.name +
      "\nTamaño: " +
      file.size +
      "\nTipo: " +
      file.type +
      "\n"
    );

    //Comprobar si el archivo es tipo video
    if (file.type.indexOf("video") == -1) {
      alert("Seleccione un archivo de tipor video por favor.");
    } else {
      const file_reader = new FileReader();
      file_reader.addEventListener("error", error_type, false); //Filtrar errores

      //Evento para ver el estado de la carga del archivo
      file_reader.addEventListener("progress", (e) => {
        root.style.setProperty(
          "--bar-width",
          Number.parseInt((e.loaded * 100) / e.total) + "%"
        );
        progress.innerHTML = ` Cargando: ${Number.parseInt(
          (e.loaded * 100) / e.total
        )}%`;
      });
      /* Archivo cargado */
      file_reader.addEventListener("loadend", () => {
        root.style.setProperty("--bar-width", "100%");
        progress.innerHTML = ['<h1 style = "color:green" >Cargado<h1>'];
        video.poster = "";
      });

      file_reader.onload = (e) => {
        return (video.src = e.target.result);
      };

      file_reader.readAsDataURL(file);
    }
  });
}

window.addEventListener("load", comenzar, false);
