import { fetchCountries } from '@/lib/demos/world-map';

export const revalidate = 604800;

export const GET = async () => {
  const countries = await fetchCountries();

  return Response.json(countries);
};
