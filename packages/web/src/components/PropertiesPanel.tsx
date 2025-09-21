import { type OnSelectionChangeParams } from '@xyflow/react';
import { type CSSProperties } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
} from './ui/sidebar';
import type { NodeType } from './flow/TaskGraphFlow';
import { TaskPropertiesPanel } from './TaskPropertiesPanel';
import { ProjectPropertiesPanel } from './ProjectPropertiesPanel';

interface PropertiesPanelProps {
  selection: OnSelectionChangeParams<NodeType>;
}

export function PropertiesPanel({ selection }: PropertiesPanelProps) {
  const selectedNode = selection.nodes.at(0);

  if (selection.nodes.length !== 1) {
    return (
      <Sidebar
        collapsible="none"
        side="right"
        style={{ '--sidebar-width': '20rem' } as CSSProperties}
        className="border-l"
      >
        <SidebarHeader>
          <h2 className="text-lg font-semibold">Properties</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <p className="text-muted-foreground px-2 text-sm">
                {selection.nodes.length === 0
                  ? 'Select a node to view its properties'
                  : selection.nodes.length > 1
                    ? `${selection.nodes.length} nodes selected`
                    : 'Select a node to view its properties'}
              </p>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  if (!selectedNode) return null;

  return (
    <Sidebar
      collapsible="none"
      side="right"
      style={{ '--sidebar-width': '20rem' } as CSSProperties}
      className="border-l"
    >
      <SidebarHeader>
        <h2 className="text-lg font-semibold">
          {selectedNode.type === 'task' ? 'Task' : 'Project'} Properties
        </h2>
      </SidebarHeader>
      <SidebarContent>
        {selectedNode.type === 'task' && (
          <TaskPropertiesPanel selectedNode={selectedNode} />
        )}
        {selectedNode.type === 'project' && (
          <ProjectPropertiesPanel selectedNode={selectedNode} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="text-muted-foreground font-mono text-xs">
          {selectedNode.type}: {selectedNode.id.slice(0, 25)}...
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
