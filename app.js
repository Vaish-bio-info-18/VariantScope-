
/*
 * VariantScope | Dashboard Application
 * Supports synthetic demo data and uploaded VCF records.
 * Gene annotation through Ensembl VEP is not connected yet.
 * Research use only. Not a clinical diagnostic tool.
 */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const elements = {
    totalVariants: $("total-variants"),
    uniqueGenes: $("unique-genes"),
    highScores: $("high-scores"),
    rareVariants: $("rare-variants"),

    searchInput: $("search-input"),
    consequenceFilter: $("consequence-filter"),
    classificationFilter: $("classification-filter"),
    resetButton: $("reset-btn"),

    tableBody: $("variant-rows"),
    resultCount: $("result-count"),
    previousPage: $("prev-page"),
    nextPage: $("next-page"),
    pageLabel: $("page-label"),
    showingText: $("showing-text"),

    exportButton: $("export-btn"),

    dialog: $("variant-dialog"),
    dialogTitle: $("dialog-title"),
    dialogBody: $("dialog-body"),
    closeDialog: $("close-dialog"),

    toast: $("toast")
  };

  const PAGE_SIZE = 8;

  let allVariants = Array.isArray(variantData)
    ? [...variantData]
    : [];

  let filteredVariants = [...allVariants];
  let currentPage = 1;
  let dataSource = "demo";
  let consequenceChart = null;
  let frequencyChart = null;
  let toastTimeout = null;

  // ---------- Safe formatting ----------

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function numberLabel(value) {
    return Number(value || 0).toLocaleString("en-US");
  }

  function frequencyLabel(value) {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      !Number.isFinite(Number(value))
    ) {
      return "Not provided";
    }

    return `${(Number(value) * 100).toPrecision(3)}%`;
  }

  function normalizeImpact(value) {
    const impact = String(value || "").toLowerCase();

    if (impact === "high") return "High";
    if (impact === "moderate") return "Moderate";
    if (impact === "low") return "Low";
    if (impact === "modifier") return "Modifier";

    return "Unknown";
  }

  function notify(message) {
    if (!elements.toast) return;

    elements.toast.textContent = message;
    elements.toast.classList.add("show");

    if (toastTimeout) clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
      elements.toast.classList.remove("show");
    }, 3000);
  }

  function getUniqueGeneCount(records) {
    return new Set(
      records
        .map((record) => record.gene)
        .filter((gene) =>
          gene &&
          gene !== "Pending annotation" &&
          gene !== "Unknown" &&
          gene !== "Not provided"
        )
    ).size;
  }

  function getRareVariantCount(records) {
    return records.filter((record) => {
      const af = record.alleleFrequency;

      return af !== null &&
        af !== undefined &&
        Number.isFinite(Number(af)) &&
        Number(af) <= 0.01;
    }).length;
  }

  // ---------- Statistics ----------

  function updateStatistics(records) {
    if (elements.totalVariants) {
      elements.totalVariants.textContent = numberLabel(records.length);
    }

    if (elements.uniqueGenes) {
      elements.uniqueGenes.textContent =
        numberLabel(getUniqueGeneCount(records));
    }

    if (elements.highScores) {
      elements.highScores.textContent = numberLabel(
        records.filter((record) =>
          normalizeImpact(record.impact) === "High"
        ).length
      );
    }

    if (elements.rareVariants) {
      elements.rareVariants.textContent =
        numberLabel(getRareVariantCount(records));
    }
  }

  // ---------- Filter dropdowns ----------

  function populateFilterOptions() {
    const filters = [
      {
        element: elements.consequenceFilter,
        field: "consequence",
        placeholder: "All consequences"
      },
      {
        element: elements.classificationFilter,
        field: "classification",
        placeholder: "All classifications"
      }
    ];

    filters.forEach(({ element, field, placeholder }) => {
      if (!element) return;

      const previousValue = element.value;

      const values = [...new Set(
        allVariants
          .map((record) => record[field])
          .filter((value) =>
            value &&
            value !== "Pending annotation" &&
            value !== "Unknown"
          )
      )].sort();

      element.replaceChildren();

      const allOption = document.createElement("option");
      allOption.value = "all";
      allOption.textContent = placeholder;
      element.appendChild(allOption);

      values.forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        element.appendChild(option);
      });

      element.value = values.includes(previousValue)
        ? previousValue
        : "all";
    });
  }

  // ---------- Filtering ----------

  function applyFilters() {
    const search = (
      elements.searchInput?.value || ""
    ).trim().toLowerCase();

    const consequence = elements.consequenceFilter?.value || "all";
    const classification = elements.classificationFilter?.value || "all";

    filteredVariants = allVariants.filter((record) => {
      const searchable = [
        record.id,
        record.rsid,
        record.gene,
        record.transcript,
        record.chromosome,
        record.position,
        record.ref,
        record.alt,
        record.consequence,
        record.classification,
        record.impact
      ];

      const matchesSearch = !search || searchable.some((value) =>
        String(value ?? "").toLowerCase().includes(search)
      );

      const matchesConsequence =
        consequence === "all" ||
        record.consequence === consequence;

      const matchesClassification =
        classification === "all" ||
        record.classification === classification;

      return matchesSearch &&
        matchesConsequence &&
        matchesClassification;
    });

    currentPage = 1;
    updateStatistics(filteredVariants);
    renderTable();
    updateCharts(filteredVariants);
  }

  function resetFilters() {
    if (elements.searchInput) elements.searchInput.value = "";
    if (elements.consequenceFilter) elements.consequenceFilter.value = "all";
    if (elements.classificationFilter) {
      elements.classificationFilter.value = "all";
    }

    applyFilters();
    notify("Filters reset.");
  }

  // ---------- Table ----------

  function renderTable() {
    if (!elements.tableBody) return;

    const total = filteredVariants.length;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    currentPage = Math.min(currentPage, pages);

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageRecords = filteredVariants.slice(start, start + PAGE_SIZE);
    const end = start + pageRecords.length;

    if (elements.resultCount) {
      elements.resultCount.textContent =
        `${numberLabel(total)} variants`;
    }

    if (elements.pageLabel) {
      elements.pageLabel.textContent = `Page ${currentPage} of ${pages}`;
    }

    if (elements.showingText) {
      elements.showingText.textContent = total
        ? `Showing ${numberLabel(start + 1)}–${numberLabel(end)} of ${numberLabel(total)}`
        : "Showing 0 variants";
    }

    if (elements.previousPage) {
      elements.previousPage.disabled = currentPage <= 1;
    }

    if (elements.nextPage) {
      elements.nextPage.disabled = currentPage >= pages || total === 0;
    }

    if (!pageRecords.length) {
      elements.tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="empty-state">
            No variants found. Try changing your filters or upload a VCF file.
          </td>
        </tr>
      `;
      return;
    }

    elements.tableBody.innerHTML = pageRecords.map((record, index) => {
      const impact = normalizeImpact(record.impact);
      const impactClass = impact.toLowerCase();

      return `
        <tr>
          <td>
            <button
              type="button"
              class="table-action"
              data-record-index="${start + index}"
              aria-label="View variant details"
            >${escapeHTML(record.id || "Variant")}</button>
          </td>
          <td>${escapeHTML(record.chromosome ?? "N/A")}</td>
          <td class="mono">${escapeHTML(record.position ?? "N/A")}</td>
          <td>${escapeHTML(record.gene || "Pending annotation")}</td>
          <td class="mono">${escapeHTML(record.ref || "N/A")}</td>
          <td class="mono">${escapeHTML(record.alt || "N/A")}</td>
          <td>${escapeHTML(record.consequence || "Pending annotation")}</td>
          <td>
            <span class="badge badge-${escapeHTML(impactClass)}">
              ${escapeHTML(impact)}
            </span>
          </td>
        </tr>
      `;
    }).join("");
  }

  function changePage(direction) {
    const pages = Math.max(
      1,
      Math.ceil(filteredVariants.length / PAGE_SIZE)
    );

    const next = currentPage + direction;
    if (next < 1 || next > pages) return;

    currentPage = next;
    renderTable();

    elements.tableBody?.closest(".explorer-panel")?.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  // ---------- Variant details ----------

  function openDetails(record) {
    if (!record || !elements.dialog) return;

    if (elements.dialogTitle) {
      elements.dialogTitle.textContent =
        `${record.gene || "Gene pending"} · ${record.id || "Variant"}`;
    }

    const details = [
      ["Variant ID", record.id],
      ["Reference ID", record.rsid],
      ["Chromosome", record.chromosome],
      ["Position", record.position],
      ["Reference allele", record.ref],
      ["Alternate allele", record.alt],
      ["Gene", record.gene],
      ["Transcript", record.transcript],
      ["Consequence", record.consequence],
      ["Predicted impact", record.impact],
      ["Classification", record.classification],
      ["Allele frequency", frequencyLabel(record.alleleFrequency)],
      ["Quality", record.quality],
      ["VCF filter", record.reviewStatus],
      ["Record source", record.source || dataSource]
    ];

    const rows = details.map(([label, value]) => `
      <div class="detail-item">
        <span class="detail-label">${escapeHTML(label)}</span>
        <div class="detail-value">${escapeHTML(value ?? "Not provided")}</div>
      </div>
    `).join("");

    const note = dataSource === "uploaded"
      ? "This record was parsed from an uploaded VCF. Gene and consequence annotations may be pending. No clinical interpretation has been performed."
      : "This record comes from the synthetic demonstration dataset and is not real patient data.";

    if (elements.dialogBody) {
      elements.dialogBody.innerHTML = `
        <div class="detail-grid">${rows}</div>
        <div class="dialog-note">${escapeHTML(note)}</div>
      `;
    }

    if (typeof elements.dialog.showModal === "function") {
      if (!elements.dialog.open) elements.dialog.showModal();
    } else {
      elements.dialog.setAttribute("open", "");
    }
  }

  function closeDetails() {
    if (!elements.dialog) return;

    if (typeof elements.dialog.close === "function") {
      elements.dialog.close();
    } else {
      elements.dialog.removeAttribute("open");
    }
  }

  // ---------- Charts ----------

  function destroyCharts() {
    consequenceChart?.destroy();
    frequencyChart?.destroy();

    consequenceChart = null;
    frequencyChart = null;
  }

  function updateCharts(records) {
    const consequenceCanvas = $("consequence-chart");
    const frequencyCanvas = $("frequency-chart");

    if (
      typeof Chart === "undefined" ||
      !consequenceCanvas ||
      !frequencyCanvas
    ) {
      return;
    }

    destroyCharts();

    const counts = {};
    records.forEach((record) => {
      const label = record.consequence || "Not provided";
      counts[label] = (counts[label] || 0) + 1;
    });

    consequenceChart = new Chart(consequenceCanvas, {
      type: "doughnut",
      data: {
        labels: Object.keys(counts),
        datasets: [{
          data: Object.values(counts),
          backgroundColor: [
            "#5146e5", "#0e9f9a", "#e69b42", "#d94f70",
            "#7295e8", "#9a78d7", "#7d91a9", "#55b99c"
          ],
          borderColor: "#ffffff",
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" }
        }
      }
    });

    const buckets = [
      { label: "<0.1%", min: 0, max: 0.001 },
      { label: "0.1–1%", min: 0.001, max: 0.01 },
      { label: "1–5%", min: 0.01, max: 0.05 },
      { label: "5–10%", min: 0.05, max: 0.1 },
      { label: "≥10%", min: 0.1, max: Infinity }
    ];

    const frequencies = buckets.map((bucket) =>
      records.filter((record) => {
        const af = record.alleleFrequency;

        return af !== null &&
          af !== undefined &&
          Number.isFinite(Number(af)) &&
          Number(af) >= bucket.min &&
          Number(af) < bucket.max;
      }).length
    );

    frequencyChart = new Chart(frequencyCanvas, {
      type: "bar",
      data: {
        labels: buckets.map((bucket) => bucket.label),
        datasets: [{
          label: "Variants with frequency data",
          data: frequencies,
          backgroundColor: "#5146e5",
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    });
  }

  // ---------- CSV export ----------

  function exportCSV() {
    if (!filteredVariants.length) {
      notify("No variants to export.");
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
      ["impact", "Predicted impact"],
      ["classification", "Classification"],
      ["alleleFrequency", "Allele frequency"],
      ["quality", "Quality"],
      ["reviewStatus", "VCF filter"],
      ["source", "Record source"]
    ];

    const csvCell = (value) => {
      const text = value === null || value === undefined
        ? ""
        : String(value);

      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = [
      columns.map(([, heading]) => heading),
      ...filteredVariants.map((record) =>
        columns.map(([key]) => record[key] ?? "")
      )
    ];

    const csv = "\uFEFF" +
      rows.map((row) => row.map(csvCell).join(",")).join("\r\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = dataSource === "uploaded"
      ? "variantscope-uploaded-vcf-records.csv"
      : "variantscope-demo-records.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify(`Exported ${filteredVariants.length} records.`);
  }

  // ---------- Public upload integration ----------

  function renderUploadedVariants(records) {
    if (!Array.isArray(records)) {
      throw new Error("Uploaded variants must be an array.");
    }

    allVariants = records.map((record) => ({
      ...record,
      source: "Uploaded VCF"
    }));

    dataSource = "uploaded";
    currentPage = 1;

    if (elements.searchInput) elements.searchInput.value = "";
    populateFilterOptions();

    filteredVariants = [...allVariants];
    updateStatistics(filteredVariants);
    renderTable();
    updateCharts(filteredVariants);

    notify(`Loaded ${allVariants.length} VCF variant records.`);
  }

  // upload.js calls this function after parsing the selected VCF.
  window.renderUploadedVariants = renderUploadedVariants;

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

    elements.previousPage?.addEventListener("click", () => changePage(-1));
    elements.nextPage?.addEventListener("click", () => changePage(1));

    elements.exportButton?.addEventListener("click", exportCSV);
    elements.closeDialog?.addEventListener("click", closeDetails);

    elements.tableBody?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-record-index]");
      if (!button) return;

      const index = Number(button.dataset.recordIndex);
      openDetails(filteredVariants[index]);
    });

    elements.dialog?.addEventListener("click", (event) => {
      if (event.target === elements.dialog) closeDetails();
    });

    elements.consequenceFilter &&
      (elements.consequenceFilter.value = "all");

    elements.classificationFilter &&
      (elements.classificationFilter.value = "all");
  }

  // ---------- Startup ----------

  function init() {
    if (!Array.isArray(variantData)) {
      console.error("VariantScope: data.js did not load.");
      notify("Could not load initial data.");
      return;
    }

    bindEvents();
    populateFilterOptions();
    updateStatistics(allVariants);
    renderTable();
    updateCharts(allVariants);

    console.info(
      `VariantScope ready with ${allVariants.length} demo records.`
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
