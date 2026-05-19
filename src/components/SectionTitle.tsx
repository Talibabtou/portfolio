import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { SectionFlower } from '@/components/icons';

interface Props {
  icon?: ReactNode;
  className?: string;
  classNames?: {
    container?: string;
    title?: string;
    icon?: string;
  };
  title: string;
}

const SectionTitle = ({ icon, title, className, classNames }: Props) => {
  return (
    <div
      className={cn(
        'mb-10 flex items-center gap-4',
        className,
        classNames?.container,
      )}
    >
      {icon ? (
        icon
      ) : (
        <SectionFlower
          width={25}
          className={cn('animate-spin duration-7000', classNames?.icon)}
        />
      )}
      <h2 className={cn('text-xl uppercase leading-none', classNames?.title)}>
        {title}
      </h2>
    </div>
  );
};

export default SectionTitle;
