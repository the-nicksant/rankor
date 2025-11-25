import { useState } from 'react';
import { Plus, Users, Shield, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs';
import { useEventAccessTokens, useAccessTokenStats } from '../../hooks/use-access-tokens';
import { TeamAccessOverview } from './TeamAccessOverview';
import { TeamAccessList } from './TeamAccessList';
import { CreateAccessModal } from '../access-control/CreateAccessModal';
import { QRCodeModal } from '../access-control/QRCodeModal';
import { useRevokeAccessToken, useRegenerateAccessToken } from '../../hooks/use-access-tokens';
import type { AccessTokenWithUsage } from '../../domain/access-token';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface EventTeamManagementProps {
  eventId: string;
}

export function EventTeamManagement({ eventId }: EventTeamManagementProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [qrModalToken, setQrModalToken] = useState<AccessTokenWithUsage | null>(null);

  const { data: tokens = [], isLoading } = useEventAccessTokens(eventId);
  const stats = useAccessTokenStats(eventId);
  const revokeMutation = useRevokeAccessToken();
  const regenerateMutation = useRegenerateAccessToken();

  const handleRevoke = (tokenId: string) => {
    revokeMutation.mutate(
      { tokenId, eventId },
      {
        onSuccess: () => {
          toast.success('Acesso revogado', {
            description: 'O acesso foi revogado com sucesso.',
          });
        },
        onError: (error) => {
          toast.error('Erro ao revogar', {
            description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
          });
        },
      }
    );
  };

  const handleRegenerate = (tokenId: string) => {
    regenerateMutation.mutate(
      { tokenId, eventId },
      {
        onSuccess: () => {
          toast.success('Token regenerado', {
            description: 'Um novo token foi gerado. O anterior não funciona mais.',
          });
        },
        onError: (error) => {
          toast.error('Erro ao regenerar', {
            description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
          });
        },
      }
    );
  };

  if (isLoading && tokens.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Equipe do Evento</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie acessos para árbitros, juízes, equipe de check-in e outros colaboradores
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Criar Acesso
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Acessos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} ativos, {stats.revoked} revogados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos Agora</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentlyActive}</div>
            <p className="text-xs text-muted-foreground">
              Acessados nos últimos 10 minutos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Árbitros</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byRole.referee}</div>
            <p className="text-xs text-muted-foreground">
              Pontuação e controle de lutas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-in</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byRole.check_in}</div>
            <p className="text-xs text-muted-foreground">
              Leitura de QR e check-in manual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="active">Acessos Ativos ({stats.active})</TabsTrigger>
          <TabsTrigger value="all">Todos ({stats.total})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <TeamAccessOverview
            eventId={eventId}
            onCreateAccess={() => setCreateModalOpen(true)}
          />
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <TeamAccessList
            tokens={tokens.filter((t) => t.status === 'active')}
            onShowQR={setQrModalToken}
            onRevoke={handleRevoke}
            onRegenerate={handleRegenerate}
          />
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <TeamAccessList
            tokens={tokens}
            onShowQR={setQrModalToken}
            onRevoke={handleRevoke}
            onRegenerate={handleRegenerate}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateAccessModal
        eventId={eventId}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <QRCodeModal
        token={qrModalToken}
        open={!!qrModalToken}
        onClose={() => setQrModalToken(null)}
      />
    </div>
  );
}
