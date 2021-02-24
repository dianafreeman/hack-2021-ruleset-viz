import React, { useState, useref } from "react";
import {
  ForceGraph2D,
  ForceGraph3D,
  ForceGraphVR,
  ForceGraphAR,
} from "react-force-graph";
import { nodes, links } from "../data";

const COLORS = {
  requirement: "red",
  section: "green",
};

const nodeColor = (d) => {
  if (d.requirement) return "red";
  if (d.rule) return "orange";
  if (d.relational_type == "AscentModule") return "yellow";
  if (d.relational_type == "Regulator") return "white";
};

const nodeLabel = (d) =>
  d.requirement?.summary || d.rule?.number || d.name || d.slug;

const Viz = () => {
  const [data, setData] = useState({ nodes, links });

  return (
    <ForceGraph3D
      graphData={data}
      nodeColor={nodeColor}
      nodeLabel={nodeLabel}
    />
  );
};

export default Viz;
