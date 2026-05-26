import { GENERAL_INFO } from '@/lib/data';

const StickyEmail = () => {
  return (
    <div className="fixed bottom-32 left-3 block max-xl:hidden">
      <a
        href={`mailto:${GENERAL_INFO.email}`}
        className="bg-bottom! px-3 text-muted-foreground tracking-[0.0625rem] transition-all hover:bg-center! hover:text-foreground"
        style={{
          textOrientation: 'mixed',
          writingMode: 'vertical-rl',
        }}
      >
        {GENERAL_INFO.email}
      </a>
    </div>
  );
};

export default StickyEmail;
