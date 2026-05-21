import { GENERAL_INFO } from '@/lib/data';

const StickyEmail = () => {
  return (
    <div className="fixed bottom-32 left-3 block max-xl:hidden">
      <a
        href={`mailto:${GENERAL_INFO.email}`}
        className="!bg-bottom hover:!bg-center px-3 text-muted-foreground tracking-[0.0625rem] transition-all hover:text-foreground"
        style={{
          // background:
          //     'linear-gradient(to bottom, hsl(var(--muted-foreground)) 0% 33.33%, hsl(var(--primary)) 33.33% 66.66%, hsl(var(--muted-foreground)) 66.66% 100%)',
          // backgroundSize: '100% 300%',

          // backgroundClip: 'text',
          // color: 'transparent',

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
