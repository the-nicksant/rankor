import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { useModalsStore } from '~/shared/stores/modal-store';
import { type ModalInstance } from '~/shared/types/modal';

export enum ModalKeys {
  create_fight = 'createFight'
}

const modalComponents: Record<ModalKeys, React.LazyExoticComponent<any>> = {
  createFight: lazy(() => import('~/features/fight/components/modals/create-fight-v2/index')),
}

export function AppModals() {
  const activeModals = useModalsStore((state) => state.activeModals);
  const closeLastModal = useModalsStore((state) => state.closeLastModal);
  const closeModal = useModalsStore((state) => state.closeModal);

  useEffect(() => {
    if (activeModals.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModals]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeModals.length > 0) {
        const lastModal = activeModals[activeModals.length - 1];
        if (lastModal.options?.closeOnOverlayClick !== false) {
          closeLastModal();
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeModals, closeLastModal]);

  return (
    <>
      {activeModals.map((modal, index) => {
        const SpecificModalComponent: any = modalComponents[modal.key as ModalKeys];

        if (!SpecificModalComponent) {
          console.warn(`Componente de modal para a chave "${modal.key}" não encontrado.`);
          return null;
        }

        const isLast = index === activeModals.length - 1;

        const renderOverlay = isLast && activeModals.length > 0;

        return (
          <React.Fragment key={modal.id}>
            <Suspense fallback={<div>Carregando...</div>}>
              <SpecificModalComponent
                onClose={() => closeModal(modal.id)}
                payload={modal.payload}
                options={modal.options}
              />
            </Suspense>
          </React.Fragment>
        );
      })}
    </>
  );
}