/**
 * ============================================================================
 * GRAMMAR QUEST — SHARED ICON-ONLY SCROLL CUE
 * ============================================================================
 * Unified 44px circular navy button with animated chevron-down icon centred
 * above the active bottom navigation bar, backed by a subtle 90px bottom fade.
 * Stays visible whenever more scrollable content remains below, hides cleanly
 * once the user reaches the end of the page, and reappears when scrolling up.
 * Respects prefers-reduced-motion.
 * ============================================================================
 */

import React, { useCallback, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface ScrollMoreHintProps {
  /** Accessible button label */
  ariaLabel?: string;
  /** Page canvas hex colour at the bottom fade gradient */
  fadeColor?: string;
  /** Positions the overlay/button above mobile tab bar, lesson nav, or viewport bottom */
  bottomOffsetMode?: 'app-nav' | 'lesson-nav' | 'none';
  /** Minimum overflow in pixels required before showing the cue */
  minOverflowPx?: number;
  /** Distance from the bottom of the page (px) at which the cue hides */
  bottomBufferPx?: number;
  /** Smooth scroll step distance in pixels */
  scrollStepPx?: number;
  /** Optional custom scrollable container ref; defaults to window / document */
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
  /** Key whose change immediately recalculates overflow state */
  recheckKey?: string | number;
}

const DEFAULT_MIN_OVERFLOW_PX = 24;
const DEFAULT_BOTTOM_BUFFER_PX = 24;
const DEFAULT_SCROLL_STEP_PX = 380;

export const ScrollMoreHint: React.FC<ScrollMoreHintProps> = ({
  ariaLabel = 'Scroll down to see more content',
  fadeColor = '#FDFCF9',
  bottomOffsetMode = 'app-nav',
  minOverflowPx = DEFAULT_MIN_OVERFLOW_PX,
  bottomBufferPx = DEFAULT_BOTTOM_BUFFER_PX,
  scrollStepPx = DEFAULT_SCROLL_STEP_PX,
  scrollTargetRef,
  recheckKey,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const measure = useCallback(() => {
    if (typeof window === 'undefined') return;

    const customEl = scrollTargetRef?.current ?? null;
    if (customEl) {
      const hasOverflow =
        customEl.scrollHeight > customEl.clientHeight + minOverflowPx;
      const remaining =
        customEl.scrollHeight - (customEl.scrollTop + customEl.clientHeight);
      setIsVisible(hasOverflow && remaining > bottomBufferPx);
      return;
    }

    const docEl = document.scrollingElement || document.documentElement;
    const scrollTop = window.scrollY ?? docEl.scrollTop ?? 0;
    const clientHeight = window.innerHeight || docEl.clientHeight;
    const scrollHeight = docEl.scrollHeight;
    const remaining = scrollHeight - (scrollTop + clientHeight);

    const hasOverflow = scrollHeight > clientHeight + minOverflowPx;
    setIsVisible(hasOverflow && remaining > bottomBufferPx);
  }, [scrollTargetRef, minOverflowPx, bottomBufferPx]);

  useEffect(() => {
    let rafId = 0;

    const scheduleMeasure = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };

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
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    const customEl = scrollTargetRef?.current ?? null;
    if (customEl) {
      customEl.scrollBy({ top: scrollStepPx, behavior });
    } else {
      window.scrollBy({ top: scrollStepPx, behavior });
    }
  };

  const gradientBottomStyle =
    bottomOffsetMode === 'app-nav'
      ? undefined
      : bottomOffsetMode === 'lesson-nav'
        ? { bottom: 'calc(68px + env(safe-area-inset-bottom, 0px))' }
        : { bottom: '0px' };

  const gradientBottomClass =
    bottomOffsetMode === 'app-nav'
      ? 'bottom-[calc(56px+env(safe-area-inset-bottom,0px))] md:bottom-0'
      : '';

  const buttonBottomStyle =
    bottomOffsetMode === 'app-nav'
      ? undefined
      : bottomOffsetMode === 'lesson-nav'
        ? { bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }
        : { bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' };

  const buttonBottomClass =
    bottomOffsetMode === 'app-nav'
      ? 'bottom-[calc(68px+env(safe-area-inset-bottom,0px))] md:bottom-4'
      : '';

  return (
    <>
      {/* Subtle 90px Bottom Gradient Fade */}
      <div
        aria-hidden="true"
        className={[
          'fixed left-0 right-0 h-[90px] pointer-events-none z-10 transition-opacity duration-200',
          gradientBottomClass,
          isVisible ? 'opacity-100' : 'opacity-0',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          ...gradientBottomStyle,
          background: `linear-gradient(to bottom, transparent 0%, ${fadeColor} 100%)`,
        }}
      />

      {/* 44px Circular Navy Icon-Only Scroll Cue */}
      <div
        aria-hidden={!isVisible || undefined}
        className={[
          'fixed left-0 right-0 z-20 flex justify-center pointer-events-none',
          buttonBottomClass,
        ]
          .filter(Boolean)
          .join(' ')}
        style={buttonBottomStyle}
      >
        <button
          type="button"
          onClick={handleScrollDown}
          aria-label={ariaLabel}
          aria-hidden={!isVisible}
          tabIndex={isVisible ? 0 : -1}
          className={[
            'w-11 h-11 rounded-full bg-[#1B2559] hover:bg-[#141D47] text-white',
            'inline-flex items-center justify-center shadow-[0_6px_16px_rgba(27,37,89,0.28)]',
            'transition-opacity duration-200 cursor-pointer',
            'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
            isVisible
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none',
          ].join(' ')}
        >
          <ChevronDown
            className="gq-scroll-chevron w-5 h-5"
            strokeWidth={2.75}
            aria-hidden="true"
          />
        </button>
      </div>
    </>
  );
};
