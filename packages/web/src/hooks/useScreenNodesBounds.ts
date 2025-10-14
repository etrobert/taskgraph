import { useMemo } from 'react';
import { useReactFlow, useViewport } from '@xyflow/react';
import type { NodeType } from '@/components/flow/TaskGraphFlow';

export function useScreenNodesBounds(nodes: NodeType[]) {
  const { getNodesBounds, flowToScreenPosition } = useReactFlow<NodeType>();

  const viewport = useViewport();

  return useMemo(() => {
    const { width, height, ...flowPos } = getNodesBounds(nodes);
    const pos = flowToScreenPosition(flowPos);
    const { zoom } = viewport;
    const size = { width: width * zoom, height: height * zoom };
    return { ...pos, ...size };
  }, [flowToScreenPosition, getNodesBounds, nodes, viewport]);
}
