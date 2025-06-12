let projectsData = [];

  async function fetchProjects() {
    try {
      const response = await fetch("progetti.json");
      if (!response.ok) throw new Error("Errore di rete");
      projectsData = await response.json();
      loadProjects();
    } catch (error) {
      console.error("Errore nel caricamento dei progetti:", error);
      const projectsGrid = document.getElementById("projectsGrid");
      if (projectsGrid) {
        projectsGrid.innerHTML = `
          <div class="empty-state">
            <div style="font-size: 4rem; margin-bottom: 1rem;">❌</div>
            <h3>Errore nel caricamento</h3>
            <p>Verifica la connessione a Internet e ricarica la pagina.</p>
          </div>
        `;
      }
    }
  }

  function loadProjects() {
    const projectsGrid = document.getElementById("projectsGrid");
    if (!projectsGrid) return;

    if (projectsData.length === 0) {
      projectsGrid.innerHTML = `
        <div class="empty-state">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🏗️</div>
          <h3>Nessun progetto disponibile</h3>
          <p>I progetti verranno caricati automaticamente.</p>
        </div>
      `;
      return;
    }

    projectsGrid.innerHTML = projectsData.map(project => createProjectCard(project)).join('');
  }

  function createProjectCard(project) {
    return `
      <div class="project-card" onclick="openProjectModal(${project.id})">
        <div class="project-thumbnail">
          <img src="${project.thumbnail}" alt="${project.title}" loading="lazy">
          <div class="project-overlay">
            <button class="view-btn">Visualizza Progetto</button>
          </div>
        </div>
        <div class="project-info">
          <h3 class="project-title">${project.title}</h3>
          <div class="project-meta">
            <span>📍 ${project.location}</span>
            <span>📅 ${project.year}</span>
          </div>
          <p class="project-description">${project.description}</p>
          <div class="project-stats">
            <span class="stat">🖼️ ${project.images} foto</span>
          </div>
        </div>
      </div>
    `;
  }

  function openProjectModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalSubtitle').textContent = `${project.location} • ${project.year}`;
    document.getElementById('modalDescription').innerHTML = `
      <p><strong>Descrizione:</strong> ${project.description}</p>
      <p><strong>Categoria:</strong> ${project.category}</p>
    `;

    const imageGallery = document.getElementById('imageGallery');
    imageGallery.innerHTML = project.gallery.map(image => `
      <div class="gallery-image" onclick="openImageViewer('${image}')">
        <img src="${image}" alt="Immagine progetto" loading="lazy">
      </div>
    `).join('');

    document.getElementById('projectModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('projectModal').style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  function openImageViewer(imageSrc) {
    window.open(imageSrc, '_blank');
  }

  function setupEventListeners() {
    document.getElementById('projectModal').addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal();
    });

    // Form preventivo
    const form = document.getElementById("preventivoForm");
    if (form) {
      form.addEventListener("submit", function(e) {
        e.preventDefault();
        const data = new FormData(form);
        fetch(form.action, {
          method: "POST",
          body: data,
          headers: { 'Accept': 'application/json' }
        }).then(response => {
          if (response.ok) {
            document.getElementById("form-messaggio").style.display = "block";
            form.reset();
          } else {
            alert("Errore durante l'invio.");
          }
        }).catch(() => {
          alert("Errore di connessione.");
        });
      });
    }

    // Popup preventivo
    const popupOverlay = document.getElementById("popupForm");
    const closeBtn = document.getElementById("closePopup");
    const preventivoTriggers = document.querySelectorAll(".preventivo-trigger");
    const confirmationMessage = popupOverlay ? popupOverlay.querySelector(".confirmation-message") : null;

    function resetFormAndClose() {
      if (form) form.reset();
      if (confirmationMessage) confirmationMessage.style.display = "none";
      popupOverlay.style.display = "none";
    }

    if (popupOverlay && closeBtn) {
      preventivoTriggers.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
          e.preventDefault();
          if (confirmationMessage) confirmationMessage.style.display = "none";
          popupOverlay.style.display = "flex";
        });
      });

      closeBtn.addEventListener("click", resetFormAndClose);
      popupOverlay.addEventListener("click", e => {
        if (e.target === popupOverlay) resetFormAndClose();
      });
    }

    // Navbar scroll shrink
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('shrink', window.scrollY > 50);
      });
    }

    // Highlight active nav link
    const currentPath = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");
      }
    });

    // Slideshow
    let slideIndex = 1;
    let slideInterval;
    const slides = document.querySelectorAll(".mySlides");

    function showSlides(n) {
      const dots = document.querySelectorAll(".dot");
      if (slides.length === 0) return;
      if (n > slides.length) slideIndex = 1;
      if (n < 1) slideIndex = slides.length;
      slides.forEach(s => s.style.display = "none");
      dots.forEach(d => d.classList.remove("active"));
      slides[slideIndex - 1].style.display = "block";
      dots[slideIndex - 1].classList.add("active");
    }

    function startAutoSlide() {
      slideInterval = setInterval(() => {
        slideIndex++;
        showSlides(slideIndex);
      }, 4000);
    }

    if (slides.length > 0) {
      showSlides(slideIndex);
      startAutoSlide();
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await fetchProjects();
    setupEventListeners();
  });
