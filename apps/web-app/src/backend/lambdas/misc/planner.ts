import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { Recipe, isRecipe } from '@tnmw/types';
import { chooseMeals } from '@tnmw/meal-planning';
import { authoriseJwt } from '../data-api/authorise';
import { returnErrorResponse } from '../data-api/return-error-response';
import { HttpError } from '../data-api/http-error';
import { HTTP } from '@tnmw/constants';

interface WeeklyPlan {
  cooks: Recipe[][];
  dates: string[];
}

const isWeeklyPlan = (plan: unknown): plan is WeeklyPlan => {
  if (typeof plan !== 'object') {
    return false;
  }

  const asPlan = plan as WeeklyPlan;

  return (
    Array.isArray(asPlan.cooks) &&
    asPlan.cooks.every(
      (item) => Array.isArray(item) && item.every((recipe) => isRecipe(recipe))
    ) &&
    typeof asPlan.dates === 'string'
  );
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    await authoriseJwt(event, ['admin']);

    const payload = JSON.parse(event.body);

    if (!isWeeklyPlan(payload)) {
      throw new HttpError(HTTP.statusCodes.BadRequest, 'Request was invalid');
    }

    const dates = payload.dates.map((date) => new Date(Date.parse(date)));

    const meals = chooseMeals(payload.cooks, dates);
  } catch (error) {
    return returnErrorResponse(error);
  }
};
