const ACCESS_KEY = "40402829";
// Esto no es seguridad real. En GitHub Pages la clave queda visible en el frontend.
const SESSION_STORAGE_KEY = "micronautaOpsSession";

const downloads = [
  {
    category: "Lectores",
    name: "Lector 1 y 3",
    description: "Driver para lectores 1 y 3.",
    url: "https://www.globalvisum.com/descargas/soporte/lector1y3.rar",
    type: "RAR"
  },
  {
    category: "Lectores",
    name: "Lector 4",
    description: "Driver para lector 4.",
    url: "https://www.globalvisum.com/descargas/soporte/lector4.rar",
    type: "RAR"
  },
  {
    category: "Lectores",
    name: "Lector 5",
    description: "Driver para lector 5.",
    url: "https://www.globalvisum.com/descargas/soporte/lector5.rar",
    type: "RAR"
  },
  {
    category: "Lectores",
    name: "Lector 6",
    description: "Driver para lector 6.",
    url: "https://www.globalvisum.com/descargas/soporte/lector6.rar",
    type: "RAR"
  },
  {
    category: "Lectores",
    name: "Lector 7",
    description: "Driver para lector 7.",
    url: "https://www.globalvisum.com/descargas/soporte/lector7.rar",
    type: "RAR"
  },
  {
    category: "Drivers de impresoras",
    name: "Epson TM-T20III",
    description: "Driver para impresora Epson TM-T20III.",
    url: "https://www.globalvisum.com/descargas/soporte/Epson%20TM-T20III.rar",
    type: "RAR"
  },
  {
    category: "Drivers de impresoras",
    name: "POS",
    description: "Driver genérico para impresoras POS.",
    url: "https://www.globalvisum.com/descargas/soporte/POS.rar",
    type: "RAR"
  },
  {
    category: "Drivers de impresoras",
    name: "Epson L90 / T88V",
    description: "Paquete APD para Epson TM-L90 y TM-T88V.",
    url: "https://www.globalvisum.com/descargas/soporte/APD_TM-L90-T88V.rar",
    type: "RAR"
  },
  {
    category: "Drivers de impresoras",
    name: "Epson TM-T20II",
    description: "Paquete APD v5 para Epson TM-T20II.",
    url: "https://www.globalvisum.com/descargas/soporte/APD_v5_T20II.rar",
    type: "RAR"
  },
  {
    category: "Herramientas remotas",
    name: "TeamViewer QS",
    description: "Cliente QuickSupport para asistencia remota.",
    url: "https://download.teamviewer.com/download/TeamViewerQS.exe",
    type: "EXE"
  },
  {
    category: "Otros",
    name: "Credenciales Web",
    description: "Utilidad de credenciales web para soporte operativo.",
    url: "https://globalvisum.com/descargas/credencialweb.rar",
    type: "RAR"
  },
  {
    category: "Otros",
    name: "Micronauta Ops",
    description: "Herramienta interna de diagnóstico y soporte para relevar información del equipo, red, conectividad, impresoras, lectores y generar reportes técnicos.",
    url: "http://www.globalvisum.com/descargas/micronautaops.rar",
    type: "RAR"
  }
];

