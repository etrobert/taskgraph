import { type OnSelectionChangeParams } from '@xyflow/react';
import { type CSSProperties } from 'react';
import { Sidebar, SidebarContent, SidebarHeader } from './ui/sidebar';
import type { NodeType } from './flow/TaskGraphFlow';
import { TaskPropertiesPanel } from './TaskPropertiesPanel';
import { ProjectPropertiesPanel } from './ProjectPropertiesPanel';

interface PropertiesPanelProps {
  selection: OnSelectionChangeParams<NodeType>;
}

function PropertiesPanelContent({ selection }: PropertiesPanelProps) {
  if (selection.nodes.length === 0)
    return (
      <>
        <SidebarHeader>Properties</SidebarHeader>
        <SidebarContent>
          <p className="text-muted-foreground text-sm">
            Select a node to view its properties
          </p>
        </SidebarContent>
      </>
    );
  if (selection.nodes.length > 1)
    return (
      <>
        <SidebarHeader>Properties</SidebarHeader>
        <SidebarContent>
          <p className="text-muted-foreground text-sm">
            {selection.nodes.length} nodes selected
          </p>
        </SidebarContent>
      </>
    );

  const selectedNode = selection.nodes[0];

  if (selectedNode.type === 'task')
    return <TaskPropertiesPanel selectedNode={selectedNode} />;

  if (selectedNode?.type === 'project')
    return <ProjectPropertiesPanel selectedNode={selectedNode} />;
}

export function PropertiesPanel({ selection }: PropertiesPanelProps) {
  return (
    <Sidebar
      collapsible="none"
      side="right"
      style={{ '--sidebar-width': '20rem' } as CSSProperties}
      className="border-l p-3"
    >
      <PropertiesPanelContent selection={selection} />
    </Sidebar>
  );
}
