/**
 * ============================================================================
 * GRAMMAR QUEST — SHARED HEADER & RESPONSIVE NAVIGATION
 * ============================================================================
 * Desktop: Clean 64px top bar (Brand wordmark and 4 concise single-line links).
 * Mobile: Compact 48px top header + fixed 56px bottom tab bar (104px combined,
 * staying comfortably below the 15% mobile sticky-height cap while preserving
 * 44px+ touch targets in the natural thumb zone).
 * ============================================================================
 */

import React from 'react';
import { BookOpen, Compass, Home, BarChart3 } from 'lucide-react';
import type { AppSection } from '../../schemas/lesson.schema';
import { GrammarQuestEmblem } from '../illustrations/Characters';

export interface HeaderProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

interface NavItem {
  id: AppSection;
  label: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'missions', label: 'Lessons', Icon: Compass },
  { id: 'guide', label: 'Guide', Icon: BookOpen },
  { id: 'progress', label: 'Progress', Icon: BarChart3 },
];

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
}) => {
  return (
    <>
      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E2D9]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-12 md:h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2.5 min-h-[44px] text-left cursor-pointer rounded-[12px] pr-2"
            aria-label="Grammar Quest Home"
          >
            <GrammarQuestEmblem className="w-8 h-8 md:w-9 md:h-9 shrink-0" />
            <span className="text-lg md:text-xl font-semibold tracking-tight whitespace-nowrap text-[#263A70]">
              Grammar <span className="text-[#E07F07]">Quest</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1.5">
            {NAV_ITEMS.map(({ id, label, Icon }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'inline-flex items-center gap-2 min-h-[40px] px-3.5 py-2 rounded-[12px]',
                    'text-sm font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer',
                    isActive
                      ? 'bg-[#FFF1D5] text-[#263A70]'
                      : 'text-[#4B5C8A] hover:text-[#263A70] hover:bg-[#F7F5EE]',
                  ].join(' ')}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={2.2} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E5E2D9] px-2 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-4 h-14 max-w-md mx-auto items-center">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'flex flex-col items-center justify-center min-h-[44px] rounded-[12px] mx-0.5 transition-colors duration-150 cursor-pointer',
                  isActive
                    ? 'bg-[#FCE9BE] text-[#1B2559]'
                    : 'text-[#4B5C8A] hover:text-[#263A70]',
                ].join(' ')}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 2} />
                <span className="text-[11px] font-medium leading-tight mt-0.5 whitespace-nowrap">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
