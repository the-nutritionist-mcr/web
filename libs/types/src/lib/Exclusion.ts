export default interface Exclusion {
  id: string;
  name: string;
  allergen: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const isExclusion = (exclusion: unknown): exclusion is Exclusion => {
  if (typeof exclusion !== 'object') {
    return false;
  }

  const asExclusion = exclusion as Exclusion;

  return (
    typeof asExclusion.id === 'string' &&
    typeof asExclusion.name === 'string' &&
    typeof asExclusion.allergen === 'boolean' &&
    (!asExclusion.createdAt || typeof asExclusion.createdAt === 'string') &&
    (!asExclusion.updatedAt || typeof asExclusion.updatedAt === 'string')
  );
};
