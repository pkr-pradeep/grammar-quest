/**
 * ============================================================================
 * GRAMMAR QUEST — UNIFIED ACCESSIBLE MODAL SYSTEM
 * ============================================================================
 * Shared React Portal modal container enforcing consistent viewport layering,
 * backdrop blur (5px) and navy dimming overlay (rgba(15, 20, 45, 0.28)),
 * body scroll lock, background `#root` inertness, keyboard focus trapping,
 * subtle reduced-motion-safe animations, and deterministic focus restoration.
 * ============================================================================
 */

import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from 'motion/react';
import {
  acquireModalLock,
  isTopMostModal,
  releaseModalLock,
} from './modalManager';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export type ModalPlacement = 'center' | 'bottom-sheet';

export interface ModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAfterClose?: () => void;
  /** Accessible dialog title element ID (`aria-labelledby`) */
  ariaLabelledBy?: string;
  /** Accessible dialog description element ID (`aria-describedby`) */
  ariaDescribedBy?: string;
  /** Fallback accessible label when `ariaLabelledBy` is omitted */
  ariaLabel?: string;
  /** Auto-opened modals show blurred backdrop on Frame 1 so unblurred page never flashes */
  immediateBackdrop?: boolean;
  /** Optional placement mode: centered dialog or mobile bottom-sheet / desktop center */
  placement?: ModalPlacement;
  /** Allow dismissing by clicking backdrop outside the dialog */
  closeOnBackdropClick?: boolean;
  /** Allow dismissing with Escape key */
  closeOnEscape?: boolean;
  /** Optional ref to focus on open (defaults to first focusable control in dialog) */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Optional explicit focus target on close (falls back to element focused before open) */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /** Optional ref forwarded to the dialog container */
  dialogRef?: React.RefObject<HTMLDivElement | null>;
  /** Visual classes applied to the foreground dialog container */
  dialogClassName?: string;
  /** Optional inline styles applied to the foreground dialog container */
  dialogStyle?: React.CSSProperties;
  children: React.ReactNode;
}

type ModalAnimPhase = 'closed' | 'entering' | 'open' | 'exiting';

