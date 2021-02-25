import { Typography } from "@material-ui/core";
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  ForceGraph2D,
  ForceGraph3D,
  ForceGraphVR,
  ForceGraphAR,
} from "react-force-graph";
import { nodes, links } from "../data";
import useVizControls from "../hooks/useVizControls";

const COLORS = {
  requirement: "red",
  section: "green",
};

const NodeDetails = (node) => {
  // const stuff =
  return Object.entries(node).map((key, val) => (
    <>
      <Typography style={{ fontWeight: "800" }}>{key}:</Typography>
      <Typography> {val}</Typography>
    </>
  ));
};

const Viz = () => {
  const [data, setData] = useState({ nodes, links });
  const {
    isDAG,
    nodeColor,
    nodeLabel,
    dagDirection,
    graphRef,
  } = useVizControls();

  const handleClick = useCallback(
    (node) => {
      // Aim at node from outside it
      const distance = 50;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      graphRef.current.cameraPosition(
        {
          x: node.x * distRatio,
          y: node.y * distRatio,
          z: node.z * distRatio,
        }, // new position
        node, // lookAt ({ x, y, z })
        3000 // ms transition duration
      );
    },
    [graphRef]
  );

  // OPEN DETAILS IN CENTER MODAL, witha close button
  return (
    <ForceGraph3D
      backgroundColor={"#101020"}
      d3VelocityDecay={0.2}
      dagLevelDistance={100}
      dagMode={isDAG ? dagDirection : false}
      enableNodeDrag={false}
      graphData={data}
      linkColor={() => "rgba(255,255,255,0.2)"}
      linkDirectionalParticles={1}
      linkDirectionalParticleWidth={2}
      nodeColor={nodeColor}
      nodeLabel={nodeLabel}
      onNodeClick={handleClick}
      nodeRelSize={3}
      ref={graphRef}
    />
  );
};

export default Viz;
