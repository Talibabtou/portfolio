import { preloadTopography } from '@/lib/topography';

let startupPromise: Promise<void> | null = null;
let warmTasksStarted = false;

const preloadDemoData = () => {
  void Promise.allSettled([
    import('@/app/_components/demos/data/BitcoinMarketDemo').then((module) =>
      module.preloadBitcoinMarketDemo(),
    ),
    import('@/app/_components/demos/data/ProtocolHeatmapDemo').then((module) =>
      module.preloadProtocolRevenueTerminal(),
    ),
    import('@/app/_components/demos/data/GitHubRadarDemo').then((module) =>
      module.preloadGitHubRadarDemo(),
    ),
    import('@/app/_components/demos/data/WorldMapDemo').then((module) =>
      module.preloadWorldMapDemo(),
    ),
  ]);
};

const scheduleWarmStartupTasks = () => {
  if (warmTasksStarted || typeof window === 'undefined') {
    return;
  }

  warmTasksStarted = true;

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(preloadDemoData, { timeout: 2500 });
    return;
  }

  setTimeout(preloadDemoData, 900);
};

export const runStartupTasks = () => {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (!startupPromise) {
    startupPromise = preloadTopography().then(() => {
      scheduleWarmStartupTasks();
    });
  }

  return startupPromise;
};
