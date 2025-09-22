import { useMutation, useQuery } from '@tanstack/react-query';
import { trpc } from '../utils/trpc';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { useOrganizationId } from '@/hooks/useOrganizationId';
import { SidebarGroup, SidebarGroupContent } from './ui/sidebar';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import type { TaskNodeData } from '@/lib/getTaskNodeFromTask';
import type { TaskNodeType } from './TaskNode';

interface TaskPropertiesPanelProps {
  selectedNode: TaskNodeType;
}

export function TaskPropertiesPanel({
  selectedNode,
}: TaskPropertiesPanelProps) {
  const organizationId = useOrganizationId();
  const { data: graph } = useQuery(
    trpc.graph.queryOptions(
      { organizationId: organizationId! },
      { enabled: !!organizationId },
    ),
  );

  const [lastKeystroke, setLastKeystroke] = useState(0);
  const [taskName, setTaskName] = useState('');

  const updateTask = useMutation(trpc.updateTask.mutationOptions());

  useEffect(() => {
    if (graph === undefined) return;

    const selectedTask = graph.tasks.find(
      (task) => task.id === selectedNode.id,
    );
    if (selectedTask && Date.now() - lastKeystroke >= 1000)
      setTaskName(selectedTask.name);
  }, [graph, lastKeystroke, selectedNode]);

  if (graph === undefined) return null;

  const selectedTask = graph.tasks.find((task) => task.id === selectedNode.id);

  if (!selectedTask) return null;

  return (
    <SidebarGroup>
      <SidebarGroupContent className="grid gap-2">
        <Label htmlFor="task-name">Task Name</Label>
        <Input
          id="task-name"
          type="text"
          value={taskName}
          onChange={(e) => {
            setLastKeystroke(Date.now());
            setTaskName(e.target.value);
            updateTask.mutate({
              id: selectedTask.id,
              updates: { name: e.target.value },
            });
          }}
        />
        <Label>Status</Label>
        <Select
          value={selectedTask.status || 'pending'}
          onValueChange={(value) =>
            updateTask.mutate({
              id: selectedTask.id,
              updates: {
                status: value as TaskNodeData['status'],
              },
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
