import type { AccessTokenWithUsage } from '../../domain/access-token';
import { AccessTokenCard } from '../access-control/AccessTokenCard';
import { Separator } from '@repo/ui/separator';

interface TeamAccessListProps {
  tokens: AccessTokenWithUsage[];
  onShowQR: (token: AccessTokenWithUsage) => void;
  onRevoke: (tokenId: string) => void;
  onRegenerate: (tokenId: string) => void;
}

export function TeamAccessList({
  tokens,
  onShowQR,
  onRevoke,
  onRegenerate,
}: TeamAccessListProps) {
  const activeTokens = tokens.filter((t) => t.status === 'active');
  const revokedTokens = tokens.filter((t) => t.status === 'revoked');

  if (tokens.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Nenhum acesso criado ainda</p>
        <p className="text-sm text-muted-foreground mt-2">
          Clique em "Criar Acesso" para começar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Tokens */}
      {activeTokens.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Acessos Ativos ({activeTokens.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeTokens.map((token) => (
              <AccessTokenCard
                key={token.id}
                token={token}
                onShowQR={onShowQR}
                onRevoke={onRevoke}
                onRegenerate={onRegenerate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Revoked Tokens */}
      {revokedTokens.length > 0 && (
        <>
          {activeTokens.length > 0 && <Separator className="my-6" />}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Acessos Revogados ({revokedTokens.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {revokedTokens.map((token) => (
                <AccessTokenCard
                  key={token.id}
                  token={token}
                  onShowQR={onShowQR}
                  onRevoke={onRevoke}
                  onRegenerate={onRegenerate}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
