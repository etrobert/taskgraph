import { useState, useRef } from 'react';

export function useMoving() {
  const [moving, setMoving] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout>(undefined);
  const onMove = () => {
    setMoving(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMoving(false), 100);
  };

  return { onMove, moving };
}
