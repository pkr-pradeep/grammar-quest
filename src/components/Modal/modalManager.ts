/**
 * ============================================================================
 * GRAMMAR QUEST — CENTRALIZED MODAL LOCK & STACK MANAGER
 * ============================================================================
 * Coordinates viewport scroll locking, background application inertness
 * (`#root`), modal stacking order for keyboard Escape handling, and reliable
 * focus restoration across all portal-mounted modals and dialogs.
 * ============================================================================
 */

interface ModalLockEntry {
  id: string;
  previousFocus: HTMLElement | null;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

const modalStack: ModalLockEntry[] = [];

interface SavedDocumentState {
  htmlOverflow: string;
  bodyOverflow: string;
  htmlOverscroll: string;
  bodyOverscroll: string;
  rootWasInert: boolean;
  rootPrevAriaHidden: string | null;
}

let savedState: SavedDocumentState | null = null;

function getAppRootElement(): (HTMLElement & { inert?: boolean }) | null {
  if (typeof document === 'undefined') return null;
  return document.getElementById('root') as (HTMLElement & { inert?: boolean }) | null;
}

function applyGlobalBackgroundLock(): void {
  if (typeof document === 'undefined' || savedState !== null) return;

  const html = document.documentElement;
  const body = document.body;
  const root = getAppRootElement();

  savedState = {
    htmlOverflow: html.style.overflow,
    bodyOverflow: body.style.overflow,
    htmlOverscroll: html.style.overscrollBehavior,
    bodyOverscroll: body.style.overscrollBehavior,
    rootWasInert: Boolean(root?.inert),
    rootPrevAriaHidden: root ? root.getAttribute('aria-hidden') : null,
  };

  html.style.overflow = 'hidden';
  body.style.overflow = 'hidden';
  html.style.overscrollBehavior = 'contain';
  body.style.overscrollBehavior = 'contain';

  if (root) {
    root.inert = true;
    root.setAttribute('aria-hidden', 'true');
  }
}

function restoreGlobalBackgroundLock(): void {
  if (typeof document === 'undefined' || savedState === null) return;

  const html = document.documentElement;
  const body = document.body;
  const root = getAppRootElement();

  html.style.overflow = savedState.htmlOverflow;
  body.style.overflow = savedState.bodyOverflow;
  html.style.overscrollBehavior = savedState.htmlOverscroll;
  body.style.overscrollBehavior = savedState.bodyOverscroll;

  if (root) {
    root.inert = savedState.rootWasInert;
    if (savedState.rootPrevAriaHidden === null) {
      root.removeAttribute('aria-hidden');
    } else {
      root.setAttribute('aria-hidden', savedState.rootPrevAriaHidden);
    }
  }

  savedState = null;
}

export function acquireModalLock(
  id: string,
  returnFocusRef?: React.RefObject<HTMLElement | null>,
): void {
  if (typeof document === 'undefined') return;
  if (modalStack.some((entry) => entry.id === id)) return;

  // Capture currently focused element BEFORE setting #root inert (setting inert blurs focus)
  const active = document.activeElement;
  const previousFocus =
    active instanceof HTMLElement && active !== document.body ? active : null;

  modalStack.push({ id, previousFocus, returnFocusRef });

  if (modalStack.length === 1) {
    applyGlobalBackgroundLock();
  }
}

export function releaseModalLock(id: string, restoreFocus = true): void {
  const index = modalStack.findIndex((entry) => entry.id === id);
  if (index === -1) return;

  const [removed] = modalStack.splice(index, 1);

  if (modalStack.length === 0) {
    restoreGlobalBackgroundLock();

    if (restoreFocus && typeof window !== 'undefined') {
      const target =
        removed.returnFocusRef?.current ?? removed.previousFocus ?? null;
      if (target && target.isConnected && typeof target.focus === 'function') {
        window.requestAnimationFrame(() => {
          if (target.isConnected) {
            target.focus({ preventScroll: true });
          }
        });
      }
    }
  }
}

export function isTopMostModal(id: string): boolean {
  if (modalStack.length === 0) return false;
  return modalStack[modalStack.length - 1].id === id;
}

export function getActiveModalCount(): number {
  return modalStack.length;
}
