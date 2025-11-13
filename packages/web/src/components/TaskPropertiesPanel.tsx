import { useMutation, useQuery } from '@tanstack/react-query';
import { useTRPC } from '../utils/trpc';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { useOrganizationId } from '@/hooks/useOrganizationId';
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from './ui/sidebar';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import type { TaskNodeData } from '@/lib/getTaskNodeFromTask';
import type { TaskNodeType } from './TaskNode';
import { statusValues } from 'api/db/schema';
import { HiddenDependenciesInfo } from './HiddenDependenciesInfo';

interface TaskPropertiesPanelProps {
  selectedNode: TaskNodeType;
}

export function TaskPropertiesPanel({
  selectedNode,
}: TaskPropertiesPanelProps) {
  const trpc = useTRPC();
  const organizationId = useOrganizationId();
  const { data: graph } = useQuery(
    trpc.graph.queryOptions(
      { organizationId: organizationId! },
      { enabled: !!organizationId },
    ),
  );
  const { data: users } = useQuery(trpc.users.queryOptions());

  const [lastKeystroke, setLastKeystroke] = useState(0);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const updateNode = useMutation(trpc.updateNode.mutationOptions());
  const updateTaskDetails = useMutation(
    trpc.updateTaskDetails.mutationOptions(),
  );

  useEffect(() => {
    if (graph === undefined) return;

    const selectedTask = graph.tasks.find(
      (task) => task.id === selectedNode.id,
    );
    if (selectedTask && Date.now() - lastKeystroke >= 1000) {
      setTaskName(selectedTask.name);
      setTaskDescription(selectedTask.description ?? '');
    }
  }, [graph, lastKeystroke, selectedNode]);

  if (graph === undefined) return null;

  const selectedTask = graph.tasks.find((task) => task.id === selectedNode.id);

  if (!selectedTask) return null;

  return (
    <>
      <SidebarHeader>Task Properties</SidebarHeader>
      <SidebarContent>
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
                updateNode.mutate({
                  id: selectedTask.id,
                  updates: { name: e.target.value },
                });
              }}
            />
            <Label>Status</Label>
            <Select
              value={selectedTask.status || 'pending'}
              onValueChange={(value) =>
                updateTaskDetails.mutate({
                  nodeId: selectedTask.id,
                  updates: {
                    status: value as TaskNodeData['status'],
                  },
                })
              }
            >
              <SelectTrigger className="w-full capitalize">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusValues.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="capitalize"
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label>Assigned To</Label>
            <Select
              value={selectedTask.assignedTo ?? 'unassigned'}
              onValueChange={(value) =>
                updateTaskDetails.mutate({
                  nodeId: selectedTask.id,
                  updates: {
                    assignedTo: value === 'unassigned' ? null : value,
                  },
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label htmlFor="task-description">Description</Label>
            <textarea
              id="task-description"
              value={taskDescription}
              onChange={(e) => {
                setLastKeystroke(Date.now());
                setTaskDescription(e.target.value);
                updateTaskDetails.mutate({
                  nodeId: selectedTask.id,
                  updates: { description: e.target.value },
                });
              }}
              className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive min-h-[6rem] w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />

            <HiddenDependenciesInfo nodeId={selectedTask.id} />

            {selectedTask.archivedAt && (
              <>
                <Label>Archive Information</Label>
                <div className="text-muted-foreground text-sm">
                  Archived: {selectedTask.archivedAt.toLocaleString()}
                </div>
              </>
            )}

            {selectedTask.archivedAt && (
              <Button
                variant="outline"
                onClick={() =>
                  updateNode.mutate({
                    id: selectedTask.id,
                    updates: { archivedAt: null },
                  })
                }
                disabled={updateNode.isPending}
                className="w-full"
              >
                {updateNode.isPending ? 'Unarchiving...' : 'Unarchive'}
              </Button>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="text-muted-foreground font-mono text-xs whitespace-pre">
          {JSON.stringify(selectedTask, undefined, 2)}
        </div>
      </SidebarFooter>
    </>
  );
}
