import { IconButton } from '../../atoms';
import QuestionMarkIcon from './question-mark-icon.png';
import {
  gridContainer,
  header,
  iconContainer,
  sectionContents,
  withIcon,
} from './form-section.css';
import { ToolTip } from '../../molecules';
import { CONTACT_EMAIL } from '@tnmw/constants';

interface FormSectionProps {
  children: React.ReactNode;
  heading?: string;
  showQuestionMarkIcon?: boolean;
}

const FormSection = (props: FormSectionProps) => {
  const gridContainerClasses = (
    props.showQuestionMarkIcon ? [gridContainer, withIcon] : [gridContainer]
  ).join(' ');

  return (
    <div>
      {props.heading ? <h2 className={header}>{props.heading}</h2> : null}
      <div className={sectionContents}>
        <div className={gridContainerClasses}>{props.children}</div>

        {props.showQuestionMarkIcon && (
          <ToolTip
            text={`This section cannot be edited - please email ${CONTACT_EMAIL} if you need to make any changes`}
          >
            <div className={iconContainer}>
              <IconButton icon={QuestionMarkIcon} a11yLabel="Information" />
            </div>
          </ToolTip>
        )}
      </div>
    </div>
  );
};

export default FormSection;
