const usersDatabase = [
  {
    email: "idiomasfyd@gmail.com",
    password: "Fyd@12345",
    name: "Follow Your Dreams Idiomas"
  }
];

const lessons = [
  {
    id: 1,
    level: "A1",
    language: "Español",
    audience: "Teens/Adulto",
    type: "Filme / animação",
    title: "Saludos con Toy Story",
    subtitle: "Aprende a saludar, presentarte y hablar de tus amigos.",
    theme: "Saludos, nombres y amistad",
    cefrPrimary: "A1",
    posterClass: "toy",
    presentationLink: "a1_toy_story.html"
  },
  {
    id: 2,
    level: "A2",
    language: "Español",
    audience: "Teens/Adulto",
    type: "Filme / animação",
    title: "Hablando de películas y series",
    subtitle: "Aprende a expresar opiniones y recomendaciones en español.",
    theme: "Opiniones y recomendaciones",
    cefrPrimary: "A2",
    posterClass: "coco",
    presentationLink: "a2_coco.html"
  },
  {
    id: 3,
    level: "B1",
    language: "Español",
    audience: "Teens/Adulto",
    type: "Serie / comedia",
    title: "Situaciones y opiniones en la oficina",
    subtitle: "Practica opiniones, acuerdos, desacuerdos y situaciones cotidianas.",
    theme: "Opiniones, trabajo y comunicación",
    cefrPrimary: "B1",
    posterClass: "office",
    presentationLink: "b1_the_office.html"
  },
  {
    id: 4,
    level: "B2",
    language: "Español",
    audience: "Teens/Adulto",
    type: "Filme / animação",
    title: "Tecnología, planeta y futuro",
    subtitle: "Debate problemas ambientales, consumo y tecnología usando WALL·E.",
    theme: "Medio ambiente, tecnología y sociedad",
    cefrPrimary: "B2",
    posterClass: "walle",
    presentationLink: "b2_walle.html"
  },
  {
    id: 5,
    level: "A1",
    language: "Español",
    audience: "Teens/Adulto",
    type: "Filme / animação",
    title: "Colores y emociones con Monstruos S.A.",
    subtitle: "Aprende colores, emociones simples y descripciones básicas.",
    theme: "Colores, emociones y descripciones",
    cefrPrimary: "A1",
    posterClass: "monsters",
    presentationLink: "a1_monstruos.html"
  },
  {
    id: 6,
    level: "A2",
    language: "Español",
    audience: "Teens/Adulto",
    type: "Filme / animação",
    title: "Emociones y cambios con Del Revés",
    subtitle: "Practica emociones, cambios de vida y opiniones personales.",
    theme: "Emociones, cambios y experiencias",
    cefrPrimary: "A2",
    posterClass: "insideout",
    presentationLink: "a2_del_reves.html"
  }
];

const levelOrder = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1"
];

let selectedLesson = null;
let completedLessons = [];

try {
  completedLessons = JSON.parse(localStorage.getItem("dreamovieCompletedLessons")) || [];
} catch (error) {
  completedLessons = [];
  localStorage.setItem("dreamovieCompletedLessons", JSON.stringify([]));
}

function login() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const error = document.getElementById("loginError");

  if (!emailInput || !passwordInput) {
    alert("Erro: os campos de login não foram encontrados no index.html.");
    return;
  }

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  const foundUser = usersDatabase.find(user => {
    return user.email.toLowerCase() === email && user.password === password;
  });

  if (!foundUser) {
    if (error) {
      error.innerText = "Usuário ou senha incorretos.";
    }
    return;
  }

  if (error) {
    error.innerText = "";
  }

  localStorage.setItem("dreamovieLogged", "true");
  showPlatform();
}

function logout() {
  localStorage.removeItem("dreamovieLogged");

  const app = document.getElementById("app");
  const loginScreen = document.getElementById("loginScreen");

  if (app) app.classList.add("hidden");
  if (loginScreen) loginScreen.classList.remove("hidden");
}

function showPlatform() {
  const app = document.getElementById("app");
  const loginScreen = document.getElementById("loginScreen");

  if (loginScreen) loginScreen.classList.add("hidden");
  if (app) app.classList.remove("hidden");

  renderLessonsByLevel();
  updateProgress();

  setTimeout(() => {
    const aulas = document.getElementById("aulas");
    if (aulas) {
      aulas.scrollIntoView({ behavior: "smooth" });
    }
  }, 150);
}

