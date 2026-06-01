'use client';

import { Printer } from 'lucide-react';

const PrintCvButton = () => {
  return (
    <button
      className="inline-flex h-12 items-center justify-center gap-2 bg-primary px-6 font-anton text-primary-foreground text-sm uppercase tracking-widest transition-colors hover:bg-primary-hover print:hidden"
      onClick={() => window.print()}
      type="button"
    >
      <Printer aria-hidden="true" className="size-4" />
      Print
    </button>
  );
};

export default PrintCvButton;
