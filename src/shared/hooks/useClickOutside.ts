import { useEffect, type RefObject } from 'react';

/** Закрывает всплывающий элемент по клику вне его и по Escape */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return undefined;

    const handlePointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose();
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [ref, onClose, active]);
}
