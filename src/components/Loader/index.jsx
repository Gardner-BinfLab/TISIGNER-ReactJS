import React, { Fragment, Component } from "react";
import Navigation from "../Common/Navigation";
import Footer from "../Homepage/Footer";
import Typography from "@material-ui/core/Typography";
import "./loading.css";

const Loading = () => (
  <Fragment>
    <div className="loading">
      <div className="make">
        <div className="dash"></div>
        <div className="dash"></div>
        <div className="dash"></div>
        <div className="dash"></div>
        <div className="dash"></div>
        <div className="dash"></div>
        <div className="dash"></div>
        <div className="dash"></div>
        <div className="dash"></div>
        <div className="dash"></div>
      </div>
    </div>
  </Fragment>
);

class Loader extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Fragment>
        <Navigation />
        <section
          className="hero is-fullheight"
          style={{
            backgroundImage: "linear-gradient(to right, #1a2b32, #355664)",
          }}
        >
          <div className="hero-head"></div>
          <div className="hero-body">
            <div className="container is-fluid is-paddingless">
              <div className="media-content has-text-centered">
                <div className="content">
                  <Loading />

                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ color: "#FFFFFF" }}
                  >
                    Loading ...
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </Fragment>
    );
  }
}

export default Loader;
