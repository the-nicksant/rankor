import { Copy, QrCode, MoreVertical, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@repo/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu';
import { Badge } from '@repo/ui/badge';
import type { AccessTokenWithUsage } from '../../domain/access-token';
import { ROLE_TEMPLATES, getTokenStatusLabel, getAccessTokenUrl } from '../../domain/access-token';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface AccessTokenCardProps {
  token: AccessTokenWithUsage;
  onShowQR: (token: AccessTokenWithUsage) => void;
  onRevoke: (tokenId: string) => void;
  onRegenerate: (tokenId: string) => void;
}

export function AccessTokenCard({
  token,
  onShowQR,
  onRevoke,
  onRegenerate,
}: AccessTokenCardProps) {
  const roleTemplate = ROLE_TEMPLATES[token.role];
  const tokenUrl = getAccessTokenUrl(token.eventId, token.token);
  const statusLabel = getTokenStatusLabel(token);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tokenUrl).then(() => {
      toast.success('Link copiado!', {
        description: token.pin ? `PIN: ${token.pin}` : 'Sem PIN necessário',
      });
    });
  };

  const handleCopyPIN = () => {
    if (token.pin) {
      navigator.clipboard.writeText(token.pin).then(() => {
        toast.success('PIN copiado!', {
          description: `PIN: ${token.pin}`,
        });
      });
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${roleTemplate.color}`}>
            <span className="text-lg">{roleTemplate.icon}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">
                {roleTemplate.label}
                {token.label && ` • ${token.label}`}
              </h4>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {statusLabel}
              {token.lastAccessedAt && (
                <span className="ml-1">
                  • Último acesso {formatDistanceToNow(token.lastAccessedAt, { addSuffix: true, locale: ptBR })}
                </span>
              )}
              {!token.lastAccessedAt && token.status === 'active' && (
                <span className="ml-1">• Nunca utilizado</span>
              )}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopyLink}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar Link
            </DropdownMenuItem>
            {token.pin && (
              <DropdownMenuItem onClick={handleCopyPIN}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar PIN
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onShowQR(token)}>
              <QrCode className="w-4 h-4 mr-2" />
              Mostrar QR Code
            </DropdownMenuItem>
            {token.status === 'active' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onRegenerate(token.id)}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerar Token
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onRevoke(token.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Revogar Acesso
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* URL and PIN */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-2 rounded bg-muted/50 font-mono text-xs w-full">
          <span className="w-full overflow-y-hidden text-ellipsis">{tokenUrl}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0"
            onClick={handleCopyLink}
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {token.pin ? (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">PIN:</span>
              <code className="px-2 py-0.5 rounded bg-muted font-mono">{token.pin}</code>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCopyPIN}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <span className="text-muted-foreground text-xs">Sem PIN necessário</span>
          )}

          {token.requireDeviceBinding && (
            <Badge className="text-xs">
              🔒 Vinculado ao dispositivo
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
        <Button variant="outline" size="sm" onClick={handleCopyLink} className="flex-1">
          <Copy className="w-3 h-3 mr-1" />
          Copiar Link
        </Button>
        <Button variant="outline" size="sm" onClick={() => onShowQR(token)} className="flex-1">
          <QrCode className="w-3 h-3 mr-1" />
          QR Code
        </Button>
      </div>
    </div>
  );
}
