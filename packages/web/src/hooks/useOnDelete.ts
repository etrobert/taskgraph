import { useMutation } from '@tanstack/react-query';
import type { OnNodesDelete, OnEdgesDelete } from '@xyflow/react';
import { trpc } from '../utils/trpc';

export const useOnDelete = () => {
  const deleteNodes = useMutation(trpc.deleteNodes.mutationOptions());
  const deleteEdges = useMutation(trpc.deleteEdges.mutationOptions());

  const onNodesDelete: OnNodesDelete = (nodes) => {
    deleteNodes.mutate(nodes.map((node) => node.id));
  };

  const onEdgesDelete: OnEdgesDelete = (edges) => {
    if (edges.length > 0) deleteEdges.mutate(edges.map((edge) => edge.id));
  };

  return {
    onNodesDelete,
    onEdgesDelete,
  };
};
