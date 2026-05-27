import { fetchEarthquakes } from '@/app/_components/demos/data/WorldMapDemo';

export const revalidate = 86400;

export const GET = async () => {
  const earthquakes = await fetchEarthquakes();

  return Response.json(earthquakes);
};
