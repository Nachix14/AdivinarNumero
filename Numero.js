const form = document.getElementById('form');
const reiniciar = document.getElementById('reiniciar');
const pHighscore = document.getElementById('highscore');
const score = document.getElementById('score');
const pista = document.getElementById('pista');
const objetivo = document.getElementById('objetivo');
const container = document.getElementById('container');
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const numero = document.getElementById('numero');
const msgModal = document.getElementById("msgModal");
const select = document.getElementById('dificultad');
const subtitulo = document.getElementById('subtitulo');

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
console.log("numero a adivinar: ", random);

form.addEventListener('submit', function (event) {
    event.preventDefault();

    let datosEntrada = { num: numero.value, intentos };

    if (numero.value) {
        intentos = intento(datosEntrada);
    }

    pHighscore.innerHTML = `Highscore ${select.value}: ${highscores[select.value]}`;
    score.innerHTML = `Score: ${intentos}`;
});

document.getElementsByClassName("close")[0].addEventListener("click", function() {
    document.getElementById("modal").style.display = "none";
});

select.addEventListener('change', function () {
    random = generarNumeroAleatorio(select.value);
    intentos = 20;
    pHighscore.innerHTML = `Highscore ${select.value}: ${highscores[select.value]}`;
    score.innerHTML = `Score: ${intentos}`;
});

function intento(datos) {
    let max = obtenerMaximo();
    if (datos.intentos > 0) {
        if (datos.num > max || datos.num < 0) {
            pista.innerHTML = `El valor debe ser mayor a 0 y menor a ${max}`;
            return datos.intentos;
        } 
        if (datos.num > random) {
            abrirModal("Muy Alto!", false, 800);
        } else if (datos.num < random) {
            abrirModal("Muy bajo!", false, 800);
        } else {
            abrirModal("Correcto!", true, 2000);
            objetivo.innerHTML = `El número encontrado fue el: ${random}`;
            if (highscores[select.value] < intentos) {
                highscores[select.value] = intentos;
                localStorage.setItem(select.value, intentos);
            }
            return datos.intentos = 20;
        }
        return --datos.intentos;
} else {
    pista.innerHTML = "Te quedaste sin intentos.";
    abrirModal("Te quedaste sin intentos!", false, 1000);
    numero.value = "";
    random = generarNumeroAleatorio(select.value);
    return datos.intentos = 20;
}
}

function generarNumeroAleatorio(dificultad) {
    let maximo;
    let subtituloText;
    
    switch (dificultad) {
        case 'facilisimo': 
            maximo = 20;
            subtituloText = 'Adivine el número del 0 y veinte, te daré pistas.';
            break;
        case 'facil':
            maximo = 100;
            subtituloText = 'Adivine el número del 0 y cien, te daré pistas.';
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

function abrirModal(msg, estado, timer) {
    clearTimeout(timeoutId);
    modal.style.display = "block";
    msgModal.innerHTML = msg;
    modalContent.className = "modal-content";
    pista.className = "pista";
    pista.innerHTML = msg;
    if (estado) {
        modalContent.classList.add('modalCorrecto');
        container.classList.add('correcto');
        pista.classList.add('pCorrecto');
        numero.value = "";
        random = generarNumeroAleatorio(select.value);
    } else {
        container.classList.add('incorrecto');
        modalContent.classList.add('modalIncorrecto');
        pista.classList.add('pIncorrecto');
    }

    timeoutId = setTimeout(() => {
        estado ? container.classList.remove('correcto') : container.classList.remove('incorrecto');
        modal.style.display = "none";
    }, timer);
}

function obtenerMaximo() {
    let maximo;
    switch (select.value) {
        case 'facilisimo':
            maximo = 20;
            break;
        case 'facil':
            maximo = 100;
            break;
        case 'medio':
            maximo = 50000;
            break;
        case 'dificil':
            maximo = 250000;
            break;
        case 'dificilisimo':
            maximo = 1000000;
            break;
        default: break;
    }
    return maximo;
}

reiniciar.addEventListener('click', function () {
    container.classList.remove('correcto');
    random = generarNumeroAleatorio(select.value);
    intentos = 20;
    console.log('numero a adivinar: ', random);
    pista.innerHTML = "";
    numero.value = "";
    score.innerHTML = `Score: ${intentos}`;
});