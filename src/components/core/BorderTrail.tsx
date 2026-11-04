import { motion, Transition } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CSSProperties } from 'react';

export interface BorderTrailProps {
  className?: string;
  size?: number;
  transition?: Transition;
  onAnimationComplete?: () => void;
  style?: CSSProperties;
}

export function BorderTrail({
  className,
  size = 120,
  transition,
  onAnimationComplete,
  style,
}: BorderTrailProps) {
  const defaultTransition: Transition = {
    repeat: Infinity,
    duration: 3,
    ease: 'linear',
    ...transition,
  };

  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
      <motion.div
        className={cn(
          'absolute aspect-square bg-gradient-to-r from-transparent via-[#ECE4B4] to-transparent',
          className
        )}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          ...style,
        }}
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={defaultTransition}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
}
