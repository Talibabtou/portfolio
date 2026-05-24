import { preloadTopography } from '@/lib/topography';

let startupPromise: Promise<void> | null = null;
let warmTasksStarted = false;

const runWarmStartupTasks = () => {
  if (warmTasksStarted || typeof window === 'undefined') {
    return;
  }

  warmTasksStarted = true;

  void Promise.allSettled([
    import('@/app/_components/demos/BitcoinMarketDemo').then((module) =>
      module.preloadBitcoinMarketDemo(),
    ),
    import('@/app/_components/demos/DataRoomDemo').then((module) =>
      module.preloadProtocolRevenueTerminal(),
    ),
    import('@/app/_components/demos/GitHubRadarDemo').then((module) =>
      module.preloadGitHubRadarDemo(),
    ),
    import('@/app/_components/demos/WorldMapDemo').then((module) =>
      module.preloadWorldMapDemo(),
    ),
  ]);
};

export const runStartupTasks = () => {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  runWarmStartupTasks();

  if (!startupPromise) {
    startupPromise = preloadTopography().then(() => undefined);
  }

  return startupPromise;
};
