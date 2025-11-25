import { Download, Printer } from 'lucide-react';
import { Button } from '@repo/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog';
import type { AccessTokenWithUsage } from '../../domain/access-token';
import { ROLE_TEMPLATES, getAccessTokenUrl } from '../../domain/access-token';
import { useRef } from 'react';
import { toast } from 'sonner';

interface QRCodeModalProps {
  token: AccessTokenWithUsage | null;
  open: boolean;
  onClose: () => void;
}

export function QRCodeModal({ token, open, onClose }: QRCodeModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  if (!token) return null;

  const roleTemplate = ROLE_TEMPLATES[token.role];
  const tokenUrl = getAccessTokenUrl(token.eventId, token.token);

  const handleDownload = () => {
    // In a real implementation, this would use a library like qrcode.react or html2canvas
    toast.info('Download QR Code', {
      description: 'Funcionalidade de download será implementada com biblioteca QR.',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            Código QR - {roleTemplate.label}
            {token.label && ` • ${token.label}`}
          </DialogTitle>
          <DialogDescription>
            Escaneie ou imprima este QR Code para acesso rápido
          </DialogDescription>
        </DialogHeader>

        <div ref={qrRef} className="space-y-4 py-4">
          {/* QR Code Placeholder */}
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border-2 border-dashed">
            {/* In production, use a QR code library like qrcode.react */}
            <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center space-y-2">
                <div className="text-6xl">{roleTemplate.icon}</div>
                <div className="text-xs text-gray-600 font-mono break-all px-4">
                  {token.token}
                </div>
              </div>
            </div>

            {/* Info below QR */}
            <div className="text-center space-y-1">
              <p className="font-semibold text-sm">
                {roleTemplate.label}
                {token.label && ` • ${token.label}`}
              </p>
              {token.pin && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-muted-foreground">PIN:</span>
                  <code className="px-2 py-1 rounded bg-muted font-mono text-sm font-bold">
                    {token.pin}
                  </code>
                </div>
              )}
            </div>
          </div>

          {/* URL */}
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Link de acesso:</p>
            <p className="text-xs font-mono break-all">{tokenUrl}</p>
          </div>

          {/* Instructions */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-blue-600 dark:text-blue-500">
              💡 Imprima e distribua para a equipe antes do evento iniciar
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Baixar PNG
          </Button>
          <Button variant="outline" className="flex-1" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
