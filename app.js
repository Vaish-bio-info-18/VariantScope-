
/*
 * VariantScope | Dashboard Application
 *
 * Uses synthetic demonstration data from data.js.
 * This application is an educational prototype, not a clinical
 * variant interpretation or diagnostic system.
 */

(() => {
  "use strict";

  // ---------- DOM references ----------

  const elements = {
    totalVariants: document.getElementById("total-variants"),
    uniqueGenes: document.getElementById("unique-genes"),
    highScores: document.getElementById("high-scores"),
    rareVariants: document.getElementById("rare-variants"),

    searchInput: document.getElementById("search-input"),
    consequenceFilter: document.getElementById("consequence-filter"),
    classificationFilter: document.getElementById("classification-filter"),
    resetButton: document.getElementById("reset-btn"),

    tableBody: document.getElementById("variant-rows"),
    resultCount: document.getElementById("result-count"),
    previousPage: document.getElementById("prev-page"),
    nextPage: document.getElementById("next-page"),
    pageLabel: document.getElementById("page-label"),
    showingText: document.getElementById("showing-text"),

    exportButton: document.getElementById("export-btn"),

    dialog: document.getElementById("variant-dialog"),
    dialogTitle: document.getElementById("dialog-title"),
    dialogBody: document.getElementById("dialog-body"),
    closeDialog: document.getElementById("close-dialog"),

    toast: document.getElementById("toast")
  };

  // ---------- Application state ----------

  const PAGE_SIZE = 8;

  let currentPage = 1;
  let filteredVariants = [...variantData];
  let consequenceChart = null;
  let frequencyChart = null;
  let toastTimeout = null;

  // ---------- Safe formatting helpers ----------

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatInteger(value) {
    return Number(value).toLocaleString("en-US");
  }

  function formatPosition(value) {
    return Number(value).toLocaleString("en-US");
  }

  function formatOptionalScore(value) {
    return typeof value === "number" && Number.isFinite(value)
      ? value.toFixed(2)
      : "N/A";
  }

  function formatPercentage(value) {
    if (!Number.isFinite(value)) return "N/A";
    return `${(value * 100).toFixed(2)}%`;
  }

  function getFrequencyLabel(value) {
    return typeof formatFrequency === "function"
      ? formatFrequency(value)
      : formatPercentage(value);
  }

  function showToast(message) {
    if (!elements.toast) return;

    elements.toast.textContent = message;
    elements.toast.classList.add("show");

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      elements.toast.classList.remove("show");
    }, 2800);
  }

  // ---------- Summary statistics ----------

  function updateStatistics(records) {
    if (elements.totalVariants) {
      elements.totalVariants.textContent = formatInteger(records.length);
    }

    if (elements.uniqueGenes) {
      elements.uniqueGenes.textContent = formatInteger(
        getUniqueGeneCount(records)
      );
    }

    if (elements.highScores) {
      const highImpactCount = records.filter(
        (variant) => variant.impact === "High"
      ).length;

      elements.highScores.textContent = formatInteger(highImpactCount);
    }

    if (elements.rareVariants) {
      elements.rareVariants.textContent = formatInteger(
        getRareVariantCount(records)
      );
    }
  }

  // ---------- Search and filters ----------

  function applyFilters() {
    const searchTerm = (
      elements.searchInput?.value || ""
    ).trim().toLowerCase();

    const selectedConsequence =
      elements.consequenceFilter?.value || "";

    const selectedClassification =
      elements.classificationFilter?.value || "";

    filteredVariants = variantData.filter((variant) => {
      const searchableFields = [
        variant.id,
        variant.rsid,
        variant.gene,
        variant.chromosome,
        variant.position,
        variant.ref,
        variant.alt,
        variant.consequence,
        variant.classification,
        variant.impact
      ];

      const matchesSearch =
        !searchTerm ||
        searchableFields.some((field) =>
          String(field ?? "").toLowerCase().includes(searchTerm)
        );

      const matchesConsequence =
        !selectedConsequence ||
        selectedConsequence === "all" ||
        variant.consequence === selectedConsequence;

      const matchesClassification =
        !selectedClassification ||
        selectedClassification === "all" ||
        variant.classification === selectedClassification;

      return (
        matchesSearch &&
        matchesConsequence &&
        matchesClassification
      );
    });

    currentPage = 1;

    updateStatistics(filteredVariants);
    renderTable();
    updateCharts(filteredVariants);
  }

  function resetFilters() {
    if (elements.searchInput) {
      elements.searchInput.value = "";
    }

    if (elements.consequenceFilter) {
      elements.consequenceFilter.value = "";
    }

    if (elements.classificationFilter) {
      elements.classificationFilter.value = "";
    }

    applyFilters();
    showToast("Filters have been reset.");
  }

  // ---------- Table rendering ----------

  function renderTable() {
    if (!elements.tableBody) return;

    const totalResults = filteredVariants.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));

    currentPage = Math.min(currentPage, totalPages);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, totalResults);

    const pageRecords = filteredVariants.slice(startIndex, endIndex);

    if (elements.resultCount) {
      elements.resultCount.textContent = formatInteger(totalResults);
    }

    if (elements.pageLabel) {
      elements.pageLabel.textContent =
        `Page ${currentPage} of ${totalPages}`;
    }

    if (elements.showingText) {
      elements.showingText.textContent = totalResults === 0
        ? "Showing 0 results"
        : `Showing ${formatInteger(startIndex + 1)}–${formatInteger(endIndex)} of ${formatInteger(totalResults)}`;
    }

    if (elements.previousPage) {
      elements.previousPage.disabled = currentPage <= 1;
    }

    if (elements.nextPage) {
      elements.nextPage.disabled =
        currentPage >= totalPages || totalResults === 0;
    }

    if (pageRecords.length === 0) {
      elements.tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="empty-state">
            <strong>No matching variants found.</strong>
            <br />
            Try changing your search term or filters.
          </td>
        </tr>
      `;
      return;
    }

    elements.tableBody.innerHTML = pageRecords.map((variant) => {
      const impactClass =
        typeof getImpactClass === "function"
          ? getImpactClass(variant.impact)
          : "badge-neutral";

      return `
        <tr>
          <td>
            <span class="variant-id">${escapeHTML(variant.id)}</span>
          </td>
          <td>
            <span class="gene-name">${escapeHTML(variant.gene)}</span>
          </td>
          <td>
            <span class="mono">${escapeHTML(variant.chromosome)}:${formatPosition(variant.position)}</span>
          </td>
          <td>
            <span class="mono">${escapeHTML(variant.ref)} → ${escapeHTML(variant.alt)}</span>
          </td>
          <td>${escapeHTML(variant.consequence)}</td>
          <td>
            <span class="badge ${escapeHTML(impactClass)}">
              ${escapeHTML(variant.impact)}
            </span>
          </td>
          <td>${escapeHTML(getFrequencyLabel(variant.alleleFrequency))}</td>
          <td>
            <button
              class="table-action"
              type="button"
              data-variant-id="${escapeHTML(variant.id)}"
              aria-label="View details for ${escapeHTML(variant.id)}"
            >
              View details
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  function changePage(direction) {
    const totalPages = Math.max(
      1,
      Math.ceil(filteredVariants.length / PAGE_SIZE)
    );

    const requestedPage = currentPage + direction;

    if (requestedPage < 1 || requestedPage > totalPages) return;

    currentPage = requestedPage;
    renderTable();

    elements.tableBody?.closest(".explorer-panel")?.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  // ---------- Variant details dialog ----------

  function openVariantDetails(variantId) {
    const variant = variantData.find(
      (record) => record.id === variantId
    );

    if (!variant || !elements.dialog) return;

    if (elements.dialogTitle) {
      elements.dialogTitle.textContent =
        `${variant.gene} · ${variant.id}`;
    }

    const detailItems = [
      ["Variant ID", variant.id],
      ["Reference ID", variant.rsid],
      ["Gene", variant.gene],
      ["Chromosome", variant.chromosome],
      ["Position", formatPosition(variant.position)],
      ["Reference allele", variant.ref],
      ["Alternate allele", variant.alt],
      ["Transcript", variant.transcript],
      ["Consequence", variant.consequence],
      ["Impact category", variant.impact],
      ["Illustrative classification", variant.classification],
      ["Allele frequency", getFrequencyLabel(variant.alleleFrequency)],
      ["CADD score (illustrative)", formatOptionalScore(variant.caddScore)],
      ["SIFT score (illustrative)", formatOptionalScore(variant.siftScore)],
      ["PolyPhen score (illustrative)", formatOptionalScore(variant.polyphenScore)],
      ["Inheritance label", variant.inheritance],
      ["Record status", variant.reviewStatus]
    ];

    const detailsHTML = detailItems.map(([label, value]) => `
      <div class="detail-item">
        <span class="detail-label">${escapeHTML(label)}</span>
        <div class="detail-value">${escapeHTML(value)}</div>
      </div>
    `).join("");

    elements.dialogBody.innerHTML = `
      <div class="detail-grid">
        ${detailsHTML}
      </div>
      <div class="dialog-note">
        <strong>Demo data only.</strong>
        ${escapeHTML(variant.notes)}
        These synthetic annotations are not clinically validated and
        must not be used for diagnosis or treatment decisions.
      </div>
    `;

    if (typeof elements.dialog.showModal === "function") {
      if (!elements.dialog.open) {
        elements.dialog.showModal();
      }
    } else {
      elements.dialog.setAttribute("open", "");
    }
  }

  function closeVariantDetails() {
    if (!elements.dialog) return;

    if (typeof elements.dialog.close === "function") {
      elements.dialog.close();
    } else {
      elements.dialog.removeAttribute("open");
    }
  }

  // ---------- Charts ----------

  function destroyCharts() {
    if (consequenceChart) {
      consequenceChart.destroy();
      consequenceChart = null;
    }

    if (frequencyChart) {
      frequencyChart.destroy();
      frequencyChart = null;
    }
  }

  function updateCharts(records) {
    const consequenceCanvas = document.getElementById("consequence-chart");
    const frequencyCanvas = document.getElementById("frequency-chart");

    // Keep the rest of the application usable if Chart.js is unavailable.
    if (
      typeof Chart === "undefined" ||
      !consequenceCanvas ||
      !frequencyCanvas
    ) {
      return;
    }

    destroyCharts();

    const consequenceCounts = getConsequenceCounts(records);
    const consequenceLabels = Object.keys(consequenceCounts);
    const consequenceValues = Object.values(consequenceCounts);

    consequenceChart = new Chart(consequenceCanvas, {
      type: "doughnut",
      data: {
        labels: consequenceLabels,
        datasets: [{
          data: consequenceValues,
          backgroundColor: [
            "#5146e5",
            "#0e9f9a",
            "#e69b42",
            "#d94f70",
            "#7295e8",
            "#9a78d7",
            "#7d91a9",
            "#55b99c"
          ],
          borderColor: "#ffffff",
          borderWidth: 3,
          hoverOffset: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "64%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              padding: 15,
              boxWidth: 7,
              font: {
                family: "DM Sans",
                size: 10
              }
            }
          },
          tooltip: {
            callbacks: {
              label(context) {
                const total = context.dataset.data.reduce(
                  (sum, value) => sum + value,
                  0
                );

                const percentage = total
                  ? ((context.raw / total) * 100).toFixed(1)
                  : "0.0";

                return ` ${context.label}: ${context.raw} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    const frequencyBuckets = [
      { label: "< 0.1%", min: 0, max: 0.001 },
      { label: "0.1–1%", min: 0.001, max: 0.01 },
      { label: "1–5%", min: 0.01, max: 0.05 },
      { label: "5–10%", min: 0.05, max: 0.1 },
      { label: "≥ 10%", min: 0.1, max: Infinity }
    ];

    const frequencyCounts = frequencyBuckets.map((bucket) =>
      records.filter((variant) => {
        const frequency = variant.alleleFrequency;

        return Number.isFinite(frequency) &&
          frequency >= bucket.min &&
          frequency < bucket.max;
      }).length
    );

    frequencyChart = new Chart(frequencyCanvas, {
      type: "bar",
      data: {
        labels: frequencyBuckets.map((bucket) => bucket.label),
        datasets: [{
          label: "Variants",
          data: frequencyCounts,
          backgroundColor: [
            "#5146e5",
            "#7369eb",
            "#0e9f9a",
            "#58b8ac",
            "#e69b42"
          ],
          borderRadius: 6,
          maxBarThickness: 45
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label(context) {
                return ` ${context.raw} variant(s)`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: "#77839b",
              font: {
                family: "DM Sans",
                size: 10
              }
            },
            border: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              color: "#77839b",
              font: {
                family: "DM Sans",
                size: 10
              }
            },
            grid: {
              color: "#edf0f6"
            },
            border: {
              display: false
            }
          }
        }
      }
    });
  }

  // ---------- CSV export ----------

  function exportCSV() {
    if (filteredVariants.length === 0) {
      showToast("No variants to export. Adjust your filters first.");
      return;
    }

    const columns = [
      ["id", "Variant ID"],
      ["rsid", "Reference ID"],
      ["chromosome", "Chromosome"],
      ["position", "Position"],
      ["gene", "Gene"],
      ["transcript", "Transcript"],
      ["ref", "Reference allele"],
      ["alt", "Alternate allele"],
      ["consequence", "Consequence"],
      ["classification", "Demo classification"],
      ["impact", "Impact category"],
      ["alleleFrequency", "Allele frequency"],
      ["caddScore", "Illustrative CADD score"],
      ["siftScore", "Illustrative SIFT score"],
      ["polyphenScore", "Illustrative PolyPhen score"],
      ["inheritance", "Inheritance label"],
      ["reviewStatus", "Record status"],
      ["notes", "Notes"]
    ];

    function escapeCSV(value) {
      const normalized = value === null || value === undefined
        ? ""
        : String(value);

      return `"${normalized.replace(/"/g, '""')}"`;
    }

    const rows = [
      [
        "VariantScope synthetic demo dataset",
        "Not for clinical use"
      ],
      columns.map(([, heading]) => heading),
      ...filteredVariants.map((variant) =>
        columns.map(([key]) => variant[key] ?? "")
      )
    ];

    const csvContent = "\uFEFF" +
      rows.map((row) => row.map(escapeCSV).join(",")).join("\r\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const downloadURL = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadURL;
    link.download = "variantscope-synthetic-variants.csv";
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(downloadURL);

    showToast(`Exported ${filteredVariants.length} synthetic variant records.`);
  }

  // ---------- Event listeners ----------

  function bindEvents() {
    elements.searchInput?.addEventListener("input", applyFilters);

    elements.consequenceFilter?.addEventListener(
      "change",
      applyFilters
    );

    elements.classificationFilter?.addEventListener(
      "change",
      applyFilters
    );

    elements.resetButton?.addEventListener("click", resetFilters);

    elements.previousPage?.addEventListener("click", () => {
      changePage(-1);
    });

    elements.nextPage?.addEventListener("click", () => {
      changePage(1);
    });

    elements.exportButton?.addEventListener("click", exportCSV);

    elements.tableBody?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-variant-id]");

      if (!button) return;

      openVariantDetails(button.dataset.variantId);
    });

    elements.closeDialog?.addEventListener(
      "click",
      closeVariantDetails
    );

    elements.dialog?.addEventListener("click", (event) => {
      if (event.target === elements.dialog) {
        closeVariantDetails();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        elements.dialog?.open
      ) {
        closeVariantDetails();
      }
    });

    // Sidebar links navigate to matching sections when those IDs exist.
    document.querySelectorAll(".sidebar nav a").forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        if (!href || !href.startsWith("#")) return;

        const target = document.querySelector(href);

        if (target) {
          event.preventDefault();
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

          document.querySelectorAll(".sidebar nav a").forEach((item) => {
            item.classList.remove("active");
          });

          link.classList.add("active");
        }
      });
    });
  }

  // ---------- Initialise ----------

  function init() {
    if (!Array.isArray(variantData)) {
      console.error("VariantScope: variantData is missing or invalid.");
      showToast("Could not load the demo dataset.");
      return;
    }

    bindEvents();
    updateStatistics(variantData);
    renderTable();
    updateCharts(variantData);

    console.info(
      `VariantScope ready: ${variantData.length} synthetic demo records loaded.`
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
