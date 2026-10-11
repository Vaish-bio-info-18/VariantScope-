
(function () {
  "use strict";

  function parseVCF(text) {
    const lines = text.split(/\r?\n/);
    const variants = [];
    let headers = [];

    for (const line of lines) {
      if (!line || line.startsWith("##")) continue;

      if (line.startsWith("#CHROM")) {
        headers = line.slice(1).split("\t");
        continue;
      }

      if (line.startsWith("#")) continue;

      const columns = line.split("\t");
      if (columns.length < 8) continue;

      const [chrom, pos, id, ref, alt, qual, filter, info] = columns;

      const position = Number(pos);
      if (!Number.isInteger(position) || position < 1) continue;

      const infoFields = {};
      for (const field of info.split(";")) {
        if (!field) continue;
        const [key, ...rest] = field.split("=");
        infoFields[key] = rest.length ? rest.join("=") : true;
      }

      const alternatives = alt.split(",");

      for (const allele of alternatives) {
        variants.push({
          id: id && id !== "." ? id : `${chrom}-${pos}-${ref}-${allele}`,
          rsid: id && id !== "." ? id : "Not provided",
          chromosome: chrom.replace(/^chr/i, ""),
          position,
          gene: infoFields.GENE || "Pending annotation",
          transcript: "Pending annotation",
          ref,
          alt: allele,
          consequence: infoFields.CONSEQUENCE || "Pending annotation",
          classification: "Unclassified",
          impact: infoFields.IMPACT || "Unknown",
          alleleFrequency: Number(infoFields.AF) || null,
          caddScore: null,
          siftScore: null,
          polyphenScore: null,
          inheritance: "Not assessed",
          reviewStatus: filter || "Not provided",
          quality: qual === "." ? null : Number(qual),
          info: infoFields,
          source: "Uploaded VCF"
        });
      }
    }

    if (!headers.length) {
      throw new Error("VCF header not found. Please upload a valid VCF file.");
    }

    return variants;
  }

  window.VariantScopeVCF = { parseVCF };
})();
