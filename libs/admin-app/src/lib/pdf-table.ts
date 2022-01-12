// eslint-disable-next-line import/no-unresolved
import { Content, Size, Table } from "pdfmake/interfaces";
import { batchArray } from "./batch-array";

const defaultWidths = (columns: number) =>
  [...new Array(columns + 1)].map(() => "*");

export class PdfTable {
  public constructor(
    private columns: number,
    private widths: Size[] = defaultWidths(columns),
    private headerRows = 0
  ) {}

  private content: Content[][] = [];

  private makeFillerCells(size: number) {
    return new Array(size)
      .fill({ text: "" })
      .map((cell, index) => (index === 0 ? { ...cell, colSpan: size } : cell));
  }

  public row(headerCell: Content, row: Content[]): this {
    this.content.push(
      ...batchArray(row, this.columns)
        .map((mapRow, index, array) => ({
          rowSpan: array.length,
          mapRow
        }))
        .map(({ mapRow, rowSpan }) => [
          { rowSpan, text: headerCell },
          ...mapRow
        ])
        .map(mapRow =>
          mapRow.length < this.columns + 1
            ? [
                ...mapRow,
                ...this.makeFillerCells(this.columns - mapRow.length + 1)
              ]
            : mapRow
        )
    );
    return this;
  }

  public get(): Table {
    return {
      widths: this.widths,
      body: this.content,
      keepWithHeaderRows: 0,
      headerRows: this.headerRows,
      dontBreakRows: true
    };
  }
}
