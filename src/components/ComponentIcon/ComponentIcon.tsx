import type { ComponentType } from 'react';
import type { IconProps } from '@phosphor-icons/react';
import {
  Barcode,
  Camera,
  Database,
  Lightning,
  Ruler,
  VideoCamera,
} from '@phosphor-icons/react';
import type { PhosphorIconName } from '@/types';

type IconComponent = ComponentType<IconProps>;

const ICON_MAP: Record<PhosphorIconName, IconComponent> = {
  Camera,
  Barcode,
  Ruler,
  Lightning,
  Database,
  VideoCamera,
};

interface ComponentIconProps {
  name: string;
  size?: number;
  weight?: 'regular' | 'duotone' | 'fill';
}

export default function ComponentIcon({
  name,
  size = 24,
  weight = 'duotone',
}: ComponentIconProps) {
  const Icon = ICON_MAP[name as PhosphorIconName] ?? Camera;
  return <Icon size={size} weight={weight} />;
}
