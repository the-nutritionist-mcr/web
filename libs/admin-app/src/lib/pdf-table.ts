/* eslint-disable fp/no-this */
import { Content, ContentTable, Size } from 'pdfmake/interfaces';
import { batchArray } from './batch-array';

const defaultWidths = (columns: number) =>
  [...Array.from({ length: columns + 1 })].map(() => '*');

interface TableRowBorder {
  width?: number;
  color?: string;
}

export type TableRowBorders = [
  left: TableRowBorder | undefined,
  right: TableRowBorder | undefined,
  top: TableRowBorder | undefined,
  bottom: TableRowBorder | undefined
];

export interface TableRowStyle {
  borders?: TableRowBorders;
  background?: string;
}

export class PdfTable {
  public constructor(
    private columns: number,
    private widths: Size[] = defaultWidths(columns),
    private headerRows = 0
  ) {}

  private content: Content[][] = [];
  private styles: TableRowStyle[] = [];

  private makeFillerCells(size: number) {
    return Array.from<{ text: string }>({ length: size })
      .fill({ text: '' })
      .map((cell, index) => (index === 0 ? { ...cell, colSpan: size } : cell));
  }

  public row(
    headerCell: Content,
    row: Content[],
    rowStyles?: TableRowStyle
  ): this {
    const batches = batchArray(row, this.columns)
      .map((mapRow, index, array) => ({
        rowSpan: array.length,
        mapRow,
      }))
      .map(({ mapRow, rowSpan }) => [{ rowSpan, text: headerCell }, ...mapRow])
      .map((mapRow) =>
        mapRow.length < this.columns + 1
          ? [
              ...mapRow,
              ...this.makeFillerCells(this.columns - mapRow.length + 1),
            ]
          : mapRow
      );

    batches.forEach((_, index) => {
      const leftBorder = rowStyles?.borders?.[0];
      const rightBorder = rowStyles?.borders?.[1];
      const topBorder = index === 0 ? rowStyles?.borders?.[2] : undefined;
      const bottomBorder =
        index === batches.length - 1 ? rowStyles?.borders?.[3] : undefined;

      // eslint-disable-next-line fp/no-mutating-methods
      this.styles.push({
        borders: [leftBorder, rightBorder, topBorder, bottomBorder],
        background: rowStyles?.background,
      });
    });

    // eslint-disable-next-line fp/no-mutating-methods
    this.content.push(...batches);
    return this;
  }

  public get(): ContentTable {
    this.content.forEach((row) => console.log(row.length));
    return {
      table: {
        widths: this.widths,
        body: this.content,
        keepWithHeaderRows: 0,
        headerRows: this.headerRows,
        dontBreakRows: true,
      },
      layout: {
        fillColor: (index) => {
          return this.styles[index].background ?? null;
        },
        hLineWidth: (index) => {
          const top =
            index < this.styles.length &&
            this.styles[index].borders?.[2]?.width;

          if (top) {
            return top;
          }

          const bottom =
            index !== 0 && this.styles[index - 1].borders?.[3]?.width;

          if (bottom) {
            return bottom;
          }

          return 1;
        },
      },
    };
  }
}
