import { useEffect, useRef, type ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** error — красная шапка с «!», info — жёлтая с «i» */
  variant: 'error' | 'info';
  title?: string;
  children: ReactNode;
}

/**
 * Всплывающее окно на нативном <dialog>: showModal() сам блокирует страницу,
 * ловит фокус внутри и закрывается по Escape. Вид — по «экспликации».
 */
export function Modal({ open, onClose, variant, title, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`modal modal_variant_${variant}`}
      aria-label={title ?? (variant === 'error' ? 'Ошибка' : 'Информация')}
      // Escape закрывает окно силами браузера — сообщаем родителю
      onClose={onClose}
    >
      <div className="modal__head">
        <span className="modal__icon" aria-hidden="true">
          {variant === 'error' ? '!' : 'i'}
        </span>
      </div>
      <div className="modal__body">
        {title && <h2 className="modal__title">{title}</h2>}
        <div className="modal__text">{children}</div>
      </div>
      <div className="modal__footer">
        <button
          className="button button_variant_outline modal__close"
          type="button"
          onClick={onClose}
        >
          Понятно
        </button>
      </div>
    </dialog>
  );
}
