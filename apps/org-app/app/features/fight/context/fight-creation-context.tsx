import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { Athlete } from '../../athlete/domain/athlete';

export type FightMode = 'quick' | 'batch';

export interface FightConfiguration {
  modalityId: string;
  modalityCode: string;
  experienceLevel: string;
  weightClass: {
    title: string;
    minWeight: number;
    maxWeight: number;
  } | null;
}

export interface FightRules {
  numberOfRounds: number;
  roundDuration: number;
  intervalDuration: number;
  scoringMethods: Record<string, number>;
  judgingSystem: 'cumulative' | 'dominance';
}

export interface Matchup {
  id: string;
  fighterA: Athlete | null;
  fighterB: Athlete | null;
}

export interface FightCreationState {
  mode: FightMode;
  currentStep: number;
  configuration: FightConfiguration;
  fightRules: FightRules;
  availableAthletes: Athlete[];
  quickMode: {
    fighterA: Athlete | null;
    fighterB: Athlete | null;
  };
  batchMode: {
    selectedAthletes: Athlete[];
    matchups: Matchup[];
  };
  history: FightCreationState[];
  historyIndex: number;
}

type FightCreationAction =
  | { type: 'SET_MODE'; payload: FightMode }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_CONFIGURATION'; payload: Partial<FightConfiguration> }
  | { type: 'SET_FIGHT_RULES'; payload: Partial<FightRules> }
  | { type: 'SET_AVAILABLE_ATHLETES'; payload: Athlete[] }
  | { type: 'SELECT_QUICK_FIGHTER'; payload: { corner: 'A' | 'B'; athlete: Athlete | null } }
  | { type: 'TOGGLE_BATCH_ATHLETE'; payload: Athlete }
  | { type: 'ADD_MATCHUP'; payload: Matchup }
  | { type: 'UPDATE_MATCHUP'; payload: { id: string; matchup: Partial<Matchup> } }
  | { type: 'REMOVE_MATCHUP'; payload: string }
  | { type: 'AUTO_MATCH' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' };

const initialState: FightCreationState = {
  mode: 'quick',
  currentStep: 0,
  configuration: {
    modalityId: '',
    modalityCode: '',
    experienceLevel: '',
    weightClass: null,
  },
  fightRules: {
    numberOfRounds: 3,
    roundDuration: 5,
    intervalDuration: 1,
    scoringMethods: {},
    judgingSystem: 'cumulative',
  },
  availableAthletes: [],
  quickMode: {
    fighterA: null,
    fighterB: null,
  },
  batchMode: {
    selectedAthletes: [],
    matchups: [],
  },
  history: [],
  historyIndex: -1,
};

function fightCreationReducer(
  state: FightCreationState,
  action: FightCreationAction
): FightCreationState {
  const addToHistory = (newState: FightCreationState): FightCreationState => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    return {
      ...newState,
      history: [...newHistory, state],
      historyIndex: newHistory.length,
    };
  };

  switch (action.type) {
    case 'SET_MODE':
      return addToHistory({
        ...state,
        mode: action.payload,
        currentStep: 0,
      });

    case 'SET_STEP':
      return { ...state, currentStep: action.payload };

    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 };

    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };

    case 'SET_CONFIGURATION': {
      const shouldClearFights =
        action.payload.modalityId !== undefined ||
        action.payload.experienceLevel !== undefined ||
        action.payload.weightClass !== undefined;

      return addToHistory({
        ...state,
        configuration: {
          ...state.configuration,
          ...action.payload,
        },
        quickMode: shouldClearFights
          ? { fighterA: null, fighterB: null }
          : state.quickMode,
        batchMode: shouldClearFights
          ? { selectedAthletes: [], matchups: [] }
          : state.batchMode,
      });
    }

    case 'SET_FIGHT_RULES':
      return addToHistory({
        ...state,
        fightRules: {
          ...state.fightRules,
          ...action.payload,
        },
      });

    case 'SET_AVAILABLE_ATHLETES':
      return { ...state, availableAthletes: action.payload };

    case 'SELECT_QUICK_FIGHTER':
      return addToHistory({
        ...state,
        quickMode: {
          ...state.quickMode,
          [action.payload.corner === 'A' ? 'fighterA' : 'fighterB']: action.payload.athlete,
        },
      });

    case 'TOGGLE_BATCH_ATHLETE': {
      const isSelected = state.batchMode.selectedAthletes.some((a) => a.id === action.payload.id);
      return addToHistory({
        ...state,
        batchMode: {
          ...state.batchMode,
          selectedAthletes: isSelected
            ? state.batchMode.selectedAthletes.filter((a) => a.id !== action.payload.id)
            : [...state.batchMode.selectedAthletes, action.payload],
        },
      });
    }

    case 'ADD_MATCHUP':
      return addToHistory({
        ...state,
        batchMode: {
          ...state.batchMode,
          matchups: [...state.batchMode.matchups, action.payload],
        },
      });

    case 'UPDATE_MATCHUP':
      return addToHistory({
        ...state,
        batchMode: {
          ...state.batchMode,
          matchups: state.batchMode.matchups.map((m) =>
            m.id === action.payload.id ? { ...m, ...action.payload.matchup } : m
          ),
        },
      });

    case 'REMOVE_MATCHUP':
      return addToHistory({
        ...state,
        batchMode: {
          ...state.batchMode,
          matchups: state.batchMode.matchups.filter((m) => m.id !== action.payload),
        },
      });

    case 'AUTO_MATCH': {
      const available = [...state.availableAthletes];
      const newMatchups: Matchup[] = [];

      while (available.length >= 2) {
        const fighterA = available.shift()!;
        const fighterB = available.shift()!;
        newMatchups.push({
          id: Math.random().toString(36).substr(2, 9),
          fighterA,
          fighterB,
        });
      }

      return addToHistory({
        ...state,
        batchMode: {
          ...state.batchMode,
          matchups: newMatchups,
        },
      });
    }

    case 'UNDO': {
      if (state.historyIndex >= 0) {
        const previousState = state.history[state.historyIndex];
        return {
          ...previousState!,
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;
    }

    case 'REDO': {
      if (state.historyIndex < state.history.length - 1) {
        const nextState = state.history[state.historyIndex + 1];
        return {
          ...nextState!,
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;
    }

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

interface FightCreationContextValue {
  state: FightCreationState;
  dispatch: React.Dispatch<FightCreationAction>;
  canUndo: boolean;
  canRedo: boolean;
}

const FightCreationContext = createContext<FightCreationContextValue | undefined>(undefined);

export function FightCreationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(fightCreationReducer, initialState);

  const canUndo = state.historyIndex >= 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return (
    <FightCreationContext.Provider value={{ state, dispatch, canUndo, canRedo }}>
      {children}
    </FightCreationContext.Provider>
  );
}

export function useFightCreation() {
  const context = useContext(FightCreationContext);
  if (!context) {
    throw new Error('useFightCreation must be used within FightCreationProvider');
  }
  return context;
}
