import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { Button } from '@repo/ui/button';
import { Badge } from '@repo/ui/badge';
import { ArrowRight, Sword, QrCode, Calendar, Clock, TrendingUp } from 'lucide-react';
import type { AccessToken } from '~/features/event-execution/domain/access-token';
import { ROLE_TEMPLATES } from '~/features/event-execution/domain/access-token';
import { useEventChronogram, useEventDetails } from '~/features/event-execution/hooks/use-event-execution';
import { motion } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ExternalDashboardPage() {
  const navigate = useNavigate();
  const { eventId, token } = useParams<{ eventId: string; token: string }>();
  const [accessData, setAccessData] = useState<AccessToken | null>(null);

  const { data: eventDetails } = useEventDetails(eventId!);
  const { data: fights = [] } = useEventChronogram(eventId!);

  useEffect(() => {
    const storedData = sessionStorage.getItem(`access_data_${eventId}`);
    if (storedData) {
      setAccessData(JSON.parse(storedData));
    }
  }, [eventId]);

  if (!accessData) return null;

  const roleTemplate = ROLE_TEMPLATES[accessData.role];

  // Quick actions based on scopes
  const quickActions = [];

  if (accessData.scopes.includes('score_fight')) {
    const inProgressFights = fights.filter((f) => f.status === 'in_progress');
    const readyFights = fights.filter((f) => f.status === 'ready');

    quickActions.push({
      title: 'Pontuar Lutas',
      description: inProgressFights.length > 0
        ? `${inProgressFights.length} luta(s) em andamento`
        : readyFights.length > 0
        ? `${readyFights.length} luta(s) pronta(s)`
        : 'Nenhuma luta ativa no momento',
      icon: Sword,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-500',
      action: () => navigate(`/external/e/${eventId}/${token}/scoring`),
      badge: inProgressFights.length > 0 ? inProgressFights.length : null,
      enabled: inProgressFights.length > 0 || readyFights.length > 0,
    });
  }

  if (accessData.scopes.includes('scan_qr')) {
    quickActions.push({
      title: 'Check-in de Atletas',
      description: 'Escanear QR Code ou buscar atleta',
      icon: QrCode,
      color: 'bg-green-500/10 text-green-600 dark:text-green-500',
      action: () => navigate(`/external/e/${eventId}/${token}/checkin`),
      enabled: true,
    });
  }

  if (accessData.scopes.includes('view_chronogram')) {
    quickActions.push({
      title: 'Ver Cronograma',
      description: `${fights.length} lutas programadas`,
      icon: Calendar,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-500',
      action: () => navigate(`/external/e/${eventId}/${token}/chronogram`),
      enabled: true,
    });
  }

  // Recent activity
  const recentFights = fights
    .filter((f) => f.status === 'in_progress' || f.status === 'completed')
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Welcome Card */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                Bem-vindo, {roleTemplate.label}!
              </CardTitle>
              <CardDescription className="mt-2">
                {accessData.label || 'Acesso ao evento'}
              </CardDescription>
            </div>
            <div className={`p-3 rounded-lg ${roleTemplate.color}`}>
              <span className="text-3xl">{roleTemplate.icon}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {accessData.scopes.slice(0, 4).map((scope) => (
              <Badge key={scope} variant="secondary" className="text-xs">
                {scope.replace(/_/g, ' ')}
              </Badge>
            ))}
            {accessData.scopes.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{accessData.scopes.length - 4} permissões
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Card
                key={action.title}
                className={`hover:shadow-md transition-all cursor-pointer group ${
                  !action.enabled ? 'opacity-60' : ''
                }`}
                onClick={action.enabled ? action.action : undefined}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-lg ${action.color}`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      {action.badge !== null && action.badge !== undefined && (
                        <Badge className="bg-rankor text-white">
                          {action.badge}
                        </Badge>
                      )}
                      {action.enabled && (
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-rankor transition-colors" />
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-4">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {recentFights.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Atividade Recente</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {recentFights.map((fight) => (
                  <div
                    key={fight.fightId}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted flex-shrink-0">
                        <span className="text-xs font-bold">#{fight.order}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate">
                          {fight.fighterA.name} vs {fight.fighterB.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {fight.modality.name} • {fight.weightClass.title}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        fight.status === 'in_progress'
                          ? 'bg-orange-500/10 text-orange-600 dark:text-orange-500'
                          : 'bg-purple-500/10 text-purple-600 dark:text-purple-500'
                      }
                    >
                      {fight.status === 'in_progress' ? 'Em Andamento' : 'Concluída'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Event Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Total de Lutas</CardDescription>
            <CardTitle className="text-2xl">{fights.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Em Andamento</CardDescription>
            <CardTitle className="text-2xl">
              {fights.filter((f) => f.status === 'in_progress').length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Concluídas</CardDescription>
            <CardTitle className="text-2xl">
              {fights.filter((f) => f.status === 'completed').length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Próximas</CardDescription>
            <CardTitle className="text-2xl">
              {fights.filter((f) => f.status === 'ready' || f.status === 'upcoming').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Last Access Info */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                Acesso válido até:{' '}
                {formatDistanceToNow(accessData.expiresAt, { addSuffix: true, locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">Online</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
