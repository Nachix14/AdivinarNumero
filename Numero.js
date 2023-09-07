const form = document.getElementById('form');
const reiniciar = document.getElementById('reiniciar');
const pHighscore = document.getElementById('highscore');
const score = document.getElementById('score');
const container = document.getElementById('container');
const pista = document.getElementById('pista');
const objetivo = document.getElementById('objetivo');
const pIntentos = document.getElementById('intento');
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const numero = document.getElementById('numero');
const msgModal = document.getElementById("msgModal");
const pModal = document.getElementById('pModal');
const select = document.getElementById('dificultad');
const subtitulo = document.getElementById('subtitulo');
const intentoContainer = document.getElementById('intento-container');

let random = generarNumeroAleatorio(select.value);
let intentos = 20;
let sugerencia = 0;
let sugerenciaMin = 0;
let sugerenciaMax = 1000000;
let highscores = {
    facilisimo: localStorage.getItem('facilisimo') || 0,
    facil: localStorage.getItem('facil') || 0,
    medio: localStorage.getItem('medio') || 0,
    dificil: localStorage.getItem('dificil') || 0,
    dificilisimo: localStorage.getItem('dificilisimo') || 0,
    dificilisimo2: localStorage.getItem('dificilisimo2') || 0
};
let timeoutId;

pHighscore.innerHTML = `Highscore ${select.value}: ${highscores[select.value]}`;
pIntentos.innerHTML = `Te quedan: ${intentos} intentos`;

form.addEventListener('submit', function (event) {
    event.preventDefault();

    let datosEntrada = { num: numero.value, intentos, tipo: select.value };

    if (numero.value) {
        intentos = intento(datosEntrada);
        pIntentos.innerHTML = `Te quedan: ${intentos} intentos`;
    } 

    if (intentos === 0) {
        objetivo.innerHTML = `El número a encontrar era el: ${random}`;
        borrarHijos(intentoContainer);
        pIntentos.innerHTML = "";
        abrirModal("Te quedaste sin intentos 😑", false, 1000, intentos);
        numero.value = "";
        random = generarNumeroAleatorio(select.value);
    }

    pHighscore.innerHTML = `Highscore ${select.value}: ${highscores[select.value]}`;
    score.innerHTML = `Score: ${intentos}`;
});

document.getElementsByClassName("close")[0].addEventListener("click", function () {
    document.getElementById("modal").style.display = "none";
});

select.addEventListener('change', function () {
    aplicarNivel(select.value);
    select.value === 'dificilisimo2' ? (pista.innerHTML = 'Probá con 500 mil', sugerencia = 500000, 
    pista.classList.add('pCorrecto'), numero.value = sugerencia) : pista.innerHTML = "";
    random = generarNumeroAleatorio(select.value);
    intentos = 20;
    pHighscore.innerHTML = `Highscore ${select.value}: ${highscores[select.value]}`;
    score.innerHTML = `Score: ${intentos}`;
});

function aplicarNivel(nivel) {
    const nivelClases = {
        'facilisimo': 'facilisimo',
        'facil': 'facil',
        'medio': 'medio',
        'dificil': 'dificil',
        'dificilisimo': 'dificilisimo',
        'dificilisimo2': 'dificilisimo2'
    };

    const clase = nivelClases[nivel];

    if (clase) {
        container.classList.replace(container.classList[0], clase);
    }
}

function intento(datos) {
    let numIngresado = Number(datos.num);
    let max = obtenerMaximo();

    if (datos.tipo !== 'dificilisimo2') {
        if (datos.intentos > 0) {
            if (numIngresado > max || numIngresado < 0) {
                pista.innerHTML = `El valor debe ser mayor a 0 y menor a ${max}`;
                pista.classList.add('pIncorrecto');
                return datos.intentos;
            }
            if (numIngresado > random) {
                mostrarIntento(true, numIngresado, datos.intentos);
                abrirModal("Muy Alto!", false, 700, datos.intentos);
            } else if (numIngresado < random) {
                mostrarIntento(false, numIngresado, datos.intentos);
                abrirModal("Muy bajo!", false, 700, datos.intentos);
            } else {
                objetivo.innerHTML = `El número que encontraste fue el: ${numIngresado}`;
                borrarHijos(intentoContainer);
                abrirModal("Ganaste! 😎", true, 2000, datos.intentos);
                random = generarNumeroAleatorio(select.value);
                if (highscores[select.value] < intentos) {
                    highscores[select.value] = intentos;
                    localStorage.setItem(select.value, intentos);
                }
                return datos.intentos = 20;
            }
            return --datos.intentos;
        } 
    } else {
      return ayudaPC(datos);
    }
}

