'use strict';


// TID OCH DATUM

function startTime() {
    let now = new Date();
    //PadStart lägger till en nolla och gör det till tvåsiffrigt
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minutes = `${now.getMinutes()}`.padStart(2, 0);
    document.getElementById('date').innerHTML = `${hour}:${minutes} ${day}/${month}/${year}`;
}

startTime();
setInterval(startTime, 60000);






// REDIGERBAR RUBRIK

document.addEventListener('DOMContentLoaded', function () {
    const heading = document.querySelector('.editable-title');

    // Ladda sparad rubrik
    if (localStorage.getItem('savedHeading')) {
        heading.textContent = localStorage.getItem('savedHeading');
    }

    // Gör rubriken redigerbar vid klick
    heading.addEventListener('click', function () {
        heading.contentEditable = true;
        heading.classList.add('editing');
        heading.focus();
    });

    // Spara när rubrik tappar fokus
    heading.addEventListener('blur', function () {
        heading.contentEditable = false;
        heading.classList.remove('editing');
        localStorage.setItem('savedHeading', heading.textContent);
    });

    // Spara vid Enter
    heading.addEventListener('keydown', function (enter) {
        if (enter.key === 'Enter') {
            enter.preventDefault();
            heading.blur();
        }
    });
});








// LÄGGA TILL OCH SPARA LÄNKAR I LOCAL STORAGE

const linkTitleInput = document.getElementById('linkTitle');
const linkUrlInput = document.getElementById('linkUrl');
const addLinkBtn = document.getElementById('addLinkBtn');
const savedLinksContainer = document.querySelector('.saved-links');

// Ladda sparade länkar när sidan laddas
document.addEventListener('DOMContentLoaded', loadLinks);

// Lägg till eventlyssnare för knappen
addLinkBtn.addEventListener('click', addLink);

// Funktion för att lägga till länk och titel
function addLink() {
    const title = linkTitleInput.value.trim();
    const url = linkUrlInput.value.trim();

    // Validera input
    if (!title || !url) {
        alert('Vänligen fyll i både titel och URL');
        return;
    }

    // Skapa länkobjekt, spara och visa
    const linkObj = { title, url };
    saveLink(linkObj);
    addLinkToUI(linkObj);
}

// Funktion för att spara länk i localStorage
function saveLink(linkObj) {
    let saveLink = JSON.parse(localStorage.getItem('dashboardLinks')) || [];
    saveLink.push(linkObj);
    localStorage.setItem('dashboardLinks', JSON.stringify(saveLink));
}

// Funktion för att lägga till länk i UI
function addLinkToUI(linkObj) {
    const linkElement = document.createElement('div');
    linkElement.className = 'link-item';

    const icon = getLinkIcon(linkObj.url);

    linkElement.innerHTML = `
        <a href="${linkObj.url}" target="_blank">
            <span class="link-icon">${icon}</span>
            <span class="link-title">${linkObj.title}</span>
        </a>
        <button class="delete-link-btn" data-url="${linkObj.url}">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Lägg till eventlyssnare för ta bort-knappen
    linkElement.querySelector('.delete-link-btn').addEventListener('click', function () {
        deleteLink(linkObj.url);
        linkElement.remove();
    });

    savedLinksContainer.appendChild(linkElement);
}

// Funktion för att ladda sparade länkar
function loadLinks() {
    let savedLinks = JSON.parse(localStorage.getItem('dashboardLinks')) || [];
    savedLinks.forEach(link => addLinkToUI(link));
}

// Funktion för att ta bort länk
function deleteLink(url) {
    let currentLinks = JSON.parse(localStorage.getItem('dashboardLinks')) || [];
    currentLinks = currentLinks.filter(link => link.url !== url);
    localStorage.setItem('dashboardLinks', JSON.stringify(currentLinks));
}

// Funktion för att bestämma ikon baserat på URL
function getLinkIcon(url) {
    const iconMap = {
        'google.com': '<i class="fab fa-google"></i>',
        'youtube.com': '<i class="fab fa-youtube"></i>',
        'facebook.com': '<i class="fab fa-facebook"></i>',
        'instagram.com': '<i class="fab fa-instagram"></i>',
        'linkedin.com': '<i class="fab fa-linkedin"></i>',
        'github.com': '<i class="fab fa-github"></i>',
        'reddit.com': '<i class="fab fa-reddit"></i>',
        'discord.com': '<i class="fab fa-discord"></i>',
        'spotify.com': '<i class="fab fa-spotify"></i>'
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










// HÄMTA OCH VISA DAGENS VÄDER

const weatherContainer = document.querySelector('.weather');

const renderWeather = function (data) {
    if (!weatherContainer) return;

    // Skapa väderkortet med data
    const weatherHtml = `
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
    weatherContainer.innerHTML = weatherHtml;
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
    return iconMap[iconCode];
}

