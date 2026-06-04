import {
  DEFAULT_BITCOIN_RANGE,
  fetchBitcoinMarketSnapshot,
  type BitcoinRange,
} from '@/lib/demos/bitcoin-market';

export const revalidate = 300;

const isBitcoinRange = (value: string | null): value is BitcoinRange =>
  value === '1' || value === '7' || value === '30';

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const range = url.searchParams.get('days');
  const snapshot = await fetchBitcoinMarketSnapshot(
    isBitcoinRange(range) ? range : DEFAULT_BITCOIN_RANGE,
  );

  return Response.json(snapshot);
};