function renderLessonsByLevel() {
  const levelsContainer = document.getElementById("levelsContainer");
  const sideLessons = document.getElementById("sideLessons");

  if (!levelsContainer) {
    console.error("Erro: não encontrei o elemento #levelsContainer no index.html");
    return;
  }

  levelsContainer.innerHTML = "";

  if (sideLessons) {
    sideLessons.innerHTML = "";
  }

  const groupedLessons = lessons.reduce((groups, lesson) => {
    if (!groups[lesson.level]) {
      groups[lesson.level] = [];
    }

    groups[lesson.level].push(lesson);
    return groups;
  }, {});

  levelOrder.forEach(level => {
    const lessonsFromLevel = groupedLessons[level];

    if (!lessonsFromLevel || lessonsFromLevel.length === 0) {
      return;
    }

    const section = document.createElement("section");
    section.className = "level-section";

    section.innerHTML = `
      <div class="level-header">
        <div>
          <h3>${level}</h3>
          <span>${lessonsFromLevel.length} material(is) disponível(is)</span>
        </div>
      </div>
      <div class="level-row"></div>
    `;

    const row = section.querySelector(".level-row");

    lessonsFromLevel.forEach(lesson => {
      row.appendChild(createLessonCard(lesson));

      if (sideLessons) {
        sideLessons.appendChild(createSideLesson(lesson));
      }
    });

    levelsContainer.appendChild(section);
  });
}

function createLessonCard(lesson) {
  const isCompleted = completedLessons.includes(lesson.id);

  const card = document.createElement("article");
  card.className = "course-card";
  card.onclick = () => openPresentation(lesson.id);

  card.innerHTML = `
    <div class="poster ${lesson.posterClass}">
      <div class="poster-overlay">
        <div class="cover-top">
          <span class="tag">${lesson.language}</span>
          <span class="dreamovie-mini">${lesson.level}</span>
        </div>

        <div class="lesson-logo-wrap">
          <div class="lesson-logo-bg"></div>
          <img
            class="lesson-logo"
            src="assets/logo-follow.png"
            alt="Follow Your Dreams"
            onerror="this.style.display='none';"
          />
        </div>

        <div class="poster-title-wrap">
          <h3>${lesson.title}</h3>
          <p class="poster-subtitle">${lesson.subtitle}</p>
        </div>

        <div class="cover-bottom">
          <div class="cover-info-block">
            <span class="cover-label">Level:</span>
            <div class="cefr-tags">
              <span class="cefr-badge">${lesson.cefrPrimary}</span>
            </div>
          </div>

          <div class="cover-info-block">
            <span class="cover-label">Lesson Theme:</span>
            <span class="cover-theme">${lesson.theme}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="course-info">
      <h4>${lesson.type}</h4>
      <p>${lesson.audience} • ${lesson.level}</p>

      <div class="meta">
        <span>${lesson.language}</span>
        <span>${lesson.audience}</span>
        <span>${isCompleted ? "Concluído" : "Disponível"}</span>
      </div>

      <button class="card-action" type="button">Acessar lição</button>
    </div>
  `;

  return card;
}

function createSideLesson(lesson) {
  const isCompleted = completedLessons.includes(lesson.id);

  const side = document.createElement("div");
  side.className = "side-lesson";

  side.innerHTML = `
    <h4>${lesson.title}</h4>
    <p>${lesson.level} • ${lesson.audience} • ${isCompleted ? "concluído" : "pendente"}</p>
  `;

  return side;
}

function openPresentation(id) {
  selectedLesson = lessons.find(lesson => lesson.id === id);

  if (!selectedLesson) {
    alert("Lição não encontrada.");
    return;
  }

  if (!selectedLesson.presentationLink || selectedLesson.presentationLink === "#") {
    alert("O link da apresentação ainda não foi cadastrado para este material.");
    return;
  }

  markLessonAsStarted(selectedLesson.id);
  window.location.href = selectedLesson.presentationLink;
}

function markLessonAsStarted(id) {
  if (!completedLessons.includes(id)) {
    completedLessons.push(id);
    localStorage.setItem("dreamovieCompletedLessons", JSON.stringify(completedLessons));
  }

  updateProgress();
}

function showHome() {
  showPlatform();
}

function updateProgress() {
  const total = lessons.length;
  const completed = completedLessons.length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const points = document.getElementById("points");
  const progressText = document.getElementById("progressText");
  const totalProgress = document.getElementById("totalProgress");

  if (points) points.innerText = completed;
  if (progressText) progressText.innerText = `${progress}%`;
  if (totalProgress) totalProgress.style.width = `${progress}%`;
}

window.addEventListener("DOMContentLoaded", () => {
  const isLogged = localStorage.getItem("dreamovieLogged") === "true";

  if (isLogged) {
    showPlatform();
  } else {
    renderLessonsByLevel();
    updateProgress();
  }
});
