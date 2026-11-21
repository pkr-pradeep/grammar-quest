/**
 * ============================================================================
 * GRAMMAR QUEST — SHARED TWO-DIRECTION PERSISTENT SCROLL INDICATOR
 * ============================================================================
 * Single circular 44px navy floating button anchored cleanly inside AppShell's
 * transparent content-relative overlay (zero ivory strip / zero gradient fade):
 *  - Hidden when content fits inside the primary scroll container.
 *  - Shows a downward arrow at the top or middle whenever more content exists
 *    below; tapping scrolls down to the next useful position.
 *  - Stays visible continuously while scrolling (never hides on scroll timers).
 *  - Switches to an upward arrow at or near the bottom (with subpixel/mobile
 *    tolerance); tapping smoothly returns to the top.
 *  - Tracks user scroll, programmatic scroll, DOM expand/collapse mutations,
 *    container/content resizes, viewport resizes, and orientation changes.
 *  - Respects prefers-reduced-motion.
 * ============================================================================
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface ScrollMoreHintProps {
  /** Accessible button label when pointing downward */
  ariaLabel?: string;
  /** Accessible button label when pointing upward (return to top) */
  returnToTopAriaLabel?: string;
  /** Minimum overflow in pixels required before showing the button */
  minOverflowPx?: number;
  /** Distance from the bottom (px) within which the arrow switches to upward */
  bottomBufferPx?: number;
  /** Primary scrollable container element owned by AppShell */
  scrollContainerEl?: HTMLElement | null;
  /** Optional fallback ref to primary scrollable container */
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
  /** Optional bottom clearance spacer ref excluded from raw overflow detection */
  clearanceSpacerRef?: React.RefObject<HTMLElement | null>;
  /** Key whose change immediately recalculates overflow & direction */
  recheckKey?: string | number;
  /** Notifies AppShell when the floating button is visible so bottom clearance stays active */
  onVisibleChange?: (isVisible: boolean) => void;
}

type IndicatorMode = 'hidden' | 'down' | 'up';

const DEFAULT_MIN_OVERFLOW_PX = 16;
const DEFAULT_BOTTOM_BUFFER_PX = 24;

