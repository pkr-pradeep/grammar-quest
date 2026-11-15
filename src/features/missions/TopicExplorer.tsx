/**
 * ============================================================================
 * GRAMMAR QUEST — TOPIC EXPLORER
 * ============================================================================
 * Structured, mobile-first curriculum explorer supporting 22 grammar topics
 * across expandable/collapsible categories, pill search, filter bottom sheet,
 * 4-column status segmented tabs, removable class chip, and compact rows.
 * ============================================================================
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Play,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type { ClassLevel, PlaceholderMissionSummary } from '../../schemas/lesson.schema';
import {
  CURRICULUM_TOPIC_CATALOG,
  type CurriculumTopicItem,
} from '../../content/curriculumCatalog';
import { PLACEHOLDER_CLASS_CONTENT } from '../../content/placeholderDashboard';

export type ClassFilterOption = 'all' | ClassLevel;
export type StatusFilterOption = 'all' | 'ready' | 'completed' | 'upcoming';

export interface TopicExplorerProps {
  selectedClass: ClassLevel;
  completedMissionIds: string[];
  onStartMissionLesson: (missionId: string, preferredClass: ClassLevel) => void;
  onPreviewMission: (mission: PlaceholderMissionSummary) => void;
}

const STATUS_TABS: { id: StatusFilterOption; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ready', label: 'Ready' },
  { id: 'completed', label: 'Completed' },
  { id: 'upcoming', label: 'Coming soon' },
];

export const TopicExplorer: React.FC<TopicExplorerProps> = ({
  selectedClass,
  completedMissionIds,
  onStartMissionLesson,
  onPreviewMission,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<ClassFilterOption>(selectedClass);
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('all');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const cat of CURRICULUM_TOPIC_CATALOG) {
      initial[cat.id] = cat.defaultExpanded;
    }
    return initial;
  });

  const targetClassForTopic = (topic: CurriculumTopicItem): ClassLevel => {
    if (classFilter === 9 || classFilter === 10) return classFilter;
    if (topic.classLevels.includes(selectedClass)) return selectedClass;
    return topic.classLevels[0] ?? 9;
  };

  const resolveTopicCompletion = (topic: CurriculumTopicItem): boolean => {
    if (!topic.missionIdByClass) return false;
    if (classFilter === 9 || classFilter === 10) {
      const mId = topic.missionIdByClass[classFilter];
      return mId ? completedMissionIds.includes(mId) : false;
    }
    return Object.values(topic.missionIdByClass).some(
      (mId) => mId && completedMissionIds.includes(mId),
    );
  };

  const getEffectiveStatus = (
    topic: CurriculumTopicItem,
  ): 'ready' | 'completed' | 'upcoming' => {
    if (resolveTopicCompletion(topic)) return 'completed';
    return topic.status === 'ready' ? 'ready' : 'upcoming';
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matchesSearchAndClass = (topic: CurriculumTopicItem, categoryTitle: string): boolean => {
    if (classFilter !== 'all' && !topic.classLevels.includes(classFilter)) {
      return false;
    }
    if (normalizedQuery.length > 0) {
      const haystack = [topic.title, categoryTitle, topic.missionTitle ?? '']
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  };

  // Status counts reflect the current search and class filter, NOT the status filter.
  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilterOption, number> = {
      all: 0,
      ready: 0,
      completed: 0,
      upcoming: 0,
    };

    for (const cat of CURRICULUM_TOPIC_CATALOG) {
      for (const topic of cat.topics) {
        if (!matchesSearchAndClass(topic, cat.title)) continue;
        const effectiveStatus = getEffectiveStatus(topic);
        counts.all += 1;
        counts[effectiveStatus] += 1;
      }
    }

    return counts;
  }, [classFilter, normalizedQuery, completedMissionIds]);

  const filteredCategories = useMemo(() => {
    return CURRICULUM_TOPIC_CATALOG.map((cat) => {
      const matchedTopics = cat.topics.filter((topic) => {
        if (!matchesSearchAndClass(topic, cat.title)) return false;
        const effectiveStatus = getEffectiveStatus(topic);
        if (statusFilter !== 'all' && effectiveStatus !== statusFilter) {
          return false;
        }
        return true;
      });

      return {
        ...cat,
        topics: matchedTopics,
      };
    }).filter((cat) => cat.topics.length > 0);
  }, [classFilter, statusFilter, normalizedQuery, completedMissionIds]);

  // Auto-expand matching categories only while searching so default / filtered views
  // stay clean and students can still manually collapse any group afterward.
  useEffect(() => {
    if (normalizedQuery.length === 0) return;

    setExpandedCategories((prev) => {
      const next = { ...prev };
      for (const cat of CURRICULUM_TOPIC_CATALOG) {
        next[cat.id] = true;
      }
      return next;
    });
  }, [normalizedQuery]);

  // Close the filter sheet on Escape key
  useEffect(() => {
    if (!isFilterSheetOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFilterSheetOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFilterSheetOpen]);

  const totalTopicCount = CURRICULUM_TOPIC_CATALOG.reduce(
    (sum, cat) => sum + cat.topics.length,
    0,
  );
  const matchingTopicCount = filteredCategories.reduce(
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
    setClassFilter('all');
    setStatusFilter('all');
  };

  const resetSheetFilters = () => {
    setClassFilter('all');
    setStatusFilter('all');
  };

  const openUpcomingMissionDetails = (topic: CurriculumTopicItem) => {
    const lvl = targetClassForTopic(topic);
    const missionId = topic.missionIdByClass?.[lvl];
    if (!missionId) return;
    const overview = PLACEHOLDER_CLASS_CONTENT[lvl];
    const allMissions = [overview.featuredMission, ...overview.plannedTracks];
    const matched = allMissions.find((m) => m.id === missionId);
    if (matched) {
      onPreviewMission(matched);
    }
  };

  const isClassFilterActive = classFilter !== 'all';

  return (
    <div className="space-y-3.5">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-[26px] leading-[1.2] font-extrabold tracking-[-0.02em] text-[#1B2559]">
          Topics &amp; Missions
        </h1>
        <p className="text-[13px] leading-[1.4] font-normal text-[#6B6557] mt-1">
          Grammar topics across Classes 9 &amp; 10
        </p>
      </div>

      {/* Search Row: Pill Search Input + Round Navy Filter Button */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1 min-w-0">
          <label htmlFor="topic-search-input" className="sr-only">
            Search topics
          </label>
          <Search
            className="w-[18px] h-[18px] text-[#6B6557] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="topic-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics"
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
          type="button"
          onClick={() => setIsFilterSheetOpen(true)}
          aria-label={
            isClassFilterActive
              ? `Open filters (1 active class filter: Class ${classFilter})`
              : 'Open filters'
          }
          aria-haspopup="dialog"
          aria-expanded={isFilterSheetOpen}
          className="relative w-12 h-12 shrink-0 rounded-full bg-[#1B2559] hover:bg-[#141D47] text-white inline-flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
        >
          <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
          {isClassFilterActive ? (
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F6B93B] text-[#1B2559] text-[11px] font-extrabold leading-none inline-flex items-center justify-center ring-2 ring-[#FBF6EA]"
            >
              1
            </span>
          ) : null}
        </button>
      </div>

      {/* 4-Column Status Segmented Control */}
      <div
        role="tablist"
        aria-label="Filter topics by status"
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

      {/* Active Class Chip (removable) */}
      {isClassFilterActive ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setClassFilter('all')}
            aria-label={`Remove Class ${classFilter} filter`}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-full bg-white border-[1.5px] border-[#1B2559] text-[13px] font-bold text-[#1B2559] hover:bg-[#F5F0E3] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
          >
            <span>Class {classFilter}</span>
            <X className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {/* Summary Line + Single Expand/Collapse Toggle */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <p className="text-[13px] text-[#6B6557]">
          Showing{' '}
          <strong className="font-extrabold text-[#1B2559] tabular-nums">
            {matchingTopicCount}
          </strong>{' '}
          of <span className="tabular-nums">{totalTopicCount}</span> topics
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

      {/* Topic Groups (Accordion Cards) or Dashed Empty State */}
      {filteredCategories.length === 0 ? (
        <div className="rounded-[20px] border-[1.5px] border-dashed border-[#D6CBAE] bg-[#FFFDF6] px-5 py-8 text-center space-y-2.5">
          <h2 className="text-[16px] font-extrabold text-[#1B2559]">
            No topics match
          </h2>
          <p className="text-[13px] text-[#6B6557] max-w-[280px] mx-auto">
            Try a different word, or clear the filters to see every topic.
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
            const readyCount = category.topics.filter(
              (t) => getEffectiveStatus(t) === 'ready',
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
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-[10px] bg-[#F1EBDA] flex items-center justify-center text-[#1B2559] shrink-0">
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
                      <p className="text-[12px] text-[#6B6557] truncate mt-0.5">
                        {category.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 min-[360px]:flex-row min-[360px]:items-center min-[360px]:gap-2 shrink-0">
                    {readyCount > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FDEAB9] text-[#8F4B05] text-[11px] font-bold whitespace-nowrap">
                        {readyCount} Ready
                      </span>
                    ) : null}
                    <span className="text-[12.5px] font-semibold text-[#6B6557] tabular-nums whitespace-nowrap">
                      {category.topics.length}{' '}
                      {category.topics.length === 1 ? 'topic' : 'topics'}
                    </span>
                  </div>
                </button>

                {/* Expanded Topic Rows */}
                {isExpanded ? (
                  <div className="border-t border-[#E9E1CB] divide-y divide-[#EFE8D5]">
                    {category.topics.map((topic) => {
                      const effectiveStatus = getEffectiveStatus(topic);
                      const isCompleted = effectiveStatus === 'completed';
                      const isReady = effectiveStatus === 'ready';
                      const preferredClass = targetClassForTopic(topic);
                      const targetMissionId = topic.missionIdByClass?.[preferredClass];
                      const hasUpcomingMissionDetails =
                        effectiveStatus === 'upcoming' &&
                        Boolean(topic.missionNumber && targetMissionId);

                      const classTag =
                        topic.classLevels.length === 2
                          ? 'Class 9 & 10'
                          : `Class ${topic.classLevels[0]}`;

                      return (
                        <div
                          key={topic.id}
                          className="px-4 py-3.5 flex items-center justify-between gap-3 bg-[#FFFDF6]"
                        >
                          <div className="min-w-0 flex-1 space-y-0.5">
                            {topic.missionNumber ? (
                              <p className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#B4600F]">
                                {topic.missionNumber}
                              </p>
                            ) : null}

                            <h3 className="text-[14.5px] font-bold text-[#1B2559] leading-snug">
                              {topic.title}
                            </h3>

                            <p className="text-[12px] text-[#6B6557] flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                              <span className="font-semibold text-[#4B463B]">
                                {classTag}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="truncate max-w-full">
                                {topic.sourceSummary}
                              </span>
                            </p>
                          </div>

                          <div className="shrink-0">
                            {isCompleted ? (
                              targetMissionId ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onStartMissionLesson(targetMissionId, preferredClass)
                                  }
                                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-full bg-[#E2F5EE] hover:bg-[#CDEEE2] text-[#0E5A42] text-[13px] font-extrabold whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
                                >
                                  <Check
                                    className="w-4 h-4 shrink-0"
                                    strokeWidth={2.5}
                                    aria-hidden="true"
                                  />
                                  <span>Review</span>
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 min-h-[36px] px-3.5 rounded-full bg-[#E2F5EE] text-[#0E5A42] text-[12px] font-extrabold whitespace-nowrap">
                                  <Check
                                    className="w-3.5 h-3.5 shrink-0"
                                    strokeWidth={2.5}
                                    aria-hidden="true"
                                  />
                                  <span>Review</span>
                                </span>
                              )
                            ) : isReady && targetMissionId ? (
                              <button
                                type="button"
                                onClick={() =>
                                  onStartMissionLesson(targetMissionId, preferredClass)
                                }
                                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-full bg-[#F6B93B] hover:bg-[#ECAC27] text-[#1B2559] text-[13px] font-extrabold whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
                              >
                                <Play
                                  className="w-3.5 h-3.5 fill-current shrink-0"
                                  aria-hidden="true"
                                />
                                <span>Start</span>
                              </button>
                            ) : hasUpcomingMissionDetails ? (
                              <button
                                type="button"
                                onClick={() => openUpcomingMissionDetails(topic)}
                                className="inline-flex items-center justify-center min-h-[44px] px-3.5 rounded-full bg-[#F1EBDA] hover:bg-[#E7DEC7] text-[#575145] text-[12px] font-bold whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
                              >
                                Coming soon
                              </button>
                            ) : (
                              <span className="inline-flex items-center justify-center min-h-[34px] px-3 rounded-full bg-[#F1EBDA] text-[#575145] text-[12px] font-bold whitespace-nowrap">
                                Coming soon
                              </span>
                            )}
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

      {/* Filter Bottom Sheet */}
      {isFilterSheetOpen ? (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Dimmed Backdrop */}
          <div
            aria-hidden="true"
            onClick={() => setIsFilterSheetOpen(false)}
            className="fixed inset-0 bg-[#1B2559]/50"
          />

          {/* Bottom Sheet Panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-sheet-title"
            className="relative z-10 w-full max-w-[480px] rounded-t-[28px] sm:rounded-[28px] bg-[#FFFDF6] px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-12px_32px_rgba(27,37,89,0.22)] space-y-5"
          >
            {/* Drag Handle */}
            <div
              className="w-10 h-1 rounded-full bg-[#D8CEB3] mx-auto"
              aria-hidden="true"
            />

            {/* Keyboard-accessible close button */}
            <button
              type="button"
              onClick={() => setIsFilterSheetOpen(false)}
              aria-label="Close filters"
              className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:right-4 focus:px-3 focus:py-2 focus:rounded-full focus:bg-[#1B2559] focus:text-white focus:text-xs focus:font-bold"
            >
              Close
            </button>

            {/* Sheet Header */}
            <div className="flex items-center justify-between gap-2">
              <h2
                id="filter-sheet-title"
                className="text-[20px] font-extrabold text-[#1B2559]"
              >
                Filters
              </h2>
              <button
                type="button"
                onClick={resetSheetFilters}
                className="min-h-[44px] px-2 -mr-2 rounded-[10px] text-[14px] font-bold text-[#B4600F] hover:text-[#8E4909] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
              >
                Reset
              </button>
            </div>

            {/* CLASS Section (3-column grid) */}
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#6B6557] mb-2">
                CLASS
              </p>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Filter by class">
                {(['all', 9, 10] as ClassFilterOption[]).map((opt) => {
                  const isSelected = classFilter === opt;
                  const label = opt === 'all' ? 'All' : `Class ${opt}`;
                  return (
                    <button
                      key={String(opt)}
                      type="button"
                      onClick={() => setClassFilter(opt)}
                      aria-pressed={isSelected}
                      className={[
                        'h-12 px-2 rounded-full border-[1.5px] text-[13.5px] font-bold transition-colors cursor-pointer whitespace-nowrap',
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

            {/* STATUS Section (2-column grid) */}
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

            {/* Primary CTA Button */}
            <button
              type="button"
              onClick={() => setIsFilterSheetOpen(false)}
              className="w-full h-[52px] rounded-full bg-[#1B2559] hover:bg-[#141D47] text-white text-[15px] font-extrabold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
            >
              Show {matchingTopicCount} {matchingTopicCount === 1 ? 'topic' : 'topics'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
