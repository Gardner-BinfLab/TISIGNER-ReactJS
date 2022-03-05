 /**
  * @Author: Bikash Kumar Bhandari <bikash>
  * @Date:   2021-05-23T19:37:51+12:00
  * @Filename: LazyPairDocumentation.jsx
  * @FAQ written by:   CS Lim
  * @Last modified by:   bikash
  * @Last modified time: 2022-03-05T20:26:19+00:00
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
      <Navigation link={"/LazyPair"} />
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
                  There are 18 models, one generic (STRING:full) and 17 interaction-specific models.
                  Median probability is provided as the final probability of PPI.
                </Typography>


                <Typography variant="h2" component="h3" gutterBottom>
                  Data used
                </Typography>
                <Typography variant="body2" gutterBottom>
                  The training and benchmarking datasets used for the generic PPI
                  prediction (STRING:full) were obtained from D-SCRIPT and can be
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
                  <a href="https://signor.uniroma2.it/releases/getLatestRelease.php" download>
                    here
                  </a>
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
                  What is Median in the output file?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Median is the median probability the final probability of PPI.
                  </Typography>

               <Typography variant="subtitle2" gutterBottom>
                  Why do you use Median?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  We find it is more generalisable.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  How do you interpret Median?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  The largest Median we found so far is 0.645.
                  We think above 0.4 are strong predictive of PPIs based on the results from bootstrap resamplings.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                 How to cite Razor?
               </Typography>
               <Typography variant="body2" gutterBottom>
                 <span className="icon">
                   <i className="fas fa-graduation-cap"></i>
                 </span>{" "}
                 Lim, C.S., Bhandari, B.K., Gardner, P.P. (2021) LazyPair:
                 scalable prediction of protein-protein interactions and interaction types.
                 <cite title="LazyPair: scalable prediction of protein-protein interactions and interaction types.">
                   {" "}
                   bioRxiv.
                 </cite>{" "}
                 DOI:
                 <a
                   href="https://doi.org/10.1101/2022.02.21.481370"
                   target="_blank"
                   rel="noopener noreferrer"
                 >
                   10.1101/2022.02.21.481370
                 </a>
                 .
                 <br />{" "}
                 <span className="icon">
                   <i className="fas fa-graduation-cap"></i>
                 </span>{" "}
                 Bhandari, B.K., Lim, C.S., Gardner, P.P., (2021) TISIGNER.com:
                 web services for improving recombinant protein production.
                 <cite title="TISIGNER.com: web services for improving recombinant protein production.">
                   {" "}
                   Nucleic Acids Research.
                 </cite>{" "}
                 DOI:
                 <a
                   href="https://doi.org/10.1093/nar/gkab175"
                   target="_blank"
                   rel="noopener noreferrer"
                 >
                   10.1093/nar/gkab175
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

  export default ScallionDocumentation;
