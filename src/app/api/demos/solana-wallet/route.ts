import {
  isSolanaAddress,
  normalizeHeliusTransactions,
  normalizeHeliusWalletResponse,
  normalizeSolanaAddress,
} from '@/app/_components/demos/data/WalletFlowDemo';

const HELIUS_ENHANCED_API_BASE_URL = 'https://api-mainnet.helius-rpc.com/v0';
const HELIUS_WALLET_API_BASE_URL = 'https://api.helius.xyz/v1/wallet';
const SOLANA_WALLET_REVALIDATE = 5 * 60;

export const GET = async (request: Request) => {
  const apiKey = process.env.HELIUS_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'HELIUS_API_KEY is not configured.' },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const address = normalizeSolanaAddress(url.searchParams.get('address') ?? '');

  if (!isSolanaAddress(address)) {
    return Response.json({ error: 'Invalid Solana address.' }, { status: 400 });
  }

  const heliusUrl = new URL(
    `${HELIUS_WALLET_API_BASE_URL}/${address}/balances`,
  );
  heliusUrl.searchParams.set('limit', '100');
  heliusUrl.searchParams.set('showNative', 'true');
  heliusUrl.searchParams.set('showNfts', 'false');
  heliusUrl.searchParams.set('showZeroBalance', 'false');

  const transactionsUrl = new URL(
    `${HELIUS_ENHANCED_API_BASE_URL}/addresses/${address}/transactions`,
  );
  transactionsUrl.searchParams.set('api-key', apiKey);
  transactionsUrl.searchParams.set('limit', '100');

  const [balancesResponse, transactionsResponse] = await Promise.all([
    fetch(heliusUrl, {
      headers: {
        'X-Api-Key': apiKey,
      },
      next: {
        revalidate: SOLANA_WALLET_REVALIDATE,
        tags: [`demo:solana-wallet:${address}:balances`],
      },
    }),
    fetch(transactionsUrl, {
      next: {
        revalidate: SOLANA_WALLET_REVALIDATE,
        tags: [`demo:solana-wallet:${address}:transactions`],
      },
    }),
  ]);

  if (!balancesResponse.ok) {
    return Response.json(
      { error: `Helius returned ${balancesResponse.status}.` },
      { status: balancesResponse.status },
    );
  }

  const transactions = transactionsResponse.ok
    ? normalizeHeliusTransactions(await transactionsResponse.json())
    : [];

  return Response.json(
    normalizeHeliusWalletResponse(
      address,
      await balancesResponse.json(),
      transactions,
    ),
  );
};
