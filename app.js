
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
  document.getElementById('clock').textContent =
    now.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
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
