import React from 'react';
import { Card } from '../../components';
import { useFeedbackPreferences } from '../../hooks/useFeedbackPreferences';
import { updateFeedbackPreferences } from '../../services/feedback/feedbackService';

export const FeedbackPreferences: React.FC = () => {
  const preferences = useFeedbackPreferences();

  return (
    <Card surface="white" padding="md" className="space-y-3">
      <div>
        <h2 className="font-heading text-base font-semibold text-[#263A70]">
          Sound &amp; haptics
        </h2>
        <p className="text-sm text-[#4B5C8A]">
          Optional, gentle feedback for character dialogue and learning moments.
        </p>
      </div>

      <label className="flex min-h-[48px] items-center justify-between gap-4 rounded-[12px] bg-[#FDFCF9] px-3 py-2">
        <span className="text-sm font-semibold text-[#263A70]">Sound effects</span>
        <input
          type="checkbox"
          checked={preferences.soundEnabled}
          onChange={(event) =>
            updateFeedbackPreferences({ soundEnabled: event.currentTarget.checked })
          }
          className="h-5 w-5 shrink-0 cursor-pointer accent-[#263A70]"
        />
      </label>

      <label className="flex min-h-[48px] items-center justify-between gap-4 rounded-[12px] bg-[#FDFCF9] px-3 py-2">
        <span className="text-sm font-semibold text-[#263A70]">Haptic feedback</span>
        <input
          type="checkbox"
          checked={preferences.hapticsEnabled}
          onChange={(event) =>
            updateFeedbackPreferences({ hapticsEnabled: event.currentTarget.checked })
          }
          className="h-5 w-5 shrink-0 cursor-pointer accent-[#263A70]"
        />
      </label>
    </Card>
  );
};
