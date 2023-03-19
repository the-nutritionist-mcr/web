import * as PdfMake from 'pdfmake/build/pdfmake';
import { pdfMake } from 'pdfmake/build/vfs_fonts';

export type DocumentDefinition = Parameters<typeof PdfMake.createPdf>[0];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(PdfMake.vfs as any) = pdfMake.vfs;

const downloadPdf = (
  documentDefinition: DocumentDefinition,
  defaultFileName: string
): void => {
  PdfMake.createPdf(documentDefinition).download(defaultFileName);
};

export const makePdf = (
  content: DocumentDefinition['content'],
  pageTitle?: string
): DocumentDefinition => ({
  content,
  pageOrientation: 'landscape',
  defaultStyle: {
    fontSize: 8,
  },
  footer: (currentPage, pageCount) => {
    return {
      text: `${
        pageTitle ? `${pageTitle} - ` : ''
      }page ${currentPage} of ${pageCount}`,
      style: 'footer',
    };
  },
  styles: {
    footer: {
      alignment: 'center',
    },
    rowHeader: {
      fontSize: 15,
      alignment: 'center',
      bold: true,
    },
    coverPage: {
      fontSize: 35,
      bold: true,
      lineHeight: 1,
      margin: 150,
    },
    header: {
      fontSize: 22,
      bold: true,
      lineHeight: 1.5,
    },
    smallHeaderWithMargin: {
      fontSize: 16,
      bold: true,
      lineHeight: 1.2,
      margin: [0, 10, 0, 0],
    },
    smallHeader: {
      fontSize: 16,
      bold: true,
      lineHeight: 1.2,
    },
  },
});

export default downloadPdf;
