import { useContext } from "react";
import VizContext from "../context/VizContext";

const useVizControls = () => useContext(VizContext).controls;
export default useVizControls;
