import { type OnSelectionChangeParams } from 'reactflow';
import { type TaskNodeData } from './TaskNode';
import { useMutation, useQuery } from '@tanstack/react-query';
import { trpc } from '../utils/trpc';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { useOrganizationId } from '@/hooks/useOrganizationId';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
} from './ui/sidebar';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';

interface TaskPropertiesPanelProps {
  selection: OnSelectionChangeParams;
}

export function TaskPropertiesPanel({ selection }: TaskPropertiesPanelProps) {
  const organizationId = useOrganizationId();
  const { data: graph } = useQuery(
    trpc.graph.queryOptions(
      { organizationId: organizationId! },
      { enabled: !!organizationId },
    ),
  );

  const [lastKeystroke, setLastKeystroke] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    if (graph === undefined) return;
    const selectedTask = graph.tasks.find(
      (task) => task.id === selection.nodes[0]?.id,
    );
    if (selectedTask === undefined) return;
    if (Date.now() - lastKeystroke < 1000) return;
    setName(selectedTask.name);
  }, [graph, lastKeystroke, name, selection.nodes]);

  const updateTask = useMutation(trpc.updateTask.mutationOptions());

  if (selection.nodes.length !== 1) {
    return (
      <Sidebar
        collapsible="none"
        side="right"
        style={{ '--sidebar-width': '20rem' }}
        className="border-l"
      >
        <SidebarHeader>
          <h2 className="text-lg font-semibold">Task Properties</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <p className="text-muted-foreground px-2 text-sm">
                {selection.nodes.length === 0
                  ? 'Select a task to view its properties'
                  : selection.nodes.length > 1
                    ? `${selection.nodes.length} tasks selected`
                    : 'Select a task to view its properties'}
              </p>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  if (graph === undefined) return null;

  const selectedTask = graph.tasks.find(
    (task) => task.id === selection.nodes[0].id,
  );

  if (selectedTask === undefined) return null;

  return (
    <Sidebar
      collapsible="none"
      side="right"
      style={{ '--sidebar-width': '20rem' }}
      className="border-l"
    >
      <SidebarHeader>
        <h2 className="text-lg font-semibold">Task Properties</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="grid gap-2">
            <Label htmlFor="task-name">Task Name</Label>
            <Input
              id="task-name"
              type="text"
              value={name}
              onChange={(e) => {
                setLastKeystroke(Date.now());
                setName(e.target.value);
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
              <SelectTrigger>
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
      </SidebarContent>
      <SidebarFooter>
        <div className="text-muted-foreground font-mono text-xs">
          taskId: {selectedTask.id.slice(0, 25)}...
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
