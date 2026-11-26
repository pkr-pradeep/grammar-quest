import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  getNextPageTarget,
  getPreviousPageTarget,
  paginate,
} from './pagination';

describe('paginate', () => {
  it('keeps content on one page below the pagination threshold', () => {
    const pages = paginate([30, 40], 100);
    assert.equal(pages.length, 1);
    assert.deepEqual(pages[0].blockIndexes, [0, 1]);
  });

  it('packs blocks that exactly fill the page target together', () => {
    const pages = paginate([70, 20, 40], 100);
    assert.equal(pages.length, 2);
    assert.deepEqual(pages[0].blockIndexes, [0, 1]);
    assert.equal(pages[0].height, 90);
  });

  it('gives an oversize block its own page', () => {
    const pages = paginate([130, 35], 100);
    assert.equal(pages.length, 2);
    assert.deepEqual(pages[0].blockIndexes, [0]);
  });

  it('keeps a marked block with the following block', () => {
    const pages = paginate(
      [80, 30, 30],
      100,
      undefined,
      [{ keepWithNext: true, name: 'Heading' }, { name: 'Explanation' }, { name: 'Example' }],
    );
    assert.deepEqual(pages[0].blockIndexes, [0, 1]);
    assert.equal(pages[0].name, 'Heading');
  });

  it('starts a new page before a manually marked block', () => {
    const pages = paginate(
      [70, 70],
      100,
      undefined,
      [{ name: 'First' }, { name: 'Second', pageBreakBefore: true }],
    );
    assert.equal(pages.length, 2);
    assert.deepEqual(pages[1].blockIndexes, [1]);
  });

  it('merges a final page below the minimum fill threshold', () => {
    const pages = paginate([80, 80, 20], 100);
    assert.equal(pages.length, 2);
    assert.deepEqual(pages[1].blockIndexes, [1, 2]);
    assert.equal(pages[1].height, 100);
  });
});

describe('page navigation targets', () => {
  it('advances through pages before moving to the next step', () => {
    assert.deepEqual(getNextPageTarget(0, 2, 0, 3), {
      type: 'page',
      pageIndex: 1,
    });
    assert.deepEqual(getNextPageTarget(1, 2, 0, 3), {
      type: 'step',
      stepIndex: 1,
      pageIndex: 0,
    });
  });

  it('backs from page one to the previous step last page', () => {
    assert.deepEqual(getPreviousPageTarget(0, 2, 3), {
      type: 'step',
      stepIndex: 1,
      pageIndex: 2,
    });
  });
});
