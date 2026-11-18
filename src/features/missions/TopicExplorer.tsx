/**
 * ============================================================================
 * GRAMMAR QUEST — LESSONS EXPLORER
 * ============================================================================
 * Structured, mobile-first grammar explorer organising all 22 lessons by
 * grammar group with search, status & group filters, unified status
 * badges (Not started / In progress / Completed / Coming soon), clear primary
 * actions, gated Test triggers, and auto-expanded active groups.
 * ============================================================================
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Clock,
  Play,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type {
  PlaceholderMissionSummary,
  StudentProgressRecord,
} from '../../schemas/lesson.schema';
import type { AssessmentAttemptRecord } from '../../schemas/assessment.schema';
import {
  CURRICULUM_TOPIC_CATALOG,
  getMissionIdForTopic,
  resolveUnifiedLessonStatus,
  type CurriculumTopicItem,
  type UnifiedLessonStatus,
} from '../../content/curriculumCatalog';
import { hasInteractiveLesson } from '../../content/lessons/lessonRegistry';
import { hasFormalAssessment } from '../../content/assessments/assessmentRegistry';
import { createDefaultProgress } from '../../storage/progressRepository';
import { ModalDialog } from '../../components';

export type StatusFilterOption = 'all' | 'ready' | 'completed' | 'upcoming';

export interface TopicExplorerProps {
  completedMissionIds: string[];
  progress?: StudentProgressRecord;
  assessmentAttemptsByMission?: Record<string, AssessmentAttemptRecord>;
  onStartMissionLesson: (missionId: string) => void;
  onOpenAssessment?: (missionId: string) => void;
  onPreviewMission?: (mission: PlaceholderMissionSummary) => void;
}

const STATUS_TABS: { id: StatusFilterOption; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ready', label: 'Ready' },
  { id: 'completed', label: 'Completed' },
  { id: 'upcoming', label: 'Coming soon' },
];

export const TopicExplorer: React.FC<TopicExplorerProps> = ({
  completedMissionIds,
  progress,
  assessmentAttemptsByMission = {},
  onStartMissionLesson,
  onOpenAssessment,
}) => {
  const effectiveProgress: StudentProgressRecord = useMemo(
    () =>
      progress ?? {
        ...createDefaultProgress(9),
        completedMissionIds,
      },
    [progress, completedMissionIds],
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const filterTriggerRef = useRef<HTMLButtonElement | null>(null);

  const getTopicAvailability = (
    topic: CurriculumTopicItem,
  ): {
    isAvailable: boolean;
    missionId?: string;
    unifiedStatus: UnifiedLessonStatus;
    filterBucket: 'ready' | 'completed' | 'upcoming';
  } => {
    const missionId = getMissionIdForTopic(topic);
    const isAvailable =
      topic.status === 'ready' && Boolean(missionId && hasInteractiveLesson(missionId));

    if (!isAvailable || !missionId) {
      return {
        isAvailable: false,
        missionId,
        unifiedStatus: 'not-started',
        filterBucket: 'upcoming',
      };
    }

    const unifiedStatus = resolveUnifiedLessonStatus(effectiveProgress, missionId);
    return {
      isAvailable: true,
      missionId,
      unifiedStatus,
      filterBucket: unifiedStatus === 'completed' ? 'completed' : 'ready',
    };
  };

  // Groups containing an In-progress lesson
  const inProgressGroupIds = useMemo(() => {
    const ids = new Set<string>();
    for (const cat of CURRICULUM_TOPIC_CATALOG) {
      for (const topic of cat.topics) {
        const { isAvailable, unifiedStatus } = getTopicAvailability(topic);
        if (isAvailable && unifiedStatus === 'in-progress') {
          ids.add(cat.id);
        }
      }
    }
    return ids;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveProgress]);

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const cat of CURRICULUM_TOPIC_CATALOG) {
      initial[cat.id] = cat.defaultExpanded || inProgressGroupIds.has(cat.id);
    }
    return initial;
  });

  // Sync newly discovered active (in-progress) groups once local progress finishes loading
  const syncedInProgressRef = useRef<string>('');
  useEffect(() => {
    const signature = Array.from(inProgressGroupIds).sort().join(',');
    if (!signature || signature === syncedInProgressRef.current) return;
    syncedInProgressRef.current = signature;
    setExpandedCategories((prev) => {
      const next = { ...prev };
      for (const id of inProgressGroupIds) {
        next[id] = true;
      }
      return next;
    });
  }, [inProgressGroupIds]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matchesSearch = (topic: CurriculumTopicItem, categoryTitle: string): boolean => {
    if (normalizedQuery.length > 0) {
      const haystack = [
        topic.title,
        categoryTitle,
        topic.conceptSummary,
        topic.missionTitle ?? '',
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  };

  // Status counts reflect the current search query and group filter, NOT the status filter.
  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilterOption, number> = {
      all: 0,
      ready: 0,
      completed: 0,
      upcoming: 0,
    };

    for (const cat of CURRICULUM_TOPIC_CATALOG) {
      if (categoryFilter !== 'all' && cat.id !== categoryFilter) continue;
      for (const topic of cat.topics) {
        if (!matchesSearch(topic, cat.title)) continue;
        const { filterBucket } = getTopicAvailability(topic);
        counts.all += 1;
        counts[filterBucket] += 1;
      }
    }

    return counts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedQuery, categoryFilter, effectiveProgress]);

  const filteredCategories = useMemo(() => {
    return CURRICULUM_TOPIC_CATALOG.filter(
      (cat) => categoryFilter === 'all' || cat.id === categoryFilter,
    )
      .map((cat) => {
        const matchedLessons = cat.topics
          .filter((topic) => {
            if (!matchesSearch(topic, cat.title)) return false;
            const { filterBucket } = getTopicAvailability(topic);
            if (statusFilter !== 'all' && filterBucket !== statusFilter) {
              return false;
            }
            return true;
          })
          // Always ensure ready/completed lessons appear before Coming soon lessons
          .sort((a, b) => {
            const aReady = getTopicAvailability(a).isAvailable ? 0 : 1;
            const bReady = getTopicAvailability(b).isAvailable ? 0 : 1;
            return aReady - bReady;
          });

        return {
          ...cat,
          topics: matchedLessons,
        };
      })
      .filter((cat) => cat.topics.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter, normalizedQuery, effectiveProgress]);

  // Auto-expand matching groups while searching or filtering to a single group.
  useEffect(() => {
    if (normalizedQuery.length === 0 && categoryFilter === 'all') return;

    setExpandedCategories((prev) => {
      const next = { ...prev };
      for (const cat of CURRICULUM_TOPIC_CATALOG) {
        if (categoryFilter === 'all' || cat.id === categoryFilter) {
          next[cat.id] = true;
        }
      }
      return next;
    });
  }, [normalizedQuery, categoryFilter]);

  const totalLessonCount = CURRICULUM_TOPIC_CATALOG.reduce(
    (sum, cat) => sum + cat.topics.length,
    0,
  );
  const matchingLessonCount = filteredCategories.reduce(
    (sum, cat) => sum + cat.topics.length,
    0,
  );

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const allVisibleExpanded =
    filteredCategories.length > 0 &&
    filteredCategories.every((cat) => Boolean(expandedCategories[cat.id]));

  const handleToggleExpandCollapseAll = () => {
    const targetExpanded = !allVisibleExpanded;
    setExpandedCategories((prev) => {
      const next = { ...prev };
      for (const cat of filteredCategories) {
        next[cat.id] = targetExpanded;
      }
      return next;
    });
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  const resetSheetFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  const activeFilterCount =
    (statusFilter !== 'all' ? 1 : 0) + (categoryFilter !== 'all' ? 1 : 0);
  const selectedCategoryObj =
    categoryFilter === 'all'
      ? null
      : CURRICULUM_TOPIC_CATALOG.find((c) => c.id === categoryFilter) ?? null;

  return (
    <div className="space-y-3.5">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-[26px] leading-[1.2] font-extrabold tracking-[-0.02em] text-[#1B2559]">
          Lessons
        </h1>
        <p className="text-[13px] leading-[1.4] font-normal text-[#6B6557] mt-1">
          Explore English grammar lessons organised by concept group
        </p>
      </div>

      {/* Search Row: Pill Search Input + Round Navy Filter Button */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1 min-w-0">
          <label htmlFor="lesson-search-input" className="sr-only">
            Search lessons
          </label>
          <Search
            className="w-[18px] h-[18px] text-[#6B6557] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="lesson-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons"
            className="w-full h-12 pl-11 pr-11 rounded-full bg-white border-[1.5px] border-[#E4DCC6] text-[15px] font-medium text-[#1B2559] placeholder:text-[#6B6557] focus:outline-none focus:border-[#1B2559] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559] [&::-webkit-search-cancel-button]:appearance-none"
          />
          {searchQuery.length > 0 ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 inline-flex items-center justify-center rounded-full text-[#6B6557] hover:text-[#1B2559] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <button
          ref={filterTriggerRef}
          type="button"
          onClick={() => setIsFilterSheetOpen(true)}
          aria-label={
            activeFilterCount > 0
              ? `Open filters (${activeFilterCount} active)`
              : 'Open filters'
          }
          aria-haspopup="dialog"
          aria-expanded={isFilterSheetOpen}
          className="relative w-12 h-12 shrink-0 rounded-full bg-[#1B2559] hover:bg-[#141D47] text-white inline-flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
        >
          <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
          {activeFilterCount > 0 ? (
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F6B93B] text-[#1B2559] text-[11px] font-extrabold leading-none inline-flex items-center justify-center ring-2 ring-[#FBF6EA]"
            >
              {activeFilterCount}
            </span>
          ) : null}
        </button>
      </div>

      {/* 4-Column Status Segmented Control */}
      <div
        role="tablist"
        aria-label="Filter lessons by status"
        className="grid grid-cols-4 gap-1 p-1 rounded-[18px] bg-[#F1EBDA]"
      >
        {STATUS_TABS.map(({ id, label }) => {
          const isSelected = statusFilter === id;
          const count = statusCounts[id];
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setStatusFilter(id)}
              className={[
                'min-h-[48px] px-1 py-1.5 rounded-[14px] flex flex-col items-center justify-center text-center transition-colors cursor-pointer min-w-0',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
                isSelected
                  ? 'bg-[#1B2559] text-white'
                  : 'bg-transparent text-[#1B2559] hover:bg-[#E7DEC7]/60',
              ].join(' ')}
            >
              <span
                className={[
                  'text-[17px] leading-[1.15] font-extrabold tabular-nums',
                  isSelected ? 'text-[#F6B93B]' : 'text-[#1B2559]',
                ].join(' ')}
              >
                {count}
              </span>
              <span
                className={[
                  'text-[10px] min-[360px]:text-[11.5px] leading-tight font-bold whitespace-nowrap mt-0.5',
                  isSelected ? 'text-white' : 'text-[#6B6557]',
                ].join(' ')}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Group Filter Chip */}
      {selectedCategoryObj ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            aria-label={`Remove group filter: ${selectedCategoryObj.title}`}
            className="inline-flex items-center gap-1.5 min-h-[36px] pl-3 pr-2.5 rounded-full bg-[#FFFDF6] border-[1.5px] border-[#1B2559] text-[#1B2559] text-[12px] font-bold hover:bg-[#F1EBDA] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
          >
            <span>Group: {selectedCategoryObj.title}</span>
            <X className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {/* Summary Line + Single Expand/Collapse Toggle */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <p className="text-[13px] text-[#6B6557]">
          Showing{' '}
          <strong className="font-extrabold text-[#1B2559] tabular-nums">
            {matchingLessonCount}
          </strong>{' '}
          of <span className="tabular-nums">{totalLessonCount}</span> lessons
        </p>

        {filteredCategories.length > 0 ? (
          <button
            type="button"
            onClick={handleToggleExpandCollapseAll}
            className="inline-flex items-center gap-1 min-h-[44px] px-2 -mr-2 rounded-[10px] text-[13px] font-bold text-[#1B2559] hover:bg-[#F1EBDA]/70 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
          >
            {allVisibleExpanded ? (
              <ChevronUp className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            <span>{allVisibleExpanded ? 'Collapse all' : 'Expand all'}</span>
          </button>
        ) : null}
      </div>

      {/* Lesson Groups (Accordion Cards) or Dashed Empty State */}
      {filteredCategories.length === 0 ? (
        <div className="rounded-[20px] border-[1.5px] border-dashed border-[#D6CBAE] bg-[#FFFDF6] px-5 py-8 text-center space-y-2.5">
          <h2 className="text-[16px] font-extrabold text-[#1B2559]">
            No lessons match
          </h2>
          <p className="text-[13px] text-[#6B6557] max-w-[280px] mx-auto">
            Try a different word, or clear the filters to see every lesson.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full bg-[#1B2559] hover:bg-[#141D47] text-white text-[13px] font-bold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
            >
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredCategories.map((category) => {
            const isExpanded = Boolean(expandedCategories[category.id]);
            const availableCount = category.topics.filter(
              (t) => getTopicAvailability(t).isAvailable,
            ).length;

            return (
              <section
                key={category.id}
                aria-labelledby={`cat-btn-${category.id}`}
                className="rounded-[20px] bg-[#FFFDF6] border-[1.5px] border-[#E9E1CB] overflow-hidden"
              >
                {/* Accordion Header */}
                <button
                  id={`cat-btn-${category.id}`}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  aria-expanded={isExpanded}
                  className="w-full min-h-[68px] px-4 py-3.5 flex items-center justify-between gap-2.5 text-left hover:bg-[#F9F3E3]/60 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1B2559]"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-[10px] bg-[#F1EBDA] flex items-center justify-center text-[#1B2559] shrink-0 mt-0.5">
                      <ChevronDown
                        className={[
                          'w-4 h-4 transition-transform duration-200',
                          isExpanded ? 'rotate-180' : '',
                        ].join(' ')}
                        aria-hidden="true"
                      />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-[15px] font-bold text-[#1B2559] leading-snug">
                        {category.title}
                      </h2>
                      <p className="text-[12px] text-[#6B6557] leading-snug line-clamp-2 mt-0.5">
                        {category.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 min-[360px]:flex-row min-[360px]:items-center min-[360px]:gap-2 shrink-0">
                    {availableCount > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FDEAB9] text-[#8F4B05] text-[11px] font-bold whitespace-nowrap">
                        {availableCount} Ready
                      </span>
                    ) : null}
                    <span className="text-[12.5px] font-semibold text-[#6B6557] tabular-nums whitespace-nowrap">
                      {category.topics.length}{' '}
                      {category.topics.length === 1 ? 'lesson' : 'lessons'}
                    </span>
                  </div>
                </button>

                {/* Expanded Lesson Rows */}
                {isExpanded ? (
                  <div className="border-t border-[#E9E1CB] divide-y divide-[#EFE8D5]">
                    {category.topics.map((topic) => {
                      const { isAvailable, missionId, unifiedStatus } =
                        getTopicAvailability(topic);
                      const isCompleted = unifiedStatus === 'completed';
                      const isInProgress = unifiedStatus === 'in-progress';
                      const attempt = missionId
                        ? assessmentAttemptsByMission[missionId] ?? null
                        : null;
                      const isSubmitted =
                        attempt?.status === 'submitted' &&
                        attempt.score !== null &&
                        attempt.percentage !== null;
                      const hasTest = Boolean(missionId && hasFormalAssessment(missionId));
                      const isTestUnlocked = hasTest && (isCompleted || isSubmitted);

                      if (!isAvailable || !missionId) {
                        return (
                          <div
                            key={topic.id}
                            className="px-4 py-3.5 flex items-center justify-between gap-3 bg-[#FAF6EC]/85"
                          >
                            <div className="min-w-0 flex-1 space-y-1">
                              <h3 className="text-[14.5px] font-semibold text-[#5A554A] leading-snug">
                                {topic.title}
                              </h3>
                              <p className="text-[12px] text-[#746E60] leading-snug line-clamp-2">
                                {topic.conceptSummary}
                              </p>
                            </div>

                            <div className="shrink-0 flex flex-col items-end gap-0.5">
                              <span className="inline-flex items-center justify-center min-h-[30px] px-3 rounded-full bg-[#EDE5CF] text-[#5D574B] text-[11.5px] font-bold whitespace-nowrap">
                                Coming soon
                              </span>
                              <span className="text-[10.5px] text-[#746E60] whitespace-nowrap">
                                Not yet available
                              </span>
                            </div>
                          </div>
                        );
                      }

                      const primaryLabel = isCompleted
                        ? 'Review'
                        : isInProgress
                          ? 'Continue'
                          : 'Start';

                      return (
                        <div
                          key={topic.id}
                          className="px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFDF6]"
                        >
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {isCompleted ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#8CE6D3] text-[#0B4A41] text-[10.5px] font-extrabold leading-none whitespace-nowrap">
                                  <Check className="w-3 h-3 shrink-0" strokeWidth={2.7} aria-hidden="true" />
                                  <span>Completed</span>
                                </span>
                              ) : isInProgress ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F6B93B] text-[#1B2559] text-[10.5px] font-extrabold leading-none whitespace-nowrap">
                                  In progress
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#EDE5CF] text-[#4A5170] text-[10.5px] font-extrabold leading-none whitespace-nowrap">
                                  Not started
                                </span>
                              )}

                              {topic.estimatedMinutes ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6B6557] tabular-nums">
                                  <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
                                  <span>Estimated time: {topic.estimatedMinutes} min</span>
                                </span>
                              ) : null}

                              {isSubmitted ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B5F58] tabular-nums">
                                  <ClipboardCheck className="w-3 h-3 shrink-0" aria-hidden="true" />
                                  <span>
                                    Test: {attempt.score}/{attempt.totalQuestions} ({attempt.percentage}%)
                                  </span>
                                </span>
                              ) : null}
                            </div>

                            <h3 className="text-[15px] font-bold text-[#1B2559] leading-snug">
                              {topic.title}
                            </h3>

                            <p className="text-[12.5px] text-[#4A5170] leading-snug line-clamp-2">
                              {topic.conceptSummary}
                            </p>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onStartMissionLesson(missionId)}
                              className={[
                                'inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-full text-[13px] font-extrabold whitespace-nowrap transition-colors cursor-pointer',
                                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
                                isCompleted
                                  ? 'bg-[#E2F5EE] hover:bg-[#CDEEE2] text-[#0E5A42]'
                                  : isInProgress
                                    ? 'bg-[#1B2559] hover:bg-[#141D47] text-white'
                                    : 'bg-[#F6B93B] hover:bg-[#ECAC27] text-[#1B2559]',
                              ].join(' ')}
                            >
                              {isCompleted ? (
                                <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                              ) : (
                                <Play
                                  className="w-3.5 h-3.5 fill-current shrink-0"
                                  aria-hidden="true"
                                />
                              )}
                              <span>{primaryLabel}</span>
                            </button>

                            {isTestUnlocked && onOpenAssessment ? (
                              <button
                                type="button"
                                onClick={() => onOpenAssessment(missionId)}
                                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 rounded-full border-[1.5px] border-[#E5A21F] bg-[#FFFDF6] hover:bg-[#FFF1D5] text-[#1B2559] text-[12.5px] font-extrabold whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
                              >
                                <ClipboardCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                <span>
                                  {isSubmitted
                                    ? 'Test Results'
                                    : attempt?.status === 'in-progress'
                                      ? 'Resume Test'
                                      : 'Test'}
                                </span>
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      )}

      {/* Filter Bottom Sheet (Unified Portal Modal) */}
      <ModalDialog
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        ariaLabelledBy="filter-sheet-title"
        placement="bottom-sheet"
        closeOnBackdropClick={true}
        closeOnEscape={true}
        returnFocusRef={filterTriggerRef}
        dialogClassName="w-full max-w-[480px] max-h-[85dvh] flex flex-col overflow-hidden rounded-t-[28px] sm:rounded-[28px] bg-[#FFFDF6] shadow-[0_-12px_32px_rgba(27,37,89,0.22)]"
      >
        <div className="px-4 sm:px-5 pt-3 pb-2 shrink-0 space-y-2.5 border-b border-[#E5E2D9]/60">
          <div
            className="w-10 h-1 rounded-full bg-[#D8CEB3] mx-auto"
            aria-hidden="true"
          />

          <div className="flex items-center justify-between gap-2">
            <h2
              id="filter-sheet-title"
              className="text-[20px] font-extrabold text-[#1B2559]"
            >
              Filters
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetSheetFilters}
                className="min-h-[44px] px-2 rounded-[10px] text-[14px] font-bold text-[#B4600F] hover:text-[#8E4909] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                aria-label="Close filters"
                className="sr-only focus:not-sr-only focus:px-3 focus:py-2 focus:rounded-full focus:bg-[#1B2559] focus:text-white focus:text-xs focus:font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4 space-y-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#6B6557] mb-2">
              LESSON GROUP
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter by lesson group"
            >
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                aria-pressed={categoryFilter === 'all'}
                className={[
                  'min-h-[44px] px-3.5 py-2 rounded-full border-[1.5px] text-[13px] font-bold transition-colors cursor-pointer',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
                  categoryFilter === 'all'
                    ? 'bg-[#1B2559] border-[#1B2559] text-white'
                    : 'bg-white border-[#E4DCC6] text-[#1B2559] hover:border-[#1B2559]/40',
                ].join(' ')}
              >
                All groups
              </button>
              {CURRICULUM_TOPIC_CATALOG.map((cat) => {
                const isSelected = categoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    aria-pressed={isSelected}
                    className={[
                      'min-h-[44px] px-3.5 py-2 rounded-full border-[1.5px] text-[13px] font-bold text-left transition-colors cursor-pointer',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
                      isSelected
                        ? 'bg-[#1B2559] border-[#1B2559] text-white'
                        : 'bg-white border-[#E4DCC6] text-[#1B2559] hover:border-[#1B2559]/40',
                    ].join(' ')}
                  >
                    {cat.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#6B6557] mb-2">
              STATUS
            </p>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Filter by status">
              {STATUS_TABS.map(({ id, label }) => {
                const isSelected = statusFilter === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setStatusFilter(id)}
                    aria-pressed={isSelected}
                    className={[
                      'h-12 px-3 rounded-full border-[1.5px] text-[13.5px] font-bold transition-colors cursor-pointer whitespace-nowrap',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]',
                      isSelected
                        ? 'bg-[#1B2559] border-[#1B2559] text-white'
                        : 'bg-white border-[#E4DCC6] text-[#1B2559] hover:border-[#1B2559]/40',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-5 pt-2.5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shrink-0 border-t border-[#E5E2D9]/60 bg-[#FFFDF6]">
          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(false)}
            className="w-full h-[52px] rounded-full bg-[#1B2559] hover:bg-[#141D47] text-white text-[15px] font-extrabold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
          >
            Show {matchingLessonCount} {matchingLessonCount === 1 ? 'lesson' : 'lessons'}
          </button>
        </div>
      </ModalDialog>
    </div>
  );
};
