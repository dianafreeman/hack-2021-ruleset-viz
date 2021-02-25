import React, { createContext, useRef, useState, useEffect } from 'react';
import { default as DIRECTIONS } from '../constants/dagDirections';
import { forceCollide } from 'd3-force';

const VizContext = createContext({
  nodeLabel: (node) => null,
  nodeColor: (node) => null,
  dagDirection: null,
});

export default VizContext;

export const VizProvider = ({ children }) => {
  const [isDAG, setIsDAG] = useState(false);
  const graphRef = useRef();

  const nodeColor = (node) => {
    if (node.requirement) return 'red';
    if (node.rule) return 'orange';
    if (node.relational_type == 'AscentModule') return 'yellow';
    if (node.relational_type == 'Regulator') return 'white';
  };

  const toggleDag = () => setIsDAG(!isDAG);
  const nodeLabel = (d) => d.requirement?.summary || d.rule?.number || d.name || d.slug;

  const [dagDirection, setDagDirection] = useState(DIRECTIONS.TD.value);

  const useForceUpdate = () => {
    const setToggle = useState(false)[1];
    return () => setToggle((b) => !b);
  };

  useEffect(() => {
    // add collision force
    graphRef.current.d3Force(
      'collision',
      forceCollide((node) => Math.sqrt(100 / (node.level + 1)))
    );
  }, []);

  return (
    <VizContext.Provider value={{ nodeLabel, graphRef, nodeColor, isDAG, toggleDag, dagDirection, setDagDirection }}>
      {children}
    </VizContext.Provider>
  );
};
