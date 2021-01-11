import React from "react";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer" style={{ background: "rgb(2, 7, 10)" }}>
      <div className="container is-fluid is-paddingless">
        <div className="columns">
          <div className="column is-3">
            <Typography variant="h4" component="h5" gutterBottom>
              <b>
                <span style={{ color: "#FFFFFF" }}>TI</span>
                <span style={{ color: "#EDA604" }}>SIGNER</span>
              </b>
            </Typography>
            <br />
            <div className="columns">
              <div className="column">
                <p>
                  <Link to="/license">License</Link>
                </p>
              </div>

              <div className="column">
                <p>
                  <Link to="/privacy">Privacy</Link>
                </p>
              </div>

              <div className="column">
                <p>
                  <Link to="/faq">FAQ</Link>
                </p>
              </div>
            </div>
          </div>
          <div className="column is-3">
            <p className="title has-text-white">Authors</p>
            <ul>
              <li>
                <a
                  href="https://bkb3.github.io/homepage"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Bikash K. Bhandari
                </a>
              </li>
              <li>
                <a
                  href="https://otago.ac.nz/biochemistry/people/profile/index.html?id=3136"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chun Shen Lim
                </a>
              </li>
              <li>
                <a
                  href="https://otago.ac.nz/biochemistry/people/profile/index.html?id=2817"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Paul P. Gardner
                </a>
              </li>
            </ul>
          </div>
          <div className="column is-3">
            <p className="title has-text-white">Contact</p>
            <div className="field is-grouped is-grouped-left">
              <p className="control">
                {" "}
                <a
                  href="mailto:paul.gardner@otago.ac.nz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="icon">
                    <i className="far fa-envelope fa-lg"></i>
                  </span>
                </a>
              </p>
              <p className="control">
                <a
                  href="https://github.com/Gardner-BinfLab/TISIGNER-ReactJS"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="icon">
                    <i className="fab fa-github fa-lg"></i>
                  </span>
                  {/*<span>Github</span>*/}
                </a>
              </p>
            </div>
            <p>
              <a
                href="https://bkb3.github.io/homepage"
                target="_blank"
                rel="noopener noreferrer"
              >
                Maintainer
              </a>
            </p>
          </div>

          <div className="column is-3">
            <p className="title has-text-white">Institutions</p>
            <ul>
              <li>
                <a
                  href="https://www.callaghaninnovation.govt.nz/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Callaghan Innovation
                </a>
              </li>
              <li>
                <a
                  href="https://www.otago.ac.nz/biochemistry"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Department of Biochemistry, University of Otago
                </a>
              </li>
              <li>
                <a
                  href="https://www.mbie.govt.nz/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ministry of Business, Innovation and Employment
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr />

        <div className="has-text-centered is-family-code">
          <p>
            <img
              src="https://travis-ci.com/Gardner-BinfLab/TISIGNER-ReactJS.svg?branch=master"
              alt="Travis CI build status"
            />
          </p>
          <p>
            Build from commit:
            <a
              href={`https://github.com/Gardner-BinfLab/TISIGNER-ReactJS/commit/${process.env.REACT_APP_GIT_SHA_LONG}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {`${process.env.REACT_APP_GIT_SHA_SHORT}`}
            </a>
          </p>
        </div>
        <div className="content has-text-centered has-text-white">
          <p>&copy; 2019-{new Date().getFullYear()} Authors</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
