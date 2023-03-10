import PdfPrinter from "pdfmake";
import imageToBase64 from "image-to-base64";

export const getPDFReadableStream = async (media) => {
  console.log("media:", media);
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };
  const printer = new PdfPrinter(fonts);
  console.log("img url", media.poster);
  const encodedImg = await imageToBase64(media.poster);

  const docDefinition = {
    content: [
      {
        text: media.title,
        style: "header",
      },
      {
        image: `data:image/jpeg;base64, ${encodedImg}`,
        width: 150,
      },
      {
        text: media.year,
        style: "subheader",
      },

      media.content,
    ],
    defaultStyle: {
      font: "Helvetica",
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      quote: {
        italics: true,
      },
      small: {
        fontSize: 8,
      },
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  pdfReadableStream.end();

  return pdfReadableStream;
};