export const ModalDialog: React.FC<ModalDialogProps> = ({
  isOpen,
  onClose,
  onAfterClose,
  ariaLabelledBy,
  ariaDescribedBy,
  ariaLabel,
  immediateBackdrop = false,
  placement = 'center',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  initialFocusRef,
  returnFocusRef,
  dialogRef: externalDialogRef,
  dialogClassName = '',
  dialogStyle,
  children,
}) => {
  const modalId = useId();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const internalDialogRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const wasEverOpenRef = useRef(isOpen);

  const [animPhase, setAnimPhase] = useState<ModalAnimPhase>(() =>
    isOpen ? 'entering' : 'closed',
  );
  const [skipBackdropFadeIn, setSkipBackdropFadeIn] = useState<boolean>(
    () => isOpen && immediateBackdrop,
  );

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const onAfterCloseRef = useRef(onAfterClose);
  onAfterCloseRef.current = onAfterClose;
  const returnFocusRefStable = useRef(returnFocusRef);
  returnFocusRefStable.current = returnFocusRef;

  const clearPendingTimer = () => {
    if (timerRef.current !== null && typeof window !== 'undefined') {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Synchronize open/close transitions smoothly without stacking or duplicate renders
  useEffect(() => {
    clearPendingTimer();

    if (isOpen) {
      wasEverOpenRef.current = true;
      setSkipBackdropFadeIn(immediateBackdrop);
      setAnimPhase('entering');

      const enterDuration = prefersReducedMotion ? 140 : 240;
      timerRef.current = window.setTimeout(() => {
        setAnimPhase('open');
        timerRef.current = null;
      }, enterDuration);

      return clearPendingTimer;
    }

    if (!wasEverOpenRef.current) {
      setAnimPhase('closed');
      return;
    }

    setAnimPhase((prev) => {
      if (prev === 'closed') return 'closed';
      return 'exiting';
    });

    const exitDuration = prefersReducedMotion ? 140 : 200;
    timerRef.current = window.setTimeout(() => {
      setAnimPhase('closed');
      setSkipBackdropFadeIn(false);
      timerRef.current = null;
      onAfterCloseRef.current?.();
    }, exitDuration);

    return clearPendingTimer;
  }, [isOpen, immediateBackdrop, prefersReducedMotion]);

  const isRendered = animPhase !== 'closed';
  const isInteractive = isRendered && isOpen && animPhase !== 'exiting';

  // Synchronous background scroll lock & #root inert management while portal is mounted
  useLayoutEffect(() => {
    if (!isRendered) return;
    acquireModalLock(modalId, returnFocusRefStable.current);
    return () => {
      releaseModalLock(modalId, true);
    };
  }, [isRendered, modalId]);

  // Initial focus inside dialog when interactive
  useEffect(() => {
    if (!isInteractive) return;
    const raf = window.requestAnimationFrame(() => {
      const container = internalDialogRef.current;
      if (!container) return;
      if (container.scrollTop !== 0) {
        container.scrollTop = 0;
      }

      const explicitTarget = initialFocusRef?.current;
      if (explicitTarget && container.contains(explicitTarget)) {
        explicitTarget.focus({ preventScroll: true });
        return;
      }

      const firstFocusable =
        container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      if (firstFocusable) {
        firstFocusable.focus({ preventScroll: true });
      } else {
        container.focus({ preventScroll: true });
      }
    });

    return () => window.cancelAnimationFrame(raf);
  }, [isInteractive, initialFocusRef]);

  // Keyboard Escape & Tab focus trapping restricted to topmost open modal
  useEffect(() => {
    if (!isInteractive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopMostModal(modalId)) return;

      if (event.key === 'Escape' && closeOnEscape) {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key === 'Tab') {
        const container = internalDialogRef.current;
        if (!container) return;
        const focusables = Array.from(
          container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        ).filter((el) => el.offsetParent !== null || el === document.activeElement);

        if (focusables.length === 0) {
          event.preventDefault();
          container.focus({ preventScroll: true });
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (!container.contains(active)) {
          event.preventDefault();
          first.focus({ preventScroll: true });
          return;
        }

        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus({ preventScroll: true });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isInteractive, modalId, closeOnEscape]);

  const assignDialogRefs = (node: HTMLDivElement | null) => {
    internalDialogRef.current = node;
    if (externalDialogRef) {
      externalDialogRef.current = node;
    }
  };

  if (!isRendered || typeof document === 'undefined') {
    return null;
  }

  const backdropAnimClass =
    animPhase === 'exiting'
      ? 'gq-modal-backdrop-exit'
      : animPhase === 'entering' && !skipBackdropFadeIn
        ? 'gq-modal-backdrop-enter'
        : '';

  const contentAnimClass =
    animPhase === 'exiting'
      ? 'gq-modal-content-exit'
      : animPhase === 'entering'
        ? 'gq-modal-content-enter'
        : '';

  const placementContainerClasses =
    placement === 'bottom-sheet'
      ? 'items-end sm:items-center justify-center p-0 sm:p-4'
      : 'items-center justify-center p-3 sm:p-5';

  return createPortal(
    <>
      {/* Layer 3: Full-Viewport Blurred & Subdued Backdrop (above all fixed navigation) */}
      <div
        aria-hidden="true"
        data-gq-modal-backdrop=""
        style={{
          backgroundColor: 'rgba(15, 20, 45, 0.28)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          touchAction: 'none',
        }}
        className={[
          'fixed inset-0 z-[100]',
          isInteractive ? 'pointer-events-auto' : 'pointer-events-none',
          backdropAnimClass,
        ]
          .filter(Boolean)
          .join(' ')}
      />

      {/* Layer 4: Foreground Dialog Positioning Layer */}
      <div
        role="presentation"
        onClick={(event) => {
          if (!isInteractive || !closeOnBackdropClick) return;
          if (event.target === event.currentTarget) {
            onCloseRef.current();
          }
        }}
        className={[
          'fixed inset-0 z-[110] flex overscroll-contain',
          placementContainerClasses,
          isInteractive ? 'pointer-events-auto' : 'pointer-events-none',
        ].join(' ')}
      >
        <div
          ref={assignDialogRefs}
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-label={!ariaLabelledBy ? ariaLabel : undefined}
          tabIndex={-1}
          onClick={(event) => event.stopPropagation()}
          style={dialogStyle}
          className={[
            'relative outline-none overscroll-contain',
            contentAnimClass,
            dialogClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>
      </div>
    </>,
    document.body,
  );
};
