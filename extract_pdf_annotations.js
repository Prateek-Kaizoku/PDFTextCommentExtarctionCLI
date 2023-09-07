const pdfjsLib = require("pdfjs-dist/build/pdf");
const fs = require("fs");
const readline = require("readline");

// Create a readline interface for taking user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
      .filter((ann) => ann.subtype === "Text")
      .map((ann) => {
        let content = "N/A";
        if (ann.contentsObj && ann.contentsObj.str) {
          content = ann.contentsObj.str;
        } else if (ann.contents) {
          content = ann.contents;
        }
        return content;
      });

    if (textAnnotations.length > 0) {
      annotationsByPage[pageNum] = textAnnotations;
    }
  }

  return annotationsByPage;
}

async function saveAnnotationsToTextWithTemplate(
  annotations,
  outputFile,
  template
) {
  const content = [];

  for (const [page, anns] of Object.entries(annotations)) {
    content.push(`Page ${page}:`);

    for (const ann of anns) {
      content.push(`${template} - ${ann}`);
    }
  }

  fs.writeFileSync(outputFile, content.join("\n"));
}

function promptForTemplate() {
  return new Promise((resolve) => {
    rl.question(`Enter a template for the comments: `, (template) => {
      resolve(template);
    });
  });
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

  // Ask for the template once
  const template = await promptForTemplate();

  await saveAnnotationsToTextWithTemplate(annotations, outputFile, template);

  console.log(`Annotations with the template saved to ${outputFile}.`);

  rl.close(); // Close the readline interface
})();
