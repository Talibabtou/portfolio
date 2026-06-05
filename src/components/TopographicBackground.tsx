'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import dynamic from 'next/dynamic';

const DesktopTopographicBackground = dynamic(
  () => import('@/components/DesktopTopographicBackground'),
  {
    ssr: false,
  },
);

const STATIC_TOPOGRAPHIC_PATHS = [
  'M66 92C116 48 203 45 258 86C316 129 321 218 274 271C225 326 139 331 82 286C25 241 13 139 66 92Z',
  'M91 121C133 87 199 85 242 116C288 149 292 216 254 256C214 299 148 303 103 268C58 233 49 156 91 121Z',
  'M116 151C150 126 197 125 227 148C259 173 262 217 235 245C206 274 158 277 127 252C96 228 87 178 116 151Z',
  'M139 180C162 164 195 163 216 179C239 197 240 226 221 244C200 263 167 265 145 248C123 230 117 198 139 180Z',
  'M33 318C75 286 134 283 177 313C221 344 226 405 189 445C151 486 91 490 49 456C8 423 -8 350 33 318Z',
  'M61 344C94 323 136 322 166 343C197 365 200 408 174 434C146 462 103 464 73 441C44 417 32 365 61 344Z',
  'M210 36C252 17 313 32 337 70C363 112 344 170 302 189C260 209 204 192 181 154C157 116 168 55 210 36Z',
];

const StaticTopographicBackground = () => (
  <svg
    aria-hidden="true"
    className="absolute top-1/2 left-1/2 h-[145svh] w-[145svw] -translate-x-1/2 -translate-y-1/2 rotate-90 text-foreground sm:h-[130svh] sm:w-[130svw]"
    fill="none"
    viewBox="0 0 360 520"
  >
    {STATIC_TOPOGRAPHIC_PATHS.map((path, index) => (
      <path
        d={path}
        key={path}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={index % 2 === 0 ? 0.7 : 0.45}
        style={{
          opacity: `calc(${0.08 + index * 0.025} * var(--topographic-opacity-scale))`,
        }}
      />
    ))}
  </svg>
);

const TopographicBackground = () => {
  const shouldUseDesktopTopography = useMediaQuery('(min-width: 1024px)');

  return (
    <div className="topographic-background pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {shouldUseDesktopTopography ? (
        <DesktopTopographicBackground />
      ) : (
        <StaticTopographicBackground />
      )}
    </div>
  );
};

export default TopographicBackground;
