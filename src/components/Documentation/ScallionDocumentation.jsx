 /**
  * @Author: Bikash Kumar Bhandari <bikash>
  * @Date:   2021-05-23T19:37:51+12:00
  * @Filename: LazyPairDocumentation.jsx
  * @Last modified by:   bikash
  * @Last modified time: 2021-10-30T09:20:24+13:00
  */



  import React, { Fragment, useEffect } from "react";
  import Navigation from "../Common/Navigation";
  import Footer from "../Homepage/Footer";
  import Typography from "@material-ui/core/Typography";
  import { Link } from "react-router-dom";
  import CookieConsent from "react-cookie-consent";
  import ReactGA from "react-ga";



  const ScallionDocumentation = (props) => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    ReactGA.event({
      category: "Documentation",
      action: "Documentation clicked.",
      label: "Scallion",
    });

    return (
      <Fragment>
        <Navigation link={"/lazypair"} />
        <section
          className="hero is-fullheight"
          style={{
            backgroundImage: "linear-gradient(to right, #1a2b32, #355664)",
          }}
        >
          <div className="hero-head"></div>
          <div className="hero-body">
            <div className="container is-fluid is-paddingless">
              <br />
              <div className="box">
                <div className="content">
                  <Typography variant="h2" component="h3" gutterBottom>
                    Interpreting results
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    The prediction steps of protein-protein interactions (PPIs)
                  </Typography>
                  {/*                <Typography variant="body2" gutterBottom>
                    This happens in the following steps:
                  </Typography>
                  */}
                  <ul>
                    <li>
                      For each protein pair, 553 AAindex1 features are calculated for each protein.
                      The values for each feature are averaged and used for prediction.
                    </li>
                  </ul>

                  <Typography variant="subtitle2" gutterBottom>
                    Prediction output
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    There are 18 models, one generic and 17 interaction-specific models.
                    Median probability is provided as the final probability of PPI.
                  </Typography>


                  <Typography variant="h2" component="h3" gutterBottom>
                    Data used
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    The training and benchmarking datasets used for the generic PPI
                    prediction were obtained from D-SCRIPT and can be
                    downloaded{" "}
                    <a href="https://d-script.readthedocs.io/en/main/data.html#trained-models" download>
                      here
                    </a>
                    .
                  </Typography>

                  <Typography variant="body2" gutterBottom>
                    The dataset used for interaction-specific PPI prediction can be downloaded{" "}
                    <a href="https://version-10-5.string-db.org/download/protein.actions.v10.5/9606.protein.actions.v10.5.txt.gz" download>
                      here
                    </a>{" "}
                    ,{" "}
                    <a href="https://www.ndexbio.org/#/network/523fff27-afe8-11e9-8bb4-0ac135e8bacf" download>
                      here
                    </a>{" "}
                    <a href="http://www.ndexbio.org/#/network/656370fa-afe8-11e9-8bb4-0ac135e8bacf" download>
                      here
                    </a>{" "}
                    <a href="http://www.ndexbio.org/#/network/76be57cd-afe8-11e9-8bb4-0ac135e8bacf" download>
                      here
                    </a>{" "}
                    .
                  </Typography>


                  <Typography variant="h2" component="h3" gutterBottom>
                    LazyPair FAQ
                  </Typography>

                  <Typography variant="subtitle2" gutterBottom>
                    What is LazyPair?
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    LazyPair is a tool for predicting PPI.
                  </Typography>

                  <Typography variant="subtitle2" gutterBottom>
                    What is STRING:full mean?
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    This is a predicted probability for generic PPI.
                  </Typography>

                  <Typography variant="subtitle2" gutterBottom>
                    Why is median probability the final probability of PPI?
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    We find that median probability is more generalisable.
                  </Typography>

                  <Typography variant="subtitle2" gutterBottom>
                    Where can I find the command line version of LazyPair?
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    This is in our
                    <a
                      href="https://github.com/Gardner-BinfLab/PPI_Analysis_2022/blob/master/script"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      &nbsp;GitHub
                      </a>. The command line program is optimised to run on a very large number of sequences.
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

  export default ScallionDocumentation;
