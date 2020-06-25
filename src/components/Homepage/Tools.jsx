import React, { Component, Fragment } from "react";
import Typography from "@material-ui/core/Typography";
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
        link: "/tisigner"
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
            <hr />
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
        link: "/sodope"
      }
    ]
  };

  render() {
    return this.state.data.map((item, key) => (
      <Fragment key={key}>
        <div id={item.name}>
          <section className={"hero is-medium is-bold " + item.classes}>
            <div className="hero-body">
              <div className="container is-fluid is-paddingless">
                <div className="columns">
                  <Fade left>
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

                  <Fade bottom>
                    <div className="column">
                      <div className="box">
                        <article className="media">
                          <div className="media-content">
                            <div className="content">
                              <Typography component={'span'} variant={'body1'}>
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
                                  </div>
                                </div>
                              </div>
                            </nav>
                          </div>
                        </article>
                      </div>
                    </div>
                  </Fade>
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
