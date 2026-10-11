
/*
 * VariantScope | Synthetic Genomic Variant Dataset
 *
 * IMPORTANT:
 * All records in this file are synthetic demonstration data.
 * They are not real patient observations and must not be used
 * for diagnosis, clinical interpretation, or medical decisions.
 */

const variantData = [
  {
    id: "VS-0001",
    rsid: "rs-demo-10001",
    chromosome: "7",
    position: 117559593,
    gene: "CFTR",
    transcript: "ENST00000003084",
    ref: "C",
    alt: "T",
    consequence: "Missense",
    classification: "Uncertain significance",
    impact: "Moderate",
    alleleFrequency: 0.0008,
    caddScore: 22.4,
    siftScore: 0.03,
    polyphenScore: 0.91,
    inheritance: "Autosomal recessive",
    reviewStatus: "Demo annotation",
    notes: "Synthetic missense example for interface testing."
  },
  {
    id: "VS-0002",
    rsid: "rs-demo-10002",
    chromosome: "17",
    position: 7674220,
    gene: "TP53",
    transcript: "ENST00000269305",
    ref: "G",
    alt: "A",
    consequence: "Missense",
    classification: "Uncertain significance",
    impact: "High",
    alleleFrequency: 0.0002,
    caddScore: 28.1,
    siftScore: 0.01,
    polyphenScore: 0.98,
    inheritance: "Not specified",
    reviewStatus: "Demo annotation",
    notes: "Synthetic record. Classification is not a real clinical assertion."
  },
  {
    id: "VS-0003",
    rsid: "rs-demo-10003",
    chromosome: "17",
    position: 43071077,
    gene: "BRCA1",
    transcript: "ENST00000357654",
    ref: "A",
    alt: "G",
    consequence: "Intronic",
    classification: "Benign",
    impact: "Low",
    alleleFrequency: 0.012,
    caddScore: 8.3,
    siftScore: null,
    polyphenScore: null,
    inheritance: "Autosomal dominant",
    reviewStatus: "Demo annotation",
    notes: "Synthetic intronic example; classification is illustrative only."
  },
  {
    id: "VS-0004",
    rsid: "rs-demo-10004",
    chromosome: "13",
    position: 32316461,
    gene: "BRCA2",
    transcript: "ENST00000380152",
    ref: "T",
    alt: "C",
    consequence: "Synonymous",
    classification: "Likely benign",
    impact: "Low",
    alleleFrequency: 0.024,
    caddScore: 5.6,
    siftScore: null,
    polyphenScore: null,
    inheritance: "Autosomal dominant",
    reviewStatus: "Demo annotation",
    notes: "Synthetic synonymous example for consequence filtering."
  },
  {
    id: "VS-0005",
    rsid: "rs-demo-10005",
    chromosome: "12",
    position: 112241766,
    gene: "ABCC9",
    transcript: "ENST00000261200",
    ref: "C",
    alt: "A",
    consequence: "Frameshift",
    classification: "Uncertain significance",
    impact: "High",
    alleleFrequency: 0.00005,
    caddScore: 31.2,
    siftScore: null,
    polyphenScore: null,
    inheritance: "Autosomal dominant",
    reviewStatus: "Demo annotation",
    notes: "Synthetic frameshift example; not a validated pathogenic variant."
  },
  {
    id: "VS-0006",
    rsid: "rs-demo-10006",
    chromosome: "2",
    position: 179415321,
    gene: "TTN",
    transcript: "ENST00000589042",
    ref: "G",
    alt: "T",
    consequence: "Stop gained",
    classification: "Uncertain significance",
    impact: "High",
    alleleFrequency: 0.0004,
    caddScore: 27.7,
    siftScore: null,
    polyphenScore: null,
    inheritance: "Not specified",
    reviewStatus: "Demo annotation",
    notes: "Synthetic stop-gained example for high-impact variant exploration."
  },
  {
    id: "VS-0007",
    rsid: "rs-demo-10007",
    chromosome: "11",
    position: 5227002,
    gene: "HBB",
    transcript: "ENST00000335295",
    ref: "A",
    alt: "G",
    consequence: "Missense",
    classification: "Uncertain significance",
    impact: "Moderate",
    alleleFrequency: 0.003,
    caddScore: 19.5,
    siftScore: 0.07,
    polyphenScore: 0.76,
    inheritance: "Autosomal recessive",
    reviewStatus: "Demo annotation",
    notes: "Synthetic record for exploring allele-frequency distributions."
  },
  {
    id: "VS-0008",
    rsid: "rs-demo-10008",
    chromosome: "1",
    position: 11856378,
    gene: "MTHFR",
    transcript: "ENST00000376592",
    ref: "C",
    alt: "T",
    consequence: "Missense",
    classification: "Benign",
    impact: "Moderate",
    alleleFrequency: 0.18,
    caddScore: 12.1,
    siftScore: 0.22,
    polyphenScore: 0.34,
    inheritance: "Not specified",
    reviewStatus: "Demo annotation",
    notes: "Synthetic common-variant example; scores are illustrative."
  },
  {
    id: "VS-0009",
    rsid: "rs-demo-10009",
    chromosome: "19",
    position: 44908684,
    gene: "APOE",
    transcript: "ENST00000252486",
    ref: "T",
    alt: "C",
    consequence: "Missense",
    classification: "Uncertain significance",
    impact: "Moderate",
    alleleFrequency: 0.065,
    caddScore: 16.8,
    siftScore: 0.08,
    polyphenScore: 0.82,
    inheritance: "Not specified",
    reviewStatus: "Demo annotation",
    notes: "Synthetic record for demonstrating gene-level search."
  },
  {
    id: "VS-0010",
    rsid: "rs-demo-10010",
    chromosome: "9",
    position: 21971120,
    gene: "CDKN2A",
    transcript: "ENST00000304494",
    ref: "G",
    alt: "A",
    consequence: "Splice site",
    classification: "Uncertain significance",
    impact: "High",
    alleleFrequency: 0.0001,
    caddScore: 29.6,
    siftScore: null,
    polyphenScore: null,
    inheritance: "Autosomal dominant",
    reviewStatus: "Demo annotation",
    notes: "Synthetic splice-site example for consequence filtering."
  },
  {
    id: "VS-0011",
    rsid: "rs-demo-10011",
    chromosome: "3",
    position: 37053566,
    gene: "MLH1",
    transcript: "ENST00000231790",
    ref: "C",
    alt: "T",
    consequence: "Missense",
    classification: "Likely benign",
    impact: "Moderate",
    alleleFrequency: 0.008,
    caddScore: 14.2,
    siftScore: 0.16,
    polyphenScore: 0.42,
    inheritance: "Autosomal dominant",
    reviewStatus: "Demo annotation",
    notes: "Synthetic missense example for classification filtering."
  },
  {
    id: "VS-0012",
    rsid: "rs-demo-10012",
    chromosome: "16",
    position: 23614615,
    gene: "HEXA",
    transcript: "ENST00000216124",
    ref: "T",
    alt: "C",
    consequence: "Missense",
    classification: "Uncertain significance",
    impact: "Moderate",
    alleleFrequency: 0.0006,
    caddScore: 21.7,
    siftScore: 0.04,
    polyphenScore: 0.88,
    inheritance: "Autosomal recessive",
    reviewStatus: "Demo annotation",
    notes: "Synthetic record for variant-detail panel testing."
  },
  {
    id: "VS-0013",
    rsid: "rs-demo-10013",
    chromosome: "X",
    position: 100635124,
    gene: "G6PD",
    transcript: "ENST00000393562",
    ref: "G",
    alt: "A",
    consequence: "Missense",
    classification: "Uncertain significance",
    impact: "Moderate",
    alleleFrequency: 0.015,
    caddScore: 18.9,
    siftScore: 0.02,
    polyphenScore: 0.93,
    inheritance: "X-linked",
    reviewStatus: "Demo annotation",
    notes: "Synthetic X-chromosome example for chromosome display."
  },
  {
    id: "VS-0014",
    rsid: "rs-demo-10014",
    chromosome: "5",
    position: 112175770,
    gene: "APC",
    transcript: "ENST00000257430",
    ref: "C",
    alt: "CA",
    consequence: "Frameshift",
    classification: "Uncertain significance",
    impact: "High",
    alleleFrequency: 0.00003,
    caddScore: 32.6,
    siftScore: null,
    polyphenScore: null,
    inheritance: "Autosomal dominant",
    reviewStatus: "Demo annotation",
    notes: "Synthetic insertion example for high-impact filtering."
  },
  {
    id: "VS-0015",
    rsid: "rs-demo-10015",
    chromosome: "10",
    position: 89692904,
    gene: "PTEN",
    transcript: "ENST00000371953",
    ref: "G",
    alt: "A",
    consequence: "Stop gained",
    classification: "Uncertain significance",
    impact: "High",
    alleleFrequency: 0.00007,
    caddScore: 30.4,
    siftScore: null,
    polyphenScore: null,
    inheritance: "Autosomal dominant",
    reviewStatus: "Demo annotation",
    notes: "Synthetic stop-gained example for the variant explorer."
  },
  {
    id: "VS-0016",
    rsid: "rs-demo-10016",
    chromosome: "6",
    position: 18130918,
    gene: "HFE",
    transcript: "ENST00000233190",
    ref: "G",
    alt: "A",
    consequence: "Missense",
    classification: "Benign",
    impact: "Moderate",
    alleleFrequency: 0.07,
    caddScore: 10.2,
    siftScore: 0.31,
    polyphenScore: 0.19,
    inheritance: "Autosomal recessive",
    reviewStatus: "Demo annotation",
    notes: "Synthetic common-variant example."
  },
  {
    id: "VS-0017",
    rsid: "rs-demo-10017",
    chromosome: "14",
    position: 23836916,
    gene: "LRRK2",
    transcript: "ENST00000298910",
    ref: "G",
    alt: "A",
    consequence: "Missense",
    classification: "Uncertain significance",
    impact: "Moderate",
    alleleFrequency: 0.0009,
    caddScore: 24.8,
    siftScore: 0.02,
    polyphenScore: 0.95,
    inheritance: "Autosomal dominant",
    reviewStatus: "Demo annotation",
    notes: "Synthetic record for exploratory analysis only."
  },
  {
    id: "VS-0018",
    rsid: "rs-demo-10018",
    chromosome: "4",
    position: 55593621,
    gene: "PDGFRA",
    transcript: "ENST00000257290",
    ref: "A",
    alt: "AT",
    consequence: "In-frame insertion",
    classification: "Uncertain significance",
    impact: "Moderate",
    alleleFrequency: 0.0003,
    caddScore: 20.1,
    siftScore: null,
    polyphenScore: null,
    inheritance: "Not specified",
    reviewStatus: "Demo annotation",
    notes: "Synthetic insertion example."
  },
  {
    id: "VS-0019",
    rsid: "rs-demo-10019",
    chromosome: "8",
    position: 11796321,
    gene: "FGFR1",
    transcript: "ENST00000397091",
    ref: "T",
    alt: "C",
    consequence: "Synonymous",
    classification: "Likely benign",
    impact: "Low",
    alleleFrequency: 0.032,
    caddScore: 6.8,
    siftScore: null,
    polyphenScore: null,
    inheritance: "Not specified",
    reviewStatus: "Demo annotation",
    notes: "Synthetic synonymous variant example."
  },
  {
    id: "VS-0020",
    rsid: "rs-demo-10020",
    chromosome: "2",
    position: 47641582,
    gene: "MSH2",
    transcript: "ENST00000233146",
    ref: "A",
    alt: "G",
    consequence: "Splice site",
    classification: "Uncertain significance",
    impact: "High",
    alleleFrequency: 0.0002,
    caddScore: 27.9,
    siftScore: null,
    polyphenScore: null,
    inheritance: "Autosomal dominant",
    reviewStatus: "Demo annotation",
    notes: "Synthetic splice-site example."
  },
  {
    id: "VS-0021",
    rsid: "rs-demo-10021",
    chromosome: "12",
    position: 25398284,
    gene: "KRAS",
    transcript: "ENST00000256078",
    ref: "G",
    alt: "A",
    consequence: "Missense",
    classification: "Uncertain significance",
    impact: "Moderate",
    alleleFrequency: 0.0005,
    caddScore: 23.6,
    siftScore: 0.04,
    polyphenScore: 0.87,
    inheritance: "Not specified",
    reviewStatus: "Demo annotation",
    notes: "Synthetic missense record for search and sorting."
  },
  {
    id: "VS-0022",
    rsid: "rs-demo-10022",
    chromosome: "15",
    position: 48426484,
    gene: "FBN1",
    transcript: "ENST00000316623",
    ref: "C",
    alt: "T",
    consequence: "Missense",
    classification: "Likely benign",
    impact: "Moderate",
    alleleFrequency: 0.006,
    caddScore: 15.1,
    siftScore: 0.11,
    polyphenScore: 0.59,
    inheritance: "Autosomal dominant",
    reviewStatus: "Demo annotation",
    notes: "Synthetic example; interpretation is illustrative."
  },
  {
    id: "VS-0023",
    rsid: "rs-demo-10023",
    chromosome: "1",
    position: 161155262,
    gene: "SDHB",
    transcript: "ENST00000367979",
    ref: "C",
    alt: "T",
    consequence: "Stop gained",
    classification: "Uncertain significance",
    impact: "High",
    alleleFrequency: 0.00008,
    caddScore: 30.9,
    siftScore: null,
    polyphenScore: null,
    inheritance: "Autosomal dominant",
    reviewStatus: "Demo annotation",
    notes: "Synthetic record for impact distribution charts."
  },
  {
    id: "VS-0024",
    rsid: "rs-demo-10024",
    chromosome: "11",
    position: 108236421,
    gene: "ATM",
    transcript: "ENST00000278616",
    ref: "A",
    alt: "G",
    consequence: "Intronic",
    classification: "Benign",
    impact: "Low",
    alleleFrequency: 0.041,
    caddScore: 7.2,
    siftScore: null,
    polyphenScore: null,
    inheritance: "Autosomal recessive",
    reviewStatus: "Demo annotation",
    notes: "Synthetic intronic example."
  }
];

/*
 * Shared helpers for the VariantScope dashboard.
 * Missing prediction scores are represented as null.
 */

function formatFrequency(value) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "N/A";
  }

  if (value === 0) {
    return "0";
  }

  if (value < 0.001) {
    return value.toExponential(2);
  }

  return `${(value * 100).toFixed(value < 0.01 ? 3 : 2)}%`;
}

function formatScore(value, digits = 2) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "N/A";
  }

  return value.toFixed(digits);
}

function getImpactClass(impact) {
  const normalized = String(impact || "").toLowerCase();

  if (normalized === "high") return "badge-high";
  if (normalized === "moderate") return "badge-moderate";
  if (normalized === "low") return "badge-low";

  return "badge-neutral";
}

function getConsequenceCounts(records = variantData) {
  return records.reduce((counts, variant) => {
    const consequence = variant.consequence || "Unspecified";
    counts[consequence] = (counts[consequence] || 0) + 1;
    return counts;
  }, {});
}

function getUniqueGeneCount(records = variantData) {
  return new Set(records.map((variant) => variant.gene)).size;
}

function getRareVariantCount(records = variantData, threshold = 0.01) {
  return records.filter(
    (variant) =>
      Number.isFinite(variant.alleleFrequency) &&
      variant.alleleFrequency < threshold
  ).length;
}
