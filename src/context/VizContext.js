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

const ZOOM_DURATION = 3000; // ms
const VizContext = createContext({
  nodeLabel: (node) => null,
  nodeColor: (node) => null,
  dagDirection: null,
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
export const VizProvider = ({ children }) => {
  const [cameraPosOnMount, setCameraView] = useState({});
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
    if (node.requirement) return "red";
    if (node.rule) return "orange";
    if (node.relational_type == "AscentModule") return "yellow";
    if (node.relational_type == "Regulator") return "white";
  };

  const toggleDag = () => setIsDAG(!isDAG);
  const nodeLabel = (d) =>
    d.requirement?.summary || d.rule?.number || d.name || d.slug;

  const onNodeClick = (node) => {
    setActiveNode(node);
    zoomToClickedNode(node);
    setTimeout(toggleShowDetails, ZOOM_DURATION);
  };

  const zoomToClickedNode = useCallback((node) => zoomToNode(node, graphRef), [
    graphRef,
  ]);

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

  useEffect(() => {
    const initialCamPos = graphRef.current.camera().position;
    setCameraView(initialCamPos);
  }, []);

  return (
    <VizContext.Provider
      value={{
        nodeLabel,
        graphRef,
        nodeColor,
        isDAG,
        toggleDag,
        dagDirection,
        activeNode,
        onNodeClick,
        showDetails,
        toggleShowDetails,
        setDagDirection,
        resetCameraView,
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
