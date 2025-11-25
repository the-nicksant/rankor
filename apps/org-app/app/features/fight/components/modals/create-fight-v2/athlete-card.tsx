import { User, Weight, Ruler } from 'lucide-react';
import type { Athlete } from '../../../../../features/athlete/domain/athlete';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar';

interface AthleteCardProps {
  athlete: Athlete;
  draggable?: boolean;
  selected?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
}

export function AthleteCard({
  athlete,
  draggable = false,
  selected = false,
  onClick,
  onDragStart,
}: AthleteCardProps) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      className={`
        p-4 rounded-lg border transition-all cursor-pointer
        ${selected ? 'border-rankor bg-rankor/5' : 'border-border hover:border-rankor/50 hover:bg-accent'}
        ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        <Avatar className='size-12'>
          <AvatarImage src={athlete.avatarUrl} alt={athlete.nickname}/>
          <AvatarFallback><User /></AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold truncate">
            {athlete.firstname} "{athlete.nickname}" {athlete.lastname}
          </h4>

          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Weight className="w-4 h-4" />
              <span>{athlete.weight}kg</span>
            </div>
            <div className="flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              <span>{athlete.height}cm</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            {athlete.expertises.map((exp) => (
              <span key={exp} className="text-xs px-2 py-1 rounded bg-muted">
                {exp}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
