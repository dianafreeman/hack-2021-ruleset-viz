import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Switch from "@material-ui/core/Switch";
import IconButton from "@material-ui/core/IconButton";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { Typography } from "@material-ui/core";
import useVizControls from "../../hooks/useVizControls";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import DIMENSIONS from "../../constants/dimensions";
import { default as DAG_DIRECTION_MAP } from "../../constants/dagDirections";

const { TWO, THREE } = DIMENSIONS;
const useStyles = makeStyles({
  root: {
    position: "fixed",
    zIndex: 2,
    width: "100%",
    backgroundColor: "black",
    color: "white",
  },
});

const DagControls = () => {
  const {
    isDAG,
    dagDirection,
    setDagDirection,
    toggleDag,
    allowCircularRefs,
    activeDimension,
  } = useVizControls();
  return (
    <Box px={2} mb={2}>
      <Typography variant="h6" align="left">
        DAG Settings
      </Typography>
      <FormControl component="fieldset">
        <FormControlLabel
          control={
            <Switch
              checked={isDAG}
              disabled={allowCircularRefs}
              onClick={() => toggleDag()}
              name="isDAG"
            />
          }
          label={`DAG Mode ${isDAG ? "ON" : "OFF"}`}
        />
      </FormControl>
      <FormControl component="fieldset">
        <RadioGroup
          row
          aria-label="DAG Orientation"
          value={dagDirection}
          onChange={(ev) => setDagDirection(ev.target.value)}
        >
          {Object.values(DAG_DIRECTION_MAP).map(({ value, label }) => {
            const conditionalDisabled =
              activeDimension === TWO && (value === "zout" || value === "zin");
            return (
              <FormControlLabel
                key={`radio-${value}`}
                disabled={allowCircularRefs || !isDAG || conditionalDisabled}
                value={value}
                color="secondary"
                control={<Radio />}
                label={label}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

const DimensionControl = () => {
  const {
    activeDimension,
    setActiveDimension,
    useForceUpdate,
  } = useVizControls();

  const forceUpdate = useForceUpdate();
  const handleDimension = (_ev, newDim) => {
    setActiveDimension(newDim);
    forceUpdate();
  };
  return (
    <Box>
      <ToggleButtonGroup
        value={activeDimension}
        exclusive
        onChange={handleDimension}
        aria-label="text alignment"
      >
        <ToggleButton value={TWO} aria-label="left aligned">
          <Typography variant="button">2D</Typography>
        </ToggleButton>
        <ToggleButton value={THREE} aria-label="centered">
          <Typography variant="button">3D</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

const CircularRefSettings = () => {
  const { isDAG, allowCircularRefs, toggleCircularRefs } = useVizControls();

  return (
    <Box>
      <ToggleButtonGroup
        value={allowCircularRefs}
        exclusive
        onChange={() => toggleCircularRefs()}
        aria-label="toggle circular references"
      >
        <ToggleButton disabled={isDAG} value={true} aria-label="left aligned">
          <Typography variant="button">Enabled</Typography>
        </ToggleButton>
        <ToggleButton disabled={isDAG} value={false} aria-label="centered">
          <Typography variant="button">Disabled</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
const TextNodeSettings = () => {
  const { toggleTextNodes, isTextNodes } = useVizControls();

  return (
    <Box>
      <ToggleButtonGroup
        value={isTextNodes}
        exclusive
        onChange={() => toggleTextNodes()}
        aria-label="toggle circular references"
      >
        <ToggleButton value={true} aria-label="left aligned">
          <Typography variant="button">Enabled</Typography>
        </ToggleButton>
        <ToggleButton value={false} aria-label="centered">
          <Typography variant="button">Disabled</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
const ParticleSettings = () => {
  const { toggleParticles, particlesOn } = useVizControls();

  return (
    <Box>
      <ToggleButtonGroup
        value={particlesOn}
        exclusive
        onChange={() => toggleParticles()}
        aria-label="toggle particle emissions"
      >
        <ToggleButton value={true} aria-label="left aligned">
          <Typography variant="button">On</Typography>
        </ToggleButton>
        <ToggleButton value={false} aria-label="centered">
          <Typography variant="button">Off</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
function ControlPanel(props) {
  const classes = useStyles();
  const [isOpen, setOpen] = useState(false);
  return (
    <Box p={1} w={1} className={classes.root}>
      <IconButton
        style={{ float: "right", marginRight: "10px" }}
        onClick={() => setOpen(!isOpen)}
      >
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
      {isOpen && (
        <>
          <DagControls />
          <Box display="flex">
            <Box px={2}>
              <Typography variant="h6" align="left">
                Circular References
              </Typography>
              <CircularRefSettings />
            </Box>

            <Box px={2}>
              <Typography variant="h6" align="left">
                ParticleEmissions
              </Typography>
              <ParticleSettings />
            </Box>
            <Box px={2}>
              <Typography variant="h6" align="left">
                Text Nodes
              </Typography>
              <TextNodeSettings />
            </Box>
            <Box px={2}>
              <Typography variant="h6" align="left">
                View In
              </Typography>
              <DimensionControl />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

ControlPanel.propTypes = {};

export default ControlPanel;
