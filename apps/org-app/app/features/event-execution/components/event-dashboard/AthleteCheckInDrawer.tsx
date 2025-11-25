import { Users, UserCheck, UserX, Search } from 'lucide-react';
import { Button } from '@repo/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/sheet';
import { Input } from '@repo/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs';
import { ScrollArea } from '@repo/ui/scroll-area';
import { AthleteCheckInStatus } from '../shared/AthleteCheckInStatus';
import type { FightChronogramItem } from '../../domain/event-status';
import { useState, useMemo } from 'react';

interface AthleteCheckInDrawerProps {
  fights: FightChronogramItem[];
}

interface Athlete {
  id: string;
  name: string;
  nickname: string;
  avatarUrl?: string;
  checkedInAt: Date | null;
  fightCount: number;
}

export function AthleteCheckInDrawer({ fights }: AthleteCheckInDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique athletes from fights
  const athletes = useMemo(() => {
    const athleteMap = new Map<string, Athlete>();

    fights.forEach((fight) => {
      // Process Fighter A
      if (!athleteMap.has(fight.fighterA.athleteId)) {
        athleteMap.set(fight.fighterA.athleteId, {
          id: fight.fighterA.athleteId,
          name: fight.fighterA.name,
          nickname: fight.fighterA.nickname,
          avatarUrl: fight.fighterA.avatarUrl,
          checkedInAt: fight.fighterA.checkedInAt,
          fightCount: 1,
        });
      } else {
        const athlete = athleteMap.get(fight.fighterA.athleteId)!;
        athlete.fightCount += 1;
      }

      // Process Fighter B
      if (!athleteMap.has(fight.fighterB.athleteId)) {
        athleteMap.set(fight.fighterB.athleteId, {
          id: fight.fighterB.athleteId,
          name: fight.fighterB.name,
          nickname: fight.fighterB.nickname,
          avatarUrl: fight.fighterB.avatarUrl,
          checkedInAt: fight.fighterB.checkedInAt,
          fightCount: 1,
        });
      } else {
        const athlete = athleteMap.get(fight.fighterB.athleteId)!;
        athlete.fightCount += 1;
      }
    });

    return Array.from(athleteMap.values());
  }, [fights]);

  // Filter athletes by search query
  const filteredAthletes = useMemo(() => {
    if (!searchQuery.trim()) return athletes;

    const query = searchQuery.toLowerCase();
    return athletes.filter(
      (athlete) =>
        athlete.name.toLowerCase().includes(query) ||
        athlete.nickname.toLowerCase().includes(query)
    );
  }, [athletes, searchQuery]);

  const checkedInAthletes = filteredAthletes.filter((a) => a.checkedInAt);
  const pendingAthletes = filteredAthletes.filter((a) => !a.checkedInAt);

  const totalCheckedIn = athletes.filter((a) => a.checkedInAt).length;
  const totalPending = athletes.filter((a) => !a.checkedInAt).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="w-4 h-4 mr-2" />
          Atletas
          <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-500 text-xs font-semibold">
            {totalCheckedIn}/{athletes.length}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg ">
        <SheetHeader>
          <SheetTitle>Atletas do Evento</SheetTitle>
          <SheetDescription>
            Acompanhe o check-in dos atletas participantes
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          <header className='w-full px-4'>
            <Input
              placeholder="Buscar atleta..."
              icon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </header>
    

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid-cols-3">
              <TabsTrigger value="all">
                Todos ({filteredAthletes.length})
              </TabsTrigger>
              <TabsTrigger value="checked-in">
                <UserCheck className="w-3 h-3 mr-1" />
                {checkedInAthletes.length}
              </TabsTrigger>
              <TabsTrigger value="pending">
                <UserX className="w-3 h-3 mr-1" />
                {pendingAthletes.length}
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-280px)] mt-4 px-4">
              <TabsContent value="all" className="mt-0">
                <AthleteList athletes={filteredAthletes} />
              </TabsContent>

              <TabsContent value="checked-in" className="mt-0">
                <AthleteList athletes={checkedInAthletes} />
              </TabsContent>

              <TabsContent value="pending" className="mt-0">
                <AthleteList athletes={pendingAthletes} />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function AthleteList({ athletes }: { athletes: Athlete[] }) {
  if (athletes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">Nenhum atleta encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {athletes.map((athlete) => (
        <div
          key={athlete.id}
          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <AthleteCheckInStatus
            athlete={athlete}
            size="md"
            showName={true}
          />
          <div className="text-right">
            <p className="text-sm font-semibold text-muted-foreground">
              {athlete.fightCount} {athlete.fightCount === 1 ? 'luta' : 'lutas'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
