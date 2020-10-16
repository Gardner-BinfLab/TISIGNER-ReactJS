import React, { Suspense, lazy } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import ReactGA from "react-ga";
import Loader from "./Loader";
import ErrorBoundary from "./Error/ErrorBoundary";

const Homepage = lazy(() => import("./Homepage"));
const TIsigner = lazy(() => import("./Tisigner"));
const Sodope = lazy(() => import("./Sodope"));
const Razor = lazy(() => import("./Razor"));
const NotFound = lazy(() => import("./404"));
const Faq = lazy(() => import("./Documentation/Faq"));
const SodopeDocumentation = lazy(() =>
  import("./Documentation/SodopeDocumentation")
);
const TisignerDocumentation = lazy(() =>
  import("./Documentation/TisignerDocumentation")
);
const RazorDocumentation = lazy(() =>
  import("./Documentation/RazorDocumentation")
);
const License = lazy(() => import("./Documentation/License"));
const Privacy = lazy(() => import("./Documentation/Privacy"));


ReactGA.initialize("UA-153760535-1");
ReactGA.pageview(window.location.pathname + window.location.search);

console.log(
  String.raw`

  ▄▄▄█████▓ ██▓  ██████  ██▓  ▄████  ███▄    █ ▓█████  ██▀███
  ▓  ██▒ ▓▒▓██▒▒██    ▒ ▓██▒ ██▒ ▀█▒ ██ ▀█   █ ▓█   ▀ ▓██ ▒ ██▒
  ▒ ▓██░ ▒░▒██▒░ ▓██▄   ▒██▒▒██░▄▄▄░▓██  ▀█ ██▒▒███   ▓██ ░▄█ ▒
  ░ ▓██▓ ░ ░██░  ▒   ██▒░██░░▓█  ██▓▓██▒  ▐▌██▒▒▓█  ▄ ▒██▀▀█▄
    ▒██▒ ░ ░██░▒██████▒▒░██░░▒▓███▀▒▒██░   ▓██░░▒████▒░██▓ ▒██▒
    ▒ ░░   ░▓  ▒ ▒▓▒ ▒ ░░▓   ░▒   ▒ ░ ▒░   ▒ ▒ ░░ ▒░ ░░ ▒▓ ░▒▓░
      ░     ▒ ░░ ░▒  ░ ░ ▒ ░  ░   ░ ░ ░░   ░ ▒░ ░ ░  ░  ░▒ ░ ▒░
    ░       ▒ ░░  ░  ░   ▒ ░░ ░   ░    ░   ░ ░    ░     ░░   ░
            ░        ░   ░        ░          ░    ░  ░   ░

  --------------------==| github:@bkb3 |==---------------------

  * Project GitHub: https://github.com/Gardner-BinfLab/TISIGNER-ReactJS

  `
);

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/tisigner" component={TIsigner} />
            <Route exact path="/sodope" component={Sodope} />
            <Route exact path="/razor" component={Razor} />
            <Route exact path="/faq" component={Faq} />
            <Route exact path="/sodope/faq" component={SodopeDocumentation} />
            <Route
              exact
              path="/tisigner/faq"
              component={TisignerDocumentation}
            />
            <Route exact path="/razor/faq" component={RazorDocumentation} />
            <Route exact path="/license" component={License} />
            <Route exact path="/privacy" component={Privacy} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
