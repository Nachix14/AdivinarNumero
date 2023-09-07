const form = document.getElementById('form');
const reiniciar = document.getElementById('reiniciar');
const pHighscore = document.getElementById('highscore');
const score = document.getElementById('score');
const pista = document.getElementById('pista');
const objetivo = document.getElementById('objetivo');
const pIntentos = document.getElementById('intento');
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const numero = document.getElementById('numero');
const msgModal = document.getElementById("msgModal");
const select = document.getElementById('dificultad');
const subtitulo = document.getElementById('subtitulo');
const intentoContainer = document.getElementById('intento-container');

let random = generarNumeroAleatorio(select.value);
let intentos = 20;
let highscores = {
    facilisimo: localStorage.getItem('facilisimo') || 0,
    facil: localStorage.getItem('facil') || 0,
    medio: localStorage.getItem('medio') || 0,
    dificil: localStorage.getItem('dificil') || 0,
    dificilisimo: localStorage.getItem('dificilisimo') || 0
};
let timeoutId;

pHighscore.innerHTML = `Highscore ${select.value}: ${highscores[select.value]}`;
pIntentos.innerHTML = `Te quedan: ${intentos} intentos`;

form.addEventListener('submit', function (event) {
    event.preventDefault();

    let datosEntrada = { num: numero.value, intentos };

    if (numero.value) {
        intentos = intento(datosEntrada);
        pIntentos.innerHTML = `Te quedan: ${intentos} intentos`;
    }

    pHighscore.innerHTML = `Highscore ${select.value}: ${highscores[select.value]}`;
    score.innerHTML = `Score: ${intentos}`;
});

document.getElementsByClassName("close")[0].addEventListener("click", function () {
    document.getElementById("modal").style.display = "none";
});

select.addEventListener('change', function () {
    random = generarNumeroAleatorio(select.value);
    intentos = 20;
    pista.innerHTML = "";
    pHighscore.innerHTML = `Highscore ${select.value}: ${highscores[select.value]}`;
    score.innerHTML = `Score: ${intentos}`;
});

function intento(datos) {
    let max = obtenerMaximo();
    if (datos.intentos > 1) {
        if (datos.num > max || datos.num < 0) {
            pista.innerHTML = `El valor debe ser mayor a 0 y menor a ${max}`;
            pista.classList.add('pIncorrecto');
            return datos.intentos;
        }
        if (datos.num > random) {
            mostrarIntento(true, datos.num, datos.intentos);
            abrirModal("Muy Alto!", false, 700);
        } else if (datos.num < random) {
            mostrarIntento(false, datos.num, datos.intentos);
            abrirModal("Muy bajo!", false, 700);
        } else {
            objetivo.innerHTML = `El número que encontraste fue el: ${datos.num}`;
            borrarHijos(intentoContainer);
            abrirModal("Ganaste! 😎", true, 2000);
            if (highscores[select.value] < intentos) {
                highscores[select.value] = intentos;
                localStorage.setItem(select.value, intentos);
            }
            return datos.intentos = 20;
        }
        return --datos.intentos;
    } else {
        objetivo.innerHTML = `El número a encontrar era el: ${random}`;
        borrarHijos(intentoContainer);
        pIntentos.innerHTML = "";
        abrirModal("Te quedaste sin intentos 😑", false, 1000);
        numero.value = "";
        random = generarNumeroAleatorio(select.value);
        return datos.intentos = 20;
    }
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
            maximo = 50000;
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

function abrirModal(msg, estado, timer) {
    clearTimeout(timeoutId);
    modal.style.display = "block";
    msgModal.innerHTML = msg;
    modalContent.className = "modal-content";
    pista.className = "pista";
    pista.innerHTML = msg;

    if (estado) {
        modalContent.classList.add('modalCorrecto');
        numero.value = "";
        random = generarNumeroAleatorio(select.value);
    } else {
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
        'medio': 50000,
        'dificil': 250000,
        'dificilisimo': 1000000
    };

    return maximo[select.value];
}

reiniciar.addEventListener('click', function () {
    random = generarNumeroAleatorio(select.value);
    intentos = 20;
    pIntentos.innerHTML = `Te quedan: ${intentos} intentos`;
    objetivo.innerHTML = "";
    pista.innerHTML = "";
    numero.value = "";
    score.innerHTML = `Score: ${intentos}`;
});