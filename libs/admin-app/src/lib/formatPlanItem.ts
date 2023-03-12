import { base } from 'grommet';

interface FormattedPlanItem {
  bold: boolean;
  markerColor: string;
  color: string;
  text: string;
}

const formatPlanItem = (
  text: string,
  planItem?: { allergen: boolean; customisation: boolean }
): FormattedPlanItem | string => {
  if (!planItem?.customisation && !planItem?.allergen) {
    return text;
  }

  const color = planItem?.customisation
    ? base.global?.colors?.['status-error']
    : '#000000';

  const finalColor = planItem?.allergen ? base.global?.colors?.brand : color;

  const bold = finalColor !== '#000000';

  return {
    bold,
    markerColor: finalColor as string,
    color: finalColor as string,
    text,
  };
};

export default formatPlanItem;
