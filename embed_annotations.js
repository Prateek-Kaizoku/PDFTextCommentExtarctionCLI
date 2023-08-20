const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { PDFDocument } = require("pdf-lib");

async function embedAnnotations(pdfPath, annotationsTextPath, outputPath) {
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const annotations = fs.readFileSync(annotationsTextPath, "utf-8").split("\n");

  for (let ann of annotations) {
    if (!ann.trim()) continue; // Skip empty lines

    const [pageStr, xStr, yStr, ...textParts] = ann.split(" ");

    if (!pageStr || !xStr || !yStr || textParts.length === 0) {
      console.log("Problematic line:", ann);
      continue; // Skip processing this line and move to the next
    }

    const pageNumber = parseInt(pageStr, 10) - 1; // Pages in pdf-lib are zero-indexed

    if (isNaN(pageNumber) || pageNumber < 0) {
      console.log("Invalid page number in line:", ann);
      continue; // Skip this line
    }

    const x = parseFloat(xStr);
    const y = parseFloat(yStr);
    const text = textParts.join(" ");

    const textWithPageNumber = `Page ${
      pageNumber + 1
    } at (${x}, ${y}): ${textParts.join(" ")}`;

    const page = pdfDoc.getPages()[pageNumber];
    if (!page) {
      console.log("No page found for line:", ann);
      continue; // Skip this line
    }

    console.log("Processing page number:", pageNumber + 1);
    page.drawText(textWithPageNumber, { x, y, size: 12 });
  }

  const modifiedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, modifiedPdfBytes);
}

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 <pdf> <annotations_txt> <output_pdf>")
  .demandCommand(3).argv;

embedAnnotations(argv._[0], argv._[1], argv._[2]);
