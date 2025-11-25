import { useState } from 'react';
import { Calendar, MapPin, Clock, Share2, CheckCircle2, MoreVertical } from 'lucide-react';
import { Button } from '@repo/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu';
import { Badge } from '@repo/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AthleteCheckInDrawer } from './AthleteCheckInDrawer';
import { TeamAccessButton } from '../access-control/TeamAccessButton';
import { TeamAccessSheet } from '../access-control/TeamAccessSheet';
import type { FightChronogramItem } from '../../domain/event-status';

interface EventHeaderProps {
  eventId: string;
  eventName: string;
  eventDate: Date;
  venue: string;
  city: string;
  state: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  fights: FightChronogramItem[];
  onFinishEvent: () => void;
  onSharePublicLink: () => void;
  canFinishEvent: boolean;
}

export function EventHeader({
  eventId,
  eventName,
  eventDate,
  venue,
  city,
  state,
  status,
  fights,
  onFinishEvent,
  onSharePublicLink,
  canFinishEvent,
}: EventHeaderProps) {
  const [teamAccessOpen, setTeamAccessOpen] = useState(false);

  const statusConfig = {
    upcoming: {
      label: 'Aguardando',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-500',
    },
    in_progress: {
      label: 'Em Andamento',
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-500',
    },
    completed: {
      label: 'Finalizado',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-500',
    },
    cancelled: {
      label: 'Cancelado',
      color: 'bg-red-500/10 text-red-600 dark:text-red-500',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="space-y-4">
      {/* Title and Actions */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{eventName}</h1>
            <Badge className={config.color}>{config.label}</Badge>
          </div>
          <p className="text-muted-foreground">
            Gerencie o cronograma de lutas, check-in de atletas e acompanhe o progresso do evento.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AthleteCheckInDrawer fights={fights} />

          <TeamAccessButton eventId={eventId} onClick={() => setTeamAccessOpen(true)} />

          <Button variant="outline" size="sm" onClick={onSharePublicLink}>
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSharePublicLink}>
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar Link Público
              </DropdownMenuItem>

              {canFinishEvent && status !== 'completed' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onFinishEvent}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Finalizar Evento
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Event Details */}
      <div className="flex items-center gap-6 flex-wrap text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{format(eventDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{format(eventDate, 'HH:mm', { locale: ptBR })}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>
            {venue} • {city}, {state}
          </span>
        </div>
      </div>

      {/* Team Access Sheet */}
      <TeamAccessSheet
        eventId={eventId}
        open={teamAccessOpen}
        onOpenChange={setTeamAccessOpen}
      />
    </div>
  );
}
