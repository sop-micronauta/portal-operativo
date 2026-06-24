let clientesData = [];
let clientesLoaded = false;

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "clients") {
    void initClientsPage();
  }
});

async function initClientsPage() {
  const loginGate = document.getElementById("clients-login-gate");
  const clientsShell = document.getElementById("clients-shell");
  const searchInput = document.getElementById("clients-search");
  const provinceSelect = document.getElementById("clients-filter-province");
  const classificationSelect = document.getElementById("clients-filter-classification");
  const exportButton = document.getElementById("clients-export-button");
  const resultsCount = document.getElementById("clients-results-count");
  const statusElement = document.getElementById("clients-status");
  const resultsContainer = document.getElementById("clients-results");
  const emptyState = document.getElementById("clients-empty");
  const tableShell = document.getElementById("clients-table-shell");
  const pageSizeSelect = document.getElementById("clients-page-size");
  const prevPageButton = document.getElementById("clients-prev-page");
  const nextPageButton = document.getElementById("clients-next-page");
  const pageInfo = document.getElementById("clients-page-info");
  const sortButtons = document.querySelectorAll(".clients-sort-button");
  const lastUpdatedHead = document.getElementById("clients-last-updated-head");
  const totalKpi = document.getElementById("clients-kpi-total");

  if (
    !loginGate ||
    !clientsShell ||
    !searchInput ||
    !provinceSelect ||
    !classificationSelect ||
    !exportButton ||
    !resultsCount ||
    !statusElement ||
    !resultsContainer ||
    !emptyState ||
    !tableShell ||
    !pageSizeSelect ||
    !prevPageButton ||
    !nextPageButton ||
    !pageInfo ||
    !sortButtons.length ||
    !lastUpdatedHead ||
    !totalKpi
  ) {
    return;
  }

  const isAllowed = typeof isSessionActive === "function" ? isSessionActive() : false;
  loginGate.classList.toggle("is-hidden", isAllowed);
  clientsShell.classList.toggle("is-hidden", !isAllowed);

  if (!isAllowed) {
    return;
  }

  const state = {
    term: "",
    provincia: "Todas",
    clasificacion: "Todas",
    sortKey: "nombre",
    sortDirection: "asc",
    page: 1,
    pageSize: Number(pageSizeSelect.value) || 10,
    filtered: []
  };

  setInlineMessage(statusElement, "Cargando base de clientes...", "warning");
  exportButton.disabled = true;

  await loadClientes();

  if (!clientesLoaded) {
    setInlineMessage(statusElement, "No se pudo cargar la base de clientes.", "error");
    resultsCount.textContent = "0 clientes encontrados";
    resultsContainer.innerHTML = "";
    tableShell.hidden = true;
    emptyState.hidden = false;
    exportButton.disabled = true;
    updateClientsKpis(totalKpi, []);
    updatePaginationControls(prevPageButton, nextPageButton, pageInfo, state.page, state.pageSize, 0);
    return;
  }

  populateClienteFilters(provinceSelect, classificationSelect);
  updateClientsKpis(totalKpi, clientesData);
  const hasLastUpdated = clientesData.some((client) => getLastUpdatedValue(client));
  lastUpdatedHead.hidden = !hasLastUpdated;

  searchInput.addEventListener("input", () => {
    state.term = searchInput.value.trim();
    state.page = 1;
    renderClientes();
  });

  provinceSelect.addEventListener("change", () => {
    state.provincia = provinceSelect.value;
    state.page = 1;
    renderClientes();
  });

  classificationSelect.addEventListener("change", () => {
    state.clasificacion = classificationSelect.value;
    state.page = 1;
    renderClientes();
  });

  pageSizeSelect.addEventListener("change", () => {
    state.pageSize = Number(pageSizeSelect.value) || 10;
    state.page = 1;
    renderClientes();
  });

  prevPageButton.addEventListener("click", () => {
    if (state.page > 1) {
      state.page -= 1;
      renderClientes();
    }
  });

  nextPageButton.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
    if (state.page < totalPages) {
      state.page += 1;
      renderClientes();
    }
  });

  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextKey = button.dataset.sortKey;
      if (!nextKey) {
        return;
      }

      if (state.sortKey === nextKey) {
        state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
      } else {
        state.sortKey = nextKey;
        state.sortDirection = "asc";
      }

      state.page = 1;
      updateSortButtons(sortButtons, state.sortKey, state.sortDirection);
      renderClientes();
    });
  });

  exportButton.addEventListener("click", () => {
    exportClientesCsv(state.filtered);
  });

  updateSortButtons(sortButtons, state.sortKey, state.sortDirection);
  renderClientes();

  function renderClientes() {
    const filteredItems = filterClientes(clientesData, state);
    state.filtered = sortClientes(filteredItems, state.sortKey, state.sortDirection);

    const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
    if (state.page > totalPages) {
      state.page = totalPages;
    }

    const startIndex = state.filtered.length ? (state.page - 1) * state.pageSize : 0;
    const pageItems = state.filtered.slice(startIndex, startIndex + state.pageSize);
    const rangeStart = state.filtered.length ? startIndex + 1 : 0;
    const rangeEnd = state.filtered.length ? startIndex + pageItems.length : 0;

    exportButton.disabled = state.filtered.length === 0;
    resultsCount.textContent =
      state.filtered.length === 1
        ? "1 cliente encontrado"
        : `${state.filtered.length} clientes encontrados`;

    setInlineMessage(
      statusElement,
      state.filtered.length
        ? "Base local lista para soporte operativo."
        : "No se encontraron clientes con esos filtros.",
      state.filtered.length ? "success" : "warning"
    );

    resultsContainer.innerHTML = pageItems
      .map((client) => renderClientRow(client, hasLastUpdated))
      .join("");

    emptyState.hidden = state.filtered.length !== 0;
    tableShell.hidden = state.filtered.length === 0;
    updatePaginationControls(prevPageButton, nextPageButton, pageInfo, state.page, state.pageSize, state.filtered.length);

    if (state.filtered.length) {
      pageInfo.textContent = `Mostrando ${rangeStart} a ${rangeEnd} de ${state.filtered.length}`;
    }
  }
}

