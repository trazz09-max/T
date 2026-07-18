
const apps = [
  {id:'netflix',name:'Netflix',icon:'N',url:'https://www.netflix.com'},
  {id:'youtube',name:'YouTube',icon:'▶',url:'https://www.youtube.com'},
  {id:'disney',name:'Disney+',icon:'D+',url:'https://www.disneyplus.com'},
  {id:'prime',name:'Prime Video',icon:'prime',url:'https://www.amazon.com/gp/video/storefront'},
  {id:'max',name:'Max',icon:'max',url:'https://play.max.com'},
  {id:'hulu',name:'Hulu',icon:'hulu',url:'https://www.hulu.com'},
  {id:'peacock',name:'Peacock',icon:'P',url:'https://www.peacocktv.com'},
  {id:'paramount',name:'Paramount+',icon:'P+',url:'https://www.paramountplus.com'},
  {id:'espn',name:'ESPN',icon:'ESPN',url:'https://www.espn.com/watch'},
  {id:'mlbtv',name:'MLB.TV',icon:'MLB',url:'https://www.mlb.com/live-stream-games/'},
  {id:'mlb',name:'MLB.com',icon:'MLB',url:'https://www.mlb.com'},
  {id:'yankees',name:'Yankees',icon:'NY',url:'https://www.mlb.com/yankees'},
  {id:'ytmusic',name:'YouTube Music',icon:'♫',url:'https://music.youtube.com'}
];

const defaultFavorites = ['ytmusic','mlbtv','mlb','yankees','youtube'];
const getFavorites = () => JSON.parse(localStorage.getItem('betheaFavorites') || JSON.stringify(defaultFavorites));
const setFavorites = value => localStorage.setItem('betheaFavorites', JSON.stringify(value));

function appCard(app){
  return `<a class="app-card" href="${app.url}" target="_blank" rel="noopener">
    <div class="app-icon">${app.icon}</div>
    <div class="app-name">${app.name}</div>
  </a>`;
}

function renderApps(){
  document.getElementById('homeStreaming').innerHTML = apps.slice(0,5).map(appCard).join('');
  document.getElementById('streamingGrid').innerHTML = apps.slice(0,10).map(appCard).join('');

  const favorites = getFavorites();
  const favoriteApps = favorites.map(id => apps.find(app => app.id === id)).filter(Boolean);
  document.getElementById('homeFavorites').innerHTML = favoriteApps.map(appCard).join('');
  document.getElementById('driveModeFavorites').innerHTML = favoriteApps.slice(0,5).map(appCard).join('');

  document.getElementById('favoritesEditor').innerHTML = apps.map(app => `
    <label class="favorite-option">
      <input type="checkbox" value="${app.id}" ${favorites.includes(app.id) ? 'checked' : ''}>
      <span>${app.icon}</span>
      <strong>${app.name}</strong>
    </label>
  `).join('');

  document.querySelectorAll('#favoritesEditor input').forEach(input => {
    input.addEventListener('change', () => {
      let current = getFavorites();
      if(input.checked && !current.includes(input.value)) current.push(input.value);
      if(!input.checked) current = current.filter(id => id !== input.value);
      setFavorites(current.slice(0,8));
      renderApps();
    });
  });
}

function showPage(pageId){
  document.querySelectorAll('.page').forEach(page => {
    page.classList.toggle('active', page.id === pageId);
  });
  document.querySelectorAll('.nav-button[data-page]').forEach(button => {
    button.classList.toggle('active', button.dataset.page === pageId);
  });
  document.getElementById('pageTitle').textContent =
    pageId === 'yankees' ? 'Yankees HQ' : pageId.charAt(0).toUpperCase() + pageId.slice(1);
  window.scrollTo(0,0);
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-page]');
  if(!button) return;
  event.preventDefault();
  showPage(button.dataset.page);
});

function updateClock(){
  const now = new Date();
  const currentTime = now.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
  document.getElementById('clock').textContent = currentTime;
  document.getElementById('driveModeClock').textContent = currentTime;
  document.getElementById('date').textContent =
    now.toLocaleDateString([], {weekday:'short', month:'short', day:'numeric'});
}
updateClock();
setInterval(updateClock, 1000);

const getNotes = () => JSON.parse(localStorage.getItem('betheaNotes') || '[]');
const saveNotes = notes => localStorage.setItem('betheaNotes', JSON.stringify(notes));

function renderNotes(){
  const notes = getNotes();
  const quickHtml = notes.slice(0,3).map((note,index) => `
    <div class="note-item"><span>${note}</span><button data-delete-note="${index}">×</button></div>
  `).join('');
  document.getElementById('quickNotes').innerHTML =
    quickHtml || '<span style="color:#9aa3ad;font-size:13px">No notes yet.</span>';

  document.getElementById('fullNotes').innerHTML = notes.map((note,index) => `
    <div class="full-note"><span>${note}</span><button data-delete-note="${index}">Delete</button></div>
  `).join('');
}

