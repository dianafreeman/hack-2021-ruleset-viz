import React, { useState, useRef, useCallback, useEffect } from "react";
import { Typography } from "@material-ui/core";

import { nodes, links } from "../data";
import useVizControls from "../hooks/useVizControls";
import useVizComponent from "../hooks/useVizComponent";
import useVizSettings from "../hooks/useVizSettings";
import DetailPanel from "./DetailPanel";

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

  const Vizualizer = useVizComponent();
  const settings = useVizSettings();

  return (
    <>
      <DetailPanel />
      <Vizualizer
      ref={graphRef}
        {...settings}
        dagMode={isDAG ? dagDirection : null}
        enableNodeDrag={false}
        graphData={data}
      />
    </>
  );
};

export default Viz;
