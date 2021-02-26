import { useContext } from "react";
import VizContext from "../context/VizContext";

const useVizComponent = () => useContext(VizContext).VizComponent;

export default useVizComponent;
