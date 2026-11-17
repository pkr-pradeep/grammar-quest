/**
 * ============================================================================
 * GRAMMAR QUEST — STUDENT SECTION VIEWS (LESSONS EXPLORER, GUIDE, MY PROGRESS)
 * ============================================================================
 * Renders:
 *  - Lessons section -> Structured TopicExplorer (all 22 grammar lessons)
 *  - Guide section -> Core concept summaries & direct lesson launch
 *  - Progress section -> Dynamic locally-saved progress & gated Test actions
 * ============================================================================
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  BarChart3,
  ClipboardCheck,
  Clock,
  PlayCircle,
  ShieldCheck,
} from 'lucide-react';
import type {
  AppSection,
  PlaceholderMissionSummary,
  StudentProgressRecord,
} from '../../schemas/lesson.schema';
import type { AssessmentAttemptRecord } from '../../schemas/assessment.schema';
import {
  getAvailableLessons,
  resolveUnifiedLessonStatus,
  type UnifiedLessonStatus,
} from '../../content/curriculumCatalog';
import { getLessonForMission } from '../../content/lessons/lessonRegistry';
import { getMissionProgressDetail } from '../../storage/progressRepository';
import { Badge, Button, Card, MissionIllustration, Progress } from '../../components';
import { TopicExplorer } from '../missions/TopicExplorer';

const GUIDE_CONCEPT_NOTES: Record<string, string> = {
  'c9-mission-01':
    'The Subject names who or what the sentence is about. The Predicate tells what is said about the Subject and contains the finite verb.',
  'c9-mission-04':
    'Sentence purpose determines sentence type and word order. A finite verb separates a Clause from a Phrase, and predicates follow core S-V-O-C-A clause patterns.',
  'c9-mission-02':
    'Time (Past, Present, Future) and Tense work together to show when an action happens and whether it is habitual, ongoing, or completed.',
  'c9-mission-03':
    'A finite verb agrees with the true Subject head-word in Number and Person, ignoring intervening phrases.',
};

function getPrimaryActionText(status: UnifiedLessonStatus): string {
  if (status === 'completed') return 'Review';
  if (status === 'in-progress') return 'Continue';
  return 'Start';
}

interface FoundationSectionViewProps {
  section: Exclude<AppSection, 'home'>;
  progress: StudentProgressRecord;
  assessmentAttemptsByMission?: Record<string, AssessmentAttemptRecord>;
  previewMission: PlaceholderMissionSummary | null;
  onClearPreview: () => void;
  onSelectPreview: (mission: PlaceholderMissionSummary) => void;
  onStartLesson: (missionId: string) => void;
  onOpenAssessment?: (missionId: string) => void;
  onBackHome: () => void;
}

export const FoundationSectionView: React.FC<FoundationSectionViewProps> = ({
  section,
  progress,
  assessmentAttemptsByMission = {},
  previewMission,
  onClearPreview,
  onSelectPreview,
  onStartLesson,
  onOpenAssessment,
  onBackHome,
}) => {
  const availableLessons = getAvailableLessons();
  const completedCount = availableLessons.filter(
    (lesson) => resolveUnifiedLessonStatus(progress, lesson.id) === 'completed',
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {section === 'missions' && !previewMission ? (
          <button
            type="button"
            onClick={() => {
              onClearPreview();
              onBackHome();
            }}
            className="inline-flex items-center gap-1.5 min-h-[44px] -ml-1 px-1 text-[14px] font-bold text-[#1B2559] hover:text-[#141D47] cursor-pointer rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2559]"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Back to Home</span>
          </button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onClearPreview();
              onBackHome();
            }}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Home
          </Button>
        )}
      </div>

      {/* Upcoming Preview Fallback (if directly navigated) */}
      {previewMission ? (
        <Card surface="cream" padding="md" elevated className="sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[16px] bg-white border border-[#F2DFB6] flex items-center justify-center shrink-0">
              <MissionIllustration
                kind={previewMission.iconKind}
                className="w-12 h-12 sm:w-14 sm:h-14"
              />
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">Coming soon</Badge>
                {previewMission.estimatedMinutes ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[#4B5C8A] tabular-nums">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    Estimated time: {previewMission.estimatedMinutes} min
                  </span>
                ) : null}
              </div>
              <h1 className="font-heading text-xl sm:text-2xl font-semibold text-[#263A70]">
                {previewMission.title}
              </h1>
              <p className="text-sm font-medium text-[#A15C00]">
                {previewMission.topicLabel}
              </p>
            </div>
          </div>

          <Card surface="white" padding="md" className="space-y-2">
            <p className="text-sm sm:text-base text-[#333333]">
              {previewMission.shortDescription}
            </p>
            <p className="text-sm text-[#4B5C8A]">
              This lesson is not available yet. Please check back soon.
            </p>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button variant="navy" onClick={() => onClearPreview()}>
              Back to Lessons
            </Button>
          </div>
        </Card>
      ) : null}

      {/* Lessons Page */}
      {section === 'missions' && !previewMission ? (
        <TopicExplorer
          completedMissionIds={progress.completedMissionIds}
          progress={progress}
          assessmentAttemptsByMission={assessmentAttemptsByMission}
          onStartMissionLesson={(missionId) => onStartLesson(missionId)}
          onOpenAssessment={onOpenAssessment}
          onPreviewMission={onSelectPreview}
        />
      ) : null}

      {/* Grammar Guide Page */}
      {section === 'guide' && !previewMission ? (
        <div className="space-y-4">
          <Card surface="white" padding="md" className="sm:p-6 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[14px] bg-[#D9FAF5] border border-[#A8E8DF] flex items-center justify-center text-[#263A70] shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-heading text-xl sm:text-2xl font-semibold text-[#263A70]">
                  Grammar Guide
                </h1>
                <p className="text-sm text-[#4B5C8A]">Core concepts &amp; quick rules</p>
              </div>
            </div>
            <p className="text-sm text-[#333333] pt-1">
              Explore clear explanations and interactive sentences step by step.
            </p>
          </Card>

          <div className="flex flex-col gap-3">
            {availableLessons.map((lesson) => {
              const status = resolveUnifiedLessonStatus(progress, lesson.id);
              const badgeTone =
                status === 'completed'
                  ? 'turquoise'
                  : status === 'in-progress'
                    ? 'sunshine'
                    : 'neutral';
              const badgeText =
                status === 'completed'
                  ? 'Completed'
                  : status === 'in-progress'
                    ? 'In progress'
                    : 'Not started';
              const actionText = getPrimaryActionText(status);

              return (
                <Card key={lesson.id} surface="white" padding="md" className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#9C4F08]">
                      {lesson.categoryTitle}
                    </span>
                    <Badge tone={badgeTone}>{badgeText}</Badge>
                  </div>
                  <h2 className="font-heading text-base sm:text-lg font-semibold text-[#263A70]">
                    {lesson.title}
                  </h2>
                  <p className="text-sm text-[#4B5C8A]">
                    {GUIDE_CONCEPT_NOTES[lesson.id] ?? lesson.conceptSummary}
                  </p>
                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<PlayCircle className="w-4 h-4" />}
                      onClick={() => onStartLesson(lesson.id)}
                    >
                      {actionText}
                    </Button>
                    {lesson.estimatedMinutes ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6B6557] tabular-nums">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Estimated time: {lesson.estimatedMinutes} min</span>
                      </span>
                    ) : null}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* My Progress Page */}
      {section === 'progress' && !previewMission ? (
        <Card surface="white" padding="md" className="sm:p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[14px] bg-[#FFF1D5] border border-[#F2DFB6] flex items-center justify-center text-[#263A70] shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-semibold text-[#263A70]">
                My Progress
              </h1>
              <p className="text-sm text-[#4B5C8A]">Saved locally on this device</p>
            </div>
          </div>

          {completedCount > 0 ? (
            <Progress
              value={completedCount}
              max={availableLessons.length}
              label="Completed lessons"
              summaryText={`${completedCount} of ${availableLessons.length}`}
            />
          ) : (
            <div className="rounded-[14px] bg-[#FDFCF9] border border-[#E5E2D9] p-4 space-y-1">
              <p className="text-sm font-semibold text-[#263A70]">
                0 of {availableLessons.length} lessons completed
              </p>
              <p className="text-sm text-[#4B5C8A]">
                Completed lessons and activities will appear here once you finish a lesson.
              </p>
            </div>
          )}

          {/* Per-Lesson Progress & Gated Test Status Cards */}
          <div className="space-y-3">
            {availableLessons.map((lesson) => {
              const attempt = assessmentAttemptsByMission[lesson.id] ?? null;
              const detail = getMissionProgressDetail(progress, lesson.id);
              const unifiedStatus = resolveUnifiedLessonStatus(progress, lesson.id);
              const lessonDef = getLessonForMission(lesson.id);
              const hasGuided = Boolean(lessonDef && lessonDef.wordLabActivities.length > 0);
              const hasIndependent = Boolean(
                lessonDef?.independentPractice && lessonDef.independentPractice.length > 0,
              );

              const isSubmitted =
                attempt?.status === 'submitted' &&
                attempt.score !== null &&
                attempt.percentage !== null;
              const isTestUnlocked =
                lesson.hasTest && (unifiedStatus === 'completed' || isSubmitted);

              const milestones = [
                { label: 'Started', done: detail.started },
                { label: 'Learn', done: detail.teachingStagesCompleted },
                ...(hasGuided
                  ? [{ label: 'Guided', done: detail.guidedPracticeCompleted }]
                  : []),
                ...(hasIndependent
                  ? [{ label: 'Practice', done: detail.independentPracticeCompleted }]
                  : []),
                { label: 'Completed', done: detail.completed },
              ];

              return (
                <div
                  key={lesson.id}
                  className="rounded-[16px] bg-[#FDFCF9] border border-[#E5E2D9] p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium text-[#4B5C8A]">
                        {lesson.categoryTitle}
                        {lesson.estimatedMinutes
                          ? ` · Estimated time: ${lesson.estimatedMinutes} min`
                          : ''}
                      </p>
                      <h2 className="font-heading text-base font-semibold text-[#263A70]">
                        {lesson.title}
                      </h2>
                    </div>

                    {isSubmitted ? (
                      <Badge tone="turquoise">
                        {attempt.score}/{attempt.totalQuestions} · {attempt.percentage}%
                      </Badge>
                    ) : unifiedStatus === 'completed' ? (
                      <Badge tone="turquoise">Completed</Badge>
                    ) : unifiedStatus === 'in-progress' ? (
                      <Badge tone="sunshine">In progress</Badge>
                    ) : (
                      <Badge tone="neutral">Not started</Badge>
                    )}
                  </div>

                  {/* Step-by-step Milestone Summary */}
                  <div className="flex flex-wrap gap-1.5" aria-label="Lesson milestones">
                    {milestones.map((m) => (
                      <span
                        key={m.label}
                        className={[
                          'px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                          m.done
                            ? 'bg-[#E2F5EE] border-[#A8E8DF] text-[#0E5A42]'
                            : 'bg-white border-[#E5E2D9] text-[#6B6557]',
                        ].join(' ')}
                      >
                        {m.done ? '✓ ' : ''}
                        {m.label}
                      </span>
                    ))}
                  </div>

                  {isSubmitted && attempt.revisionRecommendations.length > 0 ? (
                    <p className="text-xs text-[#4B5C8A]">
                      Revision focus areas:{' '}
                      {attempt.revisionRecommendations
                        .map((r) => r.objectiveLabel)
                        .join(', ')}
                      .
                    </p>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<PlayCircle className="w-4 h-4" />}
                      onClick={() => onStartLesson(lesson.id)}
                    >
                      {getPrimaryActionText(unifiedStatus)}
                    </Button>

                    {isTestUnlocked && onOpenAssessment ? (
                      <Button
                        variant={isSubmitted ? 'secondary' : 'primary'}
                        size="sm"
                        leftIcon={<ClipboardCheck className="w-4 h-4" />}
                        onClick={() => onOpenAssessment(lesson.id)}
                      >
                        {isSubmitted
                          ? 'View Test Results'
                          : attempt?.status === 'in-progress'
                            ? 'Resume Test'
                            : 'Take Test'}
                      </Button>
                    ) : lesson.hasTest ? (
                      <span className="text-xs font-medium text-[#6B6557]">
                        Complete this lesson to unlock the Test
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-start gap-2 pt-2 border-t border-[#E5E2D9] text-xs text-[#4B5C8A]">
            <ShieldCheck
              className="w-4 h-4 shrink-0 text-[#24B5A5] mt-0.5"
              aria-hidden="true"
            />
            <p className="leading-snug">
              Your progress stays on this device without needing an account.
            </p>
          </div>
        </Card>
      ) : null}
    </motion.div>
  );
};
