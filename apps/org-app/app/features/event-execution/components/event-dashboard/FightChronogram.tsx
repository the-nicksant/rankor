import { useState } from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@repo/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu';
import type { FightChronogramItem as FightItem, FightStatus } from '../../domain/event-status';
import { FightChronogramItem } from './FightChronogramItem';

interface FightChronogramProps {
  fights: FightItem[];
  onViewScoring: (fightId: string) => void;
  onViewConfig: (fight: FightItem) => void;
  onCancel: (fightId: string) => void;
  onUpdateStatus: (fightId: string, status: string) => void;
  isLoading?: boolean;
}

type FilterOption = FightStatus | 'all';

export function FightChronogram({
  fights,
  onViewScoring,
  onViewConfig,
  onCancel,
  onUpdateStatus,
  isLoading,
}: FightChronogramProps) {
  const [selectedFilters, setSelectedFilters] = useState<Set<FilterOption>>(new Set(['all']));
  const [groupByRing, setGroupByRing] = useState(false);

  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'in_progress', label: 'Em Progresso' },
    { value: 'upcoming', label: 'Próximas' },
    { value: 'ready', label: 'Prontas' },
    { value: 'pending', label: 'Pendentes' },
    { value: 'completed', label: 'Concluídas' },
    { value: 'cancelled', label: 'Canceladas' },
  ];

  const toggleFilter = (filter: FilterOption) => {
    const newFilters = new Set(selectedFilters);

    if (filter === 'all') {
      newFilters.clear();
      newFilters.add('all');
    } else {
      newFilters.delete('all');
      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
      }

      if (newFilters.size === 0) {
        newFilters.add('all');
      }
    }

    setSelectedFilters(newFilters);
  };

  const filteredFights = fights.filter((fight) => {
    if (selectedFilters.has('all')) return true;
    return selectedFilters.has(fight.status);
  });

  const groupedFights = groupByRing
    ? filteredFights.reduce((acc, fight) => {
        const ring = fight.ring || 'Sem Ring';
        if (!acc[ring]) acc[ring] = [];
        acc[ring].push(fight);
        return acc;
      }, {} as Record<string, FightItem[]>)
    : { 'Todas': filteredFights };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border bg-card animate-pulse">
            <div className="h-20 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold">
          Cronograma de Lutas ({filteredFights.length})
        </h2>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setGroupByRing(!groupByRing)}
          >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            {groupByRing ? 'Agrupar: Ring' : 'Agrupar: Nenhum'}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                {!selectedFilters.has('all') && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-rankor text-white text-xs">
                    {selectedFilters.size}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Status da Luta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filterOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={selectedFilters.has(option.value)}
                  onCheckedChange={() => toggleFilter(option.value)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Fight List */}
      {filteredFights.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Nenhuma luta encontrada com os filtros selecionados</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFights).map(([group, groupFights]) => (
            <div key={group} className="space-y-3">
              {groupByRing && (
                <h3 className="text-sm font-semibold text-muted-foreground px-2">
                  {group} ({groupFights.length})
                </h3>
              )}

              <div className="space-y-3">
                {groupFights.map((fight) => (
                  <FightChronogramItem
                    key={fight.fightId}
                    fight={fight}
                    onViewScoring={() => onViewScoring(fight.fightId)}
                    onViewConfig={() => onViewConfig(fight)}
                    onCancel={() => onCancel(fight.fightId)}
                    onUpdateStatus={(status) => onUpdateStatus(fight.fightId, status)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
