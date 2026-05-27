import {
  DEFAULT_BITCOIN_RANGE,
  fetchBitcoinMarketPoints,
  type BitcoinRange,
} from '@/app/_components/demos/data/BitcoinMarketDemo';

export const revalidate = 300;

const isBitcoinRange = (value: string | null): value is BitcoinRange =>
  value === '1' || value === '7' || value === '30';

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const range = url.searchParams.get('days');
  const points = await fetchBitcoinMarketPoints(
    isBitcoinRange(range) ? range : DEFAULT_BITCOIN_RANGE,
  );

  return Response.json(points);
};
