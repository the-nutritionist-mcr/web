import { IconButton } from '../../atoms';
import QuestionMarkIcon from './question-mark-icon.png';
import {
  gridContainer,
  header,
  iconContainer,
  sectionContents,
} from './form-section.css';

interface FormSectionProps {
  children: React.ReactNode;
  heading?: string;
  showQuestionMarkIcon?: boolean;
}

const FormSection = (props: FormSectionProps) => (
  <div>
    {props.heading ? <h2 className={header}>{props.heading}</h2> : null}
    <div className={sectionContents}>
      <div className={gridContainer}>{props.children}</div>

      {props.showQuestionMarkIcon && (
        <div className={iconContainer}>
          <IconButton icon={QuestionMarkIcon} a11yLabel="Information" />
        </div>
      )}
    </div>
  </div>
);

export default FormSection;
