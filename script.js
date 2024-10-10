// Constants and DOM Element References
const quotesUrl = 'https://raw.githubusercontent.com/Danizoo/ChromeQuotes/main/Quotes.txt';
const backgroundsBaseUrl = 'https://raw.githubusercontent.com/Danizoo/RandomNum1/main/BGs/Random-Full-BGs/DailyTaoBGs';
const totalBackgroundImages = 63;

const sitesList = document.getElementById('sites-list');
const showSitesButton = document.getElementById('show-sites-button');

document.getElementById('sites-list').style.display = 'none'; // Initially hide the sites list

// Utility Functions
function extractSiteName(title) {
    if (!title) return "";
    
    const delimiters = [" - ", " | ", " — ", " · "];
    let siteName = title;

    for (let delimiter of delimiters) {
        if (title.includes(delimiter)) {
            siteName = title.split(delimiter)[0];
            break;
        }
    }
    return siteName.trim();
}

async function fetchQuotes(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        return text.split('///').map(quote => quote.trim()).filter(quote => quote);
    } catch (error) {
        console.error('Error fetching quotes:', error);
        return [];
    }
}

function getRandomQuote(quotes) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

function getRandomBackgroundImage(baseUrl, totalImages) {
    /* const randomIndex = Math.floor(Math.random() * totalImages) + 1; */
    const randomIndex = 10;
    return `${baseUrl}/${randomIndex}.jpg`;
}

function adjustFontSize() {
    const quoteElement = document.getElementById('quote');
    const maxLength = 200;
    const smallFontSize = '1.5rem';
    const normalFontSize = '1.85rem';

    if (quoteElement.innerText.length > maxLength) {
        quoteElement.style.fontSize = smallFontSize;
    } else {
        quoteElement.style.fontSize = normalFontSize;
    }
}

function displayMostVisitedSites() {
    chrome.topSites.get((sites) => {
        const mostVisitedContainer = document.getElementById('most-visited');
        sites.forEach((site) => {
            const link = document.createElement('a');
            link.href = site.url;
            link.innerText = site.title;
            link.classList.add('visited-link');
            mostVisitedContainer.appendChild(link);
        });
    });
}




// Populate Sites List
chrome.topSites.get((sites) => {
    const maxSitesToShow = 8;

    sites.slice(0, maxSitesToShow).forEach(site => {
        const listItem = document.createElement('li');
        listItem.className = 'site-item';

        const link = document.createElement('a');
        link.href = site.url;
        link.className = 'site-link';

        const favicon = document.createElement('img');
        favicon.src = `https://www.google.com/s2/favicons?domain=${site.url}&sz=64`;
        favicon.alt = `${site.title} logo`;
        favicon.className = 'site-favicon';

        const fullTitle = extractSiteName(site.title) || site.url.split("/")[2];
        const shortTitle = fullTitle.length > 11 ? fullTitle.substring(0, 8) + "..." : fullTitle;
        
        const siteName = document.createElement('span');
        siteName.className = 'site-name';
        siteName.textContent = shortTitle;
        
        link.appendChild(favicon);
        link.appendChild(siteName);

        listItem.appendChild(link);
        sitesList.appendChild(listItem);
    });
});

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const utilsIcon = document.getElementById('utils-icon-div');
    const utilsMenu = document.getElementById('utils-menu');

    utilsIcon.addEventListener('click', () => {
        // Toggle the visibility of the menu
        if (utilsMenu.style.display === 'block') {
            utilsMenu.style.display = 'none';
        } else {
            utilsMenu.style.display = 'block';
        }
    });

    // Click outside of the menu to close it
    document.addEventListener('click', (event) => {
        if (!utilsIcon.contains(event.target) && !utilsMenu.contains(event.target)) {
            utilsMenu.style.display = 'none';
        }
    });
})





document.getElementById('settings').addEventListener('click', function() {
    const sidebar = document.getElementById('settings-sidebar');
    sidebar.classList.add('open'); // Open the sidebar
});

document.getElementById('close-sidebar').addEventListener('click', function() {
    const sidebar = document.getElementById('settings-sidebar');
    sidebar.classList.remove('open'); // Close the sidebar
});

// Theme toggler
const themeSwitch = document.getElementById('theme-switch');
themeSwitch.addEventListener('change', function() {
    document.body.classList.toggle('dark-theme', this.checked);
});

let currentTheme = 'dark'; // Default theme