async function loadClientes() {
  try {
    const response = await fetch("assets/data/clientes.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("No se pudo cargar clientes.json");
    }

    clientesData = await response.json();
    clientesLoaded = true;
  } catch (error) {
    console.error(error);
    clientesData = [];
    clientesLoaded = false;
    showToast("No se pudo cargar la base de clientes.", "error");
  }
}

function populateClienteFilters(provinceSelect, classificationSelect) {
  const provincias = [...new Set(
    clientesData.flatMap((client) => toArray(client.provincia))
  )].sort((a, b) => String(a).localeCompare(String(b), "es"));
  const clasificaciones = [...new Set(
    clientesData.flatMap((client) => toArray(client.clasificacion))
  )].sort((a, b) => String(a).localeCompare(String(b), "es"));

  provinceSelect.innerHTML = ["Todas", ...provincias]
    .map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`)
    .join("");

  classificationSelect.innerHTML = ["Todas", ...clasificaciones]
    .map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`)
    .join("");
}

function updateClientsKpis(totalKpi, items) {
  totalKpi.textContent = String(items.length);
}

function filterClientes(items, filters) {
  const normalizedTerm = normalizeSearchValue(filters.term);

  return items.filter((client) => {
    const provinciaValues = toArray(client.provincia);
    const clasificacionLabel = getClienteClasificacionLabel(client.clasificacion);
    const haystack = normalizeSearchValue([
      client.id_cliente,
      client.nombre,
      provinciaValues.join(" "),
      clasificacionLabel
    ].join(" "));

    const matchesTerm = normalizedTerm ? haystack.includes(normalizedTerm) : true;
    const matchesProvince =
      filters.provincia === "Todas" ? true : provinciaValues.includes(filters.provincia);
    const matchesClassification =
      filters.clasificacion === "Todas"
        ? true
        : toArray(client.clasificacion).includes(filters.clasificacion);

    return matchesTerm && matchesProvince && matchesClassification;
  });
}

