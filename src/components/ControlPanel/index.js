import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { Typography } from "@material-ui/core";
import useVizControls from "../../hooks/useVizControls";
import { default as DAG_DIRECTION_MAP } from "../../constants/dagDirections";

const DIMENSION_VALUES = ["2D", "3D"];

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
  const { isDAG, dagDirection, setDagDirection, toggleDag } = useVizControls();

  return (
    <Box align="left">
      <FormControl component="fieldset">
        <FormControlLabel
          control={
            <Switch checked={isDAG} onClick={() => toggleDag()} name="isDAG" />
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
          {Object.values(DAG_DIRECTION_MAP).map(({ value, label }) => (
            <FormControlLabel
              key={`radio-${value}`}
              disabled={!isDAG}
              value={value}
              color="secondary"
              control={<Radio />}
              label={label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};
function ControlPanel(props) {
  const { isDAG, dagDirection, setDagDirection, toggleDag } = useVizControls();

  const classes = useStyles();
  return (
    <Box p={1} w={1} className={classes.root}>
      <Typography variant="h6" align="left">
        DAG Settings
      </Typography>
      <DagControls />

      <Box align="left">{/* checkboxes for some other stuff*/}</Box>
    </Box>
  );
}

ControlPanel.propTypes = {};

export default ControlPanel;
