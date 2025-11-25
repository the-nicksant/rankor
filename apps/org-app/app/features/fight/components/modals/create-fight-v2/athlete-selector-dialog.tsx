import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@repo/ui/dialog';
import { Input } from '@repo/ui/input';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { AthleteCard } from './athlete-card';
import type { Athlete } from '../../../../../features/athlete/domain/athlete';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@repo/ui/empty';

interface AthleteSelectorDialogProps {
  open: boolean;
  onClose: () => void;
  athletes: Athlete[];
  onSelect: (athlete: Athlete) => void;
  title: string;
  description?: string;
}

export function AthleteSelectorDialog({
  open,
  onClose,
  athletes,
  onSelect,
  title,
  description,
}: AthleteSelectorDialogProps) {
  const [search, setSearch] = useState('');

  const filteredAthletes = athletes.filter((athlete) => {
    const searchLower = search.toLowerCase();
    return (
      athlete.firstname.toLowerCase().includes(searchLower) ||
      athlete.lastname.toLowerCase().includes(searchLower) ||
      athlete.nickname.toLowerCase().includes(searchLower)
    );
  });

  const handleSelect = (athlete: Athlete) => {
    onSelect(athlete);
    onClose();
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou apelido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 min-h-[300px]">
          {filteredAthletes.length === 0 ? (
            <Empty>
              <EmptyMedia variant="icon">
                <X />
              </EmptyMedia>
              <EmptyContent>
                <EmptyHeader>
                  <EmptyTitle>Nenhum atleta encontrado</EmptyTitle>
                  <EmptyDescription>
                    {search ? 'Tente ajustar sua busca' : 'Não há atletas disponíveis'}
                  </EmptyDescription>
                </EmptyHeader>
              </EmptyContent>
            </Empty>
          ) : (
            filteredAthletes.map((athlete) => (
              <AthleteCard
                key={athlete.id}
                athlete={athlete}
                onClick={() => handleSelect(athlete)}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
