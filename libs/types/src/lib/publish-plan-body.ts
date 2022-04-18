export interface PublishPlanBody {
  id: string;
}

export const isPublishPlanBody = (thing: unknown): thing is PublishPlanBody => {
  const thingAsAny = thing as PublishPlanBody;

  return typeof thingAsAny.id === 'string';
};
