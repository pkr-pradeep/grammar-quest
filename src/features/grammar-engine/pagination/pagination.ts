export const PAGINATE_THRESHOLD = 1.25;
export const PAGE_FILL = 0.9;
export const MIN_LAST_PAGE_FILL = 0.25;

export interface PaginationConfig {
  paginateThreshold: number;
  pageFill: number;
  minLastPageFill: number;
}

export const DEFAULT_PAGINATION_CONFIG: PaginationConfig = {
  paginateThreshold: PAGINATE_THRESHOLD,
  pageFill: PAGE_FILL,
  minLastPageFill: MIN_LAST_PAGE_FILL,
};

export interface PaginationMarker {
  name?: string;
  keepWithNext?: boolean;
  pageBreakBefore?: boolean;
}

export interface PaginationPage {
  blockIndexes: number[];
  height: number;
  name: string;
}

export type PageNavigationTarget =
  | { type: 'page'; pageIndex: number }
  | { type: 'step'; stepIndex: number; pageIndex: number }
  | { type: 'complete' }
  | { type: 'none' };

interface PaginationUnit {
  blockIndexes: number[];
  height: number;
  name: string;
  pageBreakBefore: boolean;
}

export function paginate(
  blockHeights: number[],
  visibleHeight: number,
  config: PaginationConfig = DEFAULT_PAGINATION_CONFIG,
  markers: PaginationMarker[] = [],
): PaginationPage[] {
  const heights = blockHeights.map((height) =>
    Number.isFinite(height) ? Math.max(0, height) : 0,
  );
  if (heights.length === 0) {
    return [{ blockIndexes: [], height: 0, name: 'Content' }];
  }

  const names = heights.map((_, index) => markers[index]?.name?.trim() || 'Content');
  const totalHeight = heights.reduce((total, height) => total + height, 0);
  if (
    !Number.isFinite(visibleHeight) ||
    visibleHeight <= 0 ||
    totalHeight <= config.paginateThreshold * visibleHeight
  ) {
    return [
      {
        blockIndexes: heights.map((_, index) => index),
        height: totalHeight,
        name: names[0],
      },
    ];
  }

  const units: PaginationUnit[] = [];
  for (let index = 0; index < heights.length; ) {
    const blockIndexes = [index];
    let height = heights[index];
    while (
      markers[index]?.keepWithNext &&
      index + 1 < heights.length &&
      !markers[index + 1]?.pageBreakBefore
    ) {
      index += 1;
      blockIndexes.push(index);
      height += heights[index];
    }

    units.push({
      blockIndexes,
      height,
      name: names[blockIndexes[0]],
      pageBreakBefore: Boolean(markers[blockIndexes[0]]?.pageBreakBefore),
    });
    index += 1;
  }

  const pages: PaginationPage[] = [];
  let currentPage: PaginationPage = { blockIndexes: [], height: 0, name: 'Content' };
  const fillLimit = config.pageFill * visibleHeight;

  const finishPage = () => {
    if (currentPage.blockIndexes.length > 0) {
      pages.push(currentPage);
      currentPage = { blockIndexes: [], height: 0, name: 'Content' };
    }
  };

  for (const unit of units) {
    if (unit.pageBreakBefore) finishPage();

    if (
      currentPage.blockIndexes.length > 0 &&
      currentPage.height + unit.height > fillLimit
    ) {
      finishPage();
    }

    if (currentPage.blockIndexes.length === 0) {
      currentPage.name = unit.name;
    }
    currentPage.blockIndexes.push(...unit.blockIndexes);
    currentPage.height += unit.height;

    if (unit.height > visibleHeight) finishPage();
  }
  finishPage();

  if (
    pages.length > 1 &&
    pages[pages.length - 1].height < config.minLastPageFill * visibleHeight
  ) {
    const lastPage = pages.pop();
    const previousPage = pages[pages.length - 1];
    if (lastPage && previousPage) {
      previousPage.blockIndexes.push(...lastPage.blockIndexes);
      previousPage.height += lastPage.height;
    }
  }

  return pages;
}

export function getNextPageTarget(
  pageIndex: number,
  pageCount: number,
  stepIndex: number,
  stepCount: number,
): PageNavigationTarget {
  if (pageIndex + 1 < pageCount) {
    return { type: 'page', pageIndex: pageIndex + 1 };
  }
  if (stepIndex + 1 < stepCount) {
    return { type: 'step', stepIndex: stepIndex + 1, pageIndex: 0 };
  }
  return { type: 'complete' };
}

export function getPreviousPageTarget(
  pageIndex: number,
  stepIndex: number,
  previousStepPageCount: number,
): PageNavigationTarget {
  if (pageIndex > 0) {
    return { type: 'page', pageIndex: pageIndex - 1 };
  }
  if (stepIndex > 0) {
    return {
      type: 'step',
      stepIndex: stepIndex - 1,
      pageIndex: Math.max(0, previousStepPageCount - 1),
    };
  }
  return { type: 'none' };
}
