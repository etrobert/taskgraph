import { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

export function useZoomShortcuts() {
  const { fitView } = useReactFlow();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '!' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        fitView({ padding: 0.1, duration: 300 });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fitView]);
}
