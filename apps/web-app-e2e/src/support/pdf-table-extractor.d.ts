declare module 'pdf-table-extractor' {
  interface PageTablesPage {
    page: number;
    tables: string[][];
    merges: Record<string, unknown>;
    merge_alias: Record<string, unknown>;
    width: number;
    height: number;
  }

  type FailFunc = (error: Error) => void;

  type Extractor = (name: string, success: SuccesFunc, error: FailFunc) => void;

  type SuccesFunc = (result: PageTablesOutput) => void;

  export interface PageTablesOutput {
    pageTables: PageTablesPage[];
    numPages: number;
    currentPages: number;
  }

  const mod: Extractor;
  export default mod;
}
