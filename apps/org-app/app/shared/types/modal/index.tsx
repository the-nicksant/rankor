
export interface ModalInstance<T = any> {
  id: string;
  key: string;
  payload?: T;
  options?: {
    closeOnOverlayClick?: boolean;
    preventBodyScroll?: boolean;
  };
}

export type ModalProps<T = any> = {
  onClose: () => void
  payload?: T
  options?: any
}