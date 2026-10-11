
# VariantScope 🧬

### An Interactive Genomic Variant Exploration Dashboard

VariantScope is a browser-based bioinformatics dashboard designed to explore and visualize genomic variant annotations through an interactive interface. It demonstrates how variant-level information can be organized, filtered, summarized, and exported for exploratory analysis.

> **Important:** This project uses synthetic demonstration records. It is an educational software prototype, not a clinically validated variant interpretation tool. It must not be used for diagnosis, treatment, or medical decision-making.

## Overview

Genomic variant datasets can contain many annotations, including genomic positions, reference and alternate alleles, predicted consequences, allele frequencies, and computational prediction scores. Exploring these fields together can be challenging without a clear interface.

VariantScope provides a compact dashboard for exploring these data fields and understanding how frontend tools can support genomic data exploration.

## Features

- **Interactive summary statistics:** View the number of displayed variants, unique genes, high-impact demo records, and rare variants.
- **Variant search:** Search across variant identifiers, genes, chromosomes, genomic positions, alleles, consequences, and impact labels.
- **Dynamic filters:** Filter records by consequence and illustrative classification.
- **Data visualization:** Explore consequence categories and allele-frequency distributions using interactive charts.
- **Variant detail view:** Inspect individual records and their associated annotation fields.
- **Pagination:** Navigate the variant table in manageable pages.
- **CSV export:** Export the currently filtered records for further exploration.
- **Responsive interface:** Use the dashboard on desktop, tablet, and mobile screens.
- **Synthetic data labelling:** Keep demonstration records distinct from validated clinical data.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Dashboard structure |
| CSS3 | Responsive layout and visual styling |
| JavaScript | Search, filtering, statistics, pagination, and export |
| Chart.js | Interactive data visualization |
| CSV | Export of filtered demonstration records |

The project is implemented as a client-side web application and does not require a backend server for its current demonstration functionality.

## Project Structure

```text
VariantScope/
├── index.html     # Dashboard structure
├── styles.css     # Responsive styling
├── data.js        # Synthetic variant records and helper functions
├── app.js         # Application logic and chart integration
└── README.md      # Project documentation
```

## Getting Started

### Option 1: Run locally

1. Clone or download this repository.
2. Keep all four application files in the same directory.
3. Open `index.html` in a modern browser.

For a more reliable local setup, serve the directory using a local development server, such as the Live Server extension in Visual Studio Code.

### Option 2: Deploy with GitHub Pages

1. Open the repository on GitHub.
2. Navigate to **Settings → Pages**.
3. Under the build and deployment section, select **Deploy from a branch**.
4. Choose the `main` branch and the root (`/`) folder.
5. Save the settings and wait for deployment to finish.
6. Open the published URL displayed in the Pages settings.

The application uses Chart.js and Google Fonts through external CDN or web resources, so those features may require an internet connection.

## Data Fields

Each demonstration record contains fields such as:

| Field | Description |
|---|---|
| Variant ID | Internal identifier for the demo record |
| Reference ID | Synthetic reference identifier |
| Chromosome | Chromosome label |
| Position | Illustrative genomic position |
| Gene | Associated gene label |
| Reference allele | Reference nucleotide or allele |
| Alternate allele | Alternate nucleotide or allele |
| Consequence | Illustrative variant consequence category |
| Impact | Demonstration impact category |
| Allele frequency | Illustrative frequency value |
| Prediction scores | Example computational score fields |
| Classification | Demonstration classification label |

The records are intended to demonstrate application behavior and data presentation. They should not be interpreted as authentic genomic observations.

## Analytical and Clinical Limitations

- All records in `data.js` are synthetic demonstration data.
- Gene names and annotation fields are used to create a realistic-looking interface, but the records are not validated clinical variant assertions.
- Genomic positions, reference and alternate alleles, frequencies, and prediction scores must not be assumed to correspond to genuine variants.
- Classification and impact labels are illustrative and are not derived from a clinical interpretation workflow.
- The application does not independently annotate VCF files or query authoritative variant databases.
- No clinical sensitivity, specificity, diagnostic performance, or clinical utility has been established.

The dashboard is intended for software demonstration, interface development, and educational exploration only.

## Potential Future Improvements

- Import and validate user-supplied VCF files.
- Integrate established variant annotation tools and authoritative reference databases.
- Add genome assembly selection and coordinate validation.
- Support filtering by population frequency and additional annotation fields.
- Introduce automated data-quality checks and reproducible processing workflows.
- Add unit tests, integration tests, and more comprehensive error handling.
- Improve accessibility and expand automated interface testing.

These are potential future directions, not features claimed to be implemented in the current version.

## Author

**Vaishnavi**



## License

A license has not yet been selected. All rights and reuse permissions remain unspecified until a license is added.
