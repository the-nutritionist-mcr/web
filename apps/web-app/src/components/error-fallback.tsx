import styled from '@emotion/styled';
import { Hero, ParagraphText } from '@tnmw/components';
import { CONTACT_EMAIL } from '@tnmw/constants';

const ErrorHeaderBox = styled('div')`
  text-align: center;
  color: #3b7d7a;
  align-items: center;
  flex-direction: row;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ErrorHeader = styled('h1')`
  font-size: 40px;
  display: auto;
  margin: 0.5rem 0 0 0;
`;

const Label = styled('div')`
  max-width: 600px;
  margin: 1rem;
`;

export const ErrorFallback = () => {
  return (
    <>
      <Hero>
        <ErrorHeaderBox>
          <ErrorHeader>Whoops!</ErrorHeader>
        </ErrorHeaderBox>
      </Hero>

      <Label>
        <ParagraphText>
          This application has encountered an internal error. Don&apos;t worry,
          we know about the error and are looking into it. Press back in your
          browser to go back to your previous page and try again. If you have
          any questions about this site, please don&apos;t hesitate to get in
          touch via <strong>{CONTACT_EMAIL}</strong>
        </ParagraphText>
      </Label>
    </>
  );
};