// Function to update the theme and slider text
function setTheme(theme) {
    currentTheme = theme;
    const themeSwitch = document.getElementById('theme-switch');
    const themeLabel = document.querySelector('label[for="theme-switch"]');
    const quote = document.getElementById('quote');
    const author = document.getElementById('author');
    const overlay = document.getElementById('overlay');
    const utilsIcon = document.getElementById('utils-icon');
    const gmailLink = document.getElementById('gmail-link');
    const imagesLink = document.getElementById('images-link');
    const settings = document.getElementById('settings');
    const siteName = document.getElementsByClassName('site-name');
    const siteItems = document.querySelectorAll('.site-item');
    const utilsIconDiv = document.getElementById('utils-icon-div');
    const settingsDiv = document.getElementById('settings-div');
    const footerLeft = document.getElementById('footer-left')
    
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        themeSwitch.checked = false; // Slider to the left
        themeLabel.textContent = "Dark Theme"; // Label for dark theme
        quote.style.color = 'white'; // Change #quote to white in dark theme
        author.style.color = 'white';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        utilsIcon.style.filter = 'invert(0) brightness(100) saturate(100%)';
        settings.style.filter = 'invert(1) brightness(100) saturate(100%)';
        gmailLink.style.color = 'white';
        imagesLink.style.color = 'white';
        for (let i = 0; i < siteName.length; i++) {
            siteName[i].style.color = 'white';
        }
        for (let j = 0; j < siteItems.length; j++) {
            siteItems[j].classList.add('site-item-dark');
            siteItems[j].classList.remove('site-item-light');
        }
        utilsIconDiv.classList.add('utils-icon-div-dark');
        utilsIconDiv.classList.remove('utils-icon-div-light');
        settingsDiv.classList.add('settings-div-dark');
        settingsDiv.classList.remove('settings-div-light');
        footerLeft.style.color = 'white';

    } else if (theme === 'light') {
        document.body.classList.remove('dark-theme');
        themeSwitch.checked = true; // Slider to the right
        themeLabel.textContent = "Light Theme"; // Label for light theme
        quote.style.color = 'black';
        author.style.color = 'black';
        overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        utilsIcon.style.filter = 'invert(44%) sepia(5%) saturate(324%) hue-rotate(174deg) brightness(30%) contrast(89%)';
        settings.style.filter = 'invert(0) brightness(100) saturate(100%)';
        gmailLink.style.color = 'rgb(33, 33, 33)';
        imagesLink.style.color = 'rgb(33, 33, 33)';
        for (let i = 0; i < siteName.length; i++) {
            siteName[i].style.color = 'rgb(33, 33, 33)';
        }
        for (let j = 0; j < siteItems.length; j++) {
            siteItems[j].classList.add('site-item-light');
            siteItems[j].classList.remove('site-item-dark');
        }
        utilsIconDiv.classList.add('utils-icon-div-light');
        utilsIconDiv.classList.remove('utils-icon-div-dark');
        settingsDiv.classList.add('settings-div-light');
        settingsDiv.classList.remove('settings-div-dark');
        footerLeft.style.color = 'black';
    }
}



// Event listener for theme toggle switch
document.getElementById('theme-switch').addEventListener('change', function() {
    const theme = this.checked ? 'light' : 'dark'; // Right is light, left is dark
    setTheme(theme);
    localStorage.setItem('theme', theme); // Save the theme in local storage
});

// On page load, check the local storage and set the theme accordingly
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default is dark theme
    setTheme(savedTheme);
});


settings.addEventListener('mouseenter', function() {
    settings.src = 'Assets/Settings_full_tilted.png'; // Change the image on hover
});

settings.addEventListener('mouseleave', function() {
    settings.src = 'Assets/Settings_outline.png'; // Revert the image on mouse leave
});














