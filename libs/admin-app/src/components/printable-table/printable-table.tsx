import { TableBody, TableCell, TableHeader, TableRow } from "grommet";
import styled from "styled-components";

export const PrintableTableRow = styled(TableRow)`
  @media print {
    page-break-inside: avoid !important;
    page-break-after: auto;
  }
`;

export const PrintableTableCell = styled(TableCell)`
  @media print {
    page-break-inside: avoid;
    page-break-after: auto;
  }
`;

export const PrintableThead = styled(TableHeader)`
  display: table-header-group;
`;

export const PrintableTbody = styled(TableBody)`
  display: table-header-group;
`;
