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
  }
];

const megabusClients = [];

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  setupToasts();

  if (page === "home") {
    initHomePage();
  }

  if (page === "downloads") {
    initDownloadsPage();
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

function initDownloadsPage() {
  const loginGate = document.getElementById("downloads-login-gate");
  const downloadsShell = document.getElementById("downloads-shell");
  const searchInput = document.getElementById("downloads-search");
  const chipsContainer = document.getElementById("category-chips");
  const resultsCount = document.getElementById("results-count");
  const downloadsGrid = document.getElementById("downloads-grid");
  const emptyState = document.getElementById("downloads-empty");
  const megabusSearch = document.getElementById("megabus-search");
  const megabusResults = document.getElementById("megabus-results");

  if (
    !loginGate ||
    !downloadsShell ||
    !searchInput ||
    !chipsContainer ||
    !resultsCount ||
    !downloadsGrid ||
    !emptyState ||
    !megabusSearch ||
    !megabusResults
  ) {
    return;
  }

  const isAllowed = isSessionActive();
  loginGate.classList.toggle("is-hidden", isAllowed);
  downloadsShell.classList.toggle("is-hidden", !isAllowed);

  if (!isAllowed) {
    return;
  }

  const categories = ["Todas", "Megabus", ...new Set(downloads.map((item) => item.category))];
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
    renderMegabusResults(megabusSearch.value.trim().toLowerCase(), megabusResults);
  });

  downloadsGrid.addEventListener("click", (event) => {
    const action = event.target.closest("[data-download-name]");
    if (!action) {
      return;
    }

    showToast(`Abriendo descarga: ${action.dataset.downloadName}`, "success");
  });

  renderMegabusResults("", megabusResults);
  renderDownloadsGrid();

  function renderDownloadsGrid() {
    const filtered = downloads.filter((item) => {
      const haystack = `${item.category} ${item.name} ${item.description} ${item.type}`.toLowerCase();
      const matchesTerm = state.term ? haystack.includes(state.term) : true;
      const matchesCategory =
        state.category === "Todas" ? true : item.category === state.category;

      return matchesTerm && matchesCategory;
    });

    const includeMegabusCard =
      state.category === "Todas" || state.category === "Megabus";
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

function renderMegabusResults(term, container) {
  if (!megabusClients.length) {
    container.innerHTML = `
      <div class="megabus-item">
        La búsqueda de instaladores Megabus está preparada para integrarse con la base CSV.
      </div>
    `;
    return;
  }

  const results = megabusClients.filter((client) =>
    `${client.client} ${client.description}`.toLowerCase().includes(term)
  );

  if (!results.length) {
    container.innerHTML = `
      <div class="megabus-item">
        No hay coincidencias para la búsqueda actual.
      </div>
    `;
    return;
  }

  container.innerHTML = results
    .map(
      (client) => `
        <div class="megabus-item">
          <strong>${escapeHtml(client.client)}</strong>
          <p>${escapeHtml(client.description || "Instalador disponible para este cliente.")}</p>
        </div>
      `
    )
    .join("");
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