showSitesButton.addEventListener('click', () => {
    if (sitesList.style.display === 'none' || sitesList.style.display === '') {
        sitesList.style.display = 'flex';
        showSitesButton.textContent = '-';
        localStorage.setItem('sitesListState', 'open');
    } else {
        sitesList.style.display = 'none';
        showSitesButton.textContent = '+';
        localStorage.setItem('sitesListState', 'closed');
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const quotesText = await fetchQuotes(quotesUrl);
    const quote = getRandomQuote(quotesText);

    const splitQuote = quote.split('-');
    const quoteText = splitQuote[0].trim();
    const authorText = splitQuote.length > 1 ? splitQuote[1].trim() : "Unknown Author";

    document.getElementById('quote').innerText = quoteText;
    document.getElementById('author').innerText = `- ${authorText}`;
    
    adjustFontSize();
    
    const backgroundImageUrl = getRandomBackgroundImage(backgroundsBaseUrl, totalBackgroundImages);
    
    document.body.style.backgroundImage = `url('${backgroundImageUrl}')`;
    document.body.style.backgroundSize = 'cover';

    displayMostVisitedSites();

    // Restore the sites list state
    const sitesListState = localStorage.getItem('sitesListState');
    if (sitesListState === 'open') {
        sitesList.style.display = 'flex';
        showSitesButton.textContent = '-';
    } else {
        sitesList.style.display = 'none';
        showSitesButton.textContent = '+';
    }


    const searchBar = document.querySelector('.searchbar');

    document.getElementById('google-search').addEventListener('click', function() {
        const query = searchBar.value;
        if (query) {
            const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(query);
            window.location.href = searchUrl;
        }
    });

    searchBar.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const query = searchBar.value;
            if (query) {
                const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(query);
                window.location.href = searchUrl;
            }
        }
    });

    document.getElementById('quote').addEventListener('click', function() {
        const quoteText = document.getElementById('quote').innerText;
        const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(quoteText);
        window.location.href = searchUrl;
    });
    document.getElementById('search-quote').addEventListener('click', function() {
        const quoteText = document.getElementById('search-quote').innerText;
        const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(quoteText);
        window.location.href = searchUrl;
    });

    document.getElementById('author').addEventListener('click', function() {
        const authorName = authorText;
        const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(authorName);
        window.location.href = searchUrl;
    });
    document.getElementById('search-author').addEventListener('click', function() {
        const authorName = authorText;
        const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(authorName);
        window.location.href = searchUrl;
    });
});







//Sharing -------------------------------------

// Function to create the image of the quote (optional)
// Function to create the image of the quote (optional)
async function generateQuoteImage(quoteText, authorText) {
    // Here you can use libraries like html2canvas to capture the quote section and create an image
    const quoteElement = document.querySelector('#quote-container'); // assuming this wraps the quote and author
    return await html2canvas(quoteElement).then(canvas => canvas.toDataURL('image/png'));
}

