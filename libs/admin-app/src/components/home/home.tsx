import { Heading, Paragraph } from "grommet";
import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";

interface Card {
  idShort: number;
  url: string;
}

const StyledLi = styled.li`
  margin-bottom: 0.4rem;
`;

const replaceNumberWithTrelloUrl = async () => {
  const result = await fetch("https://api.trello.com/1/boards/OfdLJmww/cards");
  const cards = await result.json();

  return (cardNumber: string) => {
    const number = cardNumber.split("-")[1].trim();
    const card = cards.find(
      (foundCard: Card) => foundCard.idShort === Number.parseInt(number)
    );
    if (!card) {
      return cardNumber;
    }
    return `[TRELLO-${number}](${card.url})`;
  };
};

const transformNotes = (inputNotes: string): string =>
  inputNotes
    .replace(/\((?<date>\d{4}-\d{2}-\d{2})\)/gmu, " - $<date>")

    .replace(/\d{4}-\d{2}-\d{2}/gmu, (match) => new Date(match).toDateString())
    .replace(/\(\S+?\)$/gmu, "")
    .replace(
      /^\* [a-z]/gmu,
      (match) => `* ${match.split(" ")[1].toUpperCase()}`
    )
    .replace(/^#+\s\[/gmu, "## [");

const Home: React.FC = () => {
  const [theNotes, setTheNotes] = React.useState<string>("");

  React.useEffect(() => {
    (async () => {
      const changeLogPromise = fetch(`${process.env.PUBLIC_URL}/CHANGELOG.md`);
      const ticketLoaderPromise = replaceNumberWithTrelloUrl();
      const [log, ticketLoader] = await Promise.all([
        changeLogPromise,
        ticketLoaderPromise,
      ]);
      const body = await log.text();
      const hydratedNotes = body.replace(/TRELLO-\d+/gu, ticketLoader);
      setTheNotes(hydratedNotes);
    })();
  });

  return (
    <React.Fragment>
      <Heading level={2}>Releases</Heading>
      <Paragraph fill>
        These release notes are automatically generated from logs of changes
        made to the code base, so they should stay up to date. If you have any
        questions about any changes that have been made, or to report a bug,
        please email me directly at ben@thenutritionistmcr.com.
      </Paragraph>
      {/* eslint-disable react/display-name */}
      <ReactMarkdown
        components={{
          h2: ({ ...props }) => (
            <Heading
              style={{
                marginBottom: "0.25rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
                maxWidth: "100%",
              }}
              margin={{ top: "1.5rem", bottom: "0" }}
              {...props}
              level={4}
            />
          ),
          h3: ({ ...props }) => (
            <Heading
              margin={{ top: "0.5rem", bottom: "0.4rem" }}
              {...props}
              level={5}
            />
          ),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          li: ({ ...props }) => <StyledLi {...props} />,
        }}
      >
        {transformNotes(theNotes)}
      </ReactMarkdown>
      {/* eslint-enable react/display-name */}
    </React.Fragment>
  );
};

export default Home;
