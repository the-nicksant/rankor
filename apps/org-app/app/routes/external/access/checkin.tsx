import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '@repo/ui/card';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { QrCode, Search, CheckCircle2, AlertCircle, Loader2, Camera, X, ArrowRight } from 'lucide-react';
import { SlideToConfirm } from '~/components/ui/slide-to-confirm';
import { AthleteCheckInCard } from '~/features/event-execution/components/checkin/AthleteCheckInCard';
import { useEventChronogram } from '~/features/event-execution/hooks/use-event-execution';
import { useCheckInAthlete } from '~/features/event-execution/hooks/use-checkin';
import type { FightChronogramItem } from '~/features/event-execution/domain/event-status';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/alert';

import { Scanner } from "@yudiel/react-qr-scanner"

type CheckInState = 'scanner' | 'athlete_found' | 'confirming' | 'success' | 'error';

const qrcodeRegionId = "html5qr-code-full-region";

export default function CheckInPage() {
  const { eventId, token } = useParams<{ eventId: string; token: string }>();
  const [state, setState] = useState<CheckInState>('scanner');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState<{
    athleteId: string;
    name: string;
    nickname: string;
    avatarUrl?: string;
    qrCodeToken: string;
  } | null>(null);
  const [selectedFight, setSelectedFight] = useState<FightChronogramItem | null>(null);

  const { data: fights = [] } = useEventChronogram(eventId!);
  const checkInMutation = useCheckInAthlete();

  const handleQRScan = (qrData: string) => {
    const parts = qrData.split(':');
    if (parts.length !== 4 || parts[0] !== eventId) {
      setState('error');
      toast.error('QR Code inválido', {
        description: 'Este QR Code não é válido para este evento.',
      });
      return;
    }

    const [, fightId, athleteId] = parts;

    // Find fight and athlete
    const fight = fights.find((f) => f.fightId === fightId);
    if (!fight) {
      setState('error');
      toast.error('Luta não encontrada');
      return;
    }

    const athlete =
      fight.fighterA.athleteId === athleteId
        ? fight.fighterA
        : fight.fighterB.athleteId === athleteId
        ? fight.fighterB
        : null;

    if (!athlete) {
      setState('error');
      toast.error('Atleta não encontrado');
      return;
    }

    // Check if already checked in
    if (athlete.checkedInAt) {
      toast.info('Já confirmado', {
        description: 'Este atleta já fez check-in anteriormente.',
      });
      setState('error');
      return;
    }

    setSelectedAthlete(athlete);
    setSelectedFight(fight);
    setState('athlete_found');
  };

  // Manual search
  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    let foundAthlete = null;
    let foundFight = null;

    for (const fight of fights) {
      if (
        fight.fighterA.name.toLowerCase().includes(query) ||
        fight.fighterA.nickname.toLowerCase().includes(query)
      ) {
        foundAthlete = fight.fighterA;
        foundFight = fight;
        break;
      }
      if (
        fight.fighterB.name.toLowerCase().includes(query) ||
        fight.fighterB.nickname.toLowerCase().includes(query)
      ) {
        foundAthlete = fight.fighterB;
        foundFight = fight;
        break;
      }
    }

    if (foundAthlete && foundFight) {
      setSelectedAthlete(foundAthlete);
      setSelectedFight(foundFight);
      setState('athlete_found');
    } else {
      toast.error('Atleta não encontrado', {
        description: 'Nenhum atleta encontrado com este nome.',
      });
    }
  };

  // Confirm check-in
  const handleConfirm = () => {
    if (!selectedAthlete || !eventId) return;

    setState('confirming');

    checkInMutation.mutate(
      {
        eventId,
        qrCodeToken: selectedAthlete.qrCodeToken,
      },
      {
        onSuccess: () => {
          setState('success');
          toast.success('Check-in confirmado!', {
            description: `${selectedAthlete.name} fez check-in com sucesso.`,
          });

          // Reset after 3 seconds
          setTimeout(() => {
            handleReset();
          }, 3000);
        },
        onError: (error) => {
          setState('error');
          toast.error('Erro ao confirmar', {
            description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
          });

          setTimeout(() => {
            handleReset();
          }, 2000);
        },
      }
    );
  };

  const handleReset = () => {
    setState('scanner');
    setSelectedAthlete(null);
    setSelectedFight(null);
    setSearchQuery('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {/* Scanner State */}
        {state === 'scanner' && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Check-in de Atletas</h1>
              <p className="text-muted-foreground">
                Escaneie o QR Code ou busque pelo nome do atleta
              </p>
            </div>

            {/* QR Scanner Card */}
            <Card className="border-2 border-dashed">
              <CardContent className="p-8 relative">
                <Scanner 
                  allowMultiple={false}
                  constraints={{ height: 325, width: 325 }}
                  classNames={{
                    container: "rounded-xl"
                  }}
                  onScan={(data) => handleQRScan(data?.[0].rawValue)}
                />
              
                <div className="relative top-0 left-0">
                  <motion.div
                      animate={{ y: ['0px', '-325px', '0px'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-x-0 h-1 bg-primary/50 top-0"
                    />
                </div>
              </CardContent>
            </Card>

            {/* Manual Search */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold">Busca Manual</h3>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nome ou apelido do atleta..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch}>Buscar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Athlete Found State */}
        {(state === 'athlete_found' || state === 'confirming') && selectedAthlete && selectedFight && (
          <motion.div
            key="athlete-found"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold">Confirmar Check-in</h2>
            </div>

            {/* Athlete Card */}
            <AthleteCheckInCard
              athlete={selectedAthlete}
              fight={selectedFight}
              isOpponent={true}
            />

            {/* Slide to Confirm */}
            <SlideToConfirm
              onConfirm={handleConfirm}
              isLoading={state === 'confirming'}
              text="Deslize para confirmar check-in"
              confirmText="Check-in confirmado!"
            />

            {/* Cancel Button */}
            <Button variant="outline" className="w-full" onClick={handleReset}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </motion.div>
        )}

        {/* Success State */}
        {state === 'success' && selectedAthlete && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-32 h-32 rounded-full bg-green-500/10 flex items-center justify-center"
            >
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </motion.div>
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Check-in Confirmado!</h2>
              <p className="text-xl text-muted-foreground">{selectedAthlete.name}</p>
              <p className="text-sm text-muted-foreground">Redirecionando...</p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-32 h-32 rounded-full bg-red-500/10 flex items-center justify-center"
            >
              <AlertCircle className="w-16 h-16 text-red-600" />
            </motion.div>
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Erro no Check-in</h2>
              <p className="text-muted-foreground">Tente novamente</p>
              <Button onClick={handleReset}>Voltar ao Scanner</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