function addNote(text){
  const cleaned = text.trim();
  if(!cleaned) return;
  const notes = getNotes();
  notes.unshift(cleaned);
  saveNotes(notes.slice(0,20));
  renderNotes();
}

document.getElementById('quickNoteForm').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.getElementById('quickNoteInput');
  addNote(input.value);
  input.value = '';
});

document.getElementById('fullNoteForm').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.getElementById('fullNoteInput');
  addNote(input.value);
  input.value = '';
});

document.addEventListener('click', event => {
  const button = event.target.closest('[data-delete-note]');
  if(!button) return;
  const notes = getNotes();
  notes.splice(Number(button.dataset.deleteNote),1);
  saveNotes(notes);
  renderNotes();
});

renderApps();
renderNotes();


const driveModeOverlay = document.getElementById('driveModeOverlay');
const mainHeroImage = document.getElementById('mainHeroImage');
const driveModeHeroImage = document.getElementById('driveModeHeroImage');

function setActiveHero(source){
  mainHeroImage.src = source;
  driveModeHeroImage.src = source;
}

document.getElementById('driveModeButton').addEventListener('click', () => {
  driveModeOverlay.classList.remove('hidden');
  loadWeather();
  loadBaseballGames();
});

document.getElementById('exitDriveMode').addEventListener('click', () => {
  driveModeOverlay.classList.add('hidden');
});

document.getElementById('openGalleryFromDrive').addEventListener('click', () => {
  driveModeOverlay.classList.add('hidden');
  showPage('gallery');
});

document.getElementById('refreshGames').addEventListener('click', loadBaseballGames);

const weatherIcons = {
  0:'☀',1:'🌤',2:'⛅',3:'☁',45:'🌫',48:'🌫',
  51:'🌦',53:'🌦',55:'🌧',56:'🌧',57:'🌧',
  61:'🌧',63:'🌧',65:'🌧',66:'🌧',67:'🌧',
  71:'🌨',73:'🌨',75:'❄',77:'❄',
  80:'🌦',81:'🌧',82:'⛈',85:'🌨',86:'❄',
  95:'⛈',96:'⛈',99:'⛈'
};

function weatherDescription(code){
  if(code === 0) return 'Clear';
  if([1,2].includes(code)) return 'Partly cloudy';
  if(code === 3) return 'Cloudy';
  if([45,48].includes(code)) return 'Foggy';
  if(code >= 51 && code <= 67) return 'Rain';
  if(code >= 71 && code <= 86) return 'Snow';
  if(code >= 95) return 'Thunderstorms';
  return 'Mixed conditions';
}

async function loadWeather(){
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=27.8661&longitude=-82.3265&current=temperature_2m,apparent_temperature,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&timezone=America%2FNew_York&forecast_days=6';
  try{
    const response = await fetch(url);
    if(!response.ok) throw new Error('Weather request failed');
    const data = await response.json();
    const code = data.current.weather_code;
    document.getElementById('currentWeatherTemp').textContent = `${Math.round(data.current.temperature_2m)}°F`;
    document.getElementById('currentWeatherIcon').textContent = weatherIcons[code] || '☀';
    document.getElementById('currentWeatherText').textContent =
      `${weatherDescription(code)} · Feels like ${Math.round(data.current.apparent_temperature)}°F`;

    const days = data.daily.time.slice(1,6);
    document.getElementById('fiveDayForecast').innerHTML = days.map((date,index) => {
      const i = index + 1;
      const weekday = new Date(`${date}T12:00:00`).toLocaleDateString([], {weekday:'short'});
      return `<div class="forecast-day">
        <strong>${weekday}</strong>
        <span class="forecast-icon">${weatherIcons[data.daily.weather_code[i]] || '☀'}</span>
        <span>${Math.round(data.daily.temperature_2m_max[i])}° / ${Math.round(data.daily.temperature_2m_min[i])}°</span>
        <small>${data.daily.precipitation_probability_max[i] ?? 0}% rain</small>
      </div>`;
    }).join('');
  }catch(error){
    document.getElementById('currentWeatherTemp').textContent = 'Weather unavailable';
    document.getElementById('currentWeatherText').textContent = 'Tap Weather.com below for the latest forecast.';
    document.getElementById('fiveDayForecast').innerHTML = '';
  }
}

function formatGameStatus(game){
  const status = game.status?.abstractGameState || '';
  const detailed = game.status?.detailedState || '';
  const inning = game.linescore?.currentInningOrdinal;
  const half = game.linescore?.inningHalf;
  if(status === 'Live') return `${half || ''} ${inning || ''}`.trim() || 'Live';
  if(status === 'Final') return 'Final';
  const gameDate = new Date(game.gameDate);
  return gameDate.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
}

