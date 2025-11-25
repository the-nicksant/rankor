import { useState } from 'react';
import { useEventChronogram, useEventDetails, useFinishEvent } from '../../hooks/use-event-execution';
import type { FightChronogramItem as FightItem } from '../../domain/event-status';
import { EventHeader } from './EventHeader';
import { EventMetrics } from './EventMetrics';
import { FightChronogram } from './FightChronogram';
import { CompletedFightsSection } from './CompletedFightsSection';
import { FightConfigViewer } from '~/shared/components/fight-config-viewer';
import { useUpdateFightStatus, useCancelFight } from '../../hooks/use-event-execution';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { calculateMetrics } from '../../domain/event-status';

interface EventExecutionDashboardProps {
  eventId: string;
}

export function EventExecutionDashboard({ eventId }: EventExecutionDashboardProps) {
  const [selectedFight, setSelectedFight] = useState<FightItem | null>(null);

  // Fetch event details
  const {
    data: eventDetails,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useEventDetails(eventId);

  // Fetch chronogram data
  const {
    data: fights = [],
    isLoading: isLoadingFights,
    error: fightsError,
  } = useEventChronogram(eventId);

  // Mutations
  const updateStatusMutation = useUpdateFightStatus();
  const cancelFightMutation = useCancelFight();
  const finishEventMutation = useFinishEvent();

  // Calculate metrics from fights
  const metrics = calculateMetrics(fights);

  // Filter fights for active chronogram (exclude completed)
  const activeFights = fights.filter((f) => f.status !== 'completed');

  // Check if event can be finished
  const canFinishEvent =
    fights.length > 0 && fights.every((f) => f.status === 'completed' || f.status === 'cancelled');

  // Handlers
  const handleViewScoring = (fightId: string) => {
    // TODO: Navigate to scoring page or open scoring modal
    console.log('View scoring for fight:', fightId);
    toast.info('Pontuação', {
      description: 'Funcionalidade de pontuação será implementada em breve.',
    });
  };

  const handleViewConfig = (fight: FightItem) => {
    setSelectedFight(fight);
  };

  const handleCloseConfig = () => {
    setSelectedFight(null);
  };

  const handleCancel = (fightId: string) => {
    cancelFightMutation.mutate(
      { eventId, fightId },
      {
        onSuccess: () => {
          toast('Luta cancelada', {
            description: 'A luta foi cancelada com sucesso.',
          });
        },
        onError: (error) => {
          toast.error('Erro ao cancelar luta', {
            description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
          });
        },
      }
    );
  };

  const handleUpdateStatus = (fightId: string, status: string) => {
    updateStatusMutation.mutate(
      { eventId, fightId, status },
      {
        onSuccess: () => {
          const statusLabels: Record<string, string> = {
            upcoming: 'Próxima',
            in_progress: 'Em Progresso',
            ready: 'Pronta',
            pending: 'Pendente',
            completed: 'Concluída',
          };

          toast('Status atualizado', {
            description: `A luta foi marcada como ${statusLabels[status] || status}.`,
          });
        },
        onError: (error) => {
          toast.error('Erro ao atualizar status', {
            description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
          });
        },
      }
    );
  };

  const handleFinishEvent = () => {
    if (!canFinishEvent) {
      toast.error('Não é possível finalizar', {
        description: 'Todas as lutas devem estar concluídas ou canceladas.',
      });
      return;
    }

    finishEventMutation.mutate(eventId, {
      onSuccess: () => {
        toast('Evento finalizado', {
          description: 'O evento foi finalizado com sucesso.',
        });
      },
      onError: (error) => {
        toast.error('Erro ao finalizar evento', {
          description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
        });
      },
    });
  };

  const handleSharePublicLink = () => {
    const publicUrl = `${window.location.origin}/public/events/${eventId}`;

    navigator.clipboard
      .writeText(publicUrl)
      .then(() => {
        toast('Link copiado!', {
          description: 'O link público do evento foi copiado para a área de transferência.',
        });
      })
      .catch(() => {
        toast.error('Erro ao copiar link', {
          description: 'Não foi possível copiar o link. Tente novamente.',
        });
      });
  };

  // Error state
  if (fightsError || detailsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-destructive">
          <p className="text-lg font-semibold">Erro ao carregar evento</p>
          <p className="text-sm text-muted-foreground">
            {(fightsError || detailsError) instanceof Error
              ? (fightsError || detailsError)?.message
              : 'Ocorreu um erro inesperado'}
          </p>
        </div>
      </div>
    );
  }

  // Initial loading state
  if ((isLoadingFights || isLoadingDetails) && (!fights.length || !eventDetails)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-rankor" />
        <p className="text-sm text-muted-foreground">Carregando evento...</p>
      </div>
    );
  }

  // No event details
  if (!eventDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-lg font-semibold">Evento não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Event Details */}
      <EventHeader
        eventId={eventId}
        eventName={eventDetails.name}
        eventDate={eventDetails.date}
        venue={eventDetails.venue}
        city={eventDetails.city}
        state={eventDetails.state}
        status={eventDetails.status}
        fights={fights}
        onFinishEvent={handleFinishEvent}
        onSharePublicLink={handleSharePublicLink}
        canFinishEvent={canFinishEvent}
      />

      {/* Metrics */}
      <EventMetrics metrics={metrics} isLoading={isLoadingFights} />

      {/* Completed Fights Section */}
      <CompletedFightsSection fights={fights} onViewDetails={handleViewScoring} />

      {/* Active Chronogram */}
      <FightChronogram
        fights={activeFights}
        onViewScoring={handleViewScoring}
        onViewConfig={handleViewConfig}
        onCancel={handleCancel}
        onUpdateStatus={handleUpdateStatus}
        isLoading={isLoadingFights}
      />

      {/* Fight Config Modal */}
      {selectedFight && (
        <FightConfigViewer
          config={{
            modality: selectedFight.modality,
            weightClass: selectedFight.weightClass,
            experienceLevel: selectedFight.experienceLevel,
            rules: selectedFight.rules,
          }}
          open={true}
          onClose={handleCloseConfig}
        />
      )}
    </div>
  );
}
