/**
 * @Author: Bikash Kumar Bhandari <bikash>
 * @Date:   2021-04-06T21:07:49+12:00
 * @Filename: Error.jsx
 * @Last modified by:   bikash
 * @Last modified time: 2021-10-30T08:39:59+13:00
 */



import React, { Component, Fragment } from "react";
import AnimatedParticles from "../Particles";
import Typography from "@material-ui/core/Typography";

class Error extends Component {
  render() {
    const error = this.props.error;
    let errorMessage = "";
    let errorStatus = "";
    let unknownError = false;

    if (error.response && error.response.status) {
      errorStatus = error.response.status;
    } else if (error.response && error.response.data.status) {
      errorStatus = error.response.data.satus;
    } else if (error.message && error.message.status) {
      errorStatus = error.message.satus;
    } else if (error.message === "Network Error") {
      errorStatus = " ";
    } else {
      errorStatus = null;
    }

    if (error.response && error.response.data.seq) {
      errorMessage = error.response.data.seq;
    } else if (error.response && error.response.data) {
      if (error.response.data.data) {
        errorMessage = error.response.data.data;
      } else {
        errorMessage = error.response.data;
      }
    } else if (error.message && error.message.data) {
      errorMessage = error.message.data;
    } else if (error.message) {
      errorMessage = error.message + '\n Check your internet connection!';
    } else {
      errorMessage =
        "Sneed's Feed & Seed (Formerly Chuck's)\n" +
        JSON.stringify(error) +
        "\nCopy the above message and report it to us!";
      unknownError = true;
    }

    return (
      <Fragment>
        <AnimatedParticles />

        <div className="hero-body" style={{ color: "#FFFFFF", zIndex: "100" }}>
          <div className="container is-fluid is-paddingless">
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
                    {errorStatus}
                  </strong>
                </h1>
                {!errorMessage ? null : (
                  <Fragment>
                    <p>
                      There was an error processing the request. The error
                      message is:
                      <br />
                      {!unknownError ? null : (
                        <img
                          src="data:image/png;base64,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"
                          alt="big thonk"
                        />
                      )}
                    </p>

                    <pre>{errorMessage} </pre>
                  </Fragment>
                )}
              </div>

              <div className="content">
                <p>
                  Refresh the page and try again. If the error persists,{" "}
                  <a
                    href="https://github.com/Gardner-BinfLab/TISIGNER-ReactJS"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    contact us
                  </a>
                  .
                  <br />
                </p>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Error;
