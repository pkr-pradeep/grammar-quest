/**
 * ============================================================================
 * GRAMMAR QUEST — SCROLL FOR MORE HINT
 * ============================================================================
 * Accessible floating scroll cue + soft bottom gradient fade shown whenever
 * page content overflows (scrollHeight > clientHeight + 24) and more content
 * remains below. Fades out cleanly once the user reaches the end of the page,
 * and reappears if they scroll back up.
 * ============================================================================
 */

import React, { useCallback, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface ScrollMoreHintProps {
  /** Text displayed inside the floating navy pill */
  label?: string;
  /** Accessible button label */
  ariaLabel?: string;
  /** Page canvas hex colour at the bottom of the 96px fade gradient */
  fadeColor?: string;
  /** Positions the overlay/pill above either the mobile tab bar, sticky lesson nav, or bottom edge */
  bottomOffsetMode?: 'app-nav' | 'lesson-nav' | 'none';
  /** Optional custom scrollable container ref; defaults to document scrollingElement / window */
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
  /** Key whose change immediately recalculates overflow state */
  recheckKey?: string | number;
}

const OVERFLOW_THRESHOLD_PX = 24;
const BOTTOM_REACHED_THRESHOLD_PX = 24;
const SCROLL_STEP_PX = 320;

export const ScrollMoreHint: React.FC<ScrollMoreHintProps> = ({
  label = 'More topics below',
  ariaLabel = 'Scroll down to see more topics',
  fadeColor = '#FBF6EA',
  bottomOffsetMode = 'app-nav',
  scrollTargetRef,
  recheckKey,
}) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [hasMoreBelow, setHasMoreBelow] = useState(true);

  const measure = useCallback(() => {
    const customEl = scrollTargetRef?.current ?? null;
    if (customEl) {
      const overflows = customEl.scrollHeight > customEl.clientHeight + OVERFLOW_THRESHOLD_PX;
      const remaining = customEl.scrollHeight - (customEl.scrollTop + customEl.clientHeight);
      setIsOverflowing(overflows);
      setHasMoreBelow(remaining > BOTTOM_REACHED_THRESHOLD_PX);
      return;
    }

    const docEl = document.scrollingElement || document.documentElement;
    const scrollTop = window.scrollY ?? docEl.scrollTop ?? 0;
    const clientHeight = window.innerHeight || docEl.clientHeight;
    const scrollHeight = docEl.scrollHeight;
    const remaining = scrollHeight - (scrollTop + clientHeight);

    setIsOverflowing(scrollHeight > clientHeight + OVERFLOW_THRESHOLD_PX);
    setHasMoreBelow(remaining > BOTTOM_REACHED_THRESHOLD_PX);
  }, [scrollTargetRef]);

  useEffect(() => {
    let rafId = 0;

    const scheduleMeasure = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };

    // Initial check and re-check when view/key updates
    scheduleMeasure();

    const customEl = scrollTargetRef?.current ?? null;
    const scrollTarget: EventTarget = customEl ?? window;

    scrollTarget.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure, { passive: true });

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(scheduleMeasure);
      observer.observe(customEl ?? document.body);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      scrollTarget.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
      observer?.disconnect();
    };
  }, [measure, scrollTargetRef, recheckKey]);

  const handleScrollDown = () => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    const customEl = scrollTargetRef?.current ?? null;
    if (customEl) {
      customEl.scrollBy({ top: SCROLL_STEP_PX, behavior });
    } else {
      window.scrollBy({ top: SCROLL_STEP_PX, behavior });
    }
  };

  if (!isOverflowing) {
    return null;
  }

  const isVisible = hasMoreBelow;

  const gradientBottomClass =
    bottomOffsetMode === 'app-nav'
      ? 'bottom-[calc(56px+env(safe-area-inset-bottom,0px))] md:bottom-0'
      : bottomOffsetMode === 'lesson-nav'
        ? 'bottom-[calc(61px+env(safe-area-inset-bottom,0px))]'
        : 'bottom-0';

  const pillBottomClass =
    bottomOffsetMode === 'app-nav'
      ? 'bottom-[calc(72px+env(safe-area-inset-bottom,0px))] md:bottom-4'
      : bottomOffsetMode === 'lesson-nav'
        ? 'bottom-[calc(77px+env(safe-area-inset-bottom,0px))]'
        : 'bottom-4';

  return (
    <>
      {/* 96px Non-Blocking Bottom Gradient Fade */}
      <div
        aria-hidden="true"
        className={[
          'fixed left-0 right-0 h-24 pointer-events-none z-10 transition-opacity duration-300',
          gradientBottomClass,
          isVisible ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${fadeColor} 100%)`,
        }}
      />

      {/* Centered Floating Pill Wrapper (avoids transform conflict with CSS keyframe float) */}
      <div
        className={[
          'fixed left-0 right-0 z-20 flex justify-center pointer-events-none px-4',
          pillBottomClass,
        ].join(' ')}
      >
        <button
          type="button"
          onClick={handleScrollDown}
          aria-label={ariaLabel}
          aria-hidden={!isVisible}
          tabIndex={isVisible ? 0 : -1}
          className={[
            'gq-scroll-pill inline-flex items-center justify-center gap-2.5 h-[44px] pl-4 pr-2.5 rounded-full',
            'bg-[#1B2559] hover:bg-[#141D47] text-white text-[13px] font-bold leading-none whitespace-nowrap',
            'shadow-[0_6px_18px_rgba(27,37,89,0.28)] cursor-pointer transition-[opacity,background-color] duration-300',
            'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
            isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
          ].join(' ')}
        >
          <span>{label}</span>
          <span
            aria-hidden="true"
            className="gq-scroll-ring w-6 h-6 rounded-full bg-[#F6B93B] inline-flex items-center justify-center shrink-0"
          >
            <ChevronDown
              className="gq-scroll-chevron w-[14px] h-[14px] text-[#1B2559]"
              strokeWidth={3}
              aria-hidden="true"
            />
          </span>
        </button>
      </div>
    </>
  );
};
