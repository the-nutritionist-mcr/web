import { MapboxEndpoint } from './mapbox';

interface Coordinates {
  longitude: number;
  latitude: number;
}

const places = new MapboxEndpoint(
  `geocoding/v5`,
  'mapbox.places',
  process.env['MAPBOX_TOKEN']
);

export const getCoordsForAddress = async (): Promise<Coordinates> => {
  const response = await places.get({
    args: ['foo'],
    proximity: 'foo',
  });

  const feature = response.features[0];

  return {
    longitude: feature.center[0],
    latitude: feature.center[1],
  };
};
