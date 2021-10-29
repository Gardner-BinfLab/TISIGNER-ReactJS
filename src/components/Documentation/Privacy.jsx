/**
 * @Author: Bikash Kumar Bhandari <bikash>
 * @Date:   2021-04-06T21:07:49+12:00
 * @Filename: Privacy.jsx
 * @Last modified by:   bikash
 * @Last modified time: 2021-10-30T08:59:57+13:00
 */

import React, { Fragment, useEffect } from "react";
import Navigation from "../Common/Navigation";
import Footer from "../Homepage/Footer";
import Typography from "@material-ui/core/Typography";
import ReactGA from "react-ga";

const Privacy = (props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  ReactGA.event({
    category: "Privacy",
    action: "Privacy clicked.",
  });

  return (
    <Fragment>
      <Navigation />
      <section
        className="hero is-fullheight"
        style={{
          backgroundImage: "linear-gradient(to right, #1a2b32, #355664)",
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
                  TISIGNER utilises cookie and local storage technologies to
                  validate the input form data and provide functionalities
                  inside this web app. None of the user submitted data is stored
                  on our server except when we encounter some problems in the
                  app (see below). If you use this website, you agree to our
                  privacy policy and we can use cookies and local storage of
                  your browser to store data on your device.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  HMMER
                </Typography>
                <Typography variant="body2" gutterBottom>
                  For identifying known protein domains, we use the{" "}
                  <a
                    href="https://www.ebi.ac.uk/Tools/hmmer/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    HMMER webserver.{" "}
                  </a>{" "}
                  Their privacy notice can be viewed{" "}
                  <a
                    href="https://www.ebi.ac.uk/data-protection/privacy-notice/embl-ebi-public-website"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    here.{" "}
                  </a>
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

                <Typography variant="subtitle2" gutterBottom>
                  Data collection and usage
                </Typography>
                <Typography variant="body2" gutterBottom>
                  If the webapp encounters some error, the stack traceback is
                  stored which might include the data you entered. This is
                  necessary to identify, debug and fix the problems.
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Anonymised data collected from Google Analytics may be used in
                  scientific publications, conferences and presentations.
                </Typography>
                <Typography variant="body2" gutterBottom>
                  We reserve the right to modify this Privacy Policy anytime.
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
