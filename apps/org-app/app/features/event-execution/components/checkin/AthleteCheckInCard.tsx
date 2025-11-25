import { motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar';
import { Badge } from '@repo/ui/badge';
import { Card, CardContent } from '@repo/ui/card';
import { User, Swords, Weight, Trophy } from 'lucide-react';
import type { FightChronogramItem } from '../../domain/event-status';

interface AthleteCheckInCardProps {
  athlete: {
    athleteId: string;
    name: string;
    nickname: string;
    avatarUrl?: string;
  };
  fight: FightChronogramItem;
  isOpponent?: boolean;
}

export function AthleteCheckInCard({ athlete, fight, isOpponent }: AthleteCheckInCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, type: 'spring' }}
    >
      <Card className="border-2 overflow-hidden">
        <CardContent className="p-6">
          {/* Athlete Info */}
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Avatar with Ring Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(var(--primary) / 0.4)',
                    '0 0 0 20px rgba(var(--primary) / 0)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
              />
              <Avatar className="w-32 h-32 border-4 border-primary">
                <AvatarImage src={athlete.avatarUrl} alt={athlete.name} />
                <AvatarFallback className="text-4xl">
                  <User className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
            </motion.div>

            {/* Name */}
            <div className="space-y-1">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold"
              >
                {athlete.name}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground"
              >
                "{athlete.nickname}"
              </motion.p>
            </div>

            {/* Fight Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full pt-4 space-y-3"
            >
              {/* Fight Number */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Swords className="w-4 h-4" />
                <span>Luta #{fight.order}</span>
              </div>

              {/* Fight Details Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-muted-foreground">
                      Modalidade
                    </span>
                  </div>
                  <p className="text-sm font-bold">{fight.modality.name}</p>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Weight className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-muted-foreground">
                      Categoria
                    </span>
                  </div>
                  <p className="text-sm font-bold">{fight.weightClass.title}</p>
                </div>
              </div>

              {/* Opponent Info */}
              {isOpponent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="p-4 rounded-lg border-2 border-dashed"
                >
                  <p className="text-xs font-semibold text-muted-foreground mb-2 text-center">
                    Adversário
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Avatar className="w-10 h-10 border-2">
                      <AvatarImage
                        src={
                          athlete.athleteId === fight.fighterA.athleteId
                            ? fight.fighterB.avatarUrl
                            : fight.fighterA.avatarUrl
                        }
                      />
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-semibold text-sm">
                        {athlete.athleteId === fight.fighterA.athleteId
                          ? fight.fighterB.name
                          : fight.fighterA.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        "
                        {athlete.athleteId === fight.fighterA.athleteId
                          ? fight.fighterB.nickname
                          : fight.fighterA.nickname}
                        "
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Rules Badge */}
              <div className="flex justify-center gap-2">
                <Badge variant="secondary">
                  {fight.rules.numberOfRounds}x{fight.rules.roundDuration} min
                </Badge>
                <Badge variant="secondary">{fight.experienceLevel}</Badge>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
