/**
 * @Author: Bikash Kumar Bhandari <bikash>
 * @Date:   2021-04-06T21:07:49+12:00
 * @Filename: Input.jsx
 * @Last modified by:   bikash
  * @Last modified time: 2022-03-05T20:32:28+00:00
 */



import React, { Component, Fragment } from "react";
import axios from "axios";
import Error from "../Error/Error";
import ReactGA from "react-ga";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
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
    // if (event.key === "Enter") {
    //   this.submitInput(event);
    // }
  };

  exampleInput = (event) => {
    let exampleFasta = String.raw`>sp|P68871|HBB_HUMAN Hemoglobin subunit beta OS=Homo sapiens OX=9606 GN=HBB PE=1 SV=2
MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPK
VKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLAHHFG
KEFTPPVQAAYQKVVAGVANALAHKYH
>sp|P69905|HBA_HUMAN Hemoglobin subunit alpha OS=Homo sapiens OX=9606 GN=HBA1 PE=1 SV=2
MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHG
KKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTP
AVHASLDKFLASVSTVLTSKYR
>sp|P02768|ALBU_HUMAN Albumin OS=Homo sapiens OX=9606 GN=ALB PE=1 SV=2
MKWVTFISLLFLFSSAYSRGVFRRDAHKSEVAHRFKDLGEENFKALVLIAFAQYLQQCPF
EDHVKLVNEVTEFAKTCVADESAENCDKSLHTLFGDKLCTVATLRETYGEMADCCAKQEP
ERNECFLQHKDDNPNLPRLVRPEVDVMCTAFHDNEETFLKKYLYEIARRHPYFYAPELLF
FAKRYKAAFTECCQAADKAACLLPKLDELRDEGKASSAKQRLKCASLQKFGERAFKAWAV
ARLSQRFPKAEFAEVSKLVTDLTKVHTECCHGDLLECADDRADLAKYICENQDSISSKLK
ECCEKPLLEKSHCIAEVENDEMPADLPSLAADFVESKDVCKNYAEAKDVFLGMFLYEYAR
RHPDYSVVLLLRLAKTYETTLEKCCAAADPHECYAKVFDEFKPLVEEPQNLIKQNCELFE
QLGEYKFQNALLVRYTKKVPQVSTPTLVEVSRNLGKVGSKCCKHPEAKRMPCAEDYLSVV
LNQLCVLHEKTPVSDRVTKCCTESLVNRRPCFSALEVDETYVPKEFNAETFTFHADICTL
SEKERQIKKQTALVELVKHKPKATKEQLKAVMDDFAAFVEKCCKADDKETCFAEEGKKLV
AASQAALGL`;

    this.setState({
      currentSequence:exampleFasta,
      inputSequenceError: false,
      isValidatedSequence: true,
    })
  }

  handleInput(event) {
    let currentSequence = event.target.value;
    this.sequenceInput(event, currentSequence);
    // if (currentSequence) {
    //   this.sequenceInput(event, currentSequence);
    // }
  }


  sequenceInput(event, seq = null) {
    // let re = /\r\n|\n\r|\n|\r/g;
    // let fasta = event.target.value
    // let input = fasta.replace(re, "\n").split("\n");

    let isValid = true;
    let error = "";
    let s = seq === null ? event.target.value : seq;
    let sequence = s

    if ((sequence.match(/\n>/g) || []).length > 100){
      isValid = false;
      error = "Please input FASTA with less than 100 sequences."
    }


    if (!sequence || !sequence.replace(/[\n\r]/g, '').length || !sequence.replace(/[ \r]/g, '').length) {
      isValid = false;
      error = "Empty input!";
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
                      <Typography component="div" key={"h5"} variant={"h2"}>
                        <Skeleton width="30%" />
                      </Typography>
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
                    href={`data:text/csv;charset=utf-8,${encodeURIComponent(
                      results
                    )}`}
                    download="LazyPair_interaction_predictions.csv"
                    key="Download results"

                  >
                    Download
                  </Button>

                </div>
                <br />
                <div className="buttons has-addons is-grouped is-multiline is-centered">
                  <button
                    className="button are-medium is-outlined is-info is-rounded "
                    onClick={() => this.setState({showResult: !this.state.showResult,})}
                  >
                    Back
                  </button>
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
                placeholder="Paste your protein fasta sequences for predicting interactions."
                onChange={this.handleInput}
                value={this.state.currentSequence}
                disabled={!this.state.sequenceType ? true : false}
                onKeyDown={this.handleKeyDown}
                spellCheck="false"
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
            from our
            <a
              href="https://github.com/Gardner-BinfLab/PPI_Analysis_2022/blob/master/script"
              target="_blank"
              rel="noopener noreferrer"
            >
              &nbsp;GitHub
            </a>.
          </p>

          <p className="help is-success has-text-centered" style={{cursor: "pointer"}} onClick={this.exampleInput}>
            Click here for an example input.
          </p>

          {!this.state.isValidatedSequence ? (
            <p className="help is-warning has-text-centered">
              <span className="icon is-small is-right">
                <i className="fas fa-exclamation-triangle"></i>
              </span>
              {this.state.inputSequenceError}
            </p>
          ) : null}

          <br />
          <div className="buttons has-addons is-grouped is-multiline is-centered">
            <button
              className={
                "button are-medium is-outlined is-info is-rounded " +
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