async function loadBaseballGames(){
  const container = document.getElementById('todayGames');
  container.innerHTML = '<div class="loading-card">Loading today’s games…</div>';
  const today = new Date();
  const date = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&hydrate=linescore`;
  try{
    const response = await fetch(url);
    if(!response.ok) throw new Error('MLB request failed');
    const data = await response.json();
    const games = data.dates?.[0]?.games || [];
    if(!games.length){
      container.innerHTML = '<div class="loading-card">No MLB games scheduled today.</div>';
      return;
    }
    container.innerHTML = games.map(game => {
      const away = game.teams.away;
      const home = game.teams.home;
      const status = formatGameStatus(game);
      const detail = game.status?.detailedState || '';
      return `<a class="game-card" href="https://www.mlb.com/gameday/${game.gamePk}" target="_blank" rel="noopener">
        <div class="game-status">${status}</div>
        <div class="game-team"><strong>${away.team.name}</strong><span>${away.score ?? '-'}</span></div>
        <div class="game-team"><strong>${home.team.name}</strong><span>${home.score ?? '-'}</span></div>
        <div class="game-detail">${detail}</div>
      </a>`;
    }).join('');
  }catch(error){
    container.innerHTML = '<a class="loading-card" href="https://www.mlb.com/scores" target="_blank" rel="noopener">Live scores unavailable here. Open MLB Scores.</a>';
  }
}

/* Photo gallery stored in IndexedDB so uploaded images persist in this browser. */
const galleryDbPromise = new Promise((resolve,reject) => {
  const request = indexedDB.open('betheaDashboardGallery',1);
  request.onupgradeneeded = () => {
    const db = request.result;
    if(!db.objectStoreNames.contains('photos')){
      db.createObjectStore('photos',{keyPath:'id',autoIncrement:true});
    }
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

async function getGalleryPhotos(){
  const db = await galleryDbPromise;
  return new Promise((resolve,reject) => {
    const tx = db.transaction('photos','readonly');
    const request = tx.objectStore('photos').getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function addGalleryPhoto(file){
  const db = await galleryDbPromise;
  return new Promise((resolve,reject) => {
    const tx = db.transaction('photos','readwrite');
    tx.objectStore('photos').add({name:file.name, blob:file, added:Date.now()});
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function deleteGalleryPhoto(id){
  const db = await galleryDbPromise;
  return new Promise((resolve,reject) => {
    const tx = db.transaction('photos','readwrite');
    tx.objectStore('photos').delete(id);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function loadSavedHero(){
  const savedId = localStorage.getItem('betheaHeroPhotoId');
  if(!savedId) return;
  const photos = await getGalleryPhotos();
  const photo = photos.find(item => String(item.id) === savedId);
  if(photo) setActiveHero(URL.createObjectURL(photo.blob));
}

async function renderGallery(){
  const grid = document.getElementById('galleryGrid');
  try{
    const photos = await getGalleryPhotos();
    if(!photos.length){
      grid.innerHTML = '<div class="gallery-empty">Your uploaded photos will appear here.</div>';
      return;
    }
    grid.innerHTML = '';
    photos.sort((a,b) => b.added-a.added).forEach(photo => {
      const imageUrl = URL.createObjectURL(photo.blob);
      const item = document.createElement('article');
      item.className = 'gallery-item';
      item.innerHTML = `
        <img src="${imageUrl}" alt="${photo.name || 'Gallery photo'}">
        <div class="gallery-actions">
          <button class="use-photo">Use on Home</button>
          <button class="delete-photo">Delete</button>
        </div>`;
      item.querySelector('.use-photo').addEventListener('click', () => {
        localStorage.setItem('betheaHeroPhotoId', String(photo.id));
        setActiveHero(imageUrl);
        showPage('home');
      });
      item.querySelector('.delete-photo').addEventListener('click', async () => {
        await deleteGalleryPhoto(photo.id);
        if(localStorage.getItem('betheaHeroPhotoId') === String(photo.id)){
          localStorage.removeItem('betheaHeroPhotoId');
          setActiveHero('family-photo.jpg');
        }
        renderGallery();
      });
      grid.appendChild(item);
    });
  }catch(error){
    grid.innerHTML = '<div class="gallery-empty">The gallery could not be opened in this browser.</div>';
  }
}

document.getElementById('galleryUpload').addEventListener('change', async event => {
  for(const file of event.target.files){
    if(file.type.startsWith('image/')) await addGalleryPhoto(file);
  }
  event.target.value = '';
  renderGallery();
});

loadSavedHero();
renderGallery();
