import { useContext } from "react";
import VizContext from "../context/VizContext";

const useVizSettings = () => useContext(VizContext).settings;
export default useVizSettings;
