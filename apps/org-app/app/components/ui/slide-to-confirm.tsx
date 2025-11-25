import { useState, useRef, useEffect } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { cn } from '@repo/ui/cn';

interface SlideToConfirmProps {
  onConfirm: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  text?: string;
  confirmText?: string;
  className?: string;
}

export function SlideToConfirm({
  onConfirm,
  isLoading = false,
  disabled = false,
  text = 'Deslize para confirmar',
  confirmText = 'Confirmado!',
  className,
}: SlideToConfirmProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const background = useTransform(
    x,
    [0, 100],
    ['rgba(var(--primary) / 0.1)', 'rgba(var(--primary) / 0.3)']
  );

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const threshold = containerWidth * 0.7; // 70% of container width

    if (info.offset.x >= threshold && !disabled && !isLoading) {
      // Slide to end
      animate(x, containerWidth - 60, { duration: 0.2 });
      setIsConfirmed(true);

      // Trigger confirmation after animation
      setTimeout(() => {
        onConfirm();
      }, 200);
    } else {
      // Slide back to start
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
  };

  useEffect(() => {
    if (!isLoading && isConfirmed) {
      // Reset after confirmation
      const timer = setTimeout(() => {
        animate(x, 0, { duration: 0.3 });
        setIsConfirmed(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isConfirmed, x]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative h-16 rounded-full border-2 overflow-hidden select-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing',
        isConfirmed ? 'border-green-500' : 'border-primary',
        className
      )}
      style={{ background: background as any }}
    >
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: isConfirmed ? 0 : 1 }}
          className="text-sm font-semibold text-muted-foreground"
        >
          {text}
        </motion.span>
      </div>

      {/* Confirmed Text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isConfirmed ? 1 : 0, scale: isConfirmed ? 1 : 0.8 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="flex items-center gap-2 text-green-600">
          <Check className="w-5 h-5" />
          <span className="text-sm font-bold">{confirmText}</span>
        </div>
      </motion.div>

      {/* Draggable Button */}
      <motion.div
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={cn(
          'absolute top-1 left-1 h-[calc(100%-8px)] w-14 rounded-full flex items-center justify-center shadow-lg transition-colors',
          isConfirmed ? 'bg-green-500' : 'bg-primary',
          disabled && 'cursor-not-allowed'
        )}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        <motion.div
          animate={{ rotate: isConfirmed ? 0 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isConfirmed ? (
            <Check className="w-6 h-6 text-white" />
          ) : (
            <ChevronRight className="w-6 h-6 text-white" />
          )}
        </motion.div>
      </motion.div>

      {/* Loading Spinner Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
