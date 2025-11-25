import { Users } from 'lucide-react';
import { Button } from '@repo/ui/button';
import { Badge } from '@repo/ui/badge';
import { useAccessTokenStats } from '../../hooks/use-access-tokens';

interface TeamAccessButtonProps {
  eventId: string;
  onClick: () => void;
}

export function TeamAccessButton({ eventId, onClick }: TeamAccessButtonProps) {
  const stats = useAccessTokenStats(eventId);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="relative"
    >
      <Users className="w-4 h-4 mr-2" />
      Equipe
      <span className="ml-2 flex items-center gap-1">
        <Badge className="text-xs">
          {stats.total}
        </Badge>
        {stats.currentlyActive > 0 && (
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        )}
      </span>
    </Button>
  );
}
