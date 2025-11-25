import { CheckCircle2, QrCode, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AthleteCheckInStatusProps {
  athlete: {
    name: string;
    nickname: string;
    avatarUrl?: string;
    checkedInAt: Date | null;
  };
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export function AthleteCheckInStatus({
  athlete,
  size = 'md',
  showName = false,
}: AthleteCheckInStatusProps) {
  const sizeClasses = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const isCheckedIn = Boolean(athlete.checkedInAt);

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={athlete.avatarUrl} alt={athlete.nickname} />
          <AvatarFallback>
            <User className={iconSizeClasses[size]} />
          </AvatarFallback>
        </Avatar>

        {/* Status indicator */}
        <div
          className={`absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-background ${
            isCheckedIn ? 'bg-green-500' : 'bg-muted'
          } p-0.5`}
        >
          {isCheckedIn ? (
            <CheckCircle2 className={`${iconSizeClasses[size]} text-white`} />
          ) : (
            <QrCode className={`${iconSizeClasses[size]} text-muted-foreground`} />
          )}
        </div>
      </div>

      {showName && (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {athlete.name.split(' ')[0]} "{athlete.nickname}"
          </p>
          {isCheckedIn && athlete.checkedInAt && (
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(athlete.checkedInAt, {
                addSuffix: true,
                locale: ptBR,
              })}
            </p>
          )}
          {!isCheckedIn && (
            <p className="text-xs text-muted-foreground">Aguardando check-in</p>
          )}
        </div>
      )}
    </div>
  );
}
