import { Heading, Paragraph } from "grommet";
import React from "react";

const Reports: React.FC = () => {
  return (
    <React.Fragment>
      <Heading level={2}>Reports</Heading>
      <Paragraph>
        <ul>
          <li>
            Total customers on file: <strong>{0}</strong>
          </li>
          <li>
            Active: <strong>{0}</strong>
          </li>

          <li>
            Inactive: <strong>{0}</strong>
          </li>
        </ul>
      </Paragraph>
    </React.Fragment>
  );
};

export default Reports;
