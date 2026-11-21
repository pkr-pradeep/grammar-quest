/**
 * ============================================================================
 * GRAMMAR QUEST — SHARED BACK-TO-TOP UTILITY CONTROL
 * ============================================================================
 * Circular 44px navy Back-to-Top button rendered inside AppShell's reserved
 * bottom utility area (strictly outside scrollable content so it never
 * overlaps cards, category labels, questions, or feedback):
 *  - Hidden at the top of the screen.
 *  - Shows after scrolling down a meaningful distance once scrolling settles.
 *  - Hides immediately while actively scrolling, then reappears after
 *    scrolling settles if still away from the top.
 *  - Hides again when returning to the top (with hysteresis to avoid flicker).
 *  - Respects prefers-reduced-motion.
 * ============================================================================
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export interface ScrollMoreHintProps {
  /** Accessible button label */
  ariaLabel?: string;
  /** Minimum total overflow (px) before Back-to-Top can activate */
  minOverflowPx?: number;
  /** Distance scrolled down from top (px) required before showing Back-to-Top */
  showThresholdPx?: number;
  /** Scroll distance near top (px) at which Back-to-Top hides again (hysteresis) */
  hideThresholdPx?: number;
  /** Primary scrollable container ref owned by AppShell */
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
  /** Key whose change immediately resets/recalculates scroll state */
  recheckKey?: string | number;
  /** Callback notifying AppShell whether the reserved utility slot should stay open */
  onSlotActiveChange?: (isOpen: boolean) => void;
}

const DEFAULT_MIN_OVERFLOW_PX = 24;
const DEFAULT_SHOW_THRESHOLD_PX = 120;
const DEFAULT_HIDE_THRESHOLD_PX = 48;
const SCROLL_SETTLE_DELAY_MS = 240;
const UTILITY_BAR_HEIGHT_PX = 52;

export const ScrollMoreHint: React.FC<ScrollMoreHintProps> = ({
  ariaLabel = 'Scroll back to top',
  minOverflowPx = DEFAULT_MIN_OVERFLOW_PX,
  showThresholdPx = DEFAULT_SHOW_THRESHOLD_PX,
  hideThresholdPx = DEFAULT_HIDE_THRESHOLD_PX,
  scrollTargetRef,
  recheckKey,
  onSlotActiveChange,
}) => {
  const [isAwayFromTop, setIsAwayFromTop] = useState(false);
  const [isActivelyScrolling, setIsActivelyScrolling] = useState(false);

  const isAwayRef = useRef(false);
  const settleTimerRef = useRef<number | null>(null);
  const ignoreScrollUntilRef = useRef<number>(0);

  const updateAwayState = useCallback(
    (nextAway: boolean) => {
      if (isAwayRef.current !== nextAway) {
        isAwayRef.current = nextAway;
        setIsAwayFromTop(nextAway);
        onSlotActiveChange?.(nextAway);
      }
    },
    [onSlotActiveChange],
  );

  const evaluatePosition = useCallback(
    (allowBottomCompensation: boolean) => {
      if (typeof window === 'undefined') return;
      const target = scrollTargetRef?.current ?? null;
      if (!target) {
        updateAwayState(false);
        return;
      }

      const { scrollTop, clientHeight, scrollHeight } = target;
      const hasOverflow = scrollHeight > clientHeight + minOverflowPx;
      if (!hasOverflow) {
        updateAwayState(false);
        return;
      }

      const wasAway = isAwayRef.current;
      const nextAway = wasAway
        ? scrollTop > hideThresholdPx
        : scrollTop >= showThresholdPx;

      // If opening the utility bar right when the user settled at the very bottom,
      // gently keep the final card in view without triggering a scroll-hide flicker.
      if (allowBottomCompensation && !wasAway && nextAway) {
        const remaining = scrollHeight - (scrollTop + clientHeight);
        if (remaining < UTILITY_BAR_HEIGHT_PX) {
          const compensation = Math.max(0, UTILITY_BAR_HEIGHT_PX - remaining);
          ignoreScrollUntilRef.current = performance.now() + 120;
          requestAnimationFrame(() => {
            const el = scrollTargetRef?.current;
            if (!el) return;
            ignoreScrollUntilRef.current = performance.now() + 120;
            el.scrollTop = Math.min(
              Math.max(0, el.scrollHeight - el.clientHeight),
              el.scrollTop + compensation,
            );
          });
        }
      }

      updateAwayState(nextAway);
    },
    [
      scrollTargetRef,
      minOverflowPx,
      showThresholdPx,
      hideThresholdPx,
      updateAwayState,
    ],
  );

  useEffect(() => {
    let rafId = 0;

    const clearSettleTimer = () => {
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
    };

    const scheduleEvaluate = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        evaluatePosition(false);
      });
    };

    const handleScroll = () => {
      if (performance.now() < ignoreScrollUntilRef.current) {
        return;
      }

      setIsActivelyScrolling(true);
      clearSettleTimer();
      settleTimerRef.current = window.setTimeout(() => {
        settleTimerRef.current = null;
        evaluatePosition(true);
        setIsActivelyScrolling(false);
      }, SCROLL_SETTLE_DELAY_MS);
    };

    // Reset active scroll state on screen/stage/tab change and measure immediately
    setIsActivelyScrolling(false);
    scheduleEvaluate();

    const target = scrollTargetRef?.current ?? null;
    if (target) {
      target.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('resize', scheduleEvaluate, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (target && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(scheduleEvaluate);
      resizeObserver.observe(target);
      if (target.firstElementChild) {
        resizeObserver.observe(target.firstElementChild);
      }
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      clearSettleTimer();
      if (target) {
        target.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', scheduleEvaluate);
      resizeObserver?.disconnect();
    };
  }, [evaluatePosition, scrollTargetRef, recheckKey]);

  // Cleanly notify parent if unmounted while open
  useEffect(() => {
    return () => {
      if (isAwayRef.current) {
        isAwayRef.current = false;
        onSlotActiveChange?.(false);
      }
    };
  }, [onSlotActiveChange]);

  const handleBackToTop = () => {
    if (typeof window === 'undefined') return;
    const target = scrollTargetRef?.current ?? null;
    if (!target) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    setIsActivelyScrolling(true);
    target.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
    }
    settleTimerRef.current = window.setTimeout(
      () => {
        settleTimerRef.current = null;
        evaluatePosition(false);
        setIsActivelyScrolling(false);
      },
      prefersReducedMotion ? 50 : SCROLL_SETTLE_DELAY_MS,
    );
  };

  const isVisible = isAwayFromTop && !isActivelyScrolling;

  return (
    <button
      type="button"
      onClick={handleBackToTop}
      aria-label={ariaLabel}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={[
        'w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#1B2559] hover:bg-[#141D47] text-white shrink-0',
        'inline-flex items-center justify-center shadow-[0_6px_16px_rgba(27,37,89,0.28)]',
        'transition-opacity duration-200 cursor-pointer',
        'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
        isVisible
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none',
      ].join(' ')}
    >
      <ChevronUp className="w-5 h-5" strokeWidth={2.75} aria-hidden="true" />
    </button>
  );
};
