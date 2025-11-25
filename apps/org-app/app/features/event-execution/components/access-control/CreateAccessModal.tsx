import { useState } from 'react';
import { Dice5, Plus } from 'lucide-react';
import { Button } from '@repo/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import { Checkbox } from '@repo/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@repo/ui/radio-group';
import type { AccessRole } from '../../domain/access-token';
import { ROLE_TEMPLATES, generatePIN } from '../../domain/access-token';
import { useCreateAccessToken } from '../../hooks/use-access-tokens';
import { toast } from 'sonner';
import { ScrollArea } from '@repo/ui/scroll-area';

interface CreateAccessModalProps {
  eventId: string;
  open: boolean;
  onClose: () => void;
  defaultRole?: AccessRole;
}

export function CreateAccessModal({
  eventId,
  open,
  onClose,
  defaultRole,
}: CreateAccessModalProps) {
  const [selectedRole, setSelectedRole] = useState<AccessRole>(defaultRole || 'referee');
  const [label, setLabel] = useState('');
  const [requirePin, setRequirePin] = useState(true);
  const [pin, setPin] = useState(generatePIN());
  const [requireDeviceBinding, setRequireDeviceBinding] = useState(false);
  const [expirationOption, setExpirationOption] = useState<'event_end' | '24h' | 'custom'>('event_end');

  const createMutation = useCreateAccessToken();

  const roleTemplate = ROLE_TEMPLATES[selectedRole];

  const handleGeneratePIN = () => {
    setPin(generatePIN());
  };

  const handleCreate = () => {
    createMutation.mutate(
      {
        eventId,
        role: selectedRole,
        label: label || undefined,
        pin: requirePin ? pin : undefined,
        requireDeviceBinding,
        // For now, always use 24h expiration in mock
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        onSuccess: () => {
          toast.success('Acesso criado!', {
            description: `Link de acesso para ${roleTemplate.label} criado com sucesso.`,
          });
          handleClose();
        },
        onError: (error) => {
          toast.error('Erro ao criar acesso', {
            description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
          });
        },
      }
    );
  };

  const handleClose = () => {
    // Reset form
    setSelectedRole(defaultRole || 'referee');
    setLabel('');
    setRequirePin(true);
    setPin(generatePIN());
    setRequireDeviceBinding(false);
    setExpirationOption('event_end');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl sm:max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Criar Novo Acesso</DialogTitle>
          <DialogDescription>
            Crie um link de acesso para membros da equipe durante o evento
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='flex-1 h-[70vh]'>
          <div className="space-y-6 py-4 overflow-y-auto">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label>Tipo de Acesso</Label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(ROLE_TEMPLATES).map((template) => (
                  <button
                    key={template.role}
                    type="button"
                    onClick={() => setSelectedRole(template.role)}
                    className={`p-3 rounded-lg border-2 text-left transition-all cursor-pointer hover:border-primary/50 ${
                      selectedRole === template.role
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{template.icon}</span>
                      <span className="font-semibold text-sm">{template.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="label">Identificação (opcional)</Label>
              <Input
                id="label"
                placeholder='Ex: "Ring A", "Mesa 1", "Entrada Principal"'
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Ajuda a identificar este acesso na lista
              </p>
            </div>

            {/* Security Settings */}
            <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
              <Label className="text-sm font-semibold">Configurações de Segurança</Label>

              {/* PIN */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="require-pin"
                    checked={requirePin}
                    onCheckedChange={(checked) => setRequirePin(checked as boolean)}
                  />
                  <label
                    htmlFor="require-pin"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Exigir PIN
                  </label>
                </div>

                {requirePin && (
                  <div className="flex items-center gap-2 ml-6">
                    <Input
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      maxLength={6}
                      className="w-24 font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGeneratePIN}
                    >
                      <Dice5 className="w-4 h-4 mr-1" />
                      Gerar
                    </Button>
                  </div>
                )}
              </div>

              {/* Device Binding */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="device-binding"
                  checked={requireDeviceBinding}
                  onCheckedChange={(checked) => setRequireDeviceBinding(checked as boolean)}
                />
                <label
                  htmlFor="device-binding"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Vincular ao primeiro dispositivo
                </label>
              </div>

              {/* Expiration */}
              <div className="space-y-2">
                <Label className="text-sm">Expira em:</Label>
                <RadioGroup value={expirationOption} onValueChange={(v) => setExpirationOption(v as any)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="event_end" id="exp-event" />
                    <label htmlFor="exp-event" className="text-sm">
                      Após o evento terminar
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="24h" id="exp-24h" />
                    <label htmlFor="exp-24h" className="text-sm">
                      24 horas após criação
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="exp-custom" />
                    <label htmlFor="exp-custom" className="text-sm">
                      Personalizado
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Permissions Preview */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Permissões incluídas:</Label>
              <div className="flex flex-wrap gap-1">
                {roleTemplate.defaultScopes.map((scope) => (
                  <span
                    key={scope}
                    className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground"
                  >
                    {scope.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              'Criando...'
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                Criar Acesso
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
