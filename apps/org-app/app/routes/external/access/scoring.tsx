import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '@repo/ui/card';
import { Button } from '@repo/ui/button';
import { Badge } from '@repo/ui/badge';
import { Trophy, Swords, CheckCircle2 } from 'lucide-react';
import { ScoringInterface } from '~/features/event-execution/components/scoring/ScoringInterface';
import { useEventChronogram } from '~/features/event-execution/hooks/use-event-execution';
import type { FightChronogramItem } from '~/features/event-execution/domain/event-status';
import { toast } from 'sonner';

export default function ScoringPage() {
  const { eventId, token } = useParams<{ eventId: string; token: string }>();
  const [selectedFight, setSelectedFight] = useState<FightChronogramItem | null>(null);
  const [landscapeMode, setLandscapeMode] = useState(false);

  const { data: fights = [], isLoading } = useEventChronogram(eventId!);

  const scorableFights = fights.filter(
    (fight) => fight.status === 'ready' || fight.status === 'in_progress'
  );

  useEffect(() => {
    if (landscapeMode) {
      document.body.classList.add('scoring-landscape-mode');
    } else {
      document.body.classList.remove('scoring-landscape-mode');
    }

    return () => {
      document.body.classList.remove('scoring-landscape-mode');
    };
  }, [landscapeMode]);

  const handleFightSelect = (fight: FightChronogramItem) => {
    setSelectedFight(fight);
  };

  const handleBackToList = () => {
    setSelectedFight(null);
    setLandscapeMode(false);
  };

  const handleFightComplete = (result: any) => {
    toast.success('Fight result submitted!', {
      description: 'The fight has been scored and saved.',
    });

    handleBackToList();
  };

  if (selectedFight) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <ScoringInterface
          fight={selectedFight}
          onComplete={handleFightComplete}
          landscapeMode={landscapeMode}
          onToggleLandscape={() => setLandscapeMode(!landscapeMode)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Swords className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Pontue Lutas</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Selecione uma luta para pontuar
        </p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && scorableFights.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12 space-y-4"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Trophy className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="font-semibold text-lg">Nenhuma luta pronta</h3>
            <p className="text-sm text-muted-foreground">
              Não há nenhuma luta para pronta pontuar no momento.
            </p>
          </div>
        </motion.div>
      )}

      {!isLoading && scorableFights.length > 0 && (
        <div className="space-y-4">
          <AnimatePresence>
            {scorableFights.map((fight, index) => (
              <motion.div
                key={fight.fightId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="space-y-4">

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-bold text-primary">#{fight.order}</span>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {fight.modality.name} • {fight.weightClass.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {fight.rules.numberOfRounds}x{fight.rules.roundDuration} min •{' '}
                              {fight.rules.judgingSystem === 'cumulative'
                                ? 'Pontos Cumulativos'
                                : 'Dominância de Rounds'}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={fight.status === 'in_progress' ? 'default' : 'secondary'}
                          className="flex items-center gap-1"
                        >
                          {fight.status === 'in_progress' ? (
                            <>
                              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                              Em progresso
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Pronta
                            </>
                          )}
                        </Badge>
                      </div>

  
                      <div className="flex items-center justify-between">
                        <div className="flex-1 text-center">
                          <p className="font-semibold">{fight.fighterA.name}</p>
                          <p className="text-xs text-muted-foreground">
                            "{fight.fighterA.nickname}"
                          </p>
                        </div>
                        <div className="px-4">
                          <span className="text-sm font-bold text-muted-foreground">VS</span>
                        </div>
                        <div className="flex-1 text-center">
                          <p className="font-semibold">{fight.fighterB.name}</p>
                          <p className="text-xs text-muted-foreground">
                            "{fight.fighterB.nickname}"
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleFightSelect(fight)}
                        className="w-full gap-2"
                        size="lg"
                      >
                        <Swords className="w-4 h-4" />
                        {fight.status === 'in_progress' ? 'Continue Scoring' : 'Start Scoring'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
