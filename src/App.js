import React, { useState } from "react";
import PropTypes from "prop-types";
import "./App.css";
import Viz from "./components/Viz";
import ControlPanel from "./components/ControlPanel";
import {
  ThemeProvider,
  createMuiTheme,
  Container,
  Button,
  TextField,
  Box,
} from "@material-ui/core";
import { VizProvider } from "./context/VizContext";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.background.default,
    justifyContent: "center",
    display: "flex",
  },
  form: {
    width: "80%", // Fix IE 11 issue.
    marginTop: theme.spacing(5),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const EnterPasscode = ({ setLoggedIn }) => {
  const [entry, setEntry] = useState("");

  const classes = useStyles();
  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (entry === process.env.REACT_APP_SECRET_CODE) return setLoggedIn(true); //console.log("Correct!");
  };
  return (
    <Container fixed fullWidth className={classes.bg}>
      <Box className={classes.form}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          onChange={(ev) => setEntry(ev.target.value)}
          id="secret-code"
          label="Secret Code"
          name="secret-code"
          autoFocus
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          className={classes.submit}
        >
          Let me in!
        </Button>
      </Box>
    </Container>
  );
};
EnterPasscode.propTypes = {
  setLoggedIn: PropTypes.func,
};

function App() {
  const code = btoa(process.env.SECRET_CODE);
  const [isLoggedIn, setLoggedIn] = useState(false);
  return (
    <ThemeProvider theme={darkTheme}>
      {isLoggedIn ? (
        <VizProvider>
          <ControlPanel />
          <Viz />
        </VizProvider>
      ) : (
        <EnterPasscode setLoggedIn={setLoggedIn} />
      )}
    </ThemeProvider>
  );
}

export default App;
