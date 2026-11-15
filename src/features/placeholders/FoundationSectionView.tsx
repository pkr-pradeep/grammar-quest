/**
 * ============================================================================
 * GRAMMAR QUEST — STUDENT SECTION VIEWS (MISSIONS EXPLORER, GUIDE, MY PROGRESS)
 * ============================================================================
 * Renders:
 *  - Missions section -> Structured TopicExplorer (22 verified syllabus topics)
 *  - Mission Detail view -> Upcoming mission preview
 *  - Guide section -> Concise grammar guide links
 *  - Progress section -> Completed mission tracking saved locally
 * ============================================================================
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, BarChart3, Clock, PlayCircle, ShieldCheck } from 'lucide-react';
import type {
  AppSection,
  ClassLevel,
  PlaceholderMissionSummary,
  StudentProgressRecord,
} from '../../schemas/lesson.schema';
import { PLACEHOLDER_CLASS_CONTENT } from '../../content/placeholderDashboard';
import { Badge, Button, Card, MissionIllustration, Progress } from '../../components';
import { TopicExplorer } from '../missions/TopicExplorer';

interface FoundationSectionViewProps {
  section: Exclude<AppSection, 'home'>;
  selectedClass: ClassLevel;
  progress: StudentProgressRecord;
  previewMission: PlaceholderMissionSummary | null;
  onClearPreview: () => void;
  onSelectPreview: (mission: PlaceholderMissionSummary) => void;
  onStartLesson: (missionId: string, preferredClass?: ClassLevel) => void;
  onBackHome: () => void;
}

export const FoundationSectionView: React.FC<FoundationSectionViewProps> = ({
  section,
  selectedClass,
  progress,
  previewMission,
  onClearPreview,
  onSelectPreview,
  onStartLesson,
  onBackHome,
}) => {
  const classContent = PLACEHOLDER_CLASS_CONTENT[selectedClass];
  const allMissions = [classContent.featuredMission, ...classContent.plannedTracks];
  const completedInClass = progress.completedMissionIds.filter((id) =>
    id.startsWith(`c${selectedClass}-`),
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
          <>
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
            <Badge tone="turquoise">{classContent.classLabel}</Badge>
          </>
        )}
      </div>

      {/* Mission Detail View (for Upcoming Missions) */}
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
                <Badge tone="navy">{previewMission.missionNumber}</Badge>
                <Badge tone="neutral">Coming soon</Badge>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#4B5C8A] tabular-nums">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  ~{previewMission.estimatedMinutes} min
                </span>
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
              This mission is not available yet. Please check back soon.
            </p>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button variant="navy" onClick={() => onClearPreview()}>
              Back to Topics
            </Button>
          </div>
        </Card>
      ) : null}

      {/* Missions Page -> Structured Topic Explorer */}
      {section === 'missions' && !previewMission ? (
        <TopicExplorer
          selectedClass={selectedClass}
          completedMissionIds={progress.completedMissionIds}
          onStartMissionLesson={(missionId, preferredClass) =>
            onStartLesson(missionId, preferredClass)
          }
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
                <p className="text-sm text-[#4B5C8A]">{classContent.classLabel}</p>
              </div>
            </div>
            <p className="text-sm text-[#333333] pt-1">
              Explore clear explanations and interactive sentences for {classContent.classLabel}.
            </p>
          </Card>

          <div className="flex flex-col gap-3">
            {classContent.guideTopics.map((topic, index) => {
              const isSubjectPredicate = topic.id === 'guide-subject-predicate';
              return (
                <Card key={topic.id} surface="white" padding="md" className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone="sunshine">Topic 0{index + 1}</Badge>
                    <Badge tone={isSubjectPredicate ? 'turquoise' : 'neutral'}>
                      {isSubjectPredicate ? 'Interactive Lesson Ready' : 'Coming soon'}
                    </Badge>
                  </div>
                  <h2 className="font-heading text-base sm:text-lg font-semibold text-[#263A70] pt-1">
                    {topic.title}
                  </h2>
                  <p className="text-sm text-[#4B5C8A]">
                    {isSubjectPredicate
                      ? 'The Subject names who or what the sentence is about. The Predicate tells what is said about the Subject and contains the finite verb.'
                      : topic.summary}
                  </p>
                  {isSubjectPredicate ? (
                    <div className="pt-1">
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<PlayCircle className="w-4 h-4" />}
                        onClick={() =>
                          onStartLesson(classContent.featuredMission.id, selectedClass)
                        }
                      >
                        Open Interactive Lesson
                      </Button>
                    </div>
                  ) : null}
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
              <p className="text-sm text-[#4B5C8A]">{classContent.classLabel}</p>
            </div>
          </div>

          {completedInClass > 0 ? (
            <Progress
              value={completedInClass}
              max={allMissions.length}
              label="Completed missions"
              summaryText={`${completedInClass} of ${allMissions.length}`}
            />
          ) : (
            <div className="rounded-[14px] bg-[#FDFCF9] border border-[#E5E2D9] p-4 space-y-1">
              <p className="text-sm font-semibold text-[#263A70]">
                No missions completed yet
              </p>
              <p className="text-sm text-[#4B5C8A]">
                Completed missions and activities will appear here once you finish a lesson.
              </p>
            </div>
          )}

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