const accesses = [
  {
    category: "Soporte",
    name: "Jira",
    description: "Gestión de tickets y seguimiento operativo.",
    url: "https://micronauta-arg.atlassian.net/",
    logo: "assets/Jira.jpg",
    alt: "Logo de Jira"
  },
  {
    category: "Soporte",
    name: "Whaticket",
    description: "Plataforma de conversaciones y atención por WhatsApp.",
    url: "https://app.whaticket.com/login",
    logo: "assets/whaticket.jpg",
    alt: "Logo de Whaticket"
  },
  {
    category: "Soporte",
    name: "Gmail",
    description: "Bandeja principal de correo de soporte.",
    url: "https://mail.google.com/mail/u/0/#inbox",
    logo: "assets/gmail.png",
    alt: "Logo de Gmail",
    logoClass: "access-card__logo--gmail"
  },
  {
    category: "Documentación",
    name: "Confluence",
    description: "Documentación operativa y conocimiento interno del equipo.",
    url: "https://micronauta-arg.atlassian.net/wiki/spaces/SOPIT/overview",
    logo: "assets/confluence.jpg",
    alt: "Logo de Confluence"
  },
  {
    category: "Sistemas",
    name: "MicroWeb",
    description: "Entorno operativo principal.",
    url: "https://micronauta.dnsalias.net/megaweb/psw/login.php?mode=logout",
    logo: "assets/logo3.png",
    alt: "Logo de Micronauta"
  },
  {
    category: "Sistemas",
    name: "MicroWeb2",
    description: "Entorno alternativo operativo.",
    url: "https://micronauta2.dnsalias.net/megaweb/psw/login.php?mode=logout",
    logo: "assets/logo3.png",
    alt: "Logo de Micronauta"
  },
  {
    category: "Sistemas",
    name: "CMSV6",
    description: "Plataforma de monitoreo y gestión GPS.",
    url: "http://190.220.132.132:8080/808gps/login.html?1774469284737",
    logo: "assets/cmsv6.png",
    alt: "Logo de CMSV6"
  }
];
let megabusClients = [];
let megabusLoaded = false;

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  setupToasts();

  if (page === "home") {
    initHomePage();
  }

  if (page === "downloads") {
    initDownloadsPage();
  }

  if (page === "accesses") {
    initAccessesPage();
  }
});

function initHomePage() {
  const accessShell = document.getElementById("access-shell");
  const portalShell = document.getElementById("portal-shell");
  const loginForm = document.getElementById("login-form");
  const loginInput = document.getElementById("access-key-input");
  const loginMessage = document.getElementById("login-message");
  const logoutButton = document.getElementById("logout-button");

  if (!accessShell || !portalShell || !loginForm || !loginInput || !loginMessage || !logoutButton) {
    return;
  }

  const setPortalVisibility = (isAllowed) => {
    accessShell.classList.toggle("is-hidden", isAllowed);
    portalShell.classList.toggle("is-hidden", !isAllowed);
  };

  setPortalVisibility(isSessionActive());

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const submittedKey = loginInput.value.trim();

    if (!submittedKey) {
      setInlineMessage(loginMessage, "Ingresá la clave temporal para continuar.", "warning");
      showToast("Ingresá la clave temporal para continuar.", "warning");
      return;
    }

    if (submittedKey !== ACCESS_KEY) {
      setInlineMessage(loginMessage, "Clave incorrecta. Verificá el valor configurado en app.js.", "error");
      showToast("Clave incorrecta. Verificá el valor configurado en app.js.", "error");
      return;
    }

    localStorage.setItem(SESSION_STORAGE_KEY, "active");
    loginForm.reset();
    setInlineMessage(loginMessage, "");
    setPortalVisibility(true);
    showToast("Sesión operativa iniciada.", "success");
  });

  logoutButton.addEventListener("click", () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setPortalVisibility(false);
    setInlineMessage(loginMessage, "Sesión cerrada. Volvé a ingresar la clave temporal.", "warning");
    loginInput.focus();
    showToast("Sesión cerrada correctamente.", "success");
  });
}

