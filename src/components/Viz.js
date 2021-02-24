import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';
import { nodes, links } from '../data';

const COLORS = {
  requirement: 'red',
  section: 'green',
};

const nodeColor = (d) => {
  if (d.requirement) return 'red';
  if (d.rule) return 'orange';
  if (d.relational_type == 'AscentModule') return 'yellow';
  if (d.relational_type == 'Regulator') return 'white';
};

const nodeLabel = (d) => d.requirement?.summary || d.rule?.number || d.name || d.slug;

const Viz = () => {
  const [data, setData] = useState({ nodes, links });

  const graphRef = useRef();
  const handleClick = useCallback(
    (node) => {
      // Aim at node from outside it
      const distance = 40;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      graphRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        3000 // ms transition duration
      );
    },
    [graphRef]
  );
  return (
    <ForceGraph3D
      ref={graphRef}
      graphData={data}
      nodeColor={nodeColor}
      nodeLabel={nodeLabel}
      onNodeClick={handleClick}
    />
  );
};

export default Viz;
