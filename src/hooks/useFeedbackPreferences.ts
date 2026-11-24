import { useSyncExternalStore } from 'react';
import {
  getFeedbackPreferences,
  subscribeFeedbackPreferences,
} from '../services/feedback/feedbackService';

export function useFeedbackPreferences() {
  return useSyncExternalStore(
    subscribeFeedbackPreferences,
    getFeedbackPreferences,
    getFeedbackPreferences,
  );
}