// Share quote on Facebook
document.getElementById('facebook-share').addEventListener('click', async (e) => {
    e.preventDefault();

    const quoteText = document.getElementById('quote').innerText;
    const authorText = document.getElementById('author').innerText;
    const extensionUrl = 'https://chrome.google.com/webstore/detail/your-extension-id'; // Replace with your extension link

    // Optional: If you want to generate an image of the quote
    const quoteImage = await generateQuoteImage(quoteText, authorText);

    // Facebook sharing URL
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(extensionUrl)}&quote=${encodeURIComponent(quoteText)} ${encodeURIComponent(authorText)}`;
    
    window.open(facebookShareUrl, '_blank');
});

// Share quote on Instagram
document.getElementById('instagram-share').addEventListener('click', async (e) => {
    e.preventDefault();

    const quoteText = document.getElementById('quote').innerText;
    const authorText = document.getElementById('author').innerText;
    const extensionUrl = 'https://chrome.google.com/webstore/detail/your-extension-id'; // Replace with your extension link

    // Optional: Generate the image of the quote
    const quoteImage = await generateQuoteImage(quoteText, authorText);

    // Instagram sharing (Note: Instagram doesn't support direct sharing via URL like Facebook)
    // You might need to implement this using Instagram API for more advanced sharing.
    alert("Instagram sharing isn't available directly. You can download the quote image and upload it manually.");
});







//FloatingDots:------------------------------


/* 
// Set variables
const show = 300;
const maxLinesPerDot = 3; // Maximum lines a dot can form
const canvas = document.getElementById("floatingDotsCanvas");
const scene = canvas.getContext("2d");
let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);
const mouse = { x: null, y: null };  // Track mouse position
const mouseRadius = 80;  // Radius around the mouse to connect dots

// Track mouse position
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Create dot
class Dot {
  constructor() {
    const angle = Math.floor(Math.random() * 360);

    //this.size = 1.2;
    this.size = Math.random() * 1.2 + 0.1;
    this.dx = Math.cos(angle) * 0.2;
    this.dy = Math.sin(angle) * 0.2;
    this.px = Math.random() * width;
    this.py = Math.random() * height;
  }

  // Update dot position and draw
  update() {
    this.bounds();

    this.px += this.dx;
    this.py += this.dy;

    this.draw();
  }

  // Draw the dots then connect them
  draw() {
    scene.beginPath();
    scene.arc(this.px, this.py, this.size, 0, Math.PI * 2);
    scene.closePath();
    //scene.fillStyle = "rgba(168, 255, 214, 1)";
    // Set fill color based on current theme
    if (currentTheme === 'dark') {
        scene.fillStyle = "rgba(168, 255, 214, 1)";  // Color for dark theme
      } else {
        scene.fillStyle = "rgba(0, 0, 0, 0.6)";  // Color for light theme
      }
    scene.fill();

    this.connect();
  }

  // Connect the nearby dots only when within the mouse radius
  connect() {
    const nearby = (width + height) * 0.1;
    let linesDrawn = 0;  // Track number of lines drawn for this dot

    // Check if this dot is within the mouse radius
    const mouseDistance = this.distance({ px: mouse.x, py: mouse.y });
    if (mouseDistance > mouseRadius) return;  // Don't connect if outside the radius

    dots.forEach(dot => {
      const distance = this.distance(dot);

      if (distance > nearby || linesDrawn >= maxLinesPerDot) return;  // Stop if max lines reached

      const opacityDark = 1 - distance / nearby - 0.2;
      const opacityLight = 1 - distance / nearby - 0.4;

      scene.beginPath();
      scene.lineWidth = 1;
      // scene.strokeStyle = `rgba(168, 255, 214, ${opacity})`;
      if (currentTheme === 'dark') {
        scene.strokeStyle = `rgba(168, 255, 214, ${opacityDark})`;  // Color for dark theme
      } else {
        scene.strokeStyle = `rgba(0, 0, 0, ${opacityLight})`;  // Color for light theme
      }
      scene.moveTo(this.px, this.py);
      scene.lineTo(dot.px, dot.py);
      scene.stroke();

      linesDrawn++;  // Increment line count after drawing
    });
  }

  // Check if we've hit a wall and invert the direction
  bounds() {
    if (this.px < 0 || this.px > width) this.dx *= -1;

    if (this.py < 0 || this.py > height) this.dy *= -1;
  }

  // Calculate the distance between this dot and that dot
  distance(dot) {
    const distX = this.px - dot.px;
    const distY = this.py - dot.py;

    return Math.sqrt(distX * distX + distY * distY);
  }
}

// Create dots
const dots = [...Array(show).fill().map(() => new Dot())];

// Draw scene
function draw() {
  scene.clearRect(0, 0, width, height);

  // Update all dots and redraw
  dots.forEach(particle => {
    particle.update();
  });

  requestAnimationFrame(draw);
}

//draw();

// Resize canvas
window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});



// Variables to control the floating dots toggle state
let isDotsEnabled = true; // Default is true, dots are enabled

// Handle the toggle button for floating dots
const dotsSwitch = document.getElementById('dots-switch');

// Retrieve the state from localStorage when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const savedState = localStorage.getItem('dotsEnabled');
    
    if (savedState !== null) {
        isDotsEnabled = JSON.parse(savedState); // Convert string back to boolean
    }

    // Set the checkbox based on the saved or default state
    dotsSwitch.checked = isDotsEnabled;

    // Start drawing dots if they are enabled
    if (isDotsEnabled) {
        draw();
    }
});

// Save the state to localStorage when the toggle changes
dotsSwitch.addEventListener('change', function() {
    isDotsEnabled = this.checked; // Update the dots enabled state
    localStorage.setItem('dotsEnabled', JSON.stringify(isDotsEnabled)); // Save to localStorage
    
    if (isDotsEnabled) {
        draw(); // Start drawing dots if enabled
    } else {
        scene.clearRect(0, 0, width, height); // Clear the canvas if disabled
        cancelAnimationFrame(animationFrameId); // Stop the draw loop
    }
});

// Draw scene (now with a condition to check if dots are enabled)
let animationFrameId; // Store the requestAnimationFrame ID
function draw() {
    if (!isDotsEnabled) return; // Do not draw if dots are disabled

    scene.clearRect(0, 0, width, height); // Clear the canvas

    // Update and redraw all dots
    dots.forEach(particle => {
        particle.update();
    });

    animationFrameId = requestAnimationFrame(draw); // Save the animation frame ID
} */














//New and improved with controller with controling dots number ---------------------------



 
// Set variables
const maxLinesPerDot = 3; // Maximum lines a dot can form
const canvas = document.getElementById("floatingDotsCanvas");
const scene = canvas.getContext("2d");
let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);
const mouse = { x: null, y: null };  // Track mouse position
const mouseRadius = 80;  // Radius around the mouse to connect dots

// Track mouse position
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Create dot
class Dot {
  constructor() {
    const angle = Math.floor(Math.random() * 360);

    this.size = Math.random() * 1.2 + 0.1;
    this.dx = Math.cos(angle) * 0.2;  // Keep speed consistent regardless of dot count
    this.dy = Math.sin(angle) * 0.2;
    this.px = Math.random() * width;
    this.py = Math.random() * height;
  }

  // Update dot position and draw
  update() {
    this.bounds();

    this.px += this.dx;
    this.py += this.dy;

    this.draw();
  }

  // Draw the dots then connect them
  draw() {
    scene.beginPath();
    scene.arc(this.px, this.py, this.size, 0, Math.PI * 2);
    scene.closePath();
    if (currentTheme === 'dark') {
      scene.fillStyle = "rgba(168, 255, 214, 1)";  // Color for dark theme
    } else {
      scene.fillStyle = "rgba(0, 0, 0, 0.6)";  // Color for light theme
    }
    scene.fill();

    this.connect();
  }

  // Connect the nearby dots only when within the mouse radius
  connect() {
    const nearby = (width + height) * 0.1;
    let linesDrawn = 0;  // Track number of lines drawn for this dot

    const mouseDistance = this.distance({ px: mouse.x, py: mouse.y });
    if (mouseDistance > mouseRadius) return;  // Don't connect if outside the radius

    dots.forEach(dot => {
      const distance = this.distance(dot);

      if (distance > nearby || linesDrawn >= maxLinesPerDot) return;  // Stop if max lines reached

      const opacityDark = 1 - distance / nearby - 0.2;
      const opacityLight = 1 - distance / nearby - 0.4;

      scene.beginPath();
      scene.lineWidth = 1;
      if (currentTheme === 'dark') {
        scene.strokeStyle = `rgba(168, 255, 214, ${opacityDark})`;  // Color for dark theme
      } else {
        scene.strokeStyle = `rgba(0, 0, 0, ${opacityLight})`;  // Color for light theme
      }
      scene.moveTo(this.px, this.py);
      scene.lineTo(dot.px, dot.py);
      scene.stroke();

      linesDrawn++;  // Increment line count after drawing
    });
  }

  // Check if we've hit a wall and invert the direction
  bounds() {
    if (this.px < 0 || this.px > width) this.dx *= -1;
    if (this.py < 0 || this.py > height) this.dy *= -1;
  }

  // Calculate the distance between this dot and another dot
  distance(dot) {
    const distX = this.px - dot.px;
    const distY = this.py - dot.py;

    return Math.sqrt(distX * distX + distY * distY);
  }
}

// Variables to control the floating dots toggle state
let isDotsEnabled = true;
let animationFrameId;
let dots = [];

// Create dots initially (based on slider value)
const dotCountSlider = document.getElementById('dot-count-slider');
let show = parseInt(dotCountSlider.value);

// Function to create new dots based on the slider value
function createDots(count) {
  dots = [...Array(count).fill().map(() => new Dot())];
}

// Function to stop the ongoing animation
function stopAnimation() {
  cancelAnimationFrame(animationFrameId);  // Stop any ongoing animations
}

// Handle dot count changes via slider
dotCountSlider.addEventListener('input', function() {
  show = parseInt(this.value, 10);  // Update the "show" variable based on slider input
  document.getElementById('dot-count-display').textContent = show;  // Update display

  stopAnimation();  // Stop the previous animation

  // Recreate the dots array with the new count
  createDots(show);

  if (isDotsEnabled) {
    draw();  // Redraw with the updated number of dots
  }
});

// Initial dot creation based on default slider value
createDots(show);

// Draw scene
function draw() {
  if (!isDotsEnabled) return;  // Do not draw if dots are disabled

  scene.clearRect(0, 0, width, height);  // Clear the canvas

  // Update and redraw all dots
  dots.forEach(dot => {
    dot.update();
  });

  animationFrameId = requestAnimationFrame(draw);  // Save the animation frame ID
}

// Resize canvas
window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  createDots(show);  // Recreate dots after resizing
});

// Floating Dots Toggle Logic (previously implemented)
const dotsSwitch = document.getElementById('dots-switch');
document.addEventListener('DOMContentLoaded', function() {
  const savedState = localStorage.getItem('dotsEnabled');
  isDotsEnabled = savedState !== null ? JSON.parse(savedState) : true;
  dotsSwitch.checked = isDotsEnabled;
  if (isDotsEnabled) draw();  // Start drawing if enabled
});

dotsSwitch.addEventListener('change', function() {
  isDotsEnabled = this.checked;
  localStorage.setItem('dotsEnabled', JSON.stringify(isDotsEnabled));
  if (isDotsEnabled) {
    draw();
  } else {
    stopAnimation();  // Stop the animation when toggled off
    scene.clearRect(0, 0, width, height);
  }
});
