import { cn } from '@/lib/utils';
import { motion, Transition } from 'framer-motion';
import {
  Children,
  cloneElement,
  ReactElement,
  useState,
  useId,
  useEffect,
} from 'react';

export interface AnimatedBackgroundProps {
  children: ReactElement<any>[] | ReactElement<any>;
  defaultValue?: string;
  value?: string;
  onValueChange?: (newActiveId: string | null) => void;
  className?: string;
  transition?: Transition;
  enableHover?: boolean;
}

export function AnimatedBackground({
  children,
  defaultValue,
  value,
  onValueChange,
  className,
  transition = { type: 'spring', bounce: 0.2, duration: 0.3 },
  enableHover = false,
}: AnimatedBackgroundProps) {
  const [activeId, setActiveId] = useState<string | null>(value ?? defaultValue ?? null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const uniqueId = useId();

  useEffect(() => {
    if (value !== undefined) {
      setActiveId(value);
    }
  }, [value]);

  const handleSetActiveId = (id: string | null) => {
    setActiveId(id);
    onValueChange?.(id);
  };

  const currentHighlight = enableHover ? (hoveredId ?? activeId) : activeId;

  return (
    <div className="relative inline-flex items-center">
      {Children.map(children, (child, index) => {
        if (!child) return null;
        const id = child.props['data-id'];
        const isSelected = activeId === id;
        const isHovered = hoveredId === id;

        const sharedProps = {
          onClick: () => {
            child.props.onClick?.();
            handleSetActiveId(id);
          },
          ...(enableHover && {
            onMouseEnter: (e: any) => {
              child.props.onMouseEnter?.(e);
              setHoveredId(id);
            },
            onMouseLeave: (e: any) => {
              child.props.onMouseLeave?.(e);
              setHoveredId(null);
            },
          }),
          onFocus: (e: any) => {
            child.props.onFocus?.(e);
            if (enableHover) setHoveredId(id);
          },
          onBlur: (e: any) => {
            child.props.onBlur?.(e);
            if (enableHover) setHoveredId(null);
          },
        };

        return cloneElement(
          child,
          {
            key: id || index,
            ...sharedProps,
            className: cn(
              'relative inline-flex items-center justify-center z-10 select-none transition-colors duration-250',
              child.props.className
            ),
            'aria-selected': isSelected,
            'data-active': isSelected ? 'true' : 'false',
            'data-hovered': isHovered ? 'true' : 'false',
            'data-highlighted': isSelected ? 'true' : 'false',
          },
          <>
            <span className="relative z-10 w-full text-center pointer-events-none">
              {child.props.children}
            </span>
            {isSelected && (
              <motion.span
                layoutId={`background-${uniqueId}`}
                className={cn('absolute inset-0 z-0 rounded-md', className)}
                transition={transition}
                initial={false}
              />
            )}
          </>
        );
      })}
    </div>
  );
}
