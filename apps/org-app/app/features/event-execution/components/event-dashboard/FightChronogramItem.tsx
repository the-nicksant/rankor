import { useState, useEffect, useRef } from 'react';
import { MoreVertical, GripVertical, Eye, Settings, XCircle, PlayCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@repo/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import type { FightChronogramItem as FightItem } from '../../domain/event-status';
import { AthleteCheckInStatus } from '../shared/AthleteCheckInStatus';
import { cn } from '@repo/ui/cn';

interface FightChronogramItemProps {
  fight: FightItem;
  onViewScoring: () => void;
  onViewConfig: () => void;
  onCancel: () => void;
  onUpdateStatus: (status: string) => void;
}

export function FightChronogramItem({
  fight,
  onViewScoring,
  onViewConfig,
  onCancel,
  onUpdateStatus,
}: FightChronogramItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const element = ref.current;
    const dragHandle = dragHandleRef.current;

    if (!element || !dragHandle) return;

    return combine(
      draggable({
        element: dragHandle,
        getInitialData: () => ({ fightId: fight.fightId, order: fight.order }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        onDragEnter: () => setIsOver(true),
        onDragLeave: () => setIsOver(false),
        onDrop: () => setIsOver(false),
        getData: () => ({ fightId: fight.fightId, order: fight.order }),
      })
    );
  }, [fight.fightId, fight.order]);

  const statusConfig = {
    pending: {
      label: 'Pendente',
      color: 'text-yellow-600 dark:text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      icon: null,
    },
    ready: {
      label: 'Pronta',
      color: 'text-green-600 dark:text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      icon: CheckCircle2,
    },
    upcoming: {
      label: 'Próxima',
      color: 'text-blue-600 dark:text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      icon: null,
    },
    in_progress: {
      label: 'Em Progresso',
      color: 'text-orange-600 dark:text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      icon: PlayCircle,
    },
    completed: {
      label: 'Concluída',
      color: 'text-purple-600 dark:text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      icon: CheckCircle2,
    },
    cancelled: {
      label: 'Cancelada',
      color: 'text-red-600 dark:text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      icon: XCircle,
    },
  };

  const config = statusConfig[fight.status];
  const StatusIcon = config.icon;

  const bothCheckedIn = fight.fighterA.checkedInAt && fight.fighterB.checkedInAt;

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-card transition-all',
        isDragging && 'opacity-50',
        isOver && 'border-rankor',
        config.borderColor
      )}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div
            ref={dragHandleRef}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
          >
            <GripVertical className="w-5 h-5" />
          </div>

          {/* Fight Number */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
            <span className="text-sm font-bold">#{fight.order}</span>
          </div>

          {/* Fight Info */}
          <div className="flex-1 min-w-0">
            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-2">
              <div className={cn('px-2 py-1 rounded text-xs font-semibold flex items-center gap-1', config.bgColor, config.color)}>
                {StatusIcon && <StatusIcon className="w-3 h-3" />}
                {config.label}
              </div>
              {fight.ring && (
                <div className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                  {fight.ring}
                </div>
              )}
              {!bothCheckedIn && (
                <div className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
                  ⚠ Aguardando check-in
                </div>
              )}
            </div>

            {/* Fighters */}
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2 flex-1">
                <AthleteCheckInStatus athlete={fight.fighterA} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {fight.fighterA.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    "{fight.fighterA.nickname}"
                  </p>
                </div>
              </div>

              <div className="text-muted-foreground font-bold">VS</div>

              <div className="flex items-center gap-2 flex-1 justify-end">
                <div className="min-w-0 text-right">
                  <p className="text-sm font-semibold truncate">
                    {fight.fighterB.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    "{fight.fighterB.nickname}"
                  </p>
                </div>
                <AthleteCheckInStatus athlete={fight.fighterB} size="sm" />
              </div>
            </div>

            {/* Fight Details */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{fight.modality.name}</span>
              <span>•</span>
              <span>{fight.weightClass.title}</span>
              <span>•</span>
              <span>
                {fight.rules.numberOfRounds}x{fight.rules.roundDuration}min
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {fight.status === 'in_progress' && (
              <Button onClick={onViewScoring} size="sm" variant="default">
                <Eye className="w-4 h-4 mr-2" />
                Ver Pontuação
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onViewConfig}>
                  <Settings className="w-4 h-4 mr-2" />
                  Ver Configuração
                </DropdownMenuItem>

                {fight.status === 'in_progress' && (
                  <DropdownMenuItem onClick={onViewScoring}>
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Pontuação
                  </DropdownMenuItem>
                )}

                {(fight.status === 'ready' || fight.status === 'upcoming') && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onUpdateStatus('upcoming')}>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Marcar como Próxima
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateStatus('in_progress')}>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Iniciar Luta
                    </DropdownMenuItem>
                  </>
                )}

                {fight.status !== 'completed' && fight.status !== 'cancelled' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onCancel} className="text-destructive">
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancelar Luta
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
