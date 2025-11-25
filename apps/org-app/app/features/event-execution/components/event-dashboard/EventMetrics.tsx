import { Users, CheckCircle2, Swords, PlayCircle, TrophyIcon, AlertCircle } from 'lucide-react';
import type { EventExecutionMetrics } from '../../domain/event-status';

interface EventMetricsProps {
  metrics: EventExecutionMetrics;
  isLoading?: boolean;
}

export function EventMetrics({ metrics, isLoading }: EventMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border bg-card animate-pulse">
            <div className="h-4 bg-muted rounded w-20 mb-2" />
            <div className="h-8 bg-muted rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Atletas Check-in',
      value: `${metrics.checkedInAthletes}/${metrics.totalAthletes}`,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      percentage: Math.round((metrics.checkedInAthletes / metrics.totalAthletes) * 100),
    },
    {
      title: 'Lutas Prontas',
      value: metrics.readyFights.toString(),
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      percentage: Math.round((metrics.readyFights / metrics.totalFights) * 100),
    },
    {
      title: 'Em Progresso',
      value: metrics.inProgressFights.toString(),
      icon: PlayCircle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      percentage: Math.round((metrics.inProgressFights / metrics.totalFights) * 100),
    },
    {
      title: 'Concluídas',
      value: metrics.completedFights.toString(),
      icon: TrophyIcon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      percentage: Math.round((metrics.completedFights / metrics.totalFights) * 100),
    },
    {
      title: 'Pendentes',
      value: metrics.pendingFights.toString(),
      icon: AlertCircle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      percentage: Math.round((metrics.pendingFights / metrics.totalFights) * 100),
    },
    {
      title: 'Total de Lutas',
      value: metrics.totalFights.toString(),
      icon: Swords,
      color: 'text-rankor',
      bgColor: 'bg-rankor/10',
      percentage: 100,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            {card.percentage < 100 && (
              <span className="text-xs text-muted-foreground">{card.percentage}%</span>
            )}
          </div>

          <div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.title}</p>
          </div>

          {/* Progress bar for partial metrics */}
          {card.percentage < 100 && (
            <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${card.bgColor} transition-all duration-500`}
                style={{ width: `${card.percentage}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
