import { fetchEarthquakes } from '@/lib/demos/world-map';

export const revalidate = 86400;

export const GET = async () => {
  const earthquakes = await fetchEarthquakes();

  return Response.json(earthquakes);
};
