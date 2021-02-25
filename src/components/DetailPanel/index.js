import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { Box } from "@material-ui/core";
import useVizControls from "../../hooks/useVizControls";

const RENDERABLE_VALUES = [
  "requirement",
  "rule",
  "section",
  "relational_type",
  "AscentModule",
  "regulator",
  "municipality_location",
  "country_location",
  "created_at",
  "state_territory_location",
  "regulator_type",
  "uuid",
  "updated_at",
  "region_location",
  "name",
  "status",
  "summary",
  "aic",
  "uuid",
  "frequency",
];
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));
function DetailPanel({ node, onClose, selectedValue }) {
  const { activeNode, showDetails, toggleShowDetails } = useVizControls();

  const renderableNode = Object.fromEntries(
    Object.entries(activeNode).filter(([key, _value]) =>
      RENDERABLE_VALUES.includes(key)
    )
  );

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={showDetails}>
      <MuiDialogTitle disableTypography>
        <IconButton
          style={{ float: "right" }}
          onClick={() => toggleShowDetails()}
        >
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
      <Box m={1} p={2}>
        {Object.keys(renderableNode).map((k) =>
          typeof renderableNode[k] === "object" ? (
            Object.keys(renderableNode[k]).map((n) => (
              <Typography variant="h6" key="">
                {n}:{renderableNode[k][n]}
              </Typography>
            ))
          ) : (
            <Typography variant="h6" key="">
              {k}:{renderableNode[k]}
            </Typography>
          )
        )}
      </Box>
    </Dialog>
  );
}

DetailPanel.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.number,
  }),
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

export default DetailPanel;
