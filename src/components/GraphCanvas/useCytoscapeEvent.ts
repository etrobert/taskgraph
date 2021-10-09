import { useEffect } from "react";
import type Cy from "cytoscape";

const useCytoscapeEvent = (
  cy: Cy.Core | undefined,
  events: string,
  handler: Cy.EventHandler
): void => {
  useEffect(() => {
    if (cy === undefined) return;
    cy.on(events, handler);
    return () => {
      cy.removeListener(events, handler);
    };
  }, [cy, events, handler]);
};

export default useCytoscapeEvent;
