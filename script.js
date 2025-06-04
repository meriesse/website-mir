/*
// Carica dinamicamente i progetti da data.json
fetch('data.json')
  .then(response => {
    if (!response.ok) throw new Error("Errore nel caricamento del file JSON.");
    return response.json();
  })
  .then(data => {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';

      const img = document.createElement('img');
      img.src = item.url;
      img.alt = item.descrizione;

      const descr = document.createElement('p');
      descr.textContent = item.descrizione;

      card.appendChild(img);
      card.appendChild(descr);
      gallery.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Errore:", error);
    const gallery = document.getElementById('gallery');
    if (gallery) {
      gallery.innerHTML = "<p>Impossibile caricare i progetti al momento. Riprova più tardi.</p>";
    }
  });


// SLIDESHOW (se presente nel sito)
let slideIndex = 1;
let slideInterval;

function showSlides(n) {
  const slides = document.querySelectorAll(".mySlides");
  const dots = document.querySelectorAll(".dot");

  if (slides.length === 0) return;

  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;

  slides.forEach(slide => slide.style.display = "none");
  dots.forEach(dot => dot.classList.remove("active"));

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].classList.add("active");
}

function plusSlides(n) {
  clearInterval(slideInterval);
  showSlides(slideIndex += n);
  startAutoSlide();
}

function currentSlide(n) {
  clearInterval(slideInterval);
  showSlides(slideIndex = n);
  startAutoSlide();
}

function startAutoSlide() {
  slideInterval = setInterval(() => {
    slideIndex++;
    showSlides(slideIndex);
  }, 4000);
}

// Inizializza slideshow se presente
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelectorAll(".mySlides").length > 0) {
    showSlides(slideIndex);
    startAutoSlide();
  }

*/

  // Highlight the active navigation link
const currentPath = window.location.pathname.split("/").pop();
const links = document.querySelectorAll(".nav-link");

links.forEach(link => {
  if (link.getAttribute("href") === currentPath) {
    link.classList.add("active");
  }
});

/* Messaggio di conferma */

document.getElementById("preventivoForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const form = this;
  const data = new FormData(form);

  fetch(form.action, {
    method: "POST",
    body: data,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      document.getElementById("form-messaggio").style.display = "block";
      form.reset();
    } else {
      alert("Errore durante l'invio. Riprova.");
    }
  }).catch(error => {
    alert("Errore di connessione. Riprova.");
  });
});


/* popup */

document.addEventListener("DOMContentLoaded", () => {
  const openPopup = document.getElementById("openPopup");
  const popupOverlay = document.getElementById("popupForm");
  const closeBtn = document.getElementById("closePopup");
  const form = popupOverlay ? popupOverlay.querySelector("form") : null;
  const confirmationMessage = popupOverlay ? popupOverlay.querySelector(".confirmation-message") : null;

  function resetFormAndClose() {
    if (form) form.reset();
    if (confirmationMessage) confirmationMessage.style.display = "none";
    popupOverlay.style.display = "none";
  }

  if (openPopup && popupOverlay && closeBtn && form) {
    openPopup.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirmationMessage) confirmationMessage.style.display = "none";
      popupOverlay.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => {
      resetFormAndClose();
    });

    popupOverlay.addEventListener("click", (e) => {
      if (e.target === popupOverlay) {
        resetFormAndClose();
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Qui puoi inserire chiamata AJAX/fetch per inviare dati al server

      // Mostra messaggio di conferma dentro il popup
      if (confirmationMessage) {
        confirmationMessage.style.display = "block";
        confirmationMessage.textContent = "Richiesta inviata con successo!";
      }

      // Pulisci i campi, ma NON chiudere subito il popup così l'utente vede la conferma
      form.reset();

      // Opzionale: chiudi il popup dopo qualche secondo
      setTimeout(() => {
        resetFormAndClose();
      }, 3000);
    });

  } else {
    console.warn("Elementi del popup o form non trovati nel DOM.");
  }
});

/*Scroll navbar*/
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('shrink');
  } else {
    navbar.classList.remove('shrink');
  }
});