function ayudaPC(datos) {
    let numIngresado = Number(datos.num);

    if (numIngresado === sugerencia) {
        if (sugerencia > random) {
            sugerenciaMax = sugerencia;
            sugerencia = Math.round((sugerenciaMax + sugerenciaMin) / 2);
            mostrarIntento(true, numIngresado, datos.intentos);
            pista.classList.add('pCorrecto');
            pista.innerHTML = `Probá con: ${sugerencia}`;
        } else if (sugerencia < random) {
            sugerenciaMin = sugerencia;
            sugerencia = Math.round((sugerenciaMax + sugerenciaMin) / 2);
            mostrarIntento(false, numIngresado, datos.intentos);
            pista.classList.add('pCorrecto');
            pista.innerHTML = `Probá con: ${sugerencia}`; 
        } else {
            objetivo.innerHTML = `El número que encontraste fue el: ${numIngresado}`;
            borrarHijos(intentoContainer);
            random = generarNumeroAleatorio(select.value);
            abrirModal("Ganaste! 😎", true, 2000, datos.intentos);
            sugerencia = 500000;
            pista.innerHTML = `Probá con: ${sugerencia}`; 
            numero.value = sugerencia;
            sugerenciaMax = 1000000;
            sugerenciaMin = 0;
            if (highscores[select.value] < intentos) {
                highscores[select.value] = intentos;
                localStorage.setItem(select.value, intentos);
            }
            return datos.intentos = 20;
        }
    }
    numero.value = sugerencia;
    return --datos.intentos;
}

function mostrarIntento(alto, num, intento) {
    const nuevoParrafo = document.createElement('p');

    alto ? nuevoParrafo.innerHTML = `Intento numero: ${intento}: el numero ${num} fue muy alto`
        : nuevoParrafo.innerHTML = `Intento numero: ${intento}: el numero ${num} fue muy bajo`;

    const primerParrafo = intentoContainer.firstChild;
    intentoContainer.insertBefore(nuevoParrafo, primerParrafo);
}

function generarNumeroAleatorio(dificultad) {
    let maximo;
    let subtituloText;

    switch (dificultad) {
        case 'facilisimo':
            maximo = 20;
            subtituloText = 'Adivine el número entre 0 y veinte, te daré pistas.';
            break;
        case 'facil':
            maximo = 100;
            subtituloText = 'Adivine el número entre 0 y cien, te daré pistas.';
            break;
        case 'medio':
            maximo = 100000;
            subtituloText = 'Adivine el número entre 0 y 100 mil, te daré pistas.';
            break;
        case 'dificil':
            maximo = 250000;
            subtituloText = 'Adivine el número entre 0 y 250 mil, te daré pistas.';
            break;
        case 'dificilisimo':
            maximo = 1000000;
            subtituloText = 'Adivine el número entre 0 y 1 millón, te daré pistas.';
            break;
        case 'dificilisimo2':
            maximo = 1000000;
            subtituloText = 'Adivine el número entre 0 y 1 millón, te daré pistas.';
            break;
        default: break;
    }

    subtitulo.innerHTML = subtituloText;
    return Math.round(Math.random() * maximo);
}

function borrarHijos(contenedor) {
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
}

function abrirModal(msg, estado, timer, score) {
    clearTimeout(timeoutId);
    modal.style.display = "block";
    msgModal.innerHTML = msg;
    modalContent.className = "modal-content";
    pista.className = "pista";
    pista.innerHTML = msg;

    if (estado) {
        modalContent.classList.add('modalCorrecto');
        numero.value = "";
        pModal.innerHTML = `Score: ${score}`;
        random = generarNumeroAleatorio(select.value);
    } else {
        pModal.innerHTML = "";
        modalContent.classList.add('modalIncorrecto');
        pista.classList.add('pIncorrecto');
    }

    timeoutId = setTimeout(() => {
        modal.style.display = "none";
    }, timer);
}

function obtenerMaximo() {
    const maximo = {
        'facilisimo': 20,
        'facil': 100,
        'medio': 100000,
        'dificil': 250000,
        'dificilisimo': 1000000,
        'dificisilimo2': 1000000
    };

    return maximo[select.value];
}

reiniciar.addEventListener('click', function () {
    random = generarNumeroAleatorio(select.value);
    intentos = 20;
    pIntentos.innerHTML = `Te quedan: ${intentos} intentos`;
    select.value === 'dificilisimo2' ? (pista.innerHTML = 'Probá con 500 mil', sugerencia = 500000) : pista.innerHTML = "";
    objetivo.innerHTML = "";
    numero.value = "";
    score.innerHTML = `Score: ${intentos}`;
});
