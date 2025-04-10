// TID OCH DATUM

function startTime() {
    const now = new Date();
    //PadStart lägger till en nolla och gör det till tvåsiffrigt
    const day = `${now.getDate()}`.padStart(2, 0); 
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minutes = `${now.getMinutes()}`.padStart(2, 0);
    document.getElementById('date').innerHTML = `<strong>${hour}:${minutes}</strong> ${day}/${month}/${year}`;
}

startTime();
setInterval(startTime, 60000);








// HÄMTA OCH VISA DAGENS VÄDER

const weatherContainer = document.querySelector('.weather');
if (!weatherContainer) {
    console.error('Kunde inte hitta weather-elementet. Kontrollera att det finns en element med klassen "weather".');
}

const renderError = function(msg) {
    if (weatherContainer) {
        weatherContainer.insertAdjacentText('beforeend', msg);
        weatherContainer.style.opacity = 1;
    }
};


const renderWeather = function(data) {
  if (!weatherContainer) return;
  
  // Skapa väderkortet med data
  const html = `
    <div class="weather-card">
        <h2>Dagens väder</h2>
        <div class="weather-icon">${getWeatherIcon(data.weather.icon)}</div>
        <div class="weather-details">
            <p class="temp">${data.weather.temperature}°C</p>
            <p>Luftfuktighet: ${data.weather.relative_humidity || 'N/A'}%</p>
            <p>Vind: ${data.weather.wind_speed_10 || 'N/A'} km/h</p>
        </div>
    </div>
`;

// Lägg till kortet i weather
weatherContainer.innerHTML = html;
weatherContainer.style.opacity = 1;
};

function getWeatherIcon(iconCode) {
    const iconMap = {
        'clear-day': '☀️',
        'clear-night': '🌙',
        'partly-cloudy-day': '⛅',
        'partly-cloudy-night': '☁️🌙',
        'cloudy': '☁️',
        'fog': '🌫️',
        'wind': '💨',
        'rain': '🌧️',
        'sleet': '🌨️',
        'snow': '❄️',
        'hail': '🌨️',
        'thunderstorm': '⛈️'
    };
    return iconMap[iconCode] || '🌡️'; // Default icon
}

const getWeather = function() {
// Sätt opacity till 0.5 medan data hämtas
if (weatherContainer) weatherContainer.style.opacity = 0.5;

    fetch('https://api.brightsky.dev/current_weather?lat=52.520008&lon=13.404954&tz=Europe/Berlin')
        .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
        .then(data => {
        console.log(data); // För debugging
        renderWeather(data);
    })
        .catch(error => {
        console.error('Error:', error);
        renderError(`Något gick fel: ${error.message}. Försök igen!`);
    })
        .finally(() => {
        if (weatherContainer) weatherContainer.style.opacity = 1;
    });
};

// Anropa funktionen för att hämta väderdata
getWeather();









// LÄGGA TILL OCH SPARA LÄNKAR I LOCAL STORAGE

// Hämta DOM-element
const linkUrlInput = document.getElementById('linkUrl');
const addLinkBtn = document.getElementById('addLinkBtn');
const savedLinksContainer = document.querySelector('.saved-links');

// Ladda sparade länkar när sidan laddas
document.addEventListener('DOMContentLoaded', loadLinks);

// Lägg till eventlyssnare för knappen
addLinkBtn.addEventListener('click', addLink);

// Funktion för att lägga till länk
function addLink() {
    const url = linkUrlInput.value.trim();
    
    // Validera input
    if (!url) {
        alert('Vänligen fyll i URL');
        return;
    }
    
    // Säkerställ att URL har korrekt format
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        formattedUrl = 'https://' + url;
    }
    
    // Skapa ett länkobjekt
    const linkObj = {
        url: formattedUrl
    };
    
    // Spara länken i localStorage
    saveLink(linkObj);
    
    // Lägg till länken i UI
    addLinkToUI(linkObj);
    
    // Rensa input-fälten
    linkUrlInput.value = '';
}

// Funktion för att spara länk i localStorage
function saveLink(linkObj) {
    let links = JSON.parse(localStorage.getItem('dashboardLinks')) || [];
    links.push(linkObj);
    localStorage.setItem('dashboardLinks', JSON.stringify(links));
}

