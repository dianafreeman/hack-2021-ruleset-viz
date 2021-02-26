import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { Box } from "@material-ui/core";
import useVizControls from "../../hooks/useVizControls";

const RENDERABLE_VALUES = [
  "text",
  "content",
  "requirement",
  "rule",
  "number",
  "section",
  "relational_type",
  "AscentModule",
  "regulator",
  "municipality_location",
  "country_location",
  "created_at",
  "state_territory_location",
  "regulator_type",
  "updated_at",
  "region_location",
  "name",
  "status",
  "summary",
  "aic",
  "frequency",
];
function DetailPanel({ node, onClose, selectedValue }) {
  const {
    activeNode,
    showDetails,
    toggleShowDetails,
    resumeAnimation,
  } = useVizControls();

  const theme = useTheme()

  const renderableNode = Object.fromEntries(
    Object.entries(activeNode).filter(([key, _value]) =>
      RENDERABLE_VALUES.includes(key)
    )
  );

  const handleClose = () => {
    toggleShowDetails();
    resumeAnimation();
  };

  const nodeTitle = activeNode.title || activeNode.name || activeNode.number || activeNode.label;
  return (
    <Dialog aria-labelledby="simple-dialog-title" open={showDetails}>
      <MuiDialogTitle disableTypography>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4">
            {node?.relational_type === "Rule" ? `Rule ${nodeTitle}` : nodeTitle}
          </Typography>
          <IconButton style={{ float: "right" }} onClick={() => handleClose()}>
            <CloseIcon />
          </IconButton>
        </Box>
      </MuiDialogTitle>
      <Box m={1} p={2}>
        {Object.keys(renderableNode).map((k) => (
          <Typography variant="h6" key={k}>
            <span style={{ color: theme.palette.primary.light }}>
              {k.replace("_", " ").toString().toUpperCase()}:
            </span>
            <span>
            {renderableNode[k]}
            </span>
          </Typography>
        ))}
      </Box>
    </Dialog>
  );
}

DetailPanel.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.number,
    relational_type: PropTypes.string,
  }),
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

export default DetailPanel;
