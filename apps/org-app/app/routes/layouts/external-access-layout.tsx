import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams, useLocation } from 'react-router';
import { Home, Sword, QrCode, Calendar, User, LogOut } from 'lucide-react';
import { Button } from '@repo/ui/button';
import { Badge } from '@repo/ui/badge';
import type { AccessToken } from '~/features/event-execution/domain/access-token';
import { ROLE_TEMPLATES } from '~/features/event-execution/domain/access-token';
import { useEventDetails } from '~/features/event-execution/hooks/use-event-execution';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@repo/ui/cn';

export default function ExternalAccessLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId, token } = useParams<{ eventId: string; token: string }>();
  const [accessData, setAccessData] = useState<AccessToken | null>(null);

  const { data: eventDetails } = useEventDetails(eventId!);

  useEffect(() => {
    // Check if user is authorized
    const storedToken = sessionStorage.getItem(`access_token_${eventId}`);
    const storedData = sessionStorage.getItem(`access_data_${eventId}`);

    if (!storedToken || storedToken !== token || !storedData) {
      // Not authorized, redirect to verification
      navigate(`/e/${eventId}/${token}`);
      return;
    }

    try {
      const data = JSON.parse(storedData) as AccessToken;
      setAccessData(data);
    } catch (error) {
      navigate(`/e/${eventId}/${token}`);
    }
  }, [eventId, token, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem(`access_token_${eventId}`);
    sessionStorage.removeItem(`access_data_${eventId}`);
    navigate(`/e/${eventId}/${token}`);
  };

  if (!accessData || !eventDetails) {
    return null; // Will redirect in useEffect
  }

  const roleTemplate = ROLE_TEMPLATES[accessData.role];

  // Build navigation items based on scopes
  const navItems = [];

  // Dashboard - always available
  navItems.push({
    path: `/external/e/${eventId}/${token}/dashboard`,
    icon: Home,
    label: 'Início',
  });

  // Scoring - if user can score fights
  if (accessData.scopes.includes('score_fight')) {
    navItems.push({
      path: `/external/e/${eventId}/${token}/scoring`,
      icon: Sword,
      label: 'Pontuar',
    });
  }

  // Check-in - if user can scan QR
  if (accessData.scopes.includes('scan_qr')) {
    navItems.push({
      path: `/external/e/${eventId}/${token}/checkin`,
      icon: QrCode,
      label: 'Check-in',
    });
  }

  // Chronogram - if user can view chronogram
  if (accessData.scopes.includes('view_chronogram')) {
    navItems.push({
      path: `/external/e/${eventId}/${token}/chronogram`,
      icon: Calendar,
      label: 'Cronograma',
    });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Event Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded ${roleTemplate.color}`}>
                  <span className="text-lg">{roleTemplate.icon}</span>
                </div>
                <div className="min-w-0">
                  <h1 className="font-bold text-sm sm:text-base truncate">
                    {eventDetails.name}
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {format(eventDetails.date, "d 'de' MMMM", { locale: ptBR })} •{' '}
                    {eventDetails.venue}
                  </p>
                </div>
              </div>
            </div>

            {/* Role Badge */}
            <div className="flex items-center gap-2">
              <Badge className={cn('hidden sm:flex', roleTemplate.color)}>
                {roleTemplate.label}
                {accessData.label && ` • ${accessData.label}`}
              </Badge>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Sair"
                className="h-9 w-9"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-20 sm:pb-6">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-around p-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors',
                  active
                    ? 'text-rankor bg-rankor/10'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Navigation (Tabs) */}
      <div className="hidden sm:block border-b sticky top-[73px] bg-background z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 border-b-2 transition-colors',
                    active
                      ? 'border-rankor text-rankor font-semibold'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
