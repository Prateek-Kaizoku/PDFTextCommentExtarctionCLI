PDF Annotation Tools

This repository contains two scripts that allow you to work with PDF annotations: one for extracting annotations from a PDF file and saving them to a text file, and another for embedding text annotations into a PDF file using coordinates and annotations text from a provided text file.

Prerequisites

Before using these scripts, ensure you have the following prerequisites:

Node.js installed on your machine
Installation

To install the required dependencies, follow these steps:

Clone or download this repository to your local machine.
Open a terminal and navigate to the downloaded repository's directory.
Install the required dependencies using npm:
plaintext
Copy code
npm install
This will install the necessary packages, including pdfjs-dist, yargs, and pdf-lib.
Script 1: PDF Annotation Extractor

Usage
To extract annotations from a PDF file and save them to a text file, follow these steps:

Make sure you have completed the installation steps mentioned above.
Run the script using Node.js with the following command:
plaintext

```js
node extract_pdf_annotations.js <path_to_pdf> <output_txt_file>

```

Replace <path_to_pdf> with the path to the PDF file you want to extract annotations from, and <output_txt_file> with the desired path for the output text file.
For example:
plaintext
Copy code

```js
node extract_pdf_annotations.js input.pdf output_annotations.txt
```

The annotations will be extracted and saved to the specified output text file. You will see a confirmation message once the process is complete.
Script 2: PDF Annotations Embedder

Usage
To embed text annotations into a PDF file using coordinates and annotations text from a provided text file, follow these steps:

Make sure you have completed the installation steps mentioned above.
Run the script using Node.js with the following command:
plaintext
Copy code

```js

node embed_annotations.js <pdf_path> <annotations_txt_path> <output_pdf_path>
```

Replace <pdf_path> with the path to the PDF file you want to embed annotations into, <annotations_txt_path> with the path to the annotations text file, and <output_pdf_path> with the desired path for the output PDF file.
For example:
plaintext
Copy code

```js
node embed_annotations.js input.pdf annotations.txt output_annotated.pdf

```

The script will process each line in the annotations text file, where each line specifies the page number, x-coordinate, y-coordinate, and annotation text. Annotations will be embedded into the specified PDF file at the specified coordinates on the respective pages.
The modified PDF with embedded annotations will be saved as the output PDF file. You will see a confirmation message once the process is complete.
Notes

Both scripts are provided as-is under the ISC License. Feel free to use, modify, and distribute them as needed.

## Keywords

- PDF
- Annotations
- Node.js
- pdf-lib
- yargs
- Text processing
- PDF editing
- Acrobat reader
