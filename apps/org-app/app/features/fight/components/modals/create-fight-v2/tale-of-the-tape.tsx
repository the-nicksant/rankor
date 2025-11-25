import { Weight, Ruler } from 'lucide-react';
import type { Athlete } from '../../../../../features/athlete/domain/athlete';

interface TaleOfTheTapeProps {
  fighterA: Athlete;
  fighterB: Athlete;
}

export function TaleOfTheTape({ fighterA, fighterB }: TaleOfTheTapeProps) {
  const stats = [
    {
      label: 'Peso',
      icon: Weight,
      valueA: `${fighterA.weight}kg`,
      valueB: `${fighterB.weight}kg`,
    },
    {
      label: 'Altura',
      icon: Ruler,
      valueA: `${fighterA.height}cm`,
      valueB: `${fighterB.height}cm`,
    },
  ];

  return (
    <div className="p-6 rounded-lg border bg-card">
      <h3 className="text-center font-semibold mb-6">Tale of the Tape</h3>

      <div className="space-y-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="grid grid-cols-3 items-center gap-4">
              <div className="text-right font-medium">{stat.valueA}</div>

              <div className="flex flex-col items-center gap-1">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>

              <div className="text-left font-medium">{stat.valueB}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Experiência</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {fighterA.expertises.map((exp) => (
                <span key={exp} className="text-xs px-2 py-1 rounded bg-muted">
                  {exp}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Experiência</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {fighterB.expertises.map((exp) => (
                <span key={exp} className="text-xs px-2 py-1 rounded bg-muted">
                  {exp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
