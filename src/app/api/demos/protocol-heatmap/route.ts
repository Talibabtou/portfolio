import { fetchProtocolRevenueSnapshot } from '@/lib/demos/protocol-heatmap';

export const revalidate = 3600;

export const GET = async () => {
  const snapshot = await fetchProtocolRevenueSnapshot();

  return Response.json(snapshot);
};
