import { fetchProtocolRevenueSnapshot } from '@/app/_components/demos/data/ProtocolHeatmapDemo';

export const revalidate = 3600;

export const GET = async () => {
  const snapshot = await fetchProtocolRevenueSnapshot();

  return Response.json(snapshot);
};
