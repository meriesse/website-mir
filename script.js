// ============================================
// VARIABILI GLOBALI
// ============================================
let projectsData = [];

// ============================================
// FUNZIONI PER I PROGETTI
// ============================================
async function fetchProjects() {
  try {
    const response = await fetch("progetti.json");
    if (!response.ok) throw new Error("Errore di rete");
    projectsData = await response.json();
    loadProjects();
  } catch (error) {
    console.error("Errore nel caricamento dei progetti:", error);
    showProjectsError();
  }
}

function showProjectsError() {
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

// ============================================
// FUNZIONI PER IL MODAL DEI PROGETTI
// ============================================
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

function closeProjectModal() {
  document.getElementById('projectModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function openImageViewer(imageSrc) {
  const modal = document.getElementById('imageViewerModal');
  const img = document.getElementById('imageViewerImg');
  if (modal && img) {
    img.src = imageSrc;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeImageViewer() {
  const modal = document.getElementById('imageViewerModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// ============================================
// FUNZIONI PER IL POPUP DEL PREVENTIVO
// ============================================
function initializePopupForm() {
  const popupTriggers = document.querySelectorAll('.preventivo-trigger');
  const popup = document.getElementById('popupForm');
  const closeBtn = document.getElementById('closePopup');
  const form = document.getElementById('preventivoForm');
  const formMessage = document.getElementById('form-messaggio');

  if (!popup || !form) return;

  popupTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openPopup();
    });
  });

  closeBtn?.addEventListener('click', closePopup);
  popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
  });

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Invio in corso...';
    button.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        showFormMessage('Richiesta inviata con successo! Ti contatteremo presto.', 'success');
        form.reset();
        setTimeout(closePopup, 3000);
      } else {
        throw new Error('Errore invio');
      }
    } catch (err) {
      showFormMessage('Errore. Riprova più tardi.', 'error');
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  });

  function openPopup() {
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (formMessage) formMessage.style.display = 'none';
  }

  function closePopup() {
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
    form.reset();
    if (formMessage) formMessage.style.display = 'none';
  }

  function showFormMessage(msg, type) {
    if (formMessage) {
      formMessage.textContent = msg;
      formMessage.style.color = type === 'error' ? '#e74c3c' : '#27ae60';
      formMessage.style.display = 'block';
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (popup.style.display === 'flex') closePopup();
      if (document.getElementById('projectModal')?.style.display === 'block') closeProjectModal();
      closeImageViewer();
    }
  });
}

// ============================================
// NAVIGAZIONE E BURGER MENU
// ============================================
function initializeNavigation() {
  const burger = document.getElementById("burgerBtn");
  const navLinks = document.getElementById("navLinks");

  // Evidenziazione link attivo
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Burger menu
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove("show");
      });
    });
  }
}

// ============================================
// EFFETTI VISIVI
// ============================================
function initializeVisualEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `all 0.6s ease ${index * 0.2}s`;
    observer.observe(card);
  });

  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.toggle('shrink', window.scrollY > 50);
    }
  });
}

// ============================================
// INIZIALIZZAZIONE
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  await fetchProjects();
  initializePopupForm();
  initializeNavigation();
  initializeVisualEffects();

  const projectModal = document.getElementById('projectModal');
  if (projectModal) {
    projectModal.addEventListener('click', function(e) {
      if (e.target === this) closeProjectModal();
    });
  }
});

// ============================================
// FUNZIONI GLOBALI
// ============================================
window.openProjectModal = openProjectModal;
window.closeModal = closeProjectModal;
window.openImageViewer = openImageViewer;
window.closeImageViewer = closeImageViewer;