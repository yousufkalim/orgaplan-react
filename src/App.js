import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

import authReducer from "./store/reducers/auth";
import Main from "./container/Main";

const store = createStore(authReducer);

const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 600,
      lg: 1024,
      xl: 1650,
    },
  },
  palette: {
    primary: {
      main: "#DBB20A",
      contrastText: "#7E7878",
    },
    secondary: {
      main: "#F8F8F8",
      contrastText: "#000",
    },
  },
  shape: {
    borderRadius: 10,
  },
});
theme.shadows[25] = "0px 3px 6px rgba(0, 0, 0, 0.16)";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          dense={false}
          hideIconVariant={false}
          preventDuplicate={false}
          autoHideDuration={2000}
          // persist={true}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <CssBaseline />
          <BrowserRouter>
            <Main />
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
