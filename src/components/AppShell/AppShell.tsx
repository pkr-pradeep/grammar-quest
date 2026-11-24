/**
 * ============================================================================
 * GRAMMAR QUEST — UNIFIED MOBILE APPLICATION SHELL & SINGLE SCROLL BOUNDARY
 * ============================================================================
 * Establishes one consistent viewport-bounded application frame across every
 * screen:
 *   A. Device-safe application boundary (100dvh with 100vh fallback)
 *   B. Screen header (shrink-0, top safe-area aware)
 *   C. Optional sub-header / stage tabs / step bar (prop or portal slot)
 *   D. Main content region with ONE primary vertical scrolling container,
 *      automatic bottom clearance spacer when floating controls are visible,
 *      and a transparent pointer-events-none floating control layer (zero
 *      ivory horizontal strip / zero gradient fade)
 *   E. Reserved screen-specific bottom action region (prop or portal slot)
 *   F. Application bottom navigation (shrink-0, mobile only, bottom safe-area)
 * ============================================================================
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Capacitor } from '@capacitor/core';
import { ScrollMoreHint } from '../ScrollMoreHint/ScrollMoreHint';

interface AppShellContextValue {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  scrollToTop: (behavior?: ScrollBehavior) => void;
  notifyLayoutChange: () => void;
  registerUtilityPortal: () => () => void;
  registerFooterPortal: () => () => void;
  subHeaderHost: HTMLDivElement | null;
  utilityBarHost: HTMLDivElement | null;
  footerHost: HTMLDivElement | null;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

/**
 * Access the active AppShell's single primary scroll container and helpers.
 */
export function useAppScroll(): {
  scrollContainerRef: React.RefObject<HTMLDivElement | null> | null;
  scrollToTop: (behavior?: ScrollBehavior) => void;
  notifyLayoutChange: () => void;
} {
  const ctx = useContext(AppShellContext);
  const fallbackScrollToTop = useCallback((behavior: ScrollBehavior = 'auto') => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior });
    }
  }, []);
  const noop = useCallback(() => {}, []);

  if (!ctx) {
    return {
      scrollContainerRef: null,
      scrollToTop: fallbackScrollToTop,
      notifyLayoutChange: noop,
    };
  }

  return {
    scrollContainerRef: ctx.scrollContainerRef,
    scrollToTop: ctx.scrollToTop,
    notifyLayoutChange: ctx.notifyLayoutChange,
  };
}

export interface AppShellSlotProps {
  /** Only render into the shared shell slot when the owning stage/tab is active. */
  isActive?: boolean;
  children: React.ReactNode;
}

/**
 * Portals screen-specific sub-header chrome (e.g. Step progress bar or A–F tabs)
 * into Region C of the enclosing AppShell.
 */
export const AppShellSubHeader: React.FC<AppShellSlotProps> = ({
  isActive = true,
  children,
}) => {
  const ctx = useContext(AppShellContext);
  const notify = ctx?.notifyLayoutChange;

  useEffect(() => {
    notify?.();
    return () => {
      notify?.();
    };
  }, [isActive, notify]);

  if (!isActive || !ctx?.subHeaderHost) return null;
  return createPortal(children, ctx.subHeaderHost);
};

/**
 * Portals screen-specific floating bottom controls (e.g. Learn Guide Button)
 * into Region D's transparent bottom-right control layer, paired cleanly
 * beside the persistent circular scroll indicator.
 */
export const AppShellUtilityBar: React.FC<AppShellSlotProps> = ({
  isActive = true,
  children,
}) => {
  const ctx = useContext(AppShellContext);
  const registerUtilityPortal = ctx?.registerUtilityPortal;

  useEffect(() => {
    if (!isActive || !registerUtilityPortal) return;
    return registerUtilityPortal();
  }, [isActive, registerUtilityPortal]);

  if (!isActive || !ctx?.utilityBarHost) return null;
  return createPortal(children, ctx.utilityBarHost);
};

/**
 * Alias for placing floating controls into Region D's transparent control layer.
 */
export const AppShellFloatingOverlay = AppShellUtilityBar;

/**
 * Portals screen-specific bottom action bars into Region E of the enclosing
 * AppShell (reserved flex row strictly below the primary scroll container).
 */
export const AppShellFooter: React.FC<AppShellSlotProps> = ({
  isActive = true,
  children,
}) => {
  const ctx = useContext(AppShellContext);
  const notify = ctx?.notifyLayoutChange;
  const registerFooterPortal = ctx?.registerFooterPortal;

  useEffect(() => {
    notify?.();
    const unregister = isActive ? registerFooterPortal?.() : undefined;
    return () => {
      unregister?.();
      notify?.();
    };
  }, [isActive, notify, registerFooterPortal]);

  if (!isActive || !ctx?.footerHost) return null;
  return createPortal(children, ctx.footerHost);
};

