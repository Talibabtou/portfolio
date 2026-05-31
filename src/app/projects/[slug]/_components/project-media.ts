export const getMediaLabel = (src: string) => {
  const filename = src.split('/').pop()?.split('.')[0] ?? 'Media';

  return filename
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const isVideoMedia = (src: string) => {
  return src.endsWith('.mp4') || src.endsWith('.webm');
};
