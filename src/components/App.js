import React from "react";
import Homepage from "./Homepage";
import TIsigner from "./Tisigner";
import Sodope from "./Sodope";
import NotFound from "./404";
import SodopeDocumentation from "./Documentation/SodopeDocumentation";
import TisignerDocumentation from "./Documentation/TisignerDocumentation";
import License from "./Documentation/License";
import Privacy from "./Documentation/Privacy";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import ReactGA from 'react-ga';



//tracking //testing =  92394943-1 //tisigner = 153760535-1
ReactGA.initialize('UA-153760535-1');
ReactGA.pageview(window.location.pathname + window.location.search);

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/tisigner" component={TIsigner} />
        <Route exact path="/sodope" component={Sodope} />
        <Route
          exact
          path="/sodope/faq"
          component={SodopeDocumentation}
        />
        <Route
          exact
          path="/tisigner/faq"
          component={TisignerDocumentation}
        />
        <Route exact path="/license" component={License} />
        <Route exact path="/privacy" component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