// Funktion för att lägga till länk i UI
function addLinkToUI(linkObj) {
    const linkElement = document.createElement('div');
    linkElement.className = 'link-item';
    
    // Bestäm ikon baserat på URL
    const icon = getLinkIcon(linkObj.url);
    
    linkElement.innerHTML = `
        <a href="${linkObj.url}" target="_blank">
            <span class="link-icon">${icon} ${linkObj.url}</span>
        </a>
        <button class="delete-link-btn" data-url="${linkObj.url}">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Lägg till eventlyssnare för ta bort-knappen
    linkElement.querySelector('.delete-link-btn').addEventListener('click', function() {
        deleteLink(linkObj.url);
        linkElement.remove();
    });
    
    savedLinksContainer.appendChild(linkElement);
}

// Funktion för att ladda sparade länkar
function loadLinks() {
    const links = JSON.parse(localStorage.getItem('dashboardLinks')) || [];
    links.forEach(link => addLinkToUI(link));
}

// Funktion för att ta bort länk
function deleteLink(url) {
    let links = JSON.parse(localStorage.getItem('dashboardLinks')) || [];
    links = links.filter(link => link.url !== url);
    localStorage.setItem('dashboardLinks', JSON.stringify(links));
}

// Funktion för att bestämma ikon baserat på URL
function getLinkIcon(url) {
    // Lista över vanliga domäner och deras ikoner
    const iconMap = {
        'google.com': '<i class="fab fa-google"></i>',
        'youtube.com': '<i class="fab fa-youtube"></i>',
        'facebook.com': '<i class="fab fa-facebook"></i>',
        'twitter.com': '<i class="fab fa-twitter"></i>',
        'instagram.com': '<i class="fab fa-instagram"></i>',
        'linkedin.com': '<i class="fab fa-linkedin"></i>',
        'github.com': '<i class="fab fa-github"></i>',
        'stackoverflow.com': '<i class="fab fa-stack-overflow"></i>',
        'reddit.com': '<i class="fab fa-reddit"></i>',
        'pinterest.com': '<i class="fab fa-pinterest"></i>',
        'twitch.tv': '<i class="fab fa-twitch"></i>',
        'discord.com': '<i class="fab fa-discord"></i>',
        'spotify.com': '<i class="fab fa-spotify"></i>',
        'netflix.com': '<i class="fab fa-netflix"></i>',
        'amazon.com': '<i class="fab fa-amazon"></i>',
        'gmail.com': '<i class="fas fa-envelope"></i>',
        'outlook.com': '<i class="fas fa-envelope"></i>',
        'yahoo.com': '<i class="fab fa-yahoo"></i>',
        'wikipedia.org': '<i class="fab fa-wikipedia-w"></i>'
    };
    
    // Hitta matchande domän
    for (const domain in iconMap) {
        if (url.includes(domain)) {
            return iconMap[domain];
        }
    }
    
    // Standardikon om ingen matchning finns
    return '<i class="fas fa-link"></i>';
}






// LÄGG TILL OCH SPARA ANTECKNINGAR

// Hämta DOM-element
const notesInput = document.getElementById('notes');
const addNotesBtn = document.getElementById('addNotesBtn');
const savedNotesContainer = document.querySelector('.saved-notes');

// Ladda sparade länkar när sidan laddas
document.addEventListener('DOMContentLoaded', loadNotes);

// Lägg till eventlyssnare för knappen
addNotesBtn.addEventListener('click', addNote);


// Funktion för att lägga till note
function addNote() {
    const noteText = notesInput.value.trim();

    if(noteText === ''){
        return;
    }
    
    // Skapa ett noteobjekt med unikt ID och tidsstämpel
    const noteObj = {
        id: Date.now(),
        text: noteText,
        date: new Date().toLocaleDateString()
    };
    
    // Spara Notisen i localStorage
    saveNotes(noteObj);
    
    // Lägg till note i UI
    addNotesToUI(noteObj);
    
    // Rensa input-fälten
    notesInput.value = '';
}


// Funktion för att spara notes i localStorage
function saveNotes(noteObj) {
    // Hämta befintliga anteckningar eller skapa tom array
    let notes = JSON.parse(localStorage.getItem('dashboardNotes')) || [];
    // Lägg till den nya anteckningen
    notes.push(noteObj);
    // Spara igen i LocalStorage
    localStorage.setItem('dashboardNotes', JSON.stringify(notes));
}


// Funktion för att lägga till notes i UI
function addNotesToUI(noteObj) {
    const noteElement = document.createElement('div');
    noteElement.className = 'note-item';
    noteElement.dataset.id = noteObj.id;
    
    noteElement.innerHTML = `
        <div class="note-card">
            <p class="note-text">${noteObj.text}</p>
            <div class="note-footer>
                <small class="note-date">${noteObj.date}</small>
                <button class="delete-note-btn">
                <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    
    // Lägg till eventlyssnare för ta bort-knappen
    noteElement.querySelector('.delete-note-btn').addEventListener('click', function() {
        deleteNote(noteObj.id);
        noteElement.remove();
    });
    
    // Lägg till anteckningselementet i container
    savedNotesContainer.appendChild(noteElement);
}

// Funktion för att ladda sparade notiser
function loadNotes() {
    const saveNotes = JSON.parse(localStorage.getItem('dashboardNotes')) || [];
    saveNotes.forEach(note => addNotesToUI(note));
}

// Funktion för att ta bort notis
function deleteNote(noteId) {
    let savedNotes = JSON.parse(localStorage.getItem('dashboardNotes')) || [];
    // Filtrerar bort anteckningar med det sparade Id numret 
    savedNotes = savedNotes.filter(note => note.id !== noteId);
    // Spara den uppdaterade listan
    localStorage.setItem('dashboardNotes', JSON.stringify(savedNotes));
}