import React from 'react';
import miraHappyArtwork from '../../assets/characters/mira/mira_02_happy.png';
import arjunHappyArtwork from '../../assets/characters/arjun/arjun_02_happy.png';
import { ShukaJiArtwork } from '../Character/ShukaJiSvg';

interface TrioIllustrationProps {
  className?: string;
}

export const WelcomeTrioIllustration: React.FC<TrioIllustrationProps> = ({
  className = '',
}) => (
  <svg
    viewBox="0 0 360 210"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Mira, Arjun, and their parrot guide Śukāji welcoming you to Grammar Quest"
  >
    <path
      d="M28 196C28 112 96 42 182 42C268 42 336 112 336 196H28Z"
      fill="#FFF1D5"
    />
    <circle cx="292" cy="52" r="14" fill="#FFC64B" opacity="0.55" />
    <circle cx="66" cy="70" r="9" fill="#8DECE0" opacity="0.7" />

    <image
      href={miraHappyArtwork}
      x="30"
      y="26"
      width="120"
      height="170"
      preserveAspectRatio="xMidYMax meet"
      className="gq-story-breathe"
      style={{ transformOrigin: '90px 196px' }}
    />
    <image
      href={arjunHappyArtwork}
      x="120"
      y="22"
      width="120"
      height="174"
      preserveAspectRatio="xMidYMax meet"
      className="gq-story-breathe"
      style={{ transformOrigin: '180px 196px', animationDelay: '0.4s' }}
    />

    <g transform="translate(220 72) scale(0.62)">
      <g id="character-shuka" className="gq-story-shuka-float">
        <ShukaJiArtwork pose="waving" expression="happy" />
      </g>
    </g>

    <line
      x1="20"
      y1="196"
      x2="340"
      y2="196"
      stroke="#263A70"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
