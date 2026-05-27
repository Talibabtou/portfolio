import { fetchCountries } from '@/app/_components/demos/data/WorldMapDemo';

export const revalidate = 604800;

export const GET = async () => {
  const countries = await fetchCountries();

  return Response.json(countries);
};
