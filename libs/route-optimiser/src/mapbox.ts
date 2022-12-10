/* eslint-disable fp/no-this */
const URL = `https://api.mapbox.com/`;

interface Feature {
  id: string;
  type: `Feature`;
  place_type: string[];
  relevance: number;
  address?: string;
  properties: {
    accuracy?: string;
    address?: string;
    category?: string;
    maki?: string;
    wikidata?: string;
    short_code?: string;
    landmark: boolean;
    tel: string;
  };
  text: string;
  place_name: string;
  matching_text?: string;
  matching_place_name?: string;
  bbox: number[];
  center: [number, number];
  geometry: {
    type: 'Point';
    coordinates: [number, number];
    interpolated?: boolean;
    omitted?: boolean;
  };
}

interface GetForwardGeocoding {
  argNames: ['search_text'];
  queryParams: {
    search_text: string;
    autocomplete?: boolean;
    bbox?: number;
    country?: string;
    fuzzyMatch?: boolean;
    language?: string;
    limit?: number;
    proximity?: string;
    routing?: string;
    types?: string;
    worldview?: string;
  };
  response: {
    type: 'FeatureCollection';
    query: string[];
    features: Feature[];
  };
}

interface GetReverseGeocoding {
  argNames: ['longitude_and_latitude'];
  queryParams: {
    longitude_and_latitude: `${number},${number}`;
    country?: string;
    language?: string;
    limit?: number;
    reverseMode?: string;
    routing?: boolean;
    types?: string;
    worldView?: string;
  };
  response: {
    type: 'FeatureCollection';
    query: string[];
    features: Feature[];
  };
}

interface MapboxPlaces {
  api: `geocoding/v5/`;
  get: GetForwardGeocoding | GetReverseGeocoding;
}

interface EndpointResponseMap {
  'mapbox.places': MapboxPlaces;
}

export class MapboxEndpoint<E extends keyof EndpointResponseMap> {
  private url: string;

  constructor(
    private api: string,
    endpoint: E,
    private token: string | undefined
  ) {
    if (!token) {
      throw new Error('No Mapbox token defined');
    }

    this.url = `${URL}${this.api}/${endpoint}`;
  }

  private getUrlWithQueryString(
    args: string[],
    query: Record<string, unknown>
  ) {
    const queryString = Object.entries({
      ...query,
      token: this.token,
    })
      .map(([key, value]) => `${key}=${encodeURIComponent(value ?? '')}`)
      .join('&');

    const argString = args.join('/');

    return `${this.url}/${argString}?${queryString}`;
  }

  async get(
    queryParams: EndpointResponseMap[E]['get']['queryParams']
  ): Promise<EndpointResponseMap[E]['get']['response']> {
    const result = Object.entries(queryParams).reduce((accum, item));

    return fetch(this.getUrlWithQueryString(args, query)).then((response) =>
      response.json()
    );
  }
}