const getWeather = function () {

    fetch('https://api.brightsky.dev/current_weather?lat=52.520008&lon=13.404954&tz=Europe/Berlin')
        .then(response => response.json())
        .then(data => {
            renderWeather(data);
        })
        .catch(error => {
            console.error('Fel vid hämtning av väder data:', error);
        });
};

document.addEventListener('DOMContentLoaded', function () {
    getWeather();
});






// HÄMTA CRYPTO DATA MED AIP KEY

const bitcoinContainer = document.querySelector('.show-bitcoin');

function bitcoinToEuro() {
    try {
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur&include_last_updated_at=true')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (!data || !data.bitcoin || !data.bitcoin.eur) {
                    bitcoinContainer.textContent = "Kunde inte hämta data";
                    return;
                }

                const exchangeRate = data.bitcoin.eur.toFixed(2);

                // Formatera datum från UNIX timestamp
                let lastUpdated = "Ej tillgängligt";
                if (data.bitcoin.last_updated_at) {
                    const date = new Date(data.bitcoin.last_updated_at * 1000);
                    lastUpdated = date.toLocaleString();
                }

                bitcoinContainer.innerHTML = `
                <div class="bit-container">
                <h2>Bitcoin to Euro</h2><br>
                <p>1 BTC = ${exchangeRate}EUR</p><br>
                <p class="last-updated">Senast uppdaterad: ${lastUpdated}</p>
                </div>`;
            });
    }
    catch (error) {
        console.error('Fel vid hämtning av Bitcoin data:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    bitcoinToEuro();
});








// LÄGG TILL OCH SPARA ANTECKNINGAR

const notesInput = document.getElementById('notes');
const savedNotesContainer = document.querySelector('.saved-notes');

document.addEventListener('DOMContentLoaded', loadNotes);
notesInput.addEventListener('input', saveNote);

// Funktion för att lägga till anteckning
function saveNote() {
    const noteText = notesInput.value.trim();
    localStorage.setItem('dashboardNote', noteText);
}

function loadNotes() {
    const savedNote = localStorage.getItem('dashboardNote') || '';
    notesInput.value = savedNote;
}








// SLUMPA FRAM BILDER FRÅN PEXELS MED API NYCKEL

function randomPexelsBackground() {
    try {
        const pexelsApiKey = CONFIG1.PEXELS_API_KEY;

        const searchTerms = ['universe'];
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

        fetch(`https://api.pexels.com/v1/search?query=${randomTerm}`, {
            headers: {
                'Authorization': pexelsApiKey
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.photos && data.photos.length > 0) {
                    let randomPhoto = data.photos[Math.floor(Math.random() * data.photos.length)];

                    // Ställ in bakgrunden
                    document.body.style.backgroundImage = `url(${randomPhoto.src.original})`;
                    document.body.style.backgroundSize = 'cover';
                    document.body.style.backgroundPosition = 'center';
                    document.body.style.backgroundAttachment = 'fixed';
                    document.body.style.minHeight = '100vh';


                    // Spara bakgrunden och photographerInfo i localStorage
                    localStorage.setItem('dashboardBackground', randomPhoto.src.original);

                    // Spara photographer information
                    const photographerInfo = {
                        name: randomPhoto.photographer,
                        url: randomPhoto.photographer_url
                    };
                    localStorage.setItem('backgroundPhotographer', JSON.stringify(photographerInfo));

                    // Uppdatera attribution
                    updateAttribution(photographerInfo);
                }
            })
    }
    catch (error) {
        console.error('Fel vid hämtning av bakgrundsbild:', error);
    };
}

// Funktion för att visa attribution
function updateAttribution(photographerInfo) {

    let attribution = document.getElementById('imageAttribution');

    // Uppdatera innehållet med photographer info
    attribution.innerHTML = `
        *by <a href="${photographerInfo.url}" target="_blank" rel="noopener">${photographerInfo.name}</a> via <a href="https://www.pexels.com" target="_blank" rel="noopener">Pexels</a>*
    `;
}

// Funktion för att läsa in sparad bakgrund och attribution
function loadSavedBackground() {
    const savedBackground = localStorage.getItem('dashboardBackground');
    const savedPhotographer = localStorage.getItem('backgroundPhotographer');

    if (savedBackground) {
        document.body.style.backgroundImage = `url(${savedBackground})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';

        // Visa attribution om den finns sparad
        if (savedPhotographer) {
            updateAttribution(JSON.parse(savedPhotographer));
        }
    }
}

// Läs in sparad bakgrund när sidan laddas
document.addEventListener('DOMContentLoaded', function () {
    loadSavedBackground();

    // Lägg till eventlyssnare för bakgrundsknappen
    const randomBgBtn = document.getElementById('backgroundBtn');
    if (randomBgBtn) {
        randomBgBtn.addEventListener('click', randomPexelsBackground);
    }
});


