import React, { Fragment, useEffect } from "react";
import Navigation from "../Common/Navigation";
import Footer from "../Homepage/Footer";
import Typography from "@material-ui/core/Typography";
import ReactGA from "react-ga";

const Privacy = props => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  ReactGA.event({
    category: "Privacy",
    action: "Privacy clicked."
  });

  return (
    <Fragment>
      <Navigation link={"/sodope"} />
      <section
        className="hero is-fullheight"
        style={{
          backgroundImage: "linear-gradient(to right, #1a2b32, #355664)"
        }}
      >
        <div className="hero-head"></div>
        <div className="hero-body">
          <div className="container is-fluid is-paddingless">
            <div className="box">
              <div className="content">
                <Typography variant="h2" component="h3" gutterBottom>
                  Privacy
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Cookie and local storage
                </Typography>
                <Typography variant="body2" gutterBottom>
                  TIsigner utilises cookie and local storage technologies to
                  validate input form data and provide functionalities inside
                  this web app. None of the user submitted data is stored on our
                  server. If you use this website, you agree that we can use
                  cookies and local storage of your browser to store data on
                  your device.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Google analytics
                </Typography>
                <Typography variant="body2" gutterBottom>
                  We use google analytics on this webapp. You can read their
                  terms of service{" "}
                  <a
                    href="https://marketingplatform.google.com/about/analytics/terms/us/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    here
                  </a>
                  .
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </Fragment>
  );
};

export default Privacy;
