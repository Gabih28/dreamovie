const slides = document.querySelectorAll(".slide");
const counter = document.getElementById("counter");

let currentSlide = 0;
let selectedWord = null;
let spanishVoices = [];
let audioUnlocked = false;

/* SLIDES */
function updateSlides(){
  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentSlide);
  });

  if(counter){
    counter.textContent = `${currentSlide + 1} / ${slides.length}`;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextSlide(){
  if(currentSlide < slides.length - 1){
    currentSlide++;
    updateSlides();
  }
}

function prevSlide(){
  if(currentSlide > 0){
    currentSlide--;
    updateSlides();
  }
}

/* QUIZ */
function checkAnswer(button, isCorrect, feedbackId){
  const feedback = document.getElementById(feedbackId);

  if(isCorrect){
    button.classList.add("correct");
    if(feedback) feedback.textContent = "¡Correcto! Muy bien.";
  } else {
    button.classList.add("wrong");
    if(feedback) feedback.textContent = "Casi. Intenta otra vez.";
  }
}

/* GERADOR DE FRASES */
function generateText(targetId, text){
  const target = document.getElementById(targetId);

  if(target){
    target.textContent = text;
  }
}

/* MATCHING */
function selectWord(button, word){
  selectedWord = word;

  document.querySelectorAll(".word").forEach(item => {
    item.style.outline = "none";
  });

  button.style.outline = "3px solid #ff5a1f";
}

function matchWord(button, word, feedbackId){
  const feedback = document.getElementById(feedbackId);

  if(!selectedWord){
    if(feedback) feedback.textContent = "Escolha primeiro uma palavra em espanhol.";
    return;
  }

  if(selectedWord === word){
    button.classList.add("correct");
    if(feedback) feedback.textContent = "¡Muy bien! Combinación correcta.";
  } else {
    button.classList.add("wrong");
    if(feedback) feedback.textContent = "Ainda não. Tente de novo.";
  }

  selectedWord = null;
}

/* ÁUDIO */
function loadSpanishVoices(){
  if(!("speechSynthesis" in window)){
    return [];
  }

  const voices = window.speechSynthesis.getVoices();

  spanishVoices = voices.filter(voice => {
    return voice.lang && voice.lang.toLowerCase().startsWith("es");
  });

  return spanishVoices;
}

function getBestSpanishVoice(){
  loadSpanishVoices();

  return (
    spanishVoices.find(voice => voice.lang === "es-ES") ||
    spanishVoices.find(voice => voice.lang === "es-MX") ||
    spanishVoices.find(voice => voice.lang === "es-US") ||
    spanishVoices.find(voice => voice.lang && voice.lang.toLowerCase().startsWith("es")) ||
    null
  );
}

function speakSpanish(text){
  if(!("speechSynthesis" in window)){
    alert("Seu navegador não suporta áudio automático.");
    return;
  }

  audioUnlocked = true;

  window.speechSynthesis.cancel();

  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "es-ES";
    utterance.rate = 0.82;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voice = getBestSpanishVoice();

    if(voice){
      utterance.voice = voice;
    }

    utterance.onerror = function(event){
      if(event.error === "interrupted" || event.error === "canceled"){
        return;
      }

      console.warn("Erro de áudio:", event.error);
    };

    window.speechSynthesis.speak(utterance);
  }, 160);
}

function activateAudio(){
  speakSpanish("Audio activado. Bienvenido a DreaMovie.");
}

function testAudio(){
  speakSpanish("Hola, bienvenido a DreaMovie.");
}

/* TECLADO */
document.addEventListener("keydown", event => {
  if(event.key === "ArrowRight") nextSlide();
  if(event.key === "ArrowLeft") prevSlide();
});

/* CARREGAR VOZES */
if("speechSynthesis" in window){
  loadSpanishVoices();

  window.speechSynthesis.onvoiceschanged = function(){
    loadSpanishVoices();
  };
}

updateSlides();