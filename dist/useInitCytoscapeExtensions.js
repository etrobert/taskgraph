import {useEffect, useState} from "../_snowpack/pkg/react.js";
import cytoscape from "../_snowpack/pkg/cytoscape.js";
import cytoscapeDomNode from "../_snowpack/pkg/cytoscape-dom-node.js";
import edgehandles from "../_snowpack/pkg/cytoscape-edgehandles.js";
cytoscape.use(cytoscapeDomNode);
cytoscape.use(edgehandles);
const useInitCytoscapeExtensions = (cy) => {
  const [edgeHandles, setEdgeHandles] = useState();
  useEffect(() => {
    if (cy === void 0)
      return;
    cy.domNode();
  }, [cy]);
  useEffect(() => {
    if (cy === void 0)
      return;
    setEdgeHandles(cy.edgehandles());
  }, [cy]);
  return {edgeHandles};
};
export default useInitCytoscapeExtensions;
