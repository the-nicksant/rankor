import { useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '@repo/ui/card';
import { Button } from '@repo/ui/button';
import { Badge } from '@repo/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@repo/ui/tabs';
import {
  Calendar,
  Filter,
  MapPin,
  List,
  Grid3x3,
  Trophy,
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  AlertCircle,
} from 'lucide-react';
import { FightListItem } from '~/features/event-execution/components/chronogram/FightListItem';
import { useEventChronogram } from '~/features/event-execution/hooks/use-event-execution';
import type { FightChronogramItem, FightStatus } from '~/features/event-execution/domain/event-status';

type FilterStatus = 'all' | FightStatus;
type GroupBy = 'none' | 'ring' | 'status';

const statusOptions: { value: FilterStatus; label: string; icon: any; color: string }[] = [
  { value: 'all', label: 'Todas', icon: List, color: 'text-foreground' },
  { value: 'pending', label: 'Pendentes', icon: Circle, color: 'text-yellow-600' },
  { value: 'ready', label: 'Prontas', icon: CheckCircle2, color: 'text-green-600' },
  { value: 'upcoming', label: 'Próximas', icon: Clock, color: 'text-blue-600' },
  { value: 'in_progress', label: 'Em Andamento', icon: PlayCircle, color: 'text-orange-600' },
  { value: 'completed', label: 'Concluídas', icon: Trophy, color: 'text-purple-600' },
  { value: 'cancelled', label: 'Canceladas', icon: AlertCircle, color: 'text-red-600' },
];

export default function ChronogramPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');

  const { data: fights = [], isLoading } = useEventChronogram(eventId!);

  // Filter fights
  const filteredFights = useMemo(() => {
    if (filterStatus === 'all') return fights;
    return fights.filter((fight) => fight.status === filterStatus);
  }, [fights, filterStatus]);

  // Group fights
  const groupedFights = useMemo(() => {
    if (groupBy === 'none') {
      return { ungrouped: filteredFights };
    }

    if (groupBy === 'ring') {
      const groups: Record<string, FightChronogramItem[]> = {};
      filteredFights.forEach((fight) => {
        const ring = fight.ring || 'Sem Ring';
        if (!groups[ring]) groups[ring] = [];
        groups[ring].push(fight);
      });
      return groups;
    }

    if (groupBy === 'status') {
      const groups: Record<string, FightChronogramItem[]> = {};
      filteredFights.forEach((fight) => {
        const statusLabel = statusOptions.find((s) => s.value === fight.status)?.label || fight.status;
        if (!groups[statusLabel]) groups[statusLabel] = [];
        groups[statusLabel].push(fight);
      });
      return groups;
    }

    return { ungrouped: filteredFights };
  }, [filteredFights, groupBy]);

  // Stats
  const stats = useMemo(() => {
    const total = fights.length;
    const pending = fights.filter((f) => f.status === 'pending').length;
    const ready = fights.filter((f) => f.status === 'ready').length;
    const inProgress = fights.filter((f) => f.status === 'in_progress').length;
    const completed = fights.filter((f) => f.status === 'completed').length;

    return { total, pending, ready, inProgress, completed };
  }, [fights]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Cronograma</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Acompanhe todas as lutas do evento em tempo real
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground mb-1">Total</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground mb-1">Pendentes</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground mb-1">Prontas</div>
            <div className="text-2xl font-bold text-green-600">{stats.ready}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground mb-1">Em Andamento</div>
            <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground mb-1">Concluídas</div>
            <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col gap-3">
        {/* Status Filter */}
        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as FilterStatus)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${option.color}`} />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Group By */}
        <Tabs value={groupBy} onValueChange={(value) => setGroupBy(value as GroupBy)} className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="none" className="flex items-center gap-1.5 flex-1 w-full">
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Ordem</span>
            </TabsTrigger>
            <TabsTrigger value="ring" className="flex items-center gap-1.5 w-full">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Ring</span>
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-1.5 w-full">
              <Grid3x3 className="w-4 h-4" />
              <span className="hidden sm:inline">Status</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Fights List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredFights.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12 space-y-4"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Trophy className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="font-semibold text-lg">Nenhuma luta encontrada</h3>
            <p className="text-sm text-muted-foreground">
              {filterStatus === 'all'
                ? 'Não há lutas cadastradas neste evento'
                : `Não há lutas com status "${statusOptions.find((s) => s.value === filterStatus)?.label}"`}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFights).map(([groupName, groupFights]) => (
            <div key={groupName} className="space-y-3">
              {/* Group Header */}
              {groupBy !== 'none' && (
                <div className="flex items-center gap-2 px-1">
                  {groupBy === 'ring' && <MapPin className="w-4 h-4 text-muted-foreground" />}
                  {groupBy === 'status' && <Filter className="w-4 h-4 text-muted-foreground" />}
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    {groupName}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {groupFights.length}
                  </Badge>
                </div>
              )}

              {/* Fights in Group */}
              <div className="space-y-3">
                <AnimatePresence>
                  {groupFights.map((fight, index) => (
                    <FightListItem key={fight.fightId} fight={fight} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
