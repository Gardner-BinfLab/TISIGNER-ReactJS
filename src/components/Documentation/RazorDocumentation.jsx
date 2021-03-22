import React, { Fragment, useEffect } from "react";
import Navigation from "../Common/Navigation";
import Footer from "../Homepage/Footer";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import ReactGA from "react-ga";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import Rating from "@material-ui/lab/Rating";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";
import { demoRazor, defaultProteinRazor } from "../Razor/Utils/Utils";
import RazorLine from "../Chart/RazorLine";
import SignalData from "./SignalPeptide_Data.csv.gz";
import ToxinData from "./Toxin_Data.csv.gz";
import FungiData from "./Fungi_Data.csv.gz";
import SignalBenchmark from "./benchmark_sp_new.csv.gz";
import ToxinBenchmark from "./benchmark_toxins.csv.gz";
import FungiBenchmark from "./benchmark_fungi.csv.gz";

const data = demoRazor();
const prot = defaultProteinRazor();

const RazorDocumentation = (props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  ReactGA.event({
    category: "Documentation",
    action: "Documentation clicked.",
    label: "Razor",
  });

  return (
    <Fragment>
      <Navigation link={"/razor"} />
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
                  The prediction steps of signal peptides
                </Typography>
                {/*                <Typography variant="body2" gutterBottom>
                  This happens in the following steps:
                </Typography>
                */}
                <ul>
                  <li>
                    The first N-terminal 30 residues of an input sequence is
                    used to score for the presence of signal peptide, producing
                    the S-score.
                  </li>
                  <li>
                    A weight matrix is applied to a sliding window of 30
                    residues and scored. Since the training was done by aligning
                    the cleavage site in between position 15 and 16, this gives
                    the C-scores along the sequence starting from position 15.
                    These C-scores are shown in the figure.
                  </li>
                  <li>
                    The classification score (Y-score) is calculated as{" "}
                    <math
                      xmlns="http://www.w3.org/1998/Math/MathML"
                      display="inline"
                      title="Y score "
                    >
                      <mrow>
                        <mi>Y</mi>
                        <mo>=</mo>
                        <msqrt>
                          <mrow>
                            <mi>S</mi>
                            <mo>×</mo>
                            <mi>C</mi>
                          </mrow>
                        </msqrt>
                      </mrow>
                    </math>
                    , where S is the S-score and C is the maximum value of
                    C-scores.
                  </li>
                </ul>

                <Typography variant="subtitle2" gutterBottom>
                  The prediction of toxin and fungal signal peptides
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Applies if a signal peptide is predicted.
                </Typography>

                <Typography variant="body2" gutterBottom>
                  <b>Note:</b> There are 5 models for each of the above
                  prediction steps. Thus, there are 5 results.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Prediction output
                </Typography>
                <Typography variant="body2" gutterBottom>
                  A sample display of predictions is shown below:
                </Typography>

                <div className="card">
                  <div className="card-content">
                    <nav className="level">
                      <div className="level-item has-text-centered">
                        <div>
                          <Tooltip
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            title="Votes of 5 models."
                            placement="top"
                            arrow
                          >
                            <p className="heading">Signal Peptide</p>
                          </Tooltip>
                          <p className="title">
                            <Rating
                              name="signal-peptide-rating"
                              value={5}
                              readOnly
                            />
                          </p>
                        </div>
                      </div>

                      <Fragment>
                        <div className="level-item has-text-centered">
                          <div>
                            <p className="heading">Toxin</p>
                            <p className="title">
                              <Rating
                                name="signal-peptide-rating"
                                value={4}
                                readOnly
                              />
                            </p>
                          </div>
                        </div>
                      </Fragment>

                      <Fragment>
                        <div className="level-item has-text-centered">
                          <div>
                            <p className="heading">Fungi</p>
                            <p className="title">
                              <Rating
                                name="signal-peptide-rating"
                                value={3}
                                readOnly
                              />
                            </p>
                          </div>
                        </div>
                      </Fragment>

                      <div className="level-item has-text-centered">
                        <div>
                          <Tooltip
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            title="The median of Y scores of 5 models."
                            placement="top"
                            arrow
                          >
                            <p className="heading">Signal peptide score</p>
                          </Tooltip>
                          <p className="title">0.99</p>
                        </div>
                      </div>

                      <Fragment>
                        <div className="level-item has-text-centered">
                          <div>
                            <Tooltip
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              title="The median of max C-scores of 5 models."
                              placement="top"
                              arrow
                            >
                              <p className="heading">Region</p>
                            </Tooltip>
                            <p className="title">1-19</p>
                          </div>
                        </div>

                        <div className="level-item has-text-centered">
                          <div>
                            <Tooltip
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              title="The median of max C-scores of 5 models."
                              placement="top"
                              arrow
                            >
                              <p className="heading">Cleavage site score</p>
                            </Tooltip>
                            <p className="title">0.99</p>
                          </div>
                        </div>
                      </Fragment>
                    </nav>
                  </div>
                </div>

                <List>
                  <Divider variant="middle" />
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                        >
                          Signal peptide
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          style={{ display: "inline" }}
                          color="textPrimary"
                        >
                          The number of models with prediction probability
                          greater than a threshold of 0.56. In this example, a
                          total of 5 stars indicates that all 5 models predict
                          the input sequence harbours a signal peptide. This
                          threshold shows the highest Matthew's correlation
                          coefficient on the training set.
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider variant="middle" />
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                        >
                          Toxin | Fungi
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          style={{ display: "inline" }}
                          color="textPrimary"
                        >
                          Similar to above, there are 5 distinct models for
                          prediction of each of these classes of signal
                          peptides. The threshold for fungi and toxin are 0.23
                          and 0.33 respectively. In this example, 4 models
                          predict that the signal peptide may be harboured by a
                          toxin, whereas 3 models predict that the signal
                          peptide is harboured by a fungal protein. If none of
                          these models make a positive prediction, these fields
                          are not visible. These thresholds were obtained
                          similar as above.
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider variant="middle" />
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                        >
                          Signal peptide score
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          style={{ display: "inline" }}
                          color="textPrimary"
                        >
                          This is the median Y-score.
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider variant="middle" />
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                        >
                          Region
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          style={{ display: "inline" }}
                          color="textPrimary"
                        >
                          This is the region of predicted signal peptide. In
                          this example, it is 1-19, in which 19 is the position
                          that has the maximum C-score of the model with the
                          median Y-score, i.e. the signal peptide score. The
                          black dotted line indicates the predicted cleavage
                          site.
                        </Typography>
                      }
                    />
                  </ListItem>
                  <div className="card">
                    <div className="card-content">
                      <div className="column has-text-centered is-full">
                        <p className="heading">C-scores along the sequence</p>
                        <RazorLine
                          data={data}
                          inputProt={prot}
                          key={"razor_plot_FAQ"}
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <Divider variant="middle" />
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                        >
                          Cleavage site score
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          style={{ display: "inline" }}
                          color="textPrimary"
                        >
                          This is the maximum C-score from the model with the
                          median Y-score, i.e. the signal peptide score.
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider variant="middle" />
                </List>

                <Typography variant="h2" component="h3" gutterBottom>
                  Data used
                </Typography>
                <Typography variant="body2" gutterBottom>
                  The training and benchmarking datasets used for the signal
                  peptide prediction were obtained from SignalP 5.0 and can be
                  downloaded{" "}
                  <a href={SignalData} download>
                    here
                  </a>
                  . We also curated a new benchmark set for SP prediction. This
                  can be downloaded{" "}
                  <a href={SignalBenchmark} download>
                    here
                  </a>
                  .
                </Typography>

                <Typography variant="body2" gutterBottom>
                  The dataset used for the toxin signal peptide training and
                  benchmarking can be downloaded{" "}
                  <a href={ToxinData} download>
                    here
                  </a>{" "}
                  and{" "}
                  <a href={ToxinBenchmark} download>
                    here
                  </a>{" "}
                  respectively.
                </Typography>

                <Typography variant="body2" gutterBottom>
                  The dataset used for the fungal signal peptide training and
                  benchmarking can be downloaded{" "}
                  <a href={FungiData} download>
                    here
                  </a>{" "}
                  and{" "}
                  <a href={FungiBenchmark} download>
                    here
                  </a>{" "}
                  respectively.
                </Typography>

                <Typography variant="h2" component="h3" gutterBottom>
                  Razor FAQ
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  What is Razor?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Razor is a tool for predicting eukaryotic signal peptides
                  (SP). We also predict whether the signal peptide predicted is
                  a region of a toxin or fungal protein.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  What do the stars mean?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  We use five random forest models for prediction of SP, toxin
                  SP or fungal SP. The number of stars refers to the number of
                  models that predict the input sequence as true for each
                  category.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Why are there 'S' in the x-axis of the C-score plot?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  If the input sequence is shorter than 30 residues, we pad
                  Serine (S) residues such that length becomes 30 residues.
                  Additional S residues will be shown as 'S'.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Why is my toxin sequence of interest not identified?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  We detect toxin SP. It is possible that your input sequence is
                  a toxin without a signal peptide.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Is there an option for batch input mode?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Not yet. You can download the command line program from our
                  GitHub{" "}
                  <a
                    href="https://github.com/Gardner-BinfLab/Razor"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://github.com/Gardner-BinfLab/Razor
                  </a>{" "}
                  and run it locally. The command line program is optimised to
                  scan a large number of sequences.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  How to cite Razor?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <span className="icon">
                    <i className="fas fa-graduation-cap"></i>
                  </span>{" "}
                  Bhandari, B.K., Gardner, P.P., Lim, C.S. (2020) Annotating
                  eukaryotic and toxin-specific signal peptides using Razor.
                  <cite title="Razor: annotation of signal peptides from toxins.">
                    {" "}
                    bioRxiv.
                  </cite>{" "}
                  DOI:
                  <a
                    href="https://doi.org/10.1101/2020.11.30.405613"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    10.1101/2020.11.30.405613
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
                  <br />
                  <br />
                  If you find optimising protein solubility useful, please also
                  cite:
                  <br />{" "}
                  <span className="icon">
                    <i className="fas fa-graduation-cap"></i>
                  </span>{" "}
                  Bhandari, B.K., Gardner, P.P., Lim, C.S. (2020){" "}
                  Solubility-Weighted Index: fast and accurate prediction of
                  protein solubility.
                  <cite title="Solubility-Weighted Index:  fast and accurate prediction of protein solubility. ">
                    {" "}
                    Bioinformatics.
                  </cite>{" "}
                  DOI:
                  <a
                    href="https://doi.org/10.1093/bioinformatics/btaa578"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    10.1093/bioinformatics/btaa578
                  </a>
                  .
                  <br />
                  If you find optimising protein expression useful, please also
                  cite the following preprint:
                  <br />{" "}
                  <span className="icon">
                    <i className="fas fa-graduation-cap"></i>
                  </span>{" "}
                  Bhandari, B.K., Lim, C.S., Gardner, P.P. (2019) Highly
                  accessible translation initiation sites are predictive of
                  successful heterologous protein expression.
                  <cite title="Protein yield is tunable by synonymous codon changes of translation initiation sites.">
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
                  Could I copy and distribute Razor for commercial purposes?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  See our <Link to="/license">License page</Link>.
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

export default RazorDocumentation;
