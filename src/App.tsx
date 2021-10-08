import { ThemeProvider } from "@fluentui/react";
import { initializeIcons } from "@uifabric/icons";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Error from "./components/Error";
import Header from "./components/Header";
import Loader from "./components/Loader";
import Section from "./components/Section";
import useData, { DataContext } from "./hooks/useData";
import initLocales from "./i18n";
import Home from "./pages/Home";
import Patch from "./pages/Patch";
import myTheme from "./theme/fluenceTheme";

initializeIcons();

initLocales();

const Inner: React.FC = () => {
  const { load, ...dataAPI } = useData();

  useEffect(() => load(), [load]);

  return (
    <DataContext.Provider value={dataAPI}>
      <Header />
      {!dataAPI.isLoaded && <Loader full />}
      {dataAPI.isLoaded && dataAPI.isError && <Error />}
      {dataAPI.isLoaded && !dataAPI.isError && (
        <Section>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/search/:searchState" component={Home} />
            <Route path="/patch/:id" component={Patch} />
          </Switch>
        </Section>
      )}
    </DataContext.Provider>
  );
};

const App: React.FC = () => (
  <ThemeProvider applyTo="body" theme={myTheme}>
    <Router>
      <Inner />
    </Router>
  </ThemeProvider>
);

export default App;
