import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import { Loader2, Lock, ShieldCheck } from 'lucide-react';
import { useVerifyAccessToken } from '~/features/event-execution/hooks/use-access-tokens';
import { useEventDetails } from '~/features/event-execution/hooks/use-event-execution';
import { ROLE_TEMPLATES } from '~/features/event-execution/domain/access-token';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function AccessVerificationPage() {
  const navigate = useNavigate();
  const { eventId, token } = useParams<{ eventId: string; token: string }>();
  const [pin, setPin] = useState('');

  const { data: eventDetails } = useEventDetails(eventId!);
  const verifyMutation = useVerifyAccessToken();

  const handleVerify = () => {
    if (!token) return;

    verifyMutation.mutate(
      {
        token,
        pin: pin || undefined,
        deviceFingerprint: generateDeviceFingerprint(),
      },
      {
        onSuccess: (result) => {
          if (result.valid && result.accessToken) {
            // Store token in sessionStorage for the session
            sessionStorage.setItem(`access_token_${eventId}`, token);
            sessionStorage.setItem(`access_data_${eventId}`, JSON.stringify(result.accessToken));

            toast.success('Acesso autorizado!', {
              description: `Bem-vindo, ${ROLE_TEMPLATES[result.accessToken.role].label}`,
            });

            // Navigate to dashboard
            navigate(`/external/e/${eventId}/${token}/dashboard`);
          } else {
            // Handle verification errors
            const errorMessages = {
              invalid_token: 'Token inválido. Verifique o link e tente novamente.',
              invalid_pin: 'PIN incorreto. Tente novamente.',
              expired: 'Este acesso expirou. Entre em contato com o organizador.',
              revoked: 'Este acesso foi revogado. Entre em contato com o organizador.',
              device_mismatch: 'Este acesso está vinculado a outro dispositivo.',
            };

            toast.error('Acesso negado', {
              description: result.error ? errorMessages[result.error] : 'Erro desconhecido',
            });
          }
        },
        onError: (error) => {
          toast.error('Erro ao verificar acesso', {
            description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
          });
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border-2">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-rankor/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-rankor" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                {eventDetails?.name || 'Evento Rankor'}
              </CardTitle>
              <CardDescription className="mt-2">
                Verificação de Acesso
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Token Info */}
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Tipo de Acesso
              </p>
              <p className="text-lg font-semibold">Verificando...</p>
            </div>

            {/* PIN Input (always show, will be ignored if not needed) */}
            <div className="space-y-2">
              <Label htmlFor="pin" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                PIN de Acesso
              </Label>
              <Input
                id="pin"
                type="password"
                placeholder="Digite o PIN (se necessário)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={6}
                className="text-center text-lg font-mono tracking-wider"
                autoFocus
              />
              <p className="text-xs text-muted-foreground text-center">
                Caso este acesso exija PIN, digite acima
              </p>
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              disabled={verifyMutation.isPending}
              className="w-full"
              size="lg"
            >
              {verifyMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Acessar Evento'
              )}
            </Button>

            {/* Security Info */}
            <div className="pt-4 border-t text-center text-xs text-muted-foreground">
              <p>🔒 Conexão segura • Acesso temporário</p>
              <p className="mt-1">Não compartilhe este link</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Simple device fingerprint generation
function generateDeviceFingerprint(): string {
  const ua = navigator.userAgent;
  const screen = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return btoa(`${ua}-${screen}-${timezone}`);
}
