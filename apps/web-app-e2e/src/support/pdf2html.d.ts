interface Pdf2Html {
  html: (
    filename: string,
    callback: (error: Error, data: string) => void
  ) => void;
}

declare module 'pdf2html' {
  const mod: Pdf2Html;
  export default mod;
}
