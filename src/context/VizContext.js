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
import { useTheme } from "@material-ui/core/styles";

import {
  regulatorNodes,
  questionNodes,
  answerNodes,
  moduleNodes,
  subjectNodes,
  ruleNodes,
  requirementNodes,
  supportingInfoNodes,
  regulatorLinks,
  questionLinks,
  answerLinks,
  moduleLinks,
  subjectLinks,
  ruleLinks,
  requirementLinks,
  supportingInfoLinks,
} from "../data";
import DIMENSIONS from "../constants/dimensions";
import SpriteText from "three-spritetext";
import { AtmTwoTone } from "@material-ui/icons";

const VizContext = createContext({
  settings: {},
  controls: {},
  component: {},
});

export default VizContext;

const ZOOM_DURATION = 3000; // ms
const makeColorMap = (palette) => {
  return {
    Requirement: palette.error.main,
    SupportingInformation: palette.success.main,
    Rule: palette.warning.main,
    AscentModule: palette.secondary.main,
    Subject: palette.secondary.main,
    Regulator: palette.primary.main,
    Question: palette.info.light,
    Answer: palette.info.dark,
  };
};
const use2dTextNodes = () => {
  const { palette } = useTheme();

  const nodeCanvasObject = (node, ctx, globalScale) => {
    const colorMap = makeColorMap(palette);
    const label = node.relational_type || node.label;
    const fontSize = 16 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2); // some padding

    ctx.fillStyle = "rgba(255, 255, 255, 0)";
    ctx.fillRect(
      node.x - bckgDimensions[0] / 2,
      node.y - bckgDimensions[1] / 2,
      ...bckgDimensions
    );

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = node.relational_type
      ? colorMap[node.relational_type]
      : colorMap[node.label];
    ctx.fillText(label, node.x, node.y);

    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
  };
  const nodePointerAreaPaint = (node, color, ctx) => {
    ctx.fillStyle = color;
    const bckgDimensions = node.__bckgDimensions;
    bckgDimensions &&
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y - bckgDimensions[1] / 2,
        ...bckgDimensions
      );
  };

  return { nodeCanvasObject, nodePointerAreaPaint };
};
export const VizProvider = ({ children }) => {
  const { TWO, THREE } = DIMENSIONS;

  const [particlesOn, setParticlesOn] = useState(true);
  const [isTextNodes, setTextNodes] = useState(false);
  const [allowCircularRefs, setAllowCircularRefs] = useState(true);
  const [dimension, setActiveDimension] = useState(TWO);
  const [activeNode, setActiveNode] = useState({});
  const [dagDirection, setDagDirection] = useState(DIRECTIONS.TD.value);
  const [isDAG, setIsDAG] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // DATA
  const DefaultNodes = [
    ...regulatorNodes,
    ...questionNodes,
    ...answerNodes,
    ...moduleNodes,
    ...subjectNodes,
    ...ruleNodes,
    ...requirementNodes,
  ];

  const DefaultLinks = [
    ...regulatorLinks,
    ...questionLinks,
    ...answerLinks,
    ...moduleLinks,
    ...subjectLinks,
    ...ruleLinks,
    ...requirementLinks,
  ];

  const [nodes, setNodes] = useState([...DefaultNodes, ...supportingInfoNodes]);
  const [links, setLinks] = useState([...DefaultLinks, ...supportingInfoLinks]);

  const enableCircularRefs = () => {
    setAllowCircularRefs(!allowCircularRefs);
    setNodes((nodes) => [...nodes, ...supportingInfoNodes]);
    setLinks((links) => [...links, ...supportingInfoLinks]);
  };
  const disableCircularRefs = () => {
    setAllowCircularRefs(!allowCircularRefs);
    setNodes(DefaultNodes);
    setLinks(DefaultLinks);
  };

  const toggleShowDetails = () => setShowDetails(!showDetails);
  const graphRef = useRef();

  const toggleParticles = () => setParticlesOn(!particlesOn);
  const useForceUpdate = () => {
    const setToggle = useState(false)[1];
    return () => setToggle((b) => !b);
  };

  const resetCameraView = useCallback(() => {
    graphRef.current.zoomToFit(ZOOM_DURATION);
  }, [graphRef]);

  const { palette } = useTheme();
  const colorMap = makeColorMap(palette);

  const nodeColor = (node) => {
    return node.relational_type
      ? colorMap[node.relational_type]
      : colorMap[node.label];
  };

  // CONTROLS
  const toggleDag = () => {
    setIsDAG(!isDAG);
  };

  const nodeThreeObject = (node) => {
    const sprite = new SpriteText(node.relational_type || node.label);
    sprite.color = node.relational_type
      ? colorMap[node.relational_type]
      : colorMap[node.label];
    sprite.textHeight = 8;
    return sprite;
  };
  const do3dZoom = useCallback(
    (node, graphRef, ms) => {
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
    },
    [graphRef]
  );

  const do2dZoom = useCallback(
    (node, graphRef, ms) => {
      graphRef.current.centerAt(node.x, node.y);
      graphRef.current.zoom(10, ms);
    },
    [graphRef]
  );

  const zoomToNode = (node, graphRef, dimension, ms = ZOOM_DURATION) => {
    try {
      do3dZoom(node, graphRef, ms);
    } catch (err) {
      do2dZoom(node, graphRef, ms);
    }
  };

  const { nodeCanvasObject, nodePointerAreaPaint } = use2dTextNodes();

  const toggleTextNodes = () => {
    setTextNodes(!isTextNodes);
  };

  const toggleCircularRefs = allowCircularRefs
    ? disableCircularRefs
    : enableCircularRefs;
  const pauseAnimation = useCallback(() => graphRef.current.pauseAnimation(), [
    graphRef,
  ]);
  const resumeAnimation = useCallback(
    () => graphRef.current.resumeAnimation(),
    [graphRef]
  );

  const nodeLabel = (node) => node.relational_type || node.label;

  const onNodeClick = (node) => {
    console.log("dimension on node click", dimension);
    setActiveNode(node);
    zoomToClickedNode(node);
    toggleShowDetails();
  };

  const zoomToClickedNode = useCallback(
    (node) => zoomToNode(node, graphRef, dimension),
    [graphRef, dimension]
  );

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
    backgroundColor: palette.background.default,
    d3VelocityDecay: 0.2,
    dagLevelDistance: 100,
    linkLabel: (link) => link.label,
    linkColor: (node) => "rgba(255,255,255,0.3)",
    linkWidth: 1,
    linkDirectionalParticles: particlesOn ? 1 : null,
    linkDirectionalParticleWidth: particlesOn ? 2 : null,
    nodeColor,
    nodeLabel,
    onNodeClick,
    onBackgroundClick: () => resetCameraView(),
    nodeRelSize: 4,
    nodeThreeObject: isTextNodes ? nodeThreeObject : null,
    nodeCanvasObject: isTextNodes ? nodeCanvasObject : null,
    nodePointerAreaPaint: isTextNodes ? nodePointerAreaPaint : null,
  };
  return (
    <VizContext.Provider
      value={{
        graphRef,
        controls: {
          toggleParticles,
          particlesOn,
          isTextNodes,
          toggleTextNodes,
          toggleCircularRefs,
          activeDimension: dimension,
          setActiveDimension,
          useForceUpdate,
          nodes,
          links,
          isDAG,
          toggleDag,
          activeNode,
          onNodeClick,
          dagDirection,
          showDetails,
          allowCircularRefs,
          setAllowCircularRefs,
          toggleShowDetails,
          setDagDirection,
          resetCameraView,
          pauseAnimation,
          resumeAnimation,
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
