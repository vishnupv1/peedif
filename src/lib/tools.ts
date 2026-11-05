export type ToolIconName =
  | 'merge'
  | 'split'
  | 'compress'
  | 'images'
  | 'rotate'
  | 'numbers'
  | 'pdf-word'
  | 'word-pdf'
  | 'pdf-jpg'
  | 'jpg-pdf'
  | 'pdf-ppt'
  | 'ppt-pdf'
  | 'pdf-excel'
  | 'excel-pdf'
  | 'html-pdf'
  | 'webpage-pdf'
  | 'qr'
  | 'ocr'
  | 'translate'

export type Tool = {
  id: ToolIconName
  title: string
  description: string
  about: string
  path: string
  icon: ToolIconName
  metaTitle: string
  metaDescription: string
  fileHint: string
}

export const tools: readonly Tool[] = [
  {
    id: 'merge',
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one document.',
    about:
      'Combine two or more PDFs into one file. Put the files in the order you want, then download the merged document. Pages are copied as they are. Each file can be up to 25 MB, and nothing is uploaded.',
    path: '/merge-pdf',
    icon: 'merge',
    metaTitle: 'Merge PDF — myfriendpdf',
    metaDescription:
      'Combine multiple PDF files into one document in your browser. Files are processed locally and are not uploaded.',
    fileHint: 'Supported format: PDF. Up to 25 MB per file. Add at least two files.',
  },
  {
    id: 'split',
    title: 'Split PDF',
    description: 'Extract selected pages from a PDF.',
    about:
      'Pull out the pages you need and save them as a new PDF. Type ranges such as 1-3, 5, or 7-9. Pages you leave out are not included. A reversed range, a page that does not exist, or an empty range is rejected.',
    path: '/split-pdf',
    icon: 'split',
    metaTitle: 'Split PDF — myfriendpdf',
    metaDescription:
      'Extract selected pages from a PDF in your browser. Your document stays on your device.',
    fileHint: 'Supported format: PDF. Up to 25 MB.',
  },
  {
    id: 'compress',
    title: 'Compress PDF',
    description: 'Reduce PDF file size.',
    about:
      'Re-save the PDF so its structure is more compact, then compare the original size with the new one. Images and fonts are left unchanged, so the file may stay the same size or get larger. There is no guaranteed reduction.',
    path: '/compress-pdf',
    icon: 'compress',
    metaTitle: 'Compress PDF — myfriendpdf',
    metaDescription:
      'Re-save a PDF and compare file size in your browser. Images are not recompressed, and files are not uploaded.',
    fileHint: 'Supported format: PDF. Up to 25 MB.',
  },
  {
    id: 'images',
    title: 'Images to PDF',
    description: 'Convert JPG and PNG images into PDF documents.',
    about:
      'Turn JPG and PNG images into one PDF. Each image is placed on its own A4 page and keeps its aspect ratio. Reorder the images before you create the file. Each image can be up to 25 MB.',
    path: '/images-to-pdf',
    icon: 'images',
    metaTitle: 'Images to PDF — myfriendpdf',
    metaDescription:
      'Convert JPG and PNG images into a PDF in your browser. Images stay on your device.',
    fileHint: 'Supported formats: JPG and PNG. Up to 25 MB per image.',
  },
  {
    id: 'rotate',
    title: 'Rotate PDF',
    description: 'Rotate PDF pages.',
    about:
      'Turn pages by 90, 180, or 270 degrees. Rotate every page, or only the ranges you type. The page content stays in the file. Only the rotation changes.',
    path: '/rotate-pdf',
    icon: 'rotate',
    metaTitle: 'Rotate PDF — myfriendpdf',
    metaDescription:
      'Rotate all or selected PDF pages by 90, 180, or 270 degrees in your browser.',
    fileHint: 'Supported format: PDF. Up to 25 MB.',
  },
  {
    id: 'numbers',
    title: 'Add page numbers',
    description: 'Add page numbers to PDF documents.',
    about:
      'Add a page number in Helvetica at the top center, or at the bottom left, center, or right. Choose the number to start from, and skip the first page when the cover should stay blank. The rest of the page is left as it is.',
    path: '/add-page-numbers',
    icon: 'numbers',
    metaTitle: 'Add Page Numbers — myfriendpdf',
    metaDescription:
      'Add simple page numbers to a PDF in your browser. The document is not uploaded.',
    fileHint: 'Supported format: PDF. Up to 25 MB.',
  },
  {
    id: 'ocr',
    title: 'OCR',
    description: 'Recognize text in a scanned PDF or image.',
    about:
      'Read English text from a scanned PDF, JPG, or PNG. The download is a new PDF of the words that were recognized, not a copy of the original layout. Up to 10 pages. A blurry page may come back with missing or wrong words.',
    path: '/ocr',
    icon: 'ocr',
    metaTitle: 'OCR — myfriendpdf',
    metaDescription: 'Recognize English text in a scanned PDF or image in your browser. The file is not uploaded.',
    fileHint: 'Supported formats: PDF, JPG, and PNG. Up to 25 MB and 10 pages.',
  },
  {
    id: 'translate',
    title: 'Translate',
    description: 'Translate PDF text in your browser.',
    about:
      'Translate the text already stored in a PDF, using translation built into this browser. The browser may download a language model. The PDF is not sent to a translation service. If this browser cannot translate on the device, the file is left unchanged. Scanned pages need OCR first.',
    path: '/translate',
    icon: 'translate',
    metaTitle: 'Translate PDF — myfriendpdf',
    metaDescription: 'Translate PDF text on your device when this browser includes the language. The file is not uploaded.',
    fileHint: 'Supported format: PDF. Up to 25 MB. Scanned pages need OCR first.',
  },
]

