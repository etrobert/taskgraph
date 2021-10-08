import {useEffect} from "../../../snowpack/pkg/react.js";
const useCytoscapeEvent = (cy, events, handler) => {
  useEffect(() => {
    if (cy === void 0)
      return;
    cy.on(events, handler);
    return () => {
      cy.removeListener(events, handler);
    };
  }, [cy, events, handler]);
};
export default useCytoscapeEvent;
