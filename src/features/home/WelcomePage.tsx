import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AppShell } from '../../components';
import shukaMainArtwork from '../../assets/shukaji/main.png';

interface WelcomePageProps {
  onStartLearning: () => void;
}

const TOPIC_CHIPS = [
  { label: 'noun', top: '9%', left: '5%', color: '#FFC83D', rotation: '-6deg' },
  { label: 'tense', top: '10%', right: '4%', color: '#5FD9CE', rotation: '5deg' },
  { label: 'modal', top: '31%', left: '4%', color: '#FF8F8F', rotation: '4deg' },
  { label: 'clause', top: '33%', right: '4%', color: '#FFC83D', rotation: '-5deg' },
  { label: 'verb', top: '46%', left: '6%', color: '#5FD9CE', rotation: '-4deg' },
  { label: 'adverb', top: '48%', right: '3%', color: '#FF8F8F', rotation: '6deg' },
];

const SPARKLES = [
  { top: '23%', left: '11%', size: 6, delay: '0.2s' },
  { top: '24%', right: '11%', size: 8, delay: '0.8s' },
  { top: '7%', left: '51%', size: 5, delay: '1.2s' },
  { top: '56%', left: '28%', size: 5, delay: '0.5s' },
  { top: '40%', right: '9%', size: 6, delay: '1.5s' },
  { top: '40%', left: '8%', size: 7, delay: '1s' },
];

export const WelcomePage: React.FC<WelcomePageProps> = ({ onStartLearning }) => (
  <AppShell
    ariaLabelledBy="welcome-title"
    className="gq-welcome bg-[#1F2A68] text-white"
    showScrollHint={true}
    utilityMaxWidthClassName="max-w-[430px]"
    scrollHintAriaLabel="Scroll down to start learning"
    scrollHintReturnToTopAriaLabel="Scroll back to top"
  >
    <main className="relative isolate flex min-h-full w-full flex-col overflow-x-clip px-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <span className="absolute -bottom-[115px] -left-[70px] h-[200px] w-[330px] rounded-[50%] bg-[#2E3B8E]" />
        <span className="absolute -bottom-[130px] left-[150px] h-[200px] w-[330px] rounded-[50%] bg-[#3B49A8]" />

        {SPARKLES.map((sparkle, index) => (
          <span
            key={`spark-${index}`}
            className="gq-welcome-spark absolute rounded-full bg-white"
            style={{
              top: sparkle.top,
              left: sparkle.left,
              right: sparkle.right,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              animationDelay: sparkle.delay,
            }}
          />
        ))}

        {TOPIC_CHIPS.map((chip, index) => (
          <span
            key={chip.label}
            className="font-expressive gq-welcome-chip absolute hidden rounded-full px-3.5 py-2 text-[14px] leading-none text-[#1F2A68] min-[360px]:inline-flex"
            style={{
              top: chip.top,
              left: chip.left,
              right: chip.right,
              backgroundColor: chip.color,
              transform: `rotate(${chip.rotation})`,
              animationDelay: `${index * 0.2}s`,
            }}
          >
            {chip.label}
          </span>
        ))}
      </div>

      <div className="gq-welcome-enter relative z-10 mx-auto flex flex-1 w-full max-w-[430px] flex-col items-center justify-between pt-[max(28px,env(safe-area-inset-top,0px))] pb-[max(24px,env(safe-area-inset-bottom,0px))]">
        <div className="flex w-full flex-1 flex-col items-center justify-center pt-6 pb-2">
          <div className="relative z-20 mb-3 w-[min(260px,calc(100vw-80px))]">
            <p className="rounded-[22px] bg-white px-4 py-4 text-center text-[16px] font-extrabold leading-tight text-[#1F2A68] shadow-lg">
              namaskāraḥ, learner! I'm Śukadeva, <br /> call me Śukaji.
            </p>
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] bg-white"
            />
          </div>

          <img
            src={shukaMainArtwork}
            alt="Śukaji, the Grammar Quest parrot guide, perched on a branch"
            draggable={false}
            className="gq-welcome-mascot block h-[clamp(150px,26dvh,235px)] w-[min(64vw,270px)] object-contain"
          />

          <h1
            id="welcome-title"
            className="gq-welcome-title mt-2 whitespace-nowrap text-[36px] font-semibold leading-[1.1] tracking-normal min-[360px]:text-[36px] sm:text-[44px]"
          >
            <span className="text-white">Grammar</span>{' '}
            <span className="text-[#FFC83D]">Quest</span>
          </h1>

          <p className="mt-2 text-center text-[16px] font-bold leading-snug text-[#D9DDFF] sm:text-[18px]">
            Grammar that makes you giggle.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-4 pt-4">
          <button
            type="button"
            onClick={onStartLearning}
            className="gq-welcome-button inline-flex h-[58px] min-h-[44px] w-full max-w-[280px] items-center justify-center gap-2.5 rounded-full bg-[#FFC83D] px-5 text-[20px] font-extrabold text-[#1F2A68] shadow-[0_6px_0_#C9970A] transition-[filter,transform,box-shadow] hover:brightness-105 active:translate-y-1 active:shadow-[0_2px_0_#C9970A] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white cursor-pointer"
          >
            Start learning
            <ArrowRight className="h-[22px] w-[22px]" strokeWidth={3} aria-hidden="true" />
          </button>

          <p className="text-center text-[13px] font-bold leading-snug text-[#D9DDFF]">
            English grammar for all
          </p>
        </div>
      </div>
    </main>
  </AppShell>
);
