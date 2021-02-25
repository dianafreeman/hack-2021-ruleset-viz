import React from "react";
import "./App.css";
import Viz from "./components/Viz";
import ControlPanel from "./components/ControlPanel";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { VizProvider } from "./context/VizContext";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <VizProvider>
        <ControlPanel />
        <Viz />
      </VizProvider>
    </ThemeProvider>
  );
}

export default App;
