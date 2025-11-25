import { motion } from 'motion/react';
import { cn } from '@repo/ui/cn';
import type { ActionItem } from '../../domain/scoring';

interface ActionButtonProps {
  action: ActionItem;
  onSelect: (actionKey: string) => void;
  disabled?: boolean;
}

export function ActionButton({ action, onSelect, disabled = false }: ActionButtonProps) {
  return (
    <motion.button
      onClick={() => !disabled && onSelect(action.key)}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center justify-center',
        'px-4 py-3 rounded-lg',
        'border-2 border-border',
        'bg-background hover:bg-muted',
        'transition-all duration-150',
        'text-sm font-semibold',
        'min-h-[70px]',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'hover:border-primary hover:shadow-md active:scale-95'
      )}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      <span className="text-center leading-tight mb-1">{action.label}</span>
      <span className="text-xs font-bold text-primary">+{action.points} pts</span>
    </motion.button>
  );
}
