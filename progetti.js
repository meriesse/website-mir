let projectsData = [];

// ===== FUNZIONE DI FETCH DA JSON =====
async function fetchProjects() {
    try {
    const response = await fetch("progetti.json");
    projectsData = await response.json();
    loadProjects(); // renderizza i progetti nella griglia
  } catch (error) {
    console.error("Errore nel caricamento dei progetti:", error);
  }
}

// ===== RENDER PROGETTI =====
function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');

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

// ===== CREAZIONE CARD =====
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

// ===== GESTIONE MODAL =====
function openProjectModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) {
        console.error('Progetto non trovato:', projectId);
        return;
    }

    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalSubtitle').textContent = `${project.location} • ${project.year}`;
    document.getElementById('modalDescription').innerHTML = createProjectDescription(project);

    const imageGallery = document.getElementById('imageGallery');
    imageGallery.innerHTML = project.gallery.map(image => `
        <div class="gallery-image" onclick="openImageViewer('${image}')">
            <img src="${image}" alt="Immagine progetto" loading="lazy">
        </div>
    `).join('');

    document.getElementById('projectModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function createProjectDescription(project) {
    return `
        <p><strong>Descrizione:</strong> ${project.description}</p>
        <p><strong>Categoria:</strong> ${project.category}</p>
    `;
}

function closeModal() {
    document.getElementById('projectModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openImageViewer(imageSrc) {
    window.open(imageSrc, '_blank');
}

// ===== EVENTI =====
function setupEventListeners() {
    document.getElementById('projectModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
}

// ===== INIZIALIZZAZIONE =====
async function init() {
    console.log('🚀 Inizializzazione pagina progetti...');
    await fetchProjects();
    setupEventListeners();
    simulateOneDriveSync();
    console.log('✅ Pagina progetti inizializzata con successo!');
}

document.addEventListener('DOMContentLoaded', init);
