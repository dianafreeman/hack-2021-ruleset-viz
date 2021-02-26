import React, { useState, useRef, useCallback, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { ForceGraph2D, ForceGraph3D } from "react-force-graph";

import useVizControls from "../hooks/useVizControls";
import useVizSettings from "../hooks/useVizSettings";
import DetailPanel from "./DetailPanel";
import DIMENSIONS from "../constants/dimensions";

const COLORS = {
  requirement: "red",
  section: "green",
};

const Viz = () => {
  const [data, setData] = useState({});
  const {
    isDAG,
    activeDimension,

    nodes,
    links,
    dagDirection,
    graphRef,
  } = useVizControls();

  const { TWO, THREE } = DIMENSIONS;
  const settings = useVizSettings();
  const Vizualizer = activeDimension === TWO ? ForceGraph2D : ForceGraph3D;

  return (
    <>
      <DetailPanel />
      <Vizualizer
        ref={graphRef}
        {...settings}
        dagMode={isDAG ? dagDirection : null}
        enableNodeDrag={false}
        graphData={{ nodes, links }}
      />
    </>
  );
};

export default Viz;
