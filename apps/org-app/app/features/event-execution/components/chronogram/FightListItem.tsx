import { motion } from 'motion/react';
import { Card, CardContent } from '@repo/ui/card';
import { Badge } from '@repo/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar';
import { Trophy, Clock, MapPin, User, CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import type { FightChronogramItem } from '../../domain/event-status';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@repo/ui/cn';

interface FightListItemProps {
  fight: FightChronogramItem;
  index: number;
}

export function FightListItem({ fight, index }: FightListItemProps) {
  const statusConfig = {
    pending: {
      label: 'Pendente',
      color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500',
      icon: Circle,
      borderColor: 'border-yellow-500/20',
    },
    ready: {
      label: 'Pronta',
      color: 'bg-green-500/10 text-green-600 dark:text-green-500',
      icon: CheckCircle2,
      borderColor: 'border-green-500/20',
    },
    upcoming: {
      label: 'Próxima',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-500',
      icon: Clock,
      borderColor: 'border-blue-500/20',
    },
    in_progress: {
      label: 'Em Andamento',
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-500',
      icon: PlayCircle,
      borderColor: 'border-orange-500/20',
    },
    completed: {
      label: 'Concluída',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-500',
      icon: Trophy,
      borderColor: 'border-purple-500/20',
    },
    cancelled: {
      label: 'Cancelada',
      color: 'bg-red-500/10 text-red-600 dark:text-red-500',
      icon: Circle,
      borderColor: 'border-red-500/20',
    },
  };

  const config = statusConfig[fight.status];
  const StatusIcon = config.icon;

  const bothCheckedIn = fight.fighterA.checkedInAt && fight.fighterB.checkedInAt;
  const isCompleted = fight.status === 'completed';
  const winnerIsA = fight.result?.winner === 'A';
  const winnerIsB = fight.result?.winner === 'B';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card className={cn('hover:shadow-md transition-all', config.borderColor, 'border-2')}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Fight Number */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
                <span className="text-lg font-bold text-primary">#{fight.order}</span>
              </div>

              {/* Ring & Time */}
              <div className="flex flex-col gap-1">
                {fight.ring && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="font-semibold">{fight.ring}</span>
                  </div>
                )}
                {fight.actualStartTime && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>
                      {formatDistanceToNow(fight.actualStartTime, { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <Badge className={cn('flex items-center gap-1.5', config.color)}>
              <StatusIcon className="w-3.5 h-3.5" />
              {config.label}
            </Badge>
          </div>

          {/* Fighters */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center mb-4">
            {/* Fighter A */}
            <div className={cn(
              'flex items-center gap-2',
              isCompleted && !winnerIsA && 'opacity-50'
            )}>
              <div className="relative">
                <Avatar className="size-12 border-2">
                  <AvatarImage src={fight.fighterA.avatarUrl} />
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                {fight.fighterA.checkedInAt && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-sm truncate">{fight.fighterA.name}</p>
                  {winnerIsA && <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground truncate">"{fight.fighterA.nickname}"</p>
              </div>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center gap-1 px-2">
              <span className="text-xs font-bold text-muted-foreground">VS</span>
              {!bothCheckedIn && (
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              )}
            </div>

            {/* Fighter B */}
            <div className={cn(
              'flex items-center gap-2 justify-end',
              isCompleted && !winnerIsB && 'opacity-50'
            )}>
              <div className="flex-1 min-w-0 text-right">
                <div className="flex items-center gap-1 justify-end">
                  {winnerIsB && <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                  <p className="font-semibold text-sm truncate">{fight.fighterB.name}</p>
                </div>
                <p className="text-xs text-muted-foreground truncate">"{fight.fighterB.nickname}"</p>
              </div>
              <div className="relative">
                <Avatar className="size-12 border-2">
                  <AvatarImage src={fight.fighterB.avatarUrl} />
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                {fight.fighterB.checkedInAt && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fight Info */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">{fight.modality.name}</span>
              <span>•</span>
              <span>{fight.weightClass.title}</span>
              <span>•</span>
              <span>{fight.rules.numberOfRounds}x{fight.rules.roundDuration} min</span>
            </div>

            {/* Result */}
            {fight.result && (
              <Badge variant="secondary" className="text-xs">
                {fight.result.method === 'knockout' && 'KO'}
                {fight.result.method === 'submission' && 'Finalização'}
                {fight.result.method === 'decision' && 'Decisão'}
                {fight.result.method === 'technical_knockout' && 'TKO'}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
