/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import type {
  AppSection,
  ClassLevel,
  PlaceholderMissionSummary,
  StudentProgressRecord,
} from './schemas/lesson.schema';
import type { AssessmentAttemptRecord } from './schemas/assessment.schema';
import {
  createDefaultProgress,
  loadStudentProgress,
  markMissionCompleted,
  markMissionStarted,
  markPracticeCompleted,
  markTeachingCompleted,
  saveSelectedClass,
} from './storage/progressRepository';
import { loadAllAssessmentAttempts } from './storage/assessmentRepository';
import { Header, ScrollMoreHint } from './components';
import { Dashboard } from './features/home/Dashboard';
import { FoundationSectionView } from './features/placeholders/FoundationSectionView';
import { getLessonForMission } from './content/lessons/lessonRegistry';
import {
  GrammarTeachingEngine,
  type EnginePhase,
} from './features/grammar-engine';
import type { GrammarLessonDefinition } from './schemas/grammarEngine.schema';

/**
 * Developer-only Character Reference Sheet lazy import.
 * Strictly gated by `import.meta.env.DEV` so Vite tree-shakes and excludes
 * the developer character sheet from the production student build.
 */
const DevCharacterReferenceSheet =
  import.meta.env && import.meta.env.DEV
    ? React.lazy(() =>
        import('./features/characters/CharacterReferenceSheet').then((m) => ({
          default: m.CharacterReferenceSheet,
        })),
      )
    : null;

function isDevCharacterSheetRoute(): boolean {
  if (!(import.meta.env && import.meta.env.DEV) || typeof window === 'undefined') return false;
  const hash = window.location.hash.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  return (
    hash === '#character-sheet' ||
    hash === '#dev-characters' ||
    params.get('dev') === 'characters'
  );
}

interface ActiveLessonState {
  missionId: string;
  classLevel: ClassLevel;
  phase?: EnginePhase;
}

const VALID_ENGINE_PHASES = new Set<EnginePhase>([
  'story',
  'learn',
  'guided',
  'practice',
  'complete',
  'assess',
]);

