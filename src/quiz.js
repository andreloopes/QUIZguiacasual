/* Quiz JavaScript - Spinoff SP */

const questions = [
  {
    id: 1,
    title: "Qual estilo de experiência gastronômica você procura hoje?",
    options: [
      { text: "Sofisticada & Exclusiva (Alta Gastronomia)", value: "fine-dining" },
      { text: "Casual, Descontraída & Acolhedora", value: "casual" }
    ]
  },
  {
    id: 2,
    title: "Qual é o clima ou ocasião principal da visita?",
    options: [
      { text: "Um encontro romântico ou jantar intimista", value: "romantic" },
      { text: "Celebrar com a família ou reunir amigos", value: "family-friends" },
      { text: "Um almoço ou jantar de negócios produtivo", value: "business" },
      { text: "Uma verdadeira aventura para explorar novos sabores", value: "experience" }
    ]
  },
  {
    id: 3,
    title: "Qual culinária mais atrai o seu paladar hoje?",
    options: [
      { text: "Massas artesanais e clássicos italianos", value: "italian" },
      { text: "Sushis, grelhados e iguarias asiáticas", value: "asian" },
      { text: "Pratos autênticos e ingredientes da cozinha brasileira", value: "brazilian" },
      { text: "Pratos autorais e contemporâneos sem fronteiras", value: "creative" }
    ]
  }
];

let currentStep = 0; // 0 = Intro, 1, 2, 3 = Questions, 4 = Results
let answers = [];
let restaurants = [];

// DOM Elements
const introScreen = document.getElementById('intro-screen');
const questionScreen = document.getElementById('question-screen');
const resultsScreen = document.getElementById('results-screen');
const questionTitle = document.getElementById('question-title');
const optionsList = document.getElementById('options-list');
const progressBar = document.getElementById('progress-bar');
const recommendationsContainer = document.getElementById('recommendations-container');

const btnStart = document.getElementById('btn-start');
const btnRestart = document.getElementById('btn-restart');

// Fetch and load restaurants
async function loadData() {
  try {
    const response = await fetch('restaurants.json');
    if (!response.ok) throw new Error('Failed to load database.');
    const data = await response.json();
    // Filter to São Paulo restaurants only
    restaurants = data.filter(r => r.city === 'São Paulo');
  } catch (error) {
    console.error('Error loading quiz data:', error);
  }
}

// Start
btnStart.addEventListener('click', () => {
  currentStep = 1;
  answers = [];
  showStep();
});

btnRestart.addEventListener('click', () => {
  currentStep = 1;
  answers = [];
  showStep();
});

function showStep() {
  // Hide all screens
  introScreen.classList.remove('active');
  questionScreen.classList.remove('active');
  resultsScreen.classList.remove('active');
  
  // Progress Bar
  const progressPercent = currentStep === 0 ? 0 : currentStep === 4 ? 100 : ((currentStep - 1) / questions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;

  if (currentStep === 0) {
    introScreen.classList.add('active');
  } else if (currentStep <= questions.length) {
    const question = questions[currentStep - 1];
    questionTitle.textContent = question.title;
    optionsList.innerHTML = '';
    
    question.options.forEach(opt => {
      const button = document.createElement('button');
      button.className = 'option-btn';
      button.textContent = opt.text;
      button.addEventListener('click', () => handleAnswer(opt.value));
      optionsList.appendChild(button);
    });
    
    questionScreen.classList.add('active');
  } else {
    showResults();
  }
}

function handleAnswer(value) {
  answers.push(value);
  currentStep++;
  showStep();
}

function showResults() {
  // Score restaurants
  const scored = restaurants.map(r => {
    let score = 0;
    const desc = (r.description || '').toLowerCase();
    const cuisine = (r.cuisine || '').toLowerCase();

    // Q1: Style
    if (answers[0] === 'fine-dining') {
      if (r.rank <= 30) score += 5;
      if (desc.includes('degustação') || desc.includes('michelin') || desc.includes('etapas')) score += 3;
    } else if (answers[0] === 'casual') {
      if (r.rank > 30) score += 5;
      if (desc.includes('casual') || desc.includes('descontraído') || desc.includes('descontraída') || desc.includes('à la carte')) score += 3;
    }

    // Q2: Occasion
    if (answers[1] === 'romantic') {
      if (desc.includes('romântico') || desc.includes('casal') || desc.includes('intimista') || desc.includes('luz de velas') || desc.includes('encontro')) score += 5;
      if (cuisine === 'italiana' || cuisine === 'japonesa') score += 2;
    } else if (answers[1] === 'family-friends') {
      if (desc.includes('família') || desc.includes('amigos') || desc.includes('compartilhar') || desc.includes('grupo') || desc.includes('turma')) score += 5;
      if (cuisine === 'brasileira' || r.rank > 40) score += 2;
    } else if (answers[1] === 'business') {
      if (desc.includes('negócios') || desc.includes('corporativo') || desc.includes('reunião') || desc.includes('executivo')) score += 5;
      if (r.rank <= 30) score += 2;
    } else if (answers[1] === 'experience') {
      if (desc.includes('degustação') || desc.includes('etapas') || desc.includes('autoral') || desc.includes('inovador') || desc.includes('experiência')) score += 5;
      if (r.rank <= 15) score += 3;
    }

    // Q3: Cuisine
    if (answers[2] === 'italian') {
      if (cuisine === 'italiana') score += 10;
    } else if (answers[2] === 'asian') {
      if (cuisine === 'japonesa' || cuisine === 'asiática') score += 10;
    } else if (answers[2] === 'brazilian') {
      if (cuisine === 'brasileira' || cuisine === 'carnes') score += 10;
    } else if (answers[2] === 'creative') {
      if (cuisine === 'contemporânea') score += 10;
    }

    return { ...r, score };
  });

  // Sort by score desc, then by rank asc
  scored.sort((a, b) => b.score - a.score || a.rank - b.rank);

  // Take top 3
  const top3 = scored.slice(0, 3);

  // Render cards
  recommendationsContainer.innerHTML = '';
  top3.forEach(r => {
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    
    // Check if image exists, use fallback if not
    const imagePath = r.imageUrl || 'Restaurantes 2026/fallback.jpg';

    card.innerHTML = `
      <div class="rec-image-wrapper">
        <img class="rec-image" src="${imagePath}" alt="${r.name}" onerror="this.src='Restaurantes 2026/1.jpg'">
      </div>
      <div class="rec-info">
        <div>
          <div class="rec-header">
            <div class="rec-name-group">
              <span class="rec-name">${r.name}</span>
              <span class="rec-cuisine">${r.cuisine} • ${r.city}</span>
            </div>
            <span class="rec-rank">${r.rank}º Lugar</span>
          </div>
          <p class="rec-description">${r.description}</p>
        </div>
        <a class="rec-link" href="https://ranking100restaurantes.exame.com/?restaurant=${r.rank}" target="_parent">Ver no Guia Completo</a>
      </div>
    `;
    recommendationsContainer.appendChild(card);
  });

  resultsScreen.classList.add('active');
}

// Check for parent theme on load
function initTheme() {
  // Set theme from query param or prefers-color-scheme
  const params = new URLSearchParams(window.location.search);
  const theme = params.get('theme');
  if (theme === 'dark' || theme === 'light') {
    document.body.className = `${theme}-theme`;
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.className = prefersDark ? 'dark-theme' : 'light-theme';
  }
}

// Initialise
initTheme();
loadData().then(() => {
  currentStep = 0;
  showStep();
});
