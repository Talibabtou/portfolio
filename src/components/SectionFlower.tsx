import Image from 'next/image';
import type { ComponentProps } from 'react';

type SectionFlowerProps = Omit<ComponentProps<typeof Image>, 'alt' | 'src'> & {
  alt?: string;
};

const SectionFlower = ({
  alt = '',
  height = 29,
  width = 25,
  ...props
}: SectionFlowerProps) => (
  <Image
    aria-hidden={alt ? undefined : true}
    alt={alt}
    height={height}
    src="/logo/section-flower.svg"
    width={width}
    {...props}
  />
);

export default SectionFlower;
