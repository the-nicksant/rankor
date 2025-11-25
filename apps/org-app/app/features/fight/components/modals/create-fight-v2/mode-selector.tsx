import { Zap, LayoutGrid } from 'lucide-react';
import { useFightCreation, type FightMode } from '../../../context/fight-creation-context';

export function ModeSelector() {
  const { state, dispatch } = useFightCreation();

  const modes = [
    {
      value: 'quick' as FightMode,
      icon: Zap,
      title: 'Modo Rápido',
      description: 'Criar uma luta por vez',
    },
    {
      value: 'batch' as FightMode,
      icon: LayoutGrid,
      title: 'Modo em Lote',
      description: 'Criar várias lutas de uma vez',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Como deseja criar as lutas?</h2>
        <p className="text-sm text-muted-foreground">
          Escolha o modo de criação que melhor se adapta ao seu evento
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = state.mode === mode.value;

          return (
            <button
              key={mode.value}
              onClick={() => dispatch({ type: 'SET_MODE', payload: mode.value })}
              className={`
                relative p-6 rounded-lg border-2 transition-all text-left
                ${
                  isSelected
                    ? 'border-rankor bg-rankor/5'
                    : 'border-border hover:border-rankor/50 hover:bg-accent'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`
                  p-2 rounded-lg
                  ${isSelected ? 'bg-rankor text-white' : 'bg-muted'}
                `}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{mode.title}</h3>
                  <p className="text-sm text-muted-foreground">{mode.description}</p>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-rankor flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