async function initDownloadsPage() {
  const loginGate = document.getElementById("downloads-login-gate");
  const downloadsShell = document.getElementById("downloads-shell");
  const searchInput = document.getElementById("downloads-search");
  const chipsContainer = document.getElementById("category-chips");
  const resultsCount = document.getElementById("results-count");
  const downloadsGrid = document.getElementById("downloads-grid");
  const emptyState = document.getElementById("downloads-empty");
  const megabusSearch = document.getElementById("megabus-search");
  const megabusResults = document.getElementById("megabus-results");
  const megabusStatus = document.getElementById("megabus-status");

  if (
    !loginGate ||
    !downloadsShell ||
    !searchInput ||
    !chipsContainer ||
    !resultsCount ||
    !downloadsGrid ||
    !emptyState ||
    !megabusSearch ||
    !megabusResults ||
    !megabusStatus
  ) {
    return;
  }

  const isAllowed = isSessionActive();
  loginGate.classList.toggle("is-hidden", isAllowed);
  downloadsShell.classList.toggle("is-hidden", !isAllowed);

  if (!isAllowed) {
    return;
  }

  const categories = ["Todas", "Lectores", "Drivers de impresoras", "Otros"];
  const state = {
    term: "",
    category: "Todas"
  };

  chipsContainer.innerHTML = categories
    .map(
      (category) => `
        <button
          class="chip${category === state.category ? " is-active" : ""}"
          type="button"
          data-category="${escapeHtml(category)}"
        >
          ${escapeHtml(category)}
        </button>
      `
    )
    .join("");

  chipsContainer.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-category]");
    if (!chip) {
      return;
    }

    state.category = chip.dataset.category;
    updateActiveChip(chipsContainer, state.category);
    renderDownloadsGrid();
  });

  searchInput.addEventListener("input", () => {
    state.term = searchInput.value.trim().toLowerCase();
    renderDownloadsGrid();
  });

  megabusSearch.addEventListener("input", () => {
    renderMegabusResults(megabusSearch.value.trim(), megabusResults, megabusStatus);
  });

  downloadsGrid.addEventListener("click", (event) => {
    const action = event.target.closest("[data-download-name]");
    if (!action) {
      return;
    }

    showToast(`Abriendo descarga: ${action.dataset.downloadName}`, "success");
  });

  megabusResults.addEventListener("click", (event) => {
    const action = event.target.closest("[data-megabus-company]");
    if (!action) {
      return;
    }

    showToast(`Abriendo instalador de ${action.dataset.megabusCompany}`, "success");
  });

  await loadMegabusClients();
  renderMegabusResults("", megabusResults, megabusStatus);
  renderDownloadsGrid();

  function renderDownloadsGrid() {
    const filtered = downloads.filter((item) => {
      const haystack = `${item.category} ${item.name} ${item.description} ${item.type}`.toLowerCase();
      const matchesTerm = state.term ? haystack.includes(state.term) : true;
      const matchesCategory = state.category === "Todas" ? true : item.category === state.category;

      return matchesTerm && matchesCategory;
    });

    const includeMegabusCard = state.category === "Todas";
    const totalResults = filtered.length + (includeMegabusCard ? 1 : 0);

    resultsCount.textContent =
      totalResults === 1
        ? "1 resultado visible"
        : `${totalResults} resultados visibles`;

    downloadsGrid.innerHTML = filtered
      .map(
        (item) => `
          <article class="download-card">
            <div>
              <div class="download-card__meta">
                <span>${escapeHtml(item.category)}</span>
                <span>${escapeHtml(item.type)}</span>
              </div>
              <h3>${escapeHtml(item.name)}</h3>
              <p>${escapeHtml(item.description)}</p>
            </div>
            <div class="download-card__footer">
              <span class="toolbar-note">${escapeHtml(item.url)}</span>
              <a
                class="download-link"
                href="${item.url}"
                target="_blank"
                rel="noopener noreferrer"
                data-download-name="${escapeHtml(item.name)}"
              >
                Descargar
              </a>
            </div>
          </article>
        `
      )
      .join("");

    emptyState.hidden = totalResults !== 0;
    downloadsGrid.hidden = totalResults === 0;
  }
}

async function loadMegabusClients() {
  try {
    const response = await fetch("assets/data/megabus.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("No se pudo cargar megabus.json");
    }

    megabusClients = await response.json();
    megabusLoaded = true;
  } catch (error) {
    console.error(error);
    megabusClients = [];
    megabusLoaded = false;
    showToast("No se pudo cargar la base Megabus.", "error");
  }
}

