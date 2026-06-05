let startupPromise: Promise<void> | null = null;
let warmTasksStarted = false;

const preloadDemoData = () => {
  void Promise.allSettled([
    import('@/lib/demos/bitcoin-market').then((module) =>
      module.preloadBitcoinMarketDemo(),
    ),
    import('@/lib/demos/protocol-heatmap').then((module) =>
      module.preloadProtocolHeatmapDemo(),
    ),
    import('@/lib/demos/wallet-flow').then((module) =>
      module.preloadWalletFlowDemo(),
    ),
    import('@/lib/demos/github-radar').then((module) =>
      module.preloadGitHubRadarDemo(),
    ),
    import('@/lib/demos/world-map').then((module) =>
      module.preloadWorldMapDemo(),
    ),
  ]);
};

const scheduleWarmStartupTasks = () => {
  if (warmTasksStarted || typeof window === 'undefined') {
    return;
  }

  if (!window.matchMedia('(min-width: 1024px)').matches) {
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

  if (!window.matchMedia('(min-width: 1024px)').matches) {
    return Promise.resolve();
  }

  if (!startupPromise) {
    startupPromise = import('@/lib/topography')
      .then((module) => module.preloadTopography())
      .then(() => {
        scheduleWarmStartupTasks();
      });
  }

  return startupPromise;
};
