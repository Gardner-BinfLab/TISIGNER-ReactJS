import React, { Fragment, useEffect } from "react";
import Navigation from "../Common/Navigation";
import Footer from "../Homepage/Footer";
import Typography from "@material-ui/core/Typography";
import CookieConsent from "react-cookie-consent";
import { Link } from "react-router-dom";
import ReactGA from "react-ga";

const License = props => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  ReactGA.event({
    category: "License",
    action: "License clicked."
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
                  TIsigner and SoDoPE license
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Disclaimer and Copyright
                </Typography>
                <Typography variant="body2" gutterBottom>
                  The programs and source code of TIsigner and SoDoPE are free
                  software. They are distributed in the hope that they will be
                  useful but WITHOUT ANY WARRANTY; without even the implied
                  warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
                  PURPOSE. Permission is granted for research, educational, and
                  commercial use and modification so long as:
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body2" gutterBottom>
                      The package and any derived works are not redistributed
                      for any fee, other than media costs.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" gutterBottom>
                      Proper credit is given to the authors.
                    </Typography>
                  </li>
                </ul>
                <Typography variant="body2" gutterBottom>
                  If you want to include this software in a commercial product,
                  please contact the authors.
                </Typography>
              </div>

              <div className="content">
                <Typography variant="h2" component="h3" gutterBottom>
                  TIsigner website license
                </Typography>

                <Typography variant="body2" gutterBottom>
                  This website is licensed under
                  <a
                    href="http://creativecommons.org/licenses/by-nd/3.0/nz/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    &nbsp;Creative Commons Attribution-NoDerivs 3.0 New Zealand
                    License
                  </a>
                  .
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CookieConsent>
        This website uses cookies and local storage to enhance the user
        experience. You can read our privacy policy{" "}
        <Link to="/privacy">here</Link>.
      </CookieConsent>

      <Footer />
    </Fragment>
  );
};

export default License;