export interface AppShellProps {
  /** Region B: Screen header (top safe-area inset applied automatically). */
  header?: React.ReactNode;
  /** Optional background/border classes for the top safe-area header wrapper. */
  headerWrapperClassName?: string;
  /** Region C: Optional static sub-header / stage navigation. */
  subHeader?: React.ReactNode;
  /** Region D: Scrollable main content. */
  children: React.ReactNode;
  /** Region E: Optional static screen-specific bottom action bar. */
  footer?: React.ReactNode;
  /** Region F: Optional application bottom navigation bar (mobile only). */
  bottomNav?: React.ReactNode;
  /** Outer shell canvas classes (e.g. background & text colours). */
  className?: string;
  /** Classes applied directly to the single primary scrolling container. */
  scrollContainerClassName?: string;
  /** Max-width alignment class for floating bottom controls (matches content column). */
  utilityMaxWidthClassName?: string;
  /** Optional external ref forwarded to the primary scroll container. */
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  /** Whether to enable the two-direction floating scroll indicator. Defaults to true. */
  showScrollHint?: boolean;
  /** Accessible label for the downward scroll indicator button. */
  scrollHintAriaLabel?: string;
  /** Accessible label for the upward return-to-top button. */
  scrollHintReturnToTopAriaLabel?: string;
  /** Minimum pixel overflow before showing the scroll indicator. */
  scrollHintMinOverflowPx?: number;
  /** Key whose change immediately re-measures scroll state. */
  scrollRecheckKey?: string | number;
  /** Additional HTML attributes on the root container. */
  ariaLabelledBy?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  header,
  headerWrapperClassName = 'bg-white/95 backdrop-blur-md border-b border-[#E5E2D9]',
  subHeader,
  children,
  footer,
  bottomNav,
  className = 'bg-[#FDFCF9] text-[#333333]',
  scrollContainerClassName = '',
  utilityMaxWidthClassName = 'max-w-[1120px]',
  scrollContainerRef: externalScrollRef,
  showScrollHint = true,
  scrollHintAriaLabel = 'Scroll down to see more content',
  scrollHintReturnToTopAriaLabel = 'Scroll back to top',
  scrollHintMinOverflowPx = 16,
  scrollRecheckKey,
  ariaLabelledBy,
}) => {
  const internalScrollRef = useRef<HTMLDivElement | null>(null);
  const activeScrollRef = externalScrollRef ?? internalScrollRef;
  const clearanceSpacerRef = useRef<HTMLDivElement | null>(null);

  const [scrollContainerEl, setScrollContainerEl] = useState<HTMLDivElement | null>(
    null,
  );
  const [subHeaderHost, setSubHeaderHost] = useState<HTMLDivElement | null>(null);
  const [utilityBarHost, setUtilityBarHost] = useState<HTMLDivElement | null>(null);
  const [footerHost, setFooterHost] = useState<HTMLDivElement | null>(null);
  const [layoutRevision, setLayoutRevision] = useState(0);
  const [utilityPortalCount, setUtilityPortalCount] = useState(0);
  const [footerPortalCount, setFooterPortalCount] = useState(0);
  const [isScrollIndicatorVisible, setIsScrollIndicatorVisible] = useState(false);

  const handleScrollContainerNode = useCallback(
    (node: HTMLDivElement | null) => {
      (activeScrollRef as React.MutableRefObject<HTMLDivElement | null>).current =
        node;
      setScrollContainerEl(node);
    },
    [activeScrollRef],
  );

  const notifyLayoutChange = useCallback(() => {
    setLayoutRevision((r) => r + 1);
  }, []);

  const registerUtilityPortal = useCallback(() => {
    setUtilityPortalCount((c) => c + 1);
    return () => {
      setUtilityPortalCount((c) => Math.max(0, c - 1));
    };
  }, []);

  const registerFooterPortal = useCallback(() => {
    setFooterPortalCount((c) => c + 1);
    return () => {
      setFooterPortalCount((c) => Math.max(0, c - 1));
    };
  }, []);

  const scrollToTop = useCallback(
    (behavior: ScrollBehavior = 'auto') => {
      const el = activeScrollRef.current;
      if (!el) return;
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : behavior,
      });
      notifyLayoutChange();
    },
    [activeScrollRef, notifyLayoutChange],
  );

  const contextValue = useMemo<AppShellContextValue>(
    () => ({
      scrollContainerRef: activeScrollRef,
      scrollToTop,
      notifyLayoutChange,
      registerUtilityPortal,
      registerFooterPortal,
      subHeaderHost,
      utilityBarHost,
      footerHost,
    }),
    [
      activeScrollRef,
      scrollToTop,
      notifyLayoutChange,
      registerUtilityPortal,
      registerFooterPortal,
      subHeaderHost,
      utilityBarHost,
      footerHost,
    ],
  );

  const hasBottomNav = Boolean(bottomNav);
  const hasFooter = Boolean(footer) || footerPortalCount > 0;
  const hasPersistentUtility = utilityPortalCount > 0;
  const needsBottomClearance =
    hasPersistentUtility || (showScrollHint && isScrollIndicatorVisible);
  const headerSafeAreaClassName =
    Capacitor.getPlatform() === 'android' ? '' : 'pt-[env(safe-area-inset-top,0px)]';

  return (
    <AppShellContext.Provider value={contextValue}>
      {/* A. Device-Safe Application Boundary */}
      <div
        aria-labelledby={ariaLabelledBy}
        className={['gq-app-shell', className].filter(Boolean).join(' ')}
      >
        {/* B. Screen Header (Android's top system inset is already applied natively) */}
        {header ? (
          <div
            className={[
              'relative shrink-0 z-40',
              headerSafeAreaClassName,
              headerWrapperClassName,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {header}
          </div>
        ) : null}

        {/* C. Optional Screen Tabs / Stage Sub-Header (static prop and/or active stage portal) */}
        {subHeader ? <div className="relative shrink-0 z-30">{subHeader}</div> : null}
        <div ref={setSubHeaderHost} className="relative shrink-0 z-30 empty:hidden" />

        {/* D. Main Content Region (ONE primary scrolling container + transparent floating control layer) */}
        <div className="relative flex-1 min-h-0 flex flex-col">
          <div
            ref={handleScrollContainerNode}
            data-gq-scroll-container="true"
            className={[
              'flex-1 min-h-0 overflow-y-auto overflow-x-clip overscroll-y-contain',
              scrollContainerClassName,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {children}
            {/* Bottom clearance spacer so final cards/questions scroll completely above floating controls */}
            <div
              ref={clearanceSpacerRef}
              aria-hidden="true"
              className={needsBottomClearance ? 'h-14 shrink-0' : 'hidden'}
            />
          </div>

          {/* Transparent Floating Control Layer (no background, no ivory strip, no gradient fade) */}
          <div
            className={[
              'pointer-events-none absolute inset-x-0 z-20',
              hasFooter || hasBottomNav
                ? 'bottom-3'
                : 'bottom-[calc(12px+env(safe-area-inset-bottom,0px))]',
            ].join(' ')}
          >
            <div
              className={[
                'mx-auto w-full px-3 sm:px-6 flex items-center justify-end gap-2.5',
                utilityMaxWidthClassName,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {showScrollHint ? (
                <ScrollMoreHint
                  ariaLabel={scrollHintAriaLabel}
                  returnToTopAriaLabel={scrollHintReturnToTopAriaLabel}
                  minOverflowPx={scrollHintMinOverflowPx}
                  scrollContainerEl={scrollContainerEl}
                  scrollTargetRef={activeScrollRef}
                  clearanceSpacerRef={clearanceSpacerRef}
                  recheckKey={`${scrollRecheckKey ?? ''}-${layoutRevision}`}
                  onVisibleChange={setIsScrollIndicatorVisible}
                />
              ) : null}

              <div
                ref={setUtilityBarHost}
                className="pointer-events-none flex items-center justify-end gap-2 empty:hidden"
              />
            </div>
          </div>
        </div>

        {/* E. Reserved Screen-Specific Bottom Action Region */}
        {footer ? (
          <div
            className={[
              'shrink-0 z-20 bg-white/95 backdrop-blur-md border-t border-[#E5E2D9]',
              hasBottomNav ? '' : 'pb-[env(safe-area-inset-bottom,0px)]',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {footer}
          </div>
        ) : null}
        <div
          ref={setFooterHost}
          className={[
            'shrink-0 z-20 empty:hidden bg-white/95 backdrop-blur-md border-t border-[#E5E2D9]',
            hasBottomNav ? '' : 'pb-[env(safe-area-inset-bottom,0px)]',
          ]
            .filter(Boolean)
            .join(' ')}
        />

        {/* F. Application Bottom Navigation (mobile only, bottom safe-area aware) */}
        {bottomNav ? (
          <div className="md:hidden shrink-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E5E2D9] pb-[env(safe-area-inset-bottom,0px)]">
            {bottomNav}
          </div>
        ) : null}
      </div>
    </AppShellContext.Provider>
  );
};
