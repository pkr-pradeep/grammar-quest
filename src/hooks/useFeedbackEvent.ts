import { useEffect, useRef } from 'react';

export function useFeedbackEvent(eventId: string | null, onEvent: () => void): void {
  const lastEventIdRef = useRef<string | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (eventId === null) {
      lastEventIdRef.current = null;
      return;
    }

    if (lastEventIdRef.current === eventId) return;
    lastEventIdRef.current = eventId;
    onEventRef.current();
  }, [eventId]);
}