function renderMegabusResults(term, container, statusElement) {
  const normalizedTerm = term.trim().toLowerCase();

  if (!megabusLoaded) {
    statusElement.textContent = "";
    statusElement.dataset.tone = "error";
    container.innerHTML = `
      <div class="megabus-item megabus-item--warning">
        <strong>Base no disponible</strong>
        <p>No se pudo cargar la base local de Megabus.</p>
      </div>
    `;
    return;
  }

  if (!normalizedTerm) {
    statusElement.textContent = "";
    statusElement.dataset.tone = "";
    container.innerHTML = `
      <div class="megabus-item">
        <strong>Búsqueda Megabus</strong>
        <p>Buscá un cliente o empresa para ver instaladores disponibles.</p>
      </div>
    `;
    return;
  }

  if (normalizedTerm.length < 2) {
    statusElement.textContent = "";
    statusElement.dataset.tone = "";
    container.innerHTML = `
      <div class="megabus-item">
        <strong>Búsqueda Megabus</strong>
        <p>Ingresá al menos 2 caracteres para buscar.</p>
      </div>
    `;
    return;
  }

  const matches = megabusClients.filter((client) =>
    String(client.empresa || "").toLowerCase().includes(normalizedTerm)
  );

  if (!matches.length) {
    statusElement.textContent = "0 resultados para la búsqueda actual.";
    statusElement.dataset.tone = "warning";
    container.innerHTML = `
      <div class="megabus-item megabus-item--warning">
        <strong>Sin coincidencias</strong>
        <p>No se encontraron instaladores para esa búsqueda.</p>
      </div>
    `;
    return;
  }

  const visibleMatches = matches.slice(0, 12);
  const extraMatches = matches.length - visibleMatches.length;

  statusElement.textContent =
    visibleMatches.length === 1
      ? "1 instalador encontrado."
      : `${visibleMatches.length} instaladores encontrados.`;
  statusElement.dataset.tone = "success";

  container.innerHTML = visibleMatches.map((client) => renderMegabusCard(client)).join("");

  if (extraMatches > 0) {
    container.insertAdjacentHTML(
      "beforeend",
      `
        <div class="megabus-item">
          <strong>Más coincidencias disponibles</strong>
          <p>Hay más coincidencias. Especificá mejor la búsqueda.</p>
        </div>
      `
    );
  }
}

function renderMegabusCard(client) {
  const empresa = String(client.empresa || "Empresa sin nombre").trim();
  const instalador = String(client.instalador || "").trim();
  const claveInstalador = String(client.claveInstalador || "").trim();
  const hasValidInstaller = instalador.toLowerCase().endsWith(".exe");
  const downloadUrl = hasValidInstaller
    ? `https://www.globalvisum.com/descargas/${encodeURIComponent(instalador)}`
    : "";

  return `
    <article class="megabus-item${hasValidInstaller ? "" : " megabus-item--warning"}">
      <div class="megabus-item__header">
        <span class="megabus-badge">Megabus</span>
        <strong>${escapeHtml(empresa)}</strong>
      </div>
      <div class="megabus-item__body">
        <p><span>Empresa</span>${escapeHtml(empresa)}</p>
        <p><span>Instalador</span>${escapeHtml(instalador || "No informado")}</p>
        <p><span>Clave del instalador</span><code>${escapeHtml(formatInstallerKey(claveInstalador))}</code></p>
        <p><span>URL final</span>${escapeHtml(downloadUrl || "Instalador no disponible o requiere revisión")}</p>
      </div>
      ${
        hasValidInstaller
          ? `
            <div class="megabus-item__footer">
              <a
                class="download-link"
                href="${downloadUrl}"
                target="_blank"
                rel="noopener noreferrer"
                data-megabus-company="${escapeHtml(empresa)}"
              >
                Descargar instalador
              </a>
            </div>
          `
          : `
            <div class="megabus-item__footer">
              <span class="megabus-warning-text">Instalador no disponible o requiere revisión</span>
            </div>
          `
      }
    </article>
  `;
}

function formatInstallerKey(value) {
  return value || "No informada";
}

function isSessionActive() {
  return localStorage.getItem(SESSION_STORAGE_KEY) === "active";
}

function updateActiveChip(container, activeCategory) {
  container.querySelectorAll("[data-category]").forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.category === activeCategory);
  });
}

function setInlineMessage(element, text, tone = "") {
  element.textContent = text;
  element.dataset.tone = tone;
}

function setupToasts() {
  const region = document.getElementById("toast-region");
  if (!region) {
    return;
  }

  window.showToast = (message, tone = "success") => {
    const toast = document.createElement("div");
    toast.className = `toast toast--${tone}`;
    toast.textContent = message;
    region.appendChild(toast);

    window.setTimeout(() => {
      toast.remove();
    }, 3200);
  };
}

