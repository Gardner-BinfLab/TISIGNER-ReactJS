import React from "react";
import { fadeInUp, fadeInLeft, fadeInRight } from "react-animations";
import Radium, { StyleRoot } from "radium";
import Typography from "@material-ui/core/Typography";
import ScrollIntoView from "react-scroll-into-view";
import { Link } from "react-router-dom";

const styles = {
  fadeInUp: {
    animation: "x 1s",
    animationName: Radium.keyframes(fadeInUp, "fadeInUp"),
  },
  fadeInLeft: {
    animation: "x 1s",
    animationName: Radium.keyframes(fadeInLeft, "fadeInLeft"),
  },
  fadeInRight: {
    animation: "x 1s",
    animationName: Radium.keyframes(fadeInRight, "fadeInRight"),
  },
};

const Banner = () => {
  return (
    <section
      className="hero is-fullheight"
      style={{ backgroundImage: "linear-gradient(to right, #1a2b32, #355664)" }}
    >
      <div className="hero-body">
        <div className="container is-fluid is-paddingless">
          <Typography variant="h2" component="h3" gutterBottom>
            <b>
              <span style={{ color: "#FFFFFF" }}>TI</span>
              <span style={{ color: "#EDA604" }}>SIGNER</span>
            </b>
          </Typography>
          <StyleRoot>
            <div className="animatedSubheadingText" style={styles.fadeInUp}>
              <Typography
                variant="h3"
                style={{ color: "#FFFFFF" }}
                gutterBottom
              >
                Unleash the power of synthetic biology
              </Typography>
            </div>
            <div className="field is-grouped is-grouped-multiline">
              <p className="control" style={styles.fadeInLeft}>
                <Link to="/tisigner">
                  <button className="button are-medium is-black is-inverted is-outlined is-rounded">
                    TIsigner | optimise expression
                  </button>
                </Link>
              </p>
              <p className="control" style={styles.fadeInUp}>
                <Link to="/sodope">
                  <button className="button are-medium is-black is-inverted is-outlined is-rounded">
                    SoDoPE | optimise solubility
                  </button>
                </Link>
              </p>
              <p className="control" style={styles.fadeInUp}>
                <Link to="/razor">
                  <button className="button are-medium is-black is-inverted is-outlined is-rounded">
                    Razor | detect signal peptide
                  </button>
                </Link>
              </p>
              <p className="control" style={styles.fadeInUp}>
                <Link to="/faq">
                  <button className="button are-medium is-black is-inverted is-outlined is-rounded">
                    Help
                  </button>
                </Link>
              </p>
              <p className="control" style={styles.fadeInUp}>
                <a
                  href="https://github.com/Gardner-BinfLab/TISIGNER-ReactJS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button are-medium is-link is-rounded"
                >
                  <span className="icon">
                    <i className="fab fa-github"></i>
                  </span>
                  <span>Github</span>
                </a>
              </p>
              <ScrollIntoView selector="#TIsigner">
                <p className="control" style={styles.fadeInRight}>
                  <button className="button are-medium is-success is-rounded">
                    Learn more
                  </button>
                </p>
              </ScrollIntoView>
            </div>
            <Typography
              variant="subtitle1"
              style={{ color: "#FFFFFF" }}
              gutterBottom
            >
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
          </StyleRoot>
        </div>
      </div>
    </section>
  );
};

export default Banner;
