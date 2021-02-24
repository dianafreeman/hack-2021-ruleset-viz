import React, { useState, useRef, useEffect } from 'react';
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';
import { forceCollide } from 'd3-force';
import { nodes, links } from '../data';

const COLORS = {
  requirement: 'red',
  section: 'green',
};

const nodeColor = (node) => {
  if (node.relational_type === 'requirement') return 'red';
  if (node.relational_type === 'rule') return 'blue';
  if (node.relational_type === 'AscentModule') return 'yellow';
  if (node.relational_type === 'Regulator') return 'white';
};

const nodeLabel = (d) => d.requirement?.summary || d.rule?.number || d.name || d.slug;

const Dag = () => {
  const [data, setData] = useState({ nodes, links });
  const graphRef = useRef();

  const [controls] = useState({ 'DAG Orientation': 'td' });

  // force update when a control changes -- controls TBD
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
    <ForceGraph2D
      dagMode={controls['DAG Orientation']}
      dagLevelDistance={100}
      backgroundColor="#101020"
      linkColor={() => 'rgba(255,255,255,0.2)'}
      nodeRelSize={3}
      graphData={data}
      ref={graphRef}
      linkDirectionalParticles={1}
      linkDirectionalParticleWidth={2}
      d3VelocityDecay={0.2}
      nodeColor={nodeColor}
      nodeLabel={nodeLabel}
    />
  );
};

export default Dag;
