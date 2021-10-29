/**
 * @Author: Bikash Kumar Bhandari <bikash>
 * @Date:   2021-04-06T21:07:49+12:00
 * @Filename: ErrorBoundary.jsx
 * @Last modified by:   bikash
 * @Last modified time: 2021-10-30T08:40:03+13:00
 */



import React, { Fragment, Component } from "react";
import AnimatedParticles from "../Particles";
import Navigation from "../Common/Navigation";
import Footer from "../Homepage/Footer";
import Typography from "@material-ui/core/Typography";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <Fragment>
        <AnimatedParticles />
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
                    <Typography variant="h4" gutterBottom>
                      <strong style={{ color: "#FFFFFF" }}>
                        We are sorry. Something went wrong.
                      </strong>
                    </Typography>

                    <Typography variant="h5" gutterBottom>
                    <strong style={{ color: "#FFFFFF" }}>
                      Please report the following error to us.
                      </strong>
                    </Typography>
                    <pre>
                      {" "}
                      {this.state.error && this.state.error.toString()}
                      <br />
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </Fragment>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;
