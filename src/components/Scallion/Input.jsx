/**
 * @Author: Bikash Kumar Bhandari <bikash>
 * @Date:   2021-04-06T21:07:49+12:00
 * @Filename: Input.jsx
 * @Last modified by:   bikash
 * @Last modified time: 2021-10-30T08:40:38+13:00
 */



import React, { Component, Fragment } from "react";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import Error from "../Error/Error";
import ReactGA from "react-ga";
import Skeleton from "@material-ui/lab/Skeleton";
import { ScallionLink } from "../EndPoints";
import Button from "@material-ui/core/Button";
// import GetAppIcon from "@material-ui/icons/GetApp";

class ScallionInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sequenceType: "Protein",
      inputSequenceProtein: "",
      isValidatedSequence: true,
      currentInputSequence: "",
      isValid: true,
      inputSequenceError: "",
      isSubmitting: false,
      showResult: false,
      isServerError: false,
      result: "",
    };
    this.handleInput = this.handleInput.bind(this);
    this.sequenceInput = this.sequenceInput.bind(this);
    this.submitInput = this.submitInput.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      this.submitInput(event);
    }
  };

  handleInput(event) {
    let currentSequence = event.target.value;
    if (currentSequence) {
      this.sequenceInput(event, currentSequence);
    }
  }
  sequenceInput(event, seq = null) {
    // let re = /\r\n|\n\r|\n|\r/g;
    // let fasta = event.target.value
    // let input = fasta.replace(re, "\n").split("\n");

    let isValid = true;
    let error = "";
    let s = seq === null ? event.target.value : seq;
    let sequence = s

    if (!sequence) {
      isValid = false;
      error = "Something's wrong!";
    }

    this.setState({
      currentSequence: sequence,
      inputSequenceError: error,
      isValidatedSequence: isValid,
    });
  }



  submitInput(event) {
    let sequence = this.state.currentSequence;
    let isValid = this.state.isValidatedSequence;

    ReactGA.event({
      category: "Scallion Input Page",
      action: "Submit button clicked.",
    });

    event.preventDefault();
    if (sequence && isValid) {
      const userObject = {
        inputSequenceScallion: sequence, //Protein sequence here
      };
      this.setState({ isSubmitting: true });

      axios
        .post(ScallionLink, userObject)
        .then((res) => {
          // console.log(res)
          this.setState({
            showResult: true,
            result: res.data,
            isSubmitting: false,
          });
          ReactGA.event({
            category: "Scallion Input Page",
            action: "Submit button clicked.",
            label: "Scallion results received.",
          });
        })
        .catch((error) => {
          this.setState({
            isServerError: true,
            serverError: error,
            isSubmitting: false,
          });
          ReactGA.event({
            category: "Scallion Input Page",
            action: "Submit button clicked.",
            label: `Scallion Failed with error: ${error}`,
          });
        });
    }
  }

  render() {
    if (this.state.isSubmitting) {
      return (
        <Fragment>
          <section
            className="hero is-fullheight"
            style={{
              backgroundImage: "linear-gradient(to right, #1a2b32, #355664)",
            }}
          >
            <div className="hero-body">
              <div className="container is-fluid is-paddingless">
                <br />
                <div className="box">
                  <Typography variant="h5" gutterBottom>
                    Please wait ...
                  </Typography>
                  <article className="media">
                    <div className="media-content">
                      <div className="content">
                        <Skeleton variant="rect" height={150} />
                        <hr />
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>
        </Fragment>
      );
    } else if (this.state.showResult) {
      let results = this.state.result
      return (
        <Fragment key="scallion_result">
          <section
            className="hero is-fullheight"
            style={{
              backgroundImage: "linear-gradient(to right, #1a2b32, #355664)",
            }}
          >
            <div className="hero-body">
              <div className="container is-fluid is-paddingless">
                <div className="box">
                  <Typography variant="h5" gutterBottom>
                    Results
                  </Typography>


                  <Button
                    color="default"
                    href={`data:text/json;charset=utf-8,${encodeURIComponent(
                      results
                    )}`}
                    download="Scallion_interaction_predictions.csv"
                    key="Download results"

                  >
                    Download
                  </Button>

                </div>
              </div>
            </div>
          </section>
        </Fragment>
      );
    } else if (this.state.isServerError) {
      return <Error error={this.state.serverError} />;
    } else {
      return (
        <Fragment>
          <div className="field has-addons">
            {/*<p className="control">
              <span className="select is-rounded">
                <select
                  value={this.state.sequenceType}
                  onChange={this.handleChangeSequenceType}
                >
                  <option value="Protein">Protein</option>
                  <option value="Nucleotide">Nucleotide</option>
                </select>
              </span>
            </p>*/}
            <div className="control is-expanded">
              <textarea
                autoFocus
                className="textarea"
                type="text"
                placeholder="Paste your fasta sequence for predicting interactions."
                onChange={this.handleInput}
                value={this.state.currentSequence}
                disabled={!this.state.sequenceType ? true : false}
                onKeyDown={this.handleKeyDown}
              />
            </div>
            {/* <div className="control">
              <button
                className={
                  "button is-info is-rounded " +
                  (this.state.isSubmitting ? " is-loading " : null)
                }
                onClick={this.submitInput}
              >
                Submit
              </button>
            </div>*/}
          </div>
          <p className="help is-success has-text-centered">
            This server limits 100 sequences. For large number of sequences, please use the command line tool
            from our GitHub.
          </p>

          <br />
          <div className="buttons has-addons is-grouped is-multiline is-centered">
            <button
              className="button are-medium is-info is-outlined is-rounded"
              className={
                "button is-info is-rounded " +
                (this.state.isSubmitting ? " is-loading " : null)
              }
              onClick={this.submitInput}
            >
              Submit
            </button>
          </div>
        </Fragment>
      );
    }
  }
}

export default ScallionInput;