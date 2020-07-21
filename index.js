// TODO change to a correct include
import cytoscape from './node_modules/cytoscape/dist/cytoscape.esm.min.js'

const cy = cytoscape({
  container: document.getElementById('cy'),
  elements: [ // list of graph elements to start with
    { // node a
      data: { id: 'a' }
    },
    { // node b
      data: { id: 'b' }
    },
    { // edge ab
      data: { id: 'ab', source: 'a', target: 'b' }
    }
  ],
  style: [
    {
      selector: 'node',
      style: {
        'background-color': 'aquamarine',
        'label': 'data(id)',
        'text-valign': 'center'
      }
    },
    {
      selector: 'edge',
      style: {
        'target-arrow-shape': 'triangle',
        'line-color': 'black',
        'target-arrow-color': 'black',
        'curve-style': 'bezier'
      }
    }
  ]
});

console.log("Hello world!");