function parseMissionHash(): ActiveLessonState | null {
  if (typeof window === 'undefined') return null;
  const raw = window.location.hash.replace(/^#/, '');
  if (!raw.startsWith('mission=')) return null;
  const params = new URLSearchParams(raw);
  const missionId = params.get('mission');
  if (!missionId) return null;
  const classMatch = /^c(9|10)-/.exec(missionId);
  const classLevel: ClassLevel = classMatch?.[1] === '10' ? 10 : 9;
  const rawPhase = params.get('phase') as EnginePhase | null;
  const phase = rawPhase && VALID_ENGINE_PHASES.has(rawPhase) ? rawPhase : undefined;
  return { missionId, classLevel, phase };
}

function writeMissionHash(state: ActiveLessonState | null): void {
  if (typeof window === 'undefined') return;
  if (!state) {
    if (window.location.hash.startsWith('#mission=')) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      );
    }
    return;
  }
  const params = new URLSearchParams();
  params.set('mission', state.missionId);
  if (state.phase) {
    params.set('phase', state.phase);
  }
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}${window.location.search}#${params.toString()}`,
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('home');
  const [progress, setProgress] = useState<StudentProgressRecord>(() =>
    createDefaultProgress(9),
  );
  const [assessmentAttemptsByMission, setAssessmentAttemptsByMission] = useState<
    Record<string, AssessmentAttemptRecord>
  >({});
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [previewMission, setPreviewMission] =
    useState<PlaceholderMissionSummary | null>(null);
  const [activeLesson, setActiveLesson] = useState<ActiveLessonState | null>(() =>
    isDevCharacterSheetRoute() ? null : parseMissionHash(),
  );
  const [isDevSheetOpen, setIsDevSheetOpen] = useState<boolean>(
    isDevCharacterSheetRoute,
  );

  useEffect(() => {
    if (!(import.meta.env && import.meta.env.DEV)) return;
    const syncRoute = () => {
      setIsDevSheetOpen(isDevCharacterSheetRoute());
    };
    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  useEffect(() => {
    let isMounted = true;

    loadStudentProgress().then((result) => {
      if (!isMounted) return;
      setProgress(result.progress);
      setStorageWarning(result.storageAvailable ? null : result.storageMessage ?? null);
    });

    loadAllAssessmentAttempts().then((attempts) => {
      if (!isMounted) return;
      const byMission: Record<string, AssessmentAttemptRecord> = {};
      for (const attempt of attempts) {
        byMission[attempt.missionId] = attempt;
      }
      setAssessmentAttemptsByMission(byMission);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectClass = async (classLevel: ClassLevel) => {
    setProgress((prev) => ({ ...prev, selectedClass: classLevel }));
    const result = await saveSelectedClass(classLevel);
    setProgress(result.progress);
    setStorageWarning(result.storageAvailable ? null : result.storageMessage ?? null);
  };

  const handleToggleClassQuick = () => {
    const nextClass: ClassLevel = progress.selectedClass === 9 ? 10 : 9;
    void handleSelectClass(nextClass);
  };

  const closeDevSheet = () => {
    if (!(import.meta.env && import.meta.env.DEV)) return;
    if (typeof window !== 'undefined' && (window.location.hash || window.location.search)) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search.replace(/[?&]dev=characters/, ''),
      );
    }
    setIsDevSheetOpen(false);
  };

  const handleNavigate = (section: AppSection) => {
    setPreviewMission(null);
    setActiveLesson(null);
    writeMissionHash(null);
    if (isDevSheetOpen) closeDevSheet();
    setActiveSection(section);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleStartLesson = (
    missionId: string,
    preferredClass?: ClassLevel,
    initialPhase?: EnginePhase,
  ) => {
    if (isDevSheetOpen) closeDevSheet();
    setPreviewMission(null);
    const resolvedClass = preferredClass ?? progress.selectedClass;
    const normalizedId = missionId.replace(/^c(?:9|10)-/, `c${resolvedClass}-`);
    const nextState: ActiveLessonState = {
      missionId: normalizedId,
      classLevel: resolvedClass,
      phase: initialPhase,
    };
    setActiveLesson(nextState);
    writeMissionHash(nextState);
  };

  const handleExitLesson = () => {
    setActiveLesson(null);
    writeMissionHash(null);
  };

  const handleLessonPhaseChange = (nextPhase: EnginePhase) => {
    setActiveLesson((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, phase: nextPhase };
      writeMissionHash(updated);
      return updated;
    });
  };

  const handleAssessmentSubmitted = (attempt: AssessmentAttemptRecord) => {
    setAssessmentAttemptsByMission((prev) => ({
      ...prev,
      [attempt.missionId]: attempt,
    }));
  };

  const handlePreviewMission = (mission: PlaceholderMissionSummary) => {
    if (isDevSheetOpen) closeDevSheet();
    if (mission.status === 'ready') {
      handleStartLesson(mission.id, mission.classLevel);
      return;
    }
    setPreviewMission(mission);
    setActiveSection('missions');
  };

  const handleRecordMissionStarted = async (lesson: GrammarLessonDefinition) => {
    const result = await markMissionStarted(lesson.missionId);
    setProgress(result.progress);
    setStorageWarning(result.storageAvailable ? null : result.storageMessage ?? null);
  };

  const handleRecordTeachingCompleted = async (lesson: GrammarLessonDefinition) => {
    const result = await markTeachingCompleted(lesson.missionId);
    setProgress(result.progress);
    setStorageWarning(result.storageAvailable ? null : result.storageMessage ?? null);
  };

  const handleRecordPracticeCompleted = async (
    lesson: GrammarLessonDefinition,
    kind: 'guided' | 'independent',
  ) => {
    const result = await markPracticeCompleted(lesson.missionId, kind);
    setProgress(result.progress);
    setStorageWarning(result.storageAvailable ? null : result.storageMessage ?? null);
  };

  const handleRecordMissionCompleted = async (lesson: GrammarLessonDefinition) => {
    const result = await markMissionCompleted(lesson.missionId);
    setProgress(result.progress);
    setStorageWarning(result.storageAvailable ? null : result.storageMessage ?? null);
  };

  const handleCompleteLessonPractice = async (lesson: GrammarLessonDefinition) => {
    await handleRecordMissionCompleted(lesson);
    setActiveLesson(null);
    writeMissionHash(null);
    setPreviewMission(null);
    setActiveSection('home');
  };

  const resolvedLesson = activeLesson
    ? getLessonForMission(
        activeLesson.missionId.replace(/^c(?:9|10)-/, `c${activeLesson.classLevel}-`),
      )
    : null;

  return (
    <MotionConfig reducedMotion="user">
      {resolvedLesson ? (
        <GrammarTeachingEngine
          lesson={resolvedLesson}
          initialPhase={activeLesson?.phase}
          assessmentAttempt={
            assessmentAttemptsByMission[resolvedLesson.missionId] ?? null
          }
          onPhaseChange={handleLessonPhaseChange}
          onAssessmentSubmitted={handleAssessmentSubmitted}
          onExit={handleExitLesson}
          onRecordMissionStarted={(lesson) => void handleRecordMissionStarted(lesson)}
          onRecordTeachingCompleted={(lesson) => void handleRecordTeachingCompleted(lesson)}
          onRecordPracticeCompleted={(lesson, kind) =>
            void handleRecordPracticeCompleted(lesson, kind)
          }
          onRecordMissionCompleted={(lesson) => void handleRecordMissionCompleted(lesson)}
          onCompleteLessonPractice={(lesson) => void handleCompleteLessonPractice(lesson)}
        />
      ) : (
        <div
          className={[
            'min-h-screen flex flex-col text-[#333333] overflow-x-clip',
            (activeSection === 'missions' || activeSection === 'guide') && !previewMission
              ? 'bg-[#FBF6EA]'
              : 'bg-[#FDFCF9]',
          ].join(' ')}
        >
          <Header
            activeSection={activeSection}
            onNavigate={handleNavigate}
            selectedClass={progress.selectedClass}
            onToggleClassQuick={handleToggleClassQuick}
          />

          <main
            className={[
              'flex-1 w-full max-w-[1120px] mx-auto pb-[120px]',
              activeSection === 'missions' && !previewMission
                ? 'px-4 sm:px-6 pt-3 sm:pt-6'
                : 'px-3.5 sm:px-6 pt-4 sm:pt-7',
            ].join(' ')}
          >
            {storageWarning ? (
              <div
                role="status"
                className="mb-5 flex items-start gap-2.5 rounded-[14px] bg-[#FEE8E7] border border-[#F7C2BF] px-4 py-3 text-sm text-[#263A70]"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-[#9E2A25] mt-0.5" aria-hidden="true" />
                <span>{storageWarning}</span>
              </div>
            ) : null}

            {import.meta.env && import.meta.env.DEV && isDevSheetOpen && DevCharacterReferenceSheet ? (
              <Suspense
                fallback={
                  <div className="py-8 text-sm text-[#4B5C8A]">Loading developer sheet…</div>
                }
              >
                <DevCharacterReferenceSheet onBack={closeDevSheet} />
              </Suspense>
            ) : activeSection === 'home' ? (
              <Dashboard
                selectedClass={progress.selectedClass}
                progress={progress}
                assessmentAttemptsByMission={assessmentAttemptsByMission}
                onSelectClass={(lvl) => void handleSelectClass(lvl)}
                onPreviewMission={handlePreviewMission}
                onOpenMissions={() => handleNavigate('missions')}
                onOpenAssessment={(missionId, preferredClass) =>
                  handleStartLesson(missionId, preferredClass, 'assess')
                }
              />
            ) : (
              <FoundationSectionView
                section={activeSection}
                selectedClass={progress.selectedClass}
                progress={progress}
                assessmentAttemptsByMission={assessmentAttemptsByMission}
                previewMission={previewMission}
                onClearPreview={() => setPreviewMission(null)}
                onSelectPreview={(mission) => setPreviewMission(mission)}
                onStartLesson={handleStartLesson}
                onOpenAssessment={(missionId, preferredClass) =>
                  handleStartLesson(missionId, preferredClass, 'assess')
                }
                onBackHome={() => handleNavigate('home')}
              />
            )}
          </main>

          <footer className="hidden md:block border-t border-[#E5E2D9] bg-white/70">
            <div className="max-w-[1120px] mx-auto px-6 py-4 flex items-center justify-between text-xs text-[#4B5C8A]">
              <span>Grammar Quest — Classes 9 &amp; 10</span>
              <span>Saved on this device • No sign-in required</span>
            </div>
          </footer>

          <ScrollMoreHint
            label={
              (activeSection === 'guide' || activeSection === 'missions') && !previewMission
                ? 'More topics below'
                : 'Scroll for more'
            }
            ariaLabel={
              (activeSection === 'guide' || activeSection === 'missions') && !previewMission
                ? 'Scroll down to see more topics'
                : 'Scroll down to see more'
            }
            fadeColor={
              (activeSection === 'missions' || activeSection === 'guide') && !previewMission
                ? '#FBF6EA'
                : '#FDFCF9'
            }
            bottomOffsetMode="app-nav"
            recheckKey={`${activeSection}-${previewMission?.id ?? 'none'}-${progress.selectedClass}`}
          />
        </div>
      )}
    </MotionConfig>
  );
}
