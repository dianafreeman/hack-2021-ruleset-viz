import { useContext } from "react";
import VizContext from "../context/VizContext";

const useVizControls = () => useContext(VizContext);
export default useVizControls;
