import React, { Fragment, useEffect } from "react";
import Navigation from "../Common/Navigation";
import Footer from "../Homepage/Footer";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import ReactGA from "react-ga";

const TisignerDocumentation = props => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  ReactGA.event({
    category: "Documentation",
    action: "Documentation clicked.",
    label: "TIsigner"
  });

  return (
    <Fragment>
      <Navigation link={"/tisigner"} />
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
                  TIsigner FAQ
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  What is TIsigner?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  TIsigner (Translation Initiation coding region designer) is a
                  gene optimisation tool.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Why TIsigner requires a 5&prime; UTR (promoter) sequence to
                  run?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  TIsigner takes a 5&prime; UTR sequence into account when
                  calculating the opening energy (accessibility) of translation
                  initiation site.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  What should I do if the promoter of my expression vector is
                  not available in the drop down menu and I can not figure out
                  the transcription start site?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  If unsure input the 71 nt vector-encoded sequence preceding
                  the start codon.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Could I optimise multiple sequences per job?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  TIsigner webserver limits one sequence per job to control work
                  load. For scaling up, please consider using the{" "}
                  <a
                    href="https://github.com/Gardner-BinfLab/TIsigner"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    command line version
                  </a>
                  .
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Could TIsigner optimise the full-length sequence of a gene of
                  interest?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  TIsigner has an option for full-length sequence optimisation
                  but this approach will have limited returns in general. The
                  exception is, if your expression vector encodes a short
                  N-terminal fusion tag.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Why not optimise the full-length sequence?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Codon adaptation index (CAI) is the most popular feature for
                  full-length gene optimisation. However, many evaluations have
                  shown that CAI has a limited relationship with protein
                  expression (0.54 AUC, in our evaluations using 11,430{" "}
                  <a
                    href="http://targetdb.rcsb.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    recombinant protein expression experiments
                  </a>{" "}
                  in <i>E. coli</i>). An AUC score of 0.5 is expected for
                  tossing a coin, suggesting that CAI has limited use in gene
                  optimisation. In contrast, the accessibility of translation
                  initiation sites has an AUC score of 0.7. Furthermore,
                  optimising as few as the first nine codons is sufficient to
                  improve the accessibility of the translation initiation
                  region.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Could I copy and distribute TIsigner for commercial purposes?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  See our <Link to="/license">License</Link> page.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  How to cite TIsigner?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Bhandari, B.K., Lim, C.S., Gardner, P.P. (2019){" "}
                  <cite title="Highly accessible translation initiation sites are predictive of successful heterologous protein expression.">
                    Highly accessible translation initiation sites are
                    predictive of successful heterologous protein expression
                  </cite>
                  . BioRxiv.{" "}
                  <a
                    href="https://doi.org/10.1101/726752"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    DOI:10.1101/726752
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

export default TisignerDocumentation;