function showToast(message, tone = "success") {
  if (typeof window.showToast === "function") {
    window.showToast(message, tone);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}




function initAccessesPage() {
  const loginGate = document.getElementById("accesses-login-gate");
  const accessesShell = document.getElementById("accesses-shell");
  const searchInput = document.getElementById("accesses-search");
  const chipsContainer = document.getElementById("accesses-chips");
  const resultsCount = document.getElementById("accesses-results-count");
  const accessesGrid = document.getElementById("accesses-grid");
  const emptyState = document.getElementById("accesses-empty");

  if (
    !loginGate ||
    !accessesShell ||
    !searchInput ||
    !chipsContainer ||
    !resultsCount ||
    !accessesGrid ||
    !emptyState
  ) {
    return;
  }

  const isAllowed = isSessionActive();
  loginGate.classList.toggle("is-hidden", isAllowed);
  accessesShell.classList.toggle("is-hidden", !isAllowed);

  if (!isAllowed) {
    return;
  }

  const categories = ["Todos", "Soporte", "Documentación", "Sistemas"];
  const state = {
    term: "",
    category: "Todos"
  };

  chipsContainer.innerHTML = categories
    .map(
      (category) => `
        <button
          class="chip${category === state.category ? " is-active" : ""}"
          type="button"
          data-category="${escapeHtml(category)}"
        >
          ${escapeHtml(category)}
        </button>
      `
    )
    .join("");

  chipsContainer.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-category]");
    if (!chip) {
      return;
    }

    state.category = chip.dataset.category;
    updateActiveChip(chipsContainer, state.category);
    renderAccessesGrid();
  });

  searchInput.addEventListener("input", () => {
    state.term = searchInput.value.trim().toLowerCase();
    renderAccessesGrid();
  });

  accessesGrid.addEventListener("click", (event) => {
    const action = event.target.closest("[data-access-name]");
    if (!action) {
      return;
    }

    showToast(`Abriendo acceso: ${action.dataset.accessName}`, "success");
  });

  renderAccessesGrid();

  function renderAccessesGrid() {
    const filtered = accesses.filter((item) => {
      const haystack = `${item.category} ${item.name} ${item.description} ${item.url}`.toLowerCase();
      const matchesTerm = state.term ? haystack.includes(state.term) : true;
      const matchesCategory = state.category === "Todos" ? true : item.category === state.category;

      return matchesTerm && matchesCategory;
    });

    resultsCount.textContent =
      filtered.length === 1
        ? "1 acceso visible"
        : `${filtered.length} accesos visibles`;

    accessesGrid.innerHTML = filtered
      .map(
        (item) => `
          <article class="download-card access-card">
            <div class="access-card__top">
              <div class="access-card__media" aria-hidden="true">
                <span class="access-card__fallback">${escapeHtml(getAccessInitials(item.name))}</span>
                <img
                  class="access-card__logo${item.logoClass ? ` ${item.logoClass}` : ""}"
                  src="${item.logo}"
                  alt="${escapeHtml(item.alt || `Logo de ${item.name}`)}"
                  loading="lazy"
                  onerror="this.style.display='none'"
                />
              </div>
              <div class="access-card__content">
                <div class="download-card__meta">
                  <span>${escapeHtml(item.category)}</span>
                  <span>Acceso web</span>
                </div>
                <h3>${escapeHtml(item.name)}</h3>
                <p>${escapeHtml(item.description)}</p>
              </div>
            </div>
            <div class="download-card__footer access-card__footer">
              <span class="access-domain">${escapeHtml(getDomainLabel(item.url))}</span>
              <a
                class="download-link"
                href="${item.url}"
                target="_blank"
                rel="noopener noreferrer"
                data-access-name="${escapeHtml(item.name)}"
              >
                Abrir
              </a>
            </div>
          </article>
        `
      )
      .join("");

    emptyState.hidden = filtered.length !== 0;
    accessesGrid.hidden = filtered.length === 0;
  }
}

function getDomainLabel(url) {
  try {
    return new URL(url).host;
  } catch (error) {
    return url;
  }
}


function getAccessInitials(name) {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
