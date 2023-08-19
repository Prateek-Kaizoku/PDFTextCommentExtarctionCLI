const pdfjsLib = require("pdfjs-dist/build/pdf");
const fs = require("fs");

async function extractAnnotations(pdfPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdfDocument = await loadingTask.promise;

  const maxPages = pdfDocument.numPages;
  const annotationsByPage = {};

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const annotations = await page.getAnnotations();

    const textAnnotations = annotations
      .filter((ann) => ann.subtype === "Text") // Filter out any non-'Text' annotations
      .map((ann) => {
        let content = "N/A";
        if (ann.contentsObj && ann.contentsObj.str) {
          content = ann.contentsObj.str;
        } else if (ann.contents) {
          content = ann.contents;
        }
        return content; // Returning only the content without 'Text: ' prefix, as it's redundant now
      });

    if (textAnnotations.length > 0) {
      annotationsByPage[pageNum] = textAnnotations;
    }
  }

  return annotationsByPage;
}

async function saveAnnotationsToText(annotations, outputFile) {
  const content = [];

  for (const [page, anns] of Object.entries(annotations)) {
    content.push(`Page ${page}:`);
    content.push(...anns, ""); // spread the annotations for each page
  }

  fs.writeFileSync(outputFile, content.join("\n"));
}

(async function main() {
  if (process.argv.length !== 4) {
    console.log(
      "Usage: node extract_pdf_annotations.js <path_to_pdf> <output_txt_file>"
    );
    process.exit(1);
  }

  const pdfPath = process.argv[2];
  const outputFile = process.argv[3];

  const annotations = await extractAnnotations(pdfPath);
  await saveAnnotationsToText(annotations, outputFile);

  console.log(`Annotations saved to ${outputFile}.`);
})();
