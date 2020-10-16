import React, { Fragment } from "react";
import AnimatedParticles from "../Particles";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Fragment>
      <AnimatedParticles />
      <section
        className="hero is-fullheight"
        style={{
          backgroundImage: "linear-gradient(to right, #1a2b32, #355664)"
        }}
      >
        <div className="hero-body" style={{ color: "#FFFFFF", zIndex: "100" }}>
          <div className="container is-fluid">
            <div className="media-content has-text-centered">
              <Typography variant="h2">
                <b>
                  <span style={{ color: "#FFFFFF" }}>TI</span>
                  <span style={{ color: "#EDA604" }}>SIGNER</span>
                </b>
              </Typography>

              <div className="content">
                <h1>
                  <strong style={{ fontSize: "350%", color: "#FFFFFF" }}>
                    404
                  </strong>
                </h1>
                <p>
                  We did not find the page you were looking for. Maybe you were
                  looking for one of these:
                </p>
              </div>
            </div>
            <br />
            <br />
            <nav className="level">
              <div className="level-item has-text-centered">
                <div>
                  <Link to={"/"}>
                    <p className="title" style={{ color: "#FFFFFF" }}>
                      Homepage
                    </p>
                    <p className="heading" style={{ color: "#FFFFFF" }}>
                      Go to homepage
                    </p>
                  </Link>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <Link to={"/tisigner"}>
                    <p className="title" style={{ color: "#FFFFFF" }}>
                      TIsigner
                    </p>
                    <p className="heading" style={{ color: "#FFFFFF" }}>
                      Optimise protein expression
                    </p>
                  </Link>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <Link to={"/sodope"}>
                    <p className="title" style={{ color: "#FFFFFF" }}>
                      SoDoPE
                    </p>
                    <p className="heading" style={{ color: "#FFFFFF" }}>
                      Check and optimise protein solubility
                    </p>
                  </Link>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <Link to={"/razor"}>
                    <p className="title" style={{ color: "#FFFFFF" }}>
                      Razor
                    </p>
                    <p className="heading" style={{ color: "#FFFFFF" }}>
                      Detect signal peptides
                    </p>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </section>
    </Fragment>
  );
}
