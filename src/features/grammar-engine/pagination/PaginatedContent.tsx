import React, { useLayoutEffect, useRef } from 'react';
import { useAppScroll } from '../../../components';
import {
  DEFAULT_PAGINATION_CONFIG,
  paginate,
  type PaginationMarker,
  type PaginationPage,
} from './pagination';

export interface PaginatedContentProps {
  children: React.ReactNode;
  contentKey: string;
  pageIndex: number;
  onPagesChange: (contentKey: string, pages: PaginationPage[]) => void;
}

function getMarkerData(element: HTMLElement): PaginationMarker {
  return {
    name: element.dataset.paginateName,
    keepWithNext: element.dataset.keepWithNext === 'true',
    pageBreakBefore: element.dataset.pageBreakBefore === 'true',
  };
}

export const PaginatedContent: React.FC<PaginatedContentProps> = ({
  children,
  contentKey,
  pageIndex,
  onPagesChange,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pagesRef = useRef<PaginationPage[]>([]);
  const previousFocusRef = useRef<{ contentKey: string; pageIndex: number } | null>(
    null,
  );
  const { scrollContainerRef } = useAppScroll();

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const scrollContainer =
      scrollContainerRef?.current ??
      wrapper?.closest<HTMLDivElement>('[data-gq-scroll-container]');
    const content = wrapper?.querySelector<HTMLElement>('[data-paginate-content]');
    if (!wrapper || !scrollContainer || !content) return undefined;
    let isActive = true;

    const measure = () => {
      if (!isActive) return;
      const blocks = Array.from(
        content.querySelectorAll<HTMLElement>('[data-paginate-block]'),
      );
      if (blocks.length === 0) {
        const pages = [{ blockIndexes: [], height: 0, name: 'Content' }];
        pagesRef.current = pages;
        onPagesChange(contentKey, pages);
        return;
      }

      blocks.forEach((block) => {
        if (block.dataset.paginateOriginalDisplay === undefined) {
          block.dataset.paginateOriginalDisplay = block.style.display;
        }
        block.hidden = false;
        block.removeAttribute('aria-hidden');
        block.style.display = block.dataset.paginateOriginalDisplay ?? '';
      });

      const contentRect = content.getBoundingClientRect();
      const blockRects = blocks.map((block) => block.getBoundingClientRect());
      const heights = blockRects.map((rect, index) => {
        const previousBottom = index === 0 ? contentRect.top : blockRects[index - 1].bottom;
        return Math.max(0, rect.bottom - previousBottom);
      });
      if (blockRects.length > 0) {
        heights[heights.length - 1] += Math.max(
          0,
          contentRect.bottom - blockRects[blockRects.length - 1].bottom,
        );
      }

      const pages = paginate(
        heights,
        scrollContainer.clientHeight || scrollContainer.getBoundingClientRect().height,
        DEFAULT_PAGINATION_CONFIG,
        blocks.map(getMarkerData),
      );
      pagesRef.current = pages;
      blocks.forEach((block, index) => {
        const isCurrentPage = pages[
          Math.max(0, Math.min(pageIndex, pages.length - 1))
        ]?.blockIndexes.includes(index);
        block.hidden = !isCurrentPage;
        block.setAttribute('aria-hidden', String(!isCurrentPage));
        if (!isCurrentPage) block.style.display = 'none';
        else block.style.display = block.dataset.paginateOriginalDisplay ?? '';
      });
      onPagesChange(contentKey, pages);
    };

    measure();
    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(measure)
      : null;
    observer?.observe(scrollContainer);
    window.addEventListener('resize', measure);
    window.visualViewport?.addEventListener('resize', measure);
    void document.fonts?.ready.then(() => {
      if (isActive) measure();
    });

    return () => {
      isActive = false;
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      window.visualViewport?.removeEventListener('resize', measure);
    };
  }, [contentKey, onPagesChange, scrollContainerRef]);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const content = wrapper?.querySelector<HTMLElement>('[data-paginate-content]');
    if (!wrapper || !content) return;

    const blocks = Array.from(
      content.querySelectorAll<HTMLElement>('[data-paginate-block]'),
    );
    const pages = pagesRef.current;
    if (!pages) return;

    const activePage = pages[Math.max(0, Math.min(pageIndex, pages.length - 1))];
    blocks.forEach((block, index) => {
      const isCurrentPage = activePage?.blockIndexes.includes(index) ?? true;
      block.hidden = !isCurrentPage;
      block.setAttribute('aria-hidden', String(!isCurrentPage));
      block.style.display = isCurrentPage
        ? block.dataset.paginateOriginalDisplay ?? ''
        : 'none';
    });

    const previous = previousFocusRef.current;
    if (
      previous &&
      previous.contentKey === contentKey &&
      previous.pageIndex !== pageIndex
    ) {
      const firstBlock = blocks.find((_, index) =>
        activePage?.blockIndexes.includes(index),
      );
      const heading = firstBlock?.querySelector<HTMLElement>(
        'h1, h2, h3, [data-paginate-heading]',
      );
      const focusTarget = heading ?? firstBlock;
      if (focusTarget) {
        if (!focusTarget.hasAttribute('tabindex')) focusTarget.tabIndex = -1;
        focusTarget.focus({ preventScroll: true });
      }
    }
    previousFocusRef.current = { contentKey, pageIndex };
  }, [contentKey, pageIndex]);

  return (
    <div ref={wrapperRef} className="contents">
      {children}
    </div>
  );
};
