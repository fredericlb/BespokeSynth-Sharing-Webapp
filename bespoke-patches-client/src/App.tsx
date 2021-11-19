import { ThemeProvider } from "@fluentui/react";
import { registerUmamiScript } from "@parcellab/react-use-umami";
import { initializeIcons } from "@uifabric/icons";
import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Error from "./components/Error";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Loader from "./components/Loader";
import Section from "./components/Section";
import useData, { DataContext } from "./hooks/useData";
import initLocales from "./i18n";
import Home from "./pages/Home";
import Patch from "./pages/Patch";
import myTheme from "./theme/fluenceTheme";

const Upload = React.lazy(() => import("./pages/Upload"));
const TokenActivation = React.lazy(() => import("./pages/TokenActivation"));

initializeIcons();

initLocales();

const Inner: React.FC = () => {
  const { ...dataAPI } = useData();

  useEffect(() => {
    if (
      import.meta.env.VITE_APP_UMAMI &&
      localStorage.getItem("disabledMetrics") === null
    ) {
      const [url, websiteId, domain] = import.meta.env.VITE_APP_UMAMI.split(
        ";"
      );
      registerUmamiScript(url, websiteId, domain);
    }
  }, []);

  return (
    <DataContext.Provider value={dataAPI}>
      <Header />
      {!dataAPI.isLoaded && <Loader full />}
      {dataAPI.isLoaded && dataAPI.isError && <Error />}
      {dataAPI.isLoaded && !dataAPI.isError && (
        <Section>
          <Suspense fallback={<Loader full />}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/search/:searchState" component={Home} />
              <Route path="/patch/:id" component={Patch} />
              <Route path="/upload" component={Upload} />
              <Route
                path="/validation/access-token/:uuid"
                component={TokenActivation}
              />
              <Route
                path="*"
                render={() => (
                  <div style={{ marginTop: 120, textAlign: "center" }}>
                    Page not found :(
                  </div>
                )}
              />
            </Switch>
          </Suspense>
        </Section>
      )}
      <Footer />
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
