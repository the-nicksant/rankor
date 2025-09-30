

import { create } from 'zustand';
import type { ModalInstance } from '../types/modal';
import type { ModalKeys } from '~/components/shared/app-modals';

interface ModalsState {
  activeModals: ModalInstance[];
  openModal: (key: ModalKeys, payload?: any, options?: ModalInstance['options']) => string;
  closeModal: (id: string) => void;
  closeLastModal: () => void;
  clearAllModals: () => void;
}

export const useModalsStore = create<ModalsState>((set, get) => ({
  activeModals: [],
  openModal: (key: ModalKeys, payload, options) => {
    const id = crypto.randomUUID();
    const newModalInstance: ModalInstance = { id, key, payload, options };
    set((state) => ({
      activeModals: [...state.activeModals, newModalInstance],
    }));
    return id;
  },

  closeModal: (id) => {
    set((state) => ({
      activeModals: state.activeModals.filter((modal) => modal.id !== id),
    }));
  },

  closeLastModal: () => {
    set((state) => ({
      activeModals: state.activeModals.slice(0, -1),
    }));
  },

  clearAllModals: () => {
    set({ activeModals: [] });
  },
}));