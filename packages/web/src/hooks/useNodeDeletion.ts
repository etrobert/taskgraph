import { useMutation } from '@tanstack/react-query';
import type { OnNodesDelete, OnEdgesDelete } from '@xyflow/react';
import { trpc } from '../utils/trpc';
import type { NodeType } from '../components/flow/TaskGraphFlow';

export const useOnDelete = () => {
  const deleteTasks = useMutation(trpc.deleteTasks.mutationOptions());
  const deleteProjects = useMutation(trpc.deleteProjects.mutationOptions());
  const deleteDependencies = useMutation(
    trpc.deleteDependencies.mutationOptions(),
  );

  const onNodesDelete: OnNodesDelete = (nodes) => {
    const taskNodes = nodes.filter((node) => node.type === 'task');
    const projectNodes = nodes.filter((node) => node.type === 'project');

    if (taskNodes.length > 0) {
      deleteTasks.mutate(taskNodes.map((node) => node.id));
    }
    if (projectNodes.length > 0) {
      deleteProjects.mutate(projectNodes.map((node) => node.id));
    }
  };

  const onEdgesDelete: OnEdgesDelete = (edges) => {
    if (edges.length > 0)
      deleteDependencies.mutate(edges.map((edge) => edge.id));
  };

  return {
    onNodesDelete,
    onEdgesDelete,
  };
};