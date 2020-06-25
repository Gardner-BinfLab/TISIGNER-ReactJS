import React, { Fragment, useEffect } from "react";
import Navigation from "../Common/Navigation";
import Footer from "../Homepage/Footer";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import ReactGA from "react-ga";

const SodopeDocumentation = props => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  ReactGA.event({
    category: "Documentation",
    action: "Documentation clicked.",
    label: "SoDoPE"
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
            <br />
            <div className="box">
              <div className="content">
                <Typography variant="h2" component="h3" gutterBottom>
                  SoDoPE FAQ
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  What is SoDoPE?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  SoDoPE (Soluble Domain for Protein Expression) is a tool for
                  solubility prediction and optimisation.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  What should I do after submitting a sequence?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Results of full sequence will be shown. You may wish to
                  explore solubility by adjusting the boundaries using the
                  slider. Known domain will also be displayed and can be
                  clicked.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  How do you predict protein domains?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  SoDoPE sends a query to the HMMER web server to annotate
                  protein domains (
                  <a
                    href="https://www.ebi.ac.uk/Tools/hmmer/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.ebi.ac.uk/Tools/hmmer/{" "}
                  </a>
                  ). We also provide a link to the HMMER results page, which
                  will expire after a week.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  What if no known domains are found?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  SoDoPE analysis report for the full-length input sequence will
                  be displayed. Profile plot (see below) may be useful in this
                  case.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  What is the profile plot?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Profile plot shows the flexibility and hydrophobicity profiles
                  of the selected region, which are calculated using a sliding
                  window of 9 amino acid residues. Flexibility is calculated
                  using a weighted variation in normalised B-factors{" "}
                  <cite title="Improved amino acid flexibility parameters.">
                    (Vihinen et al., 1994)
                  </cite>
                  , whereas hydrophobicity is calculated using a linear
                  variation in hydropathicity{" "}
                  <cite title="A simple method for displaying the hydropathic character of a protein.">
                    (Kyte and Doolittle, 1982)
                  </cite>
                  .
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Why the flexibility profile appears as a straight line?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Flexibility has a narrow range compared to hydrophobicity. If
                  you wish to view the flexibility profile, please hide the
                  hydrophobicity profile by clicking on its legend.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  How do you predict protein solubility?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  We used a set of 20 values for the standard amino acid
                  residues to score protein solubility. These values were
                  derived from the normalised B-factors{" "}
                  <cite title="Improved amino acid flexibility parameters.">
                    (Smith et al., 2003)
                  </cite>{" "}
                  using the Nelder-Mead algorithm. We call the solubility score
                  as the Solubility-Weighted Index (SWI).
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  How do I improve the solubility of a protein domain?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Regions with improved solubility will be automatically
                  displayed. If you wish to use a different fusion tag, please
                  click on 'Custom tag' button and choose a sequence type.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  How is SoDoPE different from other protein solubility
                  prediction tools?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  SoDoPE uses only one feature (SWI) to prediction solubility.
                  This key feature outperforms many existing tools. SoDoPE
                  streamlines the process of designing protein sequences for
                  tuning expression (see below) and solubility.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  What is ‘optimise expression’ about?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  This is an option for optimising protein expression using our
                  TIsigner web app.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  How to cite SoDoPE?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Bhandari, B.K., Gardner, P.P., Lim, C.S. (2020){" "}
                  Solubility-Weighted Index: Fast and Accurate Prediction of
                  Protein Solubility.
                  <cite title="Solubility-Weighted Index: Fast and Accurate Prediction of Protein Solubility ">
                    {" "}
                    Bioinformatics.
                  </cite>{" "}
                  DOI:
                  <a
                    href="https://doi.org/10.1093/bioinformatics/btaa578"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    10.1101/2020.02.15.951012
                  </a>
                  .
                  <br />
                  If you find optimising protein expression useful, please also
                  cite the following preprint:
                  <br />
                  Bhandari, B.K., Lim, C.S., Gardner, P.P. (2019) Highly
                  accessible translation initiation sites are predictive of
                  successful heterologous protein expression.
                  <cite title="Highly accessible translation initiation sites are predictive of successful heterologous protein expression.">
                    {" "}
                    bioRxiv
                  </cite>
                  . DOI:
                  <a
                    href="https://doi.org/10.1101/726752"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    10.1101/726752
                  </a>
                  .
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Could I copy and distribute TIsigner for commercial purposes?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  See our <Link to="/license">License</Link> page.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  References
                </Typography>
                <ul>
                  <li>
                    Kyte, J. and Doolittle, R.F. (1982) A simple method for
                    displaying the hydropathic character of a protein.
                    <cite title="A simple method for displaying the hydropathic character of a protein.">
                      {" "}
                      Journal of molecular Biology
                    </cite>{" "}
                    , 157, 105–132.
                  </li>
                  <li>
                    Smith, D.K. et al. (2003) Improved amino acid flexibility
                    parameters.
                    <cite title="Improved amino acid flexibility parameters.">
                      {" "}
                      Protein Science,
                    </cite>{" "}
                    12, 1060–1072.
                  </li>
                  <li>
                    Vihinen, M. et al. (1994) Accuracy of protein flexibility
                    predictions.
                    <cite title="Accuracy of protein flexibility predictions.">
                      {" "}
                      Proteins: Structure, Function, and Genetics,
                    </cite>{" "}
                    19, 141–149.
                  </li>
                </ul>
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

export default SodopeDocumentation;
