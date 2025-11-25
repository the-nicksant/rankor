import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { Button } from '@repo/ui/button';
import { Badge } from '@repo/ui/badge';
import { ROLE_TEMPLATES, type AccessRole } from '../../domain/access-token';
import { CheckCircle2, ArrowRight, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@repo/ui/alert';
import { useState } from 'react';
import { CreateAccessModal } from '../access-control/CreateAccessModal';

interface TeamAccessOverviewProps {
  eventId: string;
  onCreateAccess: () => void;
}

export function TeamAccessOverview({ eventId, onCreateAccess }: TeamAccessOverviewProps) {
  const [quickCreateRole, setQuickCreateRole] = useState<AccessRole | null>(null);

  const handleQuickCreate = (role: AccessRole) => {
    setQuickCreateRole(role);
  };

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Configure os acessos da sua equipe antes do evento começar. Cada membro receberá um link
          único com permissões específicas para sua função.
        </AlertDescription>
      </Alert>

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>Como Funciona</CardTitle>
          <CardDescription>
            Sistema de acesso simples e seguro para sua equipe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-500 font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-sm">Crie o Acesso</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Escolha a função e configure as permissões de segurança
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-600 dark:text-green-500 font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-sm">Compartilhe o Link</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Envie o link e PIN (se configurado) para o colaborador
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-500 font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-sm">Pronto!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Sua equipe acessa direto sem precisar criar conta
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Create Roles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Criar Acesso por Função</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(ROLE_TEMPLATES).map((template) => (
            <Card
              key={template.role}
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => handleQuickCreate(template.role)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${template.color}`}>
                    <span className="text-2xl">{template.icon}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-lg">{template.label}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Permissões:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.defaultScopes.slice(0, 3).map((scope) => (
                      <Badge key={scope} fill={false} className="text-xs">
                        {scope.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                    {template.defaultScopes.length > 3 && (
                      <Badge fill={false} className="text-xs">
                        +{template.defaultScopes.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle>Recursos de Segurança</CardTitle>
          <CardDescription>
            Controle total sobre os acessos da sua equipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Proteção por PIN</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Adicione um código de 4-6 dígitos para segurança extra
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Vínculo de Dispositivo</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Trave o acesso ao primeiro dispositivo que usar o link
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Expiração Automática</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Links expiram automaticamente após o evento
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Revogação Instantânea</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Revogue acessos a qualquer momento com um clique
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Create Modal */}
      {quickCreateRole && (
        <CreateAccessModal
          eventId={eventId}
          open={!!quickCreateRole}
          onClose={() => setQuickCreateRole(null)}
          defaultRole={quickCreateRole}
        />
      )}
    </div>
  );
}
