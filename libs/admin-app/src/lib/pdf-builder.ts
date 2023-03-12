/* eslint-disable fp/no-mutating-methods */
/* eslint-disable fp/no-this */
import { Content, Size } from 'pdfmake/interfaces';
import { DocumentDefinition, makePdf } from './downloadPdf';
import { PdfTable, TableRowStyle } from './pdf-table';

type Row = Content[] | { content: Content[]; style: TableRowStyle };

export class PdfBuilder {
  private content: Content[] = [];

  public constructor(private title?: string, coverPage?: boolean) {
    if (coverPage && title) {
      this.coverPage(title);
    }
  }

  public text(text: string): this {
    this.content.push({ text });
    return this;
  }

  public header(text: string): this {
    this.content.push({ text, style: 'header' });
    return this;
  }

  private coverPage(text: string): void {
    this.content.push({
      text,
      style: 'coverPage',
      pageBreak: 'after',
      alignment: 'center',
    });
  }

  public pageBreak(): this {
    const lastContent = this.content[this.content.length - 1];
    if (typeof lastContent === 'object') {
      this.content[this.content.length - 1] = {
        ...lastContent,
        pageBreak: 'after',
      };
    }
    return this;
  }

  private removeLastPageBreak() {
    const lastContent = this.content[this.content.length - 1];
    if (typeof lastContent === 'object' && 'pageBreak' in lastContent) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { pageBreak, ...rest } = lastContent;
      this.content[this.content.length - 1] = rest;
    }
  }

  public table(rows: Row[], columns: number, widths?: Size[]): this {
    const initialTable = new PdfTable(columns, widths);

    const table = rows
      .reduce<PdfTable>((currentTable, current) => {
        if (Array.isArray(current)) {
          const [header, ...row] = current;
          return currentTable.row(header, row);
        }
        const [header, ...row] = current.content;
        return currentTable.row(header, row, current.style);
      }, initialTable)
      .get();

    this.content.push(table);
    return this;
  }

  public toDocumentDefinition(): DocumentDefinition {
    this.removeLastPageBreak();
    return makePdf(this.content, this.title);
  }
}
