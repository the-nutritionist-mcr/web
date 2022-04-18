export interface PublishPlanBody {
  id: string;
  sort: string;
}

export const isPublishPlanBody = (thing: unknown): thing is PublishPlanBody => {
  const thingAsAny = thing as PublishPlanBody;

  return (
    typeof thingAsAny.id === 'string' && typeof thingAsAny.sort === 'string'
  );
};
