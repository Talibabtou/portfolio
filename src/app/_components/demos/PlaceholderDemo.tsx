import type { DemoTrack } from '@/app/_components/demos/types';

type Props = Pick<DemoTrack, 'detail' | 'metrics' | 'title'>;

const PlaceholderDemo = ({ detail, metrics, title }: Props) => {
  return (
    <div className="mt-auto translate-y-0 opacity-100 transition-all duration-500">
      <div className="mb-8 flex flex-wrap gap-3">
        {metrics.map((metric) => (
          <span
            className="border border-foreground/15 px-3 py-1 font-anton text-sm"
            key={metric}
          >
            {metric}
          </span>
        ))}
      </div>
      <h3 className="max-w-155 font-anton text-5xl leading-none md:text-7xl">
        {title}
      </h3>
      <p className="mt-5 max-w-135 text-lg text-muted-foreground">{detail}</p>
    </div>
  );
};

export default PlaceholderDemo;
