import styled from 'styled-components';
import { IconButton } from '../../atoms';
import LockIcon from './lock-icon.png';
import QuestionMarkIcon from './question-mark-icon.png';

interface FormSectionProps {
  children: React.ReactNode;
  heading?: string;
}

const Header = styled.h2`
  font-family: 'Acumin Pro', Arial, sans-serif;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 15rem 15rem;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  margin-bottom: 2.2rem;
  padding-top: 2.2rem;
`;

const SectionContents = styled.div`
  border-top 1px dashed #B8B8B8;
  width: 100%;
  display: flex;
`;

const IconContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 3.9rem;
  padding-left: 10rem;
`;

const FormSection = (props: FormSectionProps) => (
  <div>
    {props.heading ? <Header>{props.heading}</Header> : null}
    <SectionContents>
      <GridContainer>{props.children}</GridContainer>

      <IconContainer>
        <IconButton icon={LockIcon} a11yLabel="Section Disabled" />
        <IconButton icon={QuestionMarkIcon} a11yLabel="Information" />
      </IconContainer>
    </SectionContents>
  </div>
);

export default FormSection;