export const convertTools: readonly Tool[] = [
  {
    id: 'pdf-word',
    title: 'PDF to Word',
    description: 'Copy the text from a PDF into a Word document.',
    about:
      'Copy the text from a PDF into a Word document, in reading order, with a break between pages. Layout, images, and fonts are not copied. A scanned PDF has no text to copy until you run OCR.',
    path: '/pdf-to-word',
    icon: 'pdf-word',
    metaTitle: 'PDF to Word — myfriendpdf',
    metaDescription: 'Copy text from a PDF into a Word document in your browser. The file is not uploaded.',
    fileHint: 'Supported format: PDF. Up to 25 MB. Layout and scanned pages are not reproduced.',
  },
  {
    id: 'word-pdf',
    title: 'Word to PDF',
    description: 'Turn the text of a Word document into a PDF.',
    about:
      'Read the text from a Word document and write it into a PDF. Complex formatting, headers, and images are not preserved. The result is the words from the document, set as plain paragraphs.',
    path: '/word-to-pdf',
    icon: 'word-pdf',
    metaTitle: 'Word to PDF — myfriendpdf',
    metaDescription: 'Turn a Word document into a PDF in your browser. The file is not uploaded.',
    fileHint: 'Supported format: DOCX. Up to 25 MB. Complex formatting is not preserved.',
  },
  {
    id: 'pdf-jpg',
    title: 'PDF to JPG',
    description: 'Save each PDF page as a JPG image.',
    about:
      'Save each PDF page as a JPG image. One page downloads as a JPG. More than one page downloads as a ZIP of images. Text in those images is not selectable. Up to 30 pages.',
    path: '/pdf-to-jpg',
    icon: 'pdf-jpg',
    metaTitle: 'PDF to JPG — myfriendpdf',
    metaDescription: 'Save PDF pages as JPG images in your browser. The file is not uploaded.',
    fileHint: 'Supported format: PDF. Up to 25 MB and 30 pages.',
  },
  {
    id: 'jpg-pdf',
    title: 'JPG to PDF',
    description: 'Convert JPG and PNG images into a PDF document.',
    about:
      'Turn JPG and PNG images into one PDF. Each image is placed on its own A4 page and keeps its aspect ratio. Reorder the images before you create the file. Each image can be up to 25 MB.',
    path: '/jpg-to-pdf',
    icon: 'jpg-pdf',
    metaTitle: 'JPG to PDF — myfriendpdf',
    metaDescription: 'Convert JPG and PNG images into a PDF in your browser. Images stay on your device.',
    fileHint: 'Supported formats: JPG and PNG. Up to 25 MB per image.',
  },
  {
    id: 'pdf-ppt',
    title: 'PDF to PPT',
    description: 'Place each PDF page on its own PowerPoint slide.',
    about:
      'Place each PDF page as a picture on its own PowerPoint slide. The picture fills the slide. The text on the slide is not editable. Up to 30 pages.',
    path: '/pdf-to-ppt',
    icon: 'pdf-ppt',
    metaTitle: 'PDF to PowerPoint — myfriendpdf',
    metaDescription: 'Place each PDF page on a PowerPoint slide in your browser. The file is not uploaded.',
    fileHint: 'Supported format: PDF. Up to 25 MB and 30 pages. Slides contain page images.',
  },
  {
    id: 'ppt-pdf',
    title: 'PPT to PDF',
    description: 'Copy the text from a PowerPoint file into a PDF.',
    about:
      'Copy the text from each PowerPoint slide onto a PDF page. Slide design, pictures, and charts are not reproduced. A file with no readable slide text cannot be converted this way.',
    path: '/ppt-to-pdf',
    icon: 'ppt-pdf',
    metaTitle: 'PowerPoint to PDF — myfriendpdf',
    metaDescription: 'Copy PowerPoint slide text into a PDF in your browser. The file is not uploaded.',
    fileHint: 'Supported format: PPTX. Up to 25 MB. Slide design and pictures are not reproduced.',
  },
  {
    id: 'pdf-excel',
    title: 'PDF to Excel',
    description: 'Copy text from a PDF into a spreadsheet.',
    about:
      'Copy text from a PDF into spreadsheet cells based on where it sits on the page. This is not a guaranteed table, and scanned pages have no text to copy. Each page is marked in the sheet.',
    path: '/pdf-to-excel',
    icon: 'pdf-excel',
    metaTitle: 'PDF to Excel — myfriendpdf',
    metaDescription: 'Copy PDF text into a spreadsheet in your browser. The file is not uploaded.',
    fileHint: 'Supported format: PDF. Up to 25 MB. Text is placed by position, not as a guaranteed table.',
  },
  {
    id: 'excel-pdf',
    title: 'Excel to PDF',
    description: 'Turn spreadsheet rows into a PDF.',
    about:
      'Draw the rows and columns of a spreadsheet as a simple table on landscape PDF pages. The first 1000 rows and 20 columns of each sheet are included. Charts and cell styling are not copied.',
    path: '/excel-to-pdf',
    icon: 'excel-pdf',
    metaTitle: 'Excel to PDF — myfriendpdf',
    metaDescription: 'Turn spreadsheet rows into a PDF in your browser. The file is not uploaded.',
    fileHint: 'Supported format: XLSX. Up to 25 MB. The first 1000 rows and 20 columns are included.',
  },
  {
    id: 'html-pdf',
    title: 'HTML to PDF',
    description: 'Turn an HTML file into a PDF.',
    about:
      'Turn an HTML file into a PDF. Headings, paragraphs, lists, and tables are written as text. Page styling, scripts, and images are not copied.',
    path: '/html-to-pdf',
    icon: 'html-pdf',
    metaTitle: 'HTML to PDF — myfriendpdf',
    metaDescription: 'Turn an HTML file into a PDF in your browser. The file is not uploaded.',
    fileHint: 'Supported format: HTML. Up to 25 MB. Headings, paragraphs, lists, and tables are written as text.',
  },
  {
    id: 'webpage-pdf',
    title: 'Webpage to PDF',
    description: 'Turn a web page into a PDF in your browser.',
    about:
      'Turn a web page into a PDF when this browser is allowed to read that site. Many sites block that. Saving the page as HTML and adding the file is the reliable option. The result is the text of the page, not a screenshot.',
    path: '/webpage-to-pdf',
    icon: 'webpage-pdf',
    metaTitle: 'Webpage to PDF — myfriendpdf',
    metaDescription: 'Turn a web page into a PDF in your browser when the site allows it. Nothing is uploaded.',
    fileHint: 'Enter an http or https address, or add a saved HTML file. Up to 25 MB.',
  },
  {
    id: 'qr',
    title: 'QR & Barcode',
    description: 'Create a QR code or barcode as a PNG or PDF.',
    about:
      'Create a QR code or a barcode from text or a number, then download it as a PNG or a PDF. The code is made on this device. Nothing is uploaded. This creates a code. It does not read one from a photo.',
    path: '/qr-barcode',
    icon: 'qr',
    metaTitle: 'QR and Barcode — myfriendpdf',
    metaDescription: 'Create a QR code or barcode in your browser and download it as a PNG or PDF.',
    fileHint: 'No file is required. The code is created on your device.',
  },
]

export function toolMatches(tool: Tool, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  const haystack = `${tool.title} ${tool.description} ${tool.about}`.toLowerCase()
  return haystack.includes(needle)
}

export function getTool(path: string): Tool {
  const tool = [...tools, ...convertTools].find((item) => item.path === path)
  if (!tool) {
    throw new Error(`Unknown tool: ${path}`)
  }
  return tool
}
