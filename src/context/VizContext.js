import React, {
  createContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { default as DIRECTIONS } from "../constants/dagDirections";
import { forceCollide } from "d3-force";
import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import * as data from "../data";


const ZOOM_DURATION = 3000; // ms

const VizContext = createContext({
  settings: {},
  controls: {},
  component: {},
});

export default VizContext;

const zoomToNode = (node, graphRef, ms = ZOOM_DURATION) => {
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
    ms // ms transition duration
  );
};
const DIMENSIONS = {
  TWO: "TWO",
  THREE: "THREE",
};
export const VizProvider = ({ children }) => {
  const { TWO, THREE } = DIMENSIONS;
  const [nodes, setNodes] = useState(data.nodes);
  const [links, setLinks] = useState(data.links);
  const [dimension, setDimension] = useState(THREE);
  const [activeNode, setActiveNode] = useState(false);
  const [dagDirection, setDagDirection] = useState(DIRECTIONS.TD.value);
  const [isDAG, setIsDAG] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = () => setShowDetails(!showDetails);
  const graphRef = useRef();

  const resetCameraView = useCallback(() => {
    console.log("resetting view");
    graphRef.current.zoomToFit();
  }, [graphRef]);

  const nodeColor = (node) => {
    if (node.relational_type == "Requirement") return "red";
    if (node.relational_type == "SupportingInformation") return "green";
    if (node.relational_type == "Rule") return "blue";
    if (node.relational_type == "AscentModule") return "purple";
    if (node.relational_type == "Subject") return "purple";
    if (node.relational_type == "Regulator") return "white";
    return "white";
  };


  // CONTROLS
  const toggleDag = () => setIsDAG(!isDAG);
  const nodeLabel = (node) => node.relational_type || node.label;

  const onNodeHover = () => {
    setActiveNode(node);
  };
  const onNodeClick = (node) => {
    zoomToClickedNode(node);
    setTimeout(toggleShowDetails, ZOOM_DURATION / 2);
  };
  const zoomToClickedNode = useCallback((node) => zoomToNode(node, graphRef), [
    graphRef,
  ]);

  const VizComponent = React.forwardRef(function Wrapper(props, ref) {
   return dimension === TWO ? <ForceGraph2D ref={ref} {...props}/> : <ForceGraph3D ref={ref} {...props}/>
  })


  const useForceUpdate = () => {
    const setToggle = useState(false)[1];
    return () => setToggle((b) => !b);
  };

  useEffect(() => {
    // add collision force
    graphRef.current.d3Force(
      "collision",
      forceCollide((node) => Math.sqrt(100 / (node.level + 1)))
    );
  }, []);

  // SETTINGS
  const settings = {
    ref: graphRef,
    backgroundColor: "#101020",
    d3VelocityDecay: 0.2,
    dagLevelDistance: 100,
    linkColor: (node) => "rgba(255,255,255,0.2)",
    linkDirectionalParticles: 1,
    linkDirectionalParticleWidth: 2,
    nodeColor,
    nodeLabel,
    onNodeClick,
    onBackgroundClick: () => resetCameraView(),
    nodeRelSize: 3,
  };
  return (
    <VizContext.Provider
      value={{
        VizComponent,
        graphRef,
        controls: {
          isDAG,
          toggleDag,
          dagDirection,
          activeNode,
          onNodeClick,
          showDetails,
          toggleShowDetails,
          setDagDirection,
          resetCameraView,
        },
        settings,
      }}
    >
      {children}
    </VizContext.Provider>
  );
};

VizProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
