import { motion } from 'motion/react';
import { cn } from '@repo/ui/cn';
import type { ActionGroup } from '../../domain/scoring';
import { ActionButton } from './ActionButton';

interface ActionButtonGroupProps {
  group: ActionGroup;
  onActionSelect: (actionKey: string) => void;
  disabled?: boolean;
}

export function ActionButtonGroup({ group, onActionSelect, disabled = false }: ActionButtonGroupProps) {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Group Header */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-lg">{group.icon}</span>
        <span className="text-sm font-semibold text-muted-foreground">{group.label}</span>
      </div>

      {/* Action Buttons Grid */}
      <div className={cn(
        'flex gap-2 flex-wrap'
      )}>
        {group.actions.map((action, index) => (
          <motion.div
            key={action.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <ActionButton
              action={action}
              onSelect={onActionSelect}
              disabled={disabled}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
