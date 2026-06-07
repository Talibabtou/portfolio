export const PENDING_SECTION_KEY = 'portfolio:pending-section';
const SECTION_SCROLL_OFFSET = 50;

const getLayoutTop = (element: HTMLElement) => {
  let top = 0;
  let currentElement: HTMLElement | null = element;

  while (currentElement) {
    top += currentElement.offsetTop;
    currentElement = currentElement.offsetParent as HTMLElement | null;
  }

  return top;
};

export const scrollToSection = (
  sectionId: string,
  behavior: ScrollBehavior = 'smooth',
) => {
  const targetSection = document.getElementById(sectionId);
  if (!targetSection) return;

  const scrollTarget =
    targetSection.querySelector<HTMLElement>('[data-section-anchor]') ??
    targetSection;
  const targetTop = getLayoutTop(scrollTarget) - SECTION_SCROLL_OFFSET;

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior,
  });
};

const getSectionIdFromHomeHash = (url: string) => {
  return url.startsWith('/#') ? url.slice(2) : '';
};

const getHomeHashUrl = (sectionId: string) => `/#${sectionId}`;

export const navigateToHomeHashUrl = ({
  pathname,
  push,
  url,
}: {
  pathname: string;
  push: (url: string) => void;
  url: string;
}) => {
  const sectionId = getSectionIdFromHomeHash(url);

  if (!sectionId) {
    push(url);
    return;
  }

  if (pathname !== '/') {
    sessionStorage.setItem(PENDING_SECTION_KEY, sectionId);
    push('/');
    return;
  }

  window.history.pushState(null, '', getHomeHashUrl(sectionId));
  scrollToSection(sectionId);
};
