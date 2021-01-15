import React, { Component, Fragment } from "react";
import Typography from "@material-ui/core/Typography";
import Zoom from "react-reveal/Fade";
import Fade from "react-reveal/Fade";
import { Link } from "react-router-dom";

class Tools extends Component {
  state = {
    data: [
      {
        name: "TIsigner",
        fullname: "Translation Initiation coding region designer",
        classes: "is-light",
        text:
          "Our open source, industry-leading platform offers unparalleled speed and accuracy for gene optimisation.",
        image: "/tisigner.png",
        cardText: (
          <Fragment>
            TIsigner optimises the translation initiation coding region of a
            gene of interest to improve recombinant protein production in{" "}
            <i>Escherichia coli</i>, <i>Saccharomyces cerevisiae</i> and{" "}
            <i>Mus musculus</i>. In contrast to existing software, TIsigner
            suggests minimum numbers of synonymous codon changes to the input
            sequence. This enables a standard PCR cloning for the optimised
            sequence.
            <br />
            We validated TIsigner by designing constructs with different opening
            energies. Our predictions (experession scores) matched closely with
            the experimental results (Spearman's ρ = 0.72, P-value = 1.3 x 10
            <sup>-5</sup>). The experimental details and results can be viewed at{" "}
            <a
              href="https://bkb3.github.io/TIsignerExperiment/"
              target="_blank"
              rel="noopener noreferrer"
            >
              TIsigner experiment page
            </a>
            .
            <hr />
            DOI:{" "}
            <a
              href="https://doi.org/10.1101/726752"
              target="_blank"
              rel="noopener noreferrer"
            >
              10.1101/726752
            </a>
          </Fragment>
        ),
        link: "/tisigner",
        help: "/tisigner/faq",
      },
      {
        name: "SoDoPE",
        fullname: "Soluble Domain for Protein Expression",
        classes: "is-light",
        text:
          "Leveraging 98,146 real-world experimental data points, our algorithms withstand the world's most stringent tests.",
        image: "/sodope.png",
        cardText: (
          <Fragment>
            SoDoPE enables users to navigate a protein sequence and its domains
            for predicting and maximising solubility. SoDoPE is linked with
            TIsigner, and therefore empowers protein biochemists to design
            sequences for tuning both protein expression and solubility for a
            gene of interest.
            <br />
            DOI:{" "}
            <a
              href="https://dx.doi.org/10.1093/bioinformatics/btaa578"
              target="_blank"
              rel="noopener noreferrer"
            >
              10.1093/bioinformatics/btaa578
            </a>
          </Fragment>
        ),
        link: "/sodope",
        help: "/sodope/faq",
      },
      {
        name: "Razor",
        fullname: "Signal peptide detector",
        classes: "is-light",
        text:
          "Highly accurate prediction of eukaryotic signal peptides, toxins and fungi specific signal peptides.",
        image: "/tisigner.png",
        cardText: (
          <Fragment>
            Razor is built for detection of signal peptides in eukaryotes.
            Furthermore, we also detect whether the signal peptide is harboured
            by a toxin. Razor can also be used to check for signal peptides from
            fungi. Both toxin and fungi prediction is done using a novel
            approach of utilising the residues at the signal peptide itself.
            <br />
            DOI:{" "}
            <a
              href="https://doi.org/10.1101/2020.11.30.405613"
              target="_blank"
              rel="noopener noreferrer"
            >
              10.1101/2020.11.30.405613
            </a>
          </Fragment>
        ),
        link: "/razor",
        help: "/razor/faq",
      },
    ],
  };

  render() {
    return this.state.data.map((item, key) => (
      <Fragment key={key}>
        <div id={item.name}>
          <section className={"hero is-medium is-bold " + item.classes}>
            <div className="hero-body">
              <div className="container">
                <div className="columns">
                  {key % 2 === 0 ? (
                    <Fade>
                      <div className="column has-text-right">
                        <Typography
                          variant="h4"
                          component="h5"
                          fontWeight="fontWeightLight"
                          gutterBottom
                        >
                          {item.text}
                        </Typography>
                      </div>
                    </Fade>
                  ) : (
                    <Zoom>
                      <div className="column">
                        <div className="box">
                          <article className="media">
                            <div className="media-content">
                              <div className="content">
                                <Typography
                                  component={"span"}
                                  variant={"body1"}
                                >
                                  <strong>{item.name}</strong>{" "}
                                  <small>{item.fullname}</small>
                                  <br />
                                  {item.cardText}
                                </Typography>
                              </div>
                              <nav className="level is-mobile">
                                <div className="level-left">
                                  <div className="level-item">
                                    <div className="field is-grouped">
                                      <p className="control">
                                        <Link to={item.link}>
                                          <button className="button are-medium is-black is-outlined is-rounded">
                                            {item.name}
                                          </button>
                                        </Link>
                                      </p>
                                      <p className="control">
                                        <Link to={item.help}>
                                          <button className="button are-medium is-black is-rounded">
                                            Documentation
                                          </button>
                                        </Link>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </nav>
                            </div>
                          </article>
                        </div>
                      </div>
                    </Zoom>
                  )}

                  {key % 2 === 0 ? (
                    <Zoom>
                      <div className="column">
                        <div className="box">
                          <article className="media">
                            <div className="media-content">
                              <div className="content">
                                <Typography
                                  component={"span"}
                                  variant={"body1"}
                                >
                                  <strong>{item.name}</strong>{" "}
                                  <small>{item.fullname}</small>
                                  <br />
                                  {item.cardText}
                                </Typography>
                              </div>
                              <nav className="level is-mobile">
                                <div className="level-left">
                                  <div className="level-item">
                                    <div className="field is-grouped">
                                      <p className="control">
                                        <Link to={item.link}>
                                          <button className="button are-medium is-black is-outlined is-rounded">
                                            {item.name}
                                          </button>
                                        </Link>
                                      </p>
                                      <p className="control">
                                        <Link to={item.help}>
                                          <button className="button are-medium is-black is-rounded">
                                            Documentation
                                          </button>
                                        </Link>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </nav>
                            </div>
                          </article>
                        </div>
                      </div>
                    </Zoom>
                  ) : (
                    <Fade>
                      <div className="column has-text-right">
                        <Typography
                          variant="h4"
                          component="h5"
                          fontWeight="fontWeightLight"
                          gutterBottom
                        >
                          {item.text}
                        </Typography>
                      </div>
                    </Fade>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </Fragment>
    ));
  }
}
export default Tools;