export const ScrollMoreHint: React.FC<ScrollMoreHintProps> = ({
  ariaLabel = 'Scroll down to see more content',
  returnToTopAriaLabel = 'Scroll back to top',
  minOverflowPx = DEFAULT_MIN_OVERFLOW_PX,
  bottomBufferPx = DEFAULT_BOTTOM_BUFFER_PX,
  scrollContainerEl,
  scrollTargetRef,
  clearanceSpacerRef,
  recheckKey,
  onVisibleChange,
}) => {
  const [mode, setMode] = useState<IndicatorMode>('hidden');
  const lastVisibleRef = useRef<boolean>(false);

  const reportVisibility = useCallback(
    (nextMode: IndicatorMode) => {
      const nextVisible = nextMode !== 'hidden';
      if (lastVisibleRef.current !== nextVisible) {
        lastVisibleRef.current = nextVisible;
        onVisibleChange?.(nextVisible);
      }
    },
    [onVisibleChange],
  );

  const getTarget = useCallback(
    () => scrollContainerEl ?? scrollTargetRef?.current ?? null,
    [scrollContainerEl, scrollTargetRef],
  );

  const measure = useCallback(() => {
    if (typeof window === 'undefined') return;
    const target = getTarget();
    if (!target) {
      setMode('hidden');
      reportVisibility('hidden');
      return;
    }

    const clientHeight = target.clientHeight;
    if (clientHeight <= 0) {
      setMode('hidden');
      reportVisibility('hidden');
      return;
    }

    const spacerHeight = clearanceSpacerRef?.current?.offsetHeight ?? 0;
    const rawScrollHeight = Math.max(0, target.scrollHeight - spacerHeight);
    const hasOverflow = rawScrollHeight > clientHeight + minOverflowPx;

    if (!hasOverflow) {
      setMode('hidden');
      reportVisibility('hidden');
      return;
    }

    const actualMaxScrollTop = Math.max(0, target.scrollHeight - clientHeight);
    const scrollTop = Math.max(0, target.scrollTop);
    const remaining = actualMaxScrollTop - scrollTop;

    const nextMode: IndicatorMode =
      remaining <= bottomBufferPx ? 'up' : 'down';

    setMode(nextMode);
    reportVisibility(nextMode);
  }, [
    getTarget,
    clearanceSpacerRef,
    minOverflowPx,
    bottomBufferPx,
    reportVisibility,
  ]);

  useEffect(() => {
    const target = getTarget();
    if (!target) {
      setMode('hidden');
      reportVisibility('hidden');
      return;
    }

    let rafId = 0;
    let observedFirstChild: Element | null = null;

    const syncObservedChildren = (ro: ResizeObserver | null) => {
      if (!ro) return;
      const firstChild = target.firstElementChild;
      if (firstChild && firstChild !== observedFirstChild) {
        if (observedFirstChild) {
          ro.unobserve(observedFirstChild);
        }
        ro.observe(firstChild);
        observedFirstChild = firstChild;
      }
    };

    const scheduleMeasure = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        measure();
      });
    };

    // Immediate post-frame check + delayed check for late fonts/images/animations
    scheduleMeasure();
    const settleTimer = window.setTimeout(scheduleMeasure, 160);

    target.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure, { passive: true });
    window.addEventListener('orientationchange', scheduleMeasure, {
      passive: true,
    });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(scheduleMeasure);
      resizeObserver.observe(target);
      syncObservedChildren(resizeObserver);
    }

    let mutationObserver: MutationObserver | null = null;
    if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(() => {
        syncObservedChildren(resizeObserver);
        scheduleMeasure();
      });
      mutationObserver.observe(target, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'open', 'aria-expanded', 'hidden'],
      });
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimer);
      target.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
      window.removeEventListener('orientationchange', scheduleMeasure);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [getTarget, measure, reportVisibility, recheckKey]);

  // Cleanly clear visibility state on unmount
  useEffect(() => {
    return () => {
      if (lastVisibleRef.current) {
        lastVisibleRef.current = false;
        onVisibleChange?.(false);
      }
    };
  }, [onVisibleChange]);

  const handleClick = () => {
    if (typeof window === 'undefined') return;
    const target = getTarget();
    if (!target) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    if (mode === 'up') {
      target.scrollTo({ top: 0, behavior });
      if (prefersReducedMotion) {
        requestAnimationFrame(measure);
      }
      return;
    }

    if (mode === 'down') {
      const maxScrollTop = Math.max(0, target.scrollHeight - target.clientHeight);
      const step = Math.max(200, Math.round(target.clientHeight * 0.72));
      const remaining = maxScrollTop - target.scrollTop;
      const nextTop =
        remaining <= step + 40
          ? maxScrollTop
          : Math.min(maxScrollTop, target.scrollTop + step);
      target.scrollTo({ top: nextTop, behavior });
      if (prefersReducedMotion) {
        requestAnimationFrame(measure);
      }
    }
  };

  if (mode === 'hidden') {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={mode === 'up' ? returnToTopAriaLabel : ariaLabel}
      className={[
        'pointer-events-auto w-11 h-11 min-w-[44px] min-h-[44px] rounded-full shrink-0',
        'bg-[#1B2559] hover:bg-[#141D47] text-white',
        'inline-flex items-center justify-center shadow-[0_6px_16px_rgba(27,37,89,0.28)]',
        'transition-transform duration-150 active:scale-95 cursor-pointer',
        'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
      ].join(' ')}
    >
      {mode === 'up' ? (
        <ChevronUp className="w-5 h-5" strokeWidth={2.75} aria-hidden="true" />
      ) : (
        <ChevronDown
          className="gq-scroll-chevron w-5 h-5"
          strokeWidth={2.75}
          aria-hidden="true"
        />
      )}
    </button>
  );
};
