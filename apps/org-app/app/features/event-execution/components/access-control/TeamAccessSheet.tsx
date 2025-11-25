import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@repo/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@repo/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select';
import { ScrollArea } from '@repo/ui/scroll-area';
import { Separator } from '@repo/ui/separator';
import type { AccessTokenWithUsage, AccessRole } from '../../domain/access-token';
import { ROLE_TEMPLATES } from '../../domain/access-token';
import { useEventAccessTokens, useRevokeAccessToken, useRegenerateAccessToken } from '../../hooks/use-access-tokens';
import { AccessTokenCard } from './AccessTokenCard';
import { CreateAccessModal } from './CreateAccessModal';
import { QRCodeModal } from './QRCodeModal';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface TeamAccessSheetProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamAccessSheet({ eventId, open, onOpenChange }: TeamAccessSheetProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRoleForCreate, setSelectedRoleForCreate] = useState<AccessRole | undefined>();
  const [qrModalToken, setQrModalToken] = useState<AccessTokenWithUsage | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'revoked'>('all');

  const { data: tokens = [], isLoading } = useEventAccessTokens(eventId, open);
  const revokeMutation = useRevokeAccessToken();
  const regenerateMutation = useRegenerateAccessToken();

  // Filter tokens
  const filteredTokens = tokens.filter((token) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return token.status === 'active';
    if (filterStatus === 'revoked') return token.status === 'revoked';
    return true;
  });

  const activeTokens = filteredTokens.filter((t) => t.status === 'active');
  const revokedTokens = filteredTokens.filter((t) => t.status === 'revoked');

  const handleQuickCreate = (role: AccessRole) => {
    setSelectedRoleForCreate(role);
    setCreateModalOpen(true);
  };

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

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-2xl overflow-hidden flex flex-col">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>Equipe do Evento</SheetTitle>
                <SheetDescription>
                  Gerencie acessos da equipe durante o evento
                </SheetDescription>
              </div>
              <Button size="sm" onClick={() => setCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-hidden flex flex-col p-4 h-[60vh]">
            {/* Quick Actions */}
            <div className="py-4">
              <p className="text-sm font-semibold mb-3">Criar Acesso Rápido:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.values(ROLE_TEMPLATES).slice(0, 4).map((template) => (
                  <button
                    key={template.role}
                    onClick={() => handleQuickCreate(template.role)}
                    className="p-3 rounded-lg border hover:border-primary hover:bg-accent transition-colors text-left"
                  >
                    <div className="text-2xl mb-1">{template.icon}</div>
                    <div className="text-xs font-semibold">{template.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Filter */}
            <div className="flex items-center justify-between py-4">
              <h3 className="text-sm font-semibold">
                {filterStatus === 'all' && `Todos os Acessos (${tokens.length})`}
                {filterStatus === 'active' && `Acessos Ativos (${activeTokens.length})`}
                {filterStatus === 'revoked' && `Acessos Revogados (${revokedTokens.length})`}
              </h3>

              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="revoked">Revogados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Token List */}
            <ScrollArea className="flex-1 h-[60vh]">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredTokens.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">
                    Nenhum acesso encontrado
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setCreateModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Criar Primeiro Acesso
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 pb-4">
                  {/* Active Tokens */}
                  {activeTokens.length > 0 && filterStatus !== 'revoked' && (
                    <div className="space-y-3">
                      {activeTokens.map((token) => (
                        <AccessTokenCard
                          key={token.id}
                          token={token}
                          onShowQR={setQrModalToken}
                          onRevoke={handleRevoke}
                          onRegenerate={handleRegenerate}
                        />
                      ))}
                    </div>
                  )}

                  {/* Revoked Tokens */}
                  {revokedTokens.length > 0 && filterStatus !== 'active' && (
                    <>
                      {activeTokens.length > 0 && <Separator className="my-4" />}
                      <div className="space-y-3">
                        {filterStatus === 'all' && (
                          <p className="text-sm font-semibold text-muted-foreground">
                            Revogados ({revokedTokens.length})
                          </p>
                        )}
                        {revokedTokens.map((token) => (
                          <AccessTokenCard
                            key={token.id}
                            token={token}
                            onShowQR={setQrModalToken}
                            onRevoke={handleRevoke}
                            onRegenerate={handleRegenerate}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Modals */}
      <CreateAccessModal
        eventId={eventId}
        open={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setSelectedRoleForCreate(undefined);
        }}
        defaultRole={selectedRoleForCreate}
      />

      <QRCodeModal
        token={qrModalToken}
        open={!!qrModalToken}
        onClose={() => setQrModalToken(null)}
      />
    </>
  );
}