function sortClientes(items, sortKey, direction) {
  const factor = direction === "desc" ? -1 : 1;

  return [...items].sort((a, b) => {
    const valueA = getClientSortValue(a, sortKey);
    const valueB = getClientSortValue(b, sortKey);

    if (typeof valueA === "number" && typeof valueB === "number") {
      return (valueA - valueB) * factor;
    }

    return String(valueA).localeCompare(String(valueB), "es", { sensitivity: "base", numeric: true }) * factor;
  });
}

function getClientSortValue(client, sortKey) {
  switch (sortKey) {
    case "id_cliente":
      return Number(client.id_cliente) || 0;
    case "provincia":
      return getClienteProvinciaLabel(client.provincia);
    case "clasificacion":
      return getClienteClasificacionLabel(client.clasificacion);
    case "nombre":
    default:
      return client.nombre || "";
  }
}

function renderClientRow(client, hasLastUpdated) {
  const lastUpdated = getLastUpdatedValue(client);

  return `
    <tr>
      <td data-label="ID">
        <span class="clients-id-chip">#${escapeHtml(client.id_cliente)}</span>
      </td>
      <td data-label="Cliente">
        <div class="clients-table__name-cell">
          <strong>${escapeHtml(client.nombre || "Sin nombre")}</strong>
        </div>
      </td>
      <td data-label="Provincia">${escapeHtml(getClienteProvinciaLabel(client.provincia))}</td>
      <td data-label="Clasificación">${escapeHtml(getClienteClasificacionLabel(client.clasificacion))}</td>
      ${hasLastUpdated ? `<td data-label="Última actualización">${escapeHtml(lastUpdated || "-")}</td>` : ""}
    </tr>
  `;
}

function updateSortButtons(buttons, sortKey, sortDirection) {
  buttons.forEach((button) => {
    const isActive = button.dataset.sortKey === sortKey;
    button.dataset.active = isActive ? "true" : "false";
    button.setAttribute("aria-sort", isActive ? (sortDirection === "asc" ? "ascending" : "descending") : "none");

    const indicator = button.querySelector(".clients-sort-indicator");
    if (indicator) {
      indicator.textContent = isActive ? (sortDirection === "asc" ? "ASC" : "DESC") : "";
    }
  });
}

function updatePaginationControls(prevButton, nextButton, pageInfo, page, pageSize, totalItems) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  prevButton.disabled = page <= 1 || totalItems === 0;
  nextButton.disabled = page >= totalPages || totalItems === 0;

  if (!totalItems) {
    pageInfo.textContent = "Mostrando 0 a 0 de 0";
    return;
  }

  pageInfo.textContent = `Página ${page} de ${totalPages}`;
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : String(item ?? "").trim()))
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function getClienteProvinciaLabel(value) {
  const provincias = toArray(value);
  return provincias.length ? provincias.join(" / ") : "-";
}

function getClienteClasificacionLabel(value) {
  const clasificaciones = toArray(value);
  return clasificaciones.length ? clasificaciones.join(" / ") : "Ninguna";
}

function getLastUpdatedValue(client) {
  return client.ultima_actualizacion || client.ultimaActualizacion || client.actualizado || "";
}

function normalizeSearchValue(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function exportClientesCsv(items) {
  if (!items.length) {
    showToast("No hay resultados para exportar.", "warning");
    return;
  }

  const headers = ["id_cliente", "nombre", "provincia", "clasificacion"];
  const rows = items.map((client) => [
    client.id_cliente,
    client.nombre,
    getClienteProvinciaLabel(client.provincia),
    getClienteClasificacionLabel(client.clasificacion)
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `clientes-filtrados-${getTimestampForFileName()}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Exportación CSV generada correctamente.", "success");
}

function getTimestampForFileName() {
  const now = new Date();
  const parts = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    "-",
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0")
  ];

  return parts.join("");
}
