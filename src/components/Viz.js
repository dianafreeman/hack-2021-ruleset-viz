import React, { useState, useRef, useCallback, useEffect } from "react";
import { Typography } from "@material-ui/core";
import {
  ForceGraph2D,
  ForceGraph3D,
  ForceGraphVR,
  ForceGraphAR,
} from "react-force-graph";
import { nodes, links } from "../data";
import useVizControls from "../hooks/useVizControls";
import DetailPanel from "./DetailPanel";
import { getNodeText } from "@testing-library/react";

const COLORS = {
  requirement: "red",
  section: "green",
};

const Viz = () => {
  const [data, setData] = useState({ nodes, links });
  const {
    isDAG,
    nodeColor,
    nodeLabel,
    onNodeClick,
    resetCameraView,
    dagDirection,
    graphRef,
  } = useVizControls();

  return (
    <>
      <DetailPanel />
      <ForceGraph3D
        backgroundColor={"#101020"}
        d3VelocityDecay={0.2}
        dagLevelDistance={100}
        dagMode={isDAG ? dagDirection : null}
        enableNodeDrag={false}
        graphData={data}
        linkColor={() => "rgba(255,255,255,0.2)"}
        linkDirectionalParticles={1}
        linkDirectionalParticleWidth={2}
        nodeColor={nodeColor}
        nodeLabel={nodeLabel}
        onNodeClick={onNodeClick}
        onBackgroundClick={() => resetCameraView()}
        nodeRelSize={3}
        ref={graphRef}
      />
    </>
  );
};

export default Viz;
