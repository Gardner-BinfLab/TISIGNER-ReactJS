import React, { Component, Fragment } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
// import Avatar from "@material-ui/core/Avatar";
import Rating from "@material-ui/lab/Rating";
import RazorLine from "../../Chart/RazorLine";
import Input from "../../Tisigner/Input";
import ReactGA from "react-ga";

import SodopeResults from "../../Sodope/result/Result";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";

const styles = {
  paper: {
    padding: "20px",
  },
  popover: {
    pointerEvents: "none",
  },
};

class RazorResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullResults: false,
      convertClicked: true,
      isShowOptimisation: false,
      sequenceToShow: "",
      sodopeResults: "",
      Razor_solubility: false, //show or hide solubility results
    };
    // this.getMaxCleavageProb = this.getMaxCleavageProb.bind(this);
    this.showFullResults = this.showFullResults.bind(this);
    this.hmmScan = this.hmmScan.bind(this);
    this.convertSequence = this.convertSequence.bind(this);
    this.convertSequenceButton = this.convertSequenceButton.bind(this);
    this.toggleOptimisation = this.toggleOptimisation.bind(this);
  }

  showFullResults() {
    this.setState({
      fullResults: !this.state.fullResults,
    });
  }

  // getMaxCleavageProb(data, type) {
  //   let preds = data.predictions;
  //   // let cleavageSites = data.cleavage_sites
  //   let probs_c = data.c_score;
  //   let probs_s = data.y_score;
  //   // let cleavage = data.cleavage

  //   // Position of picked cleavage site inside all
  //   // predictions where SP is true
  //   let pos = preds.map((e, i) => (e === true ? i : "")).filter(String);
  //   // Pick respective probability
  //   let allProbs = [];
  //   if (type === "signal") {
  //     pos.forEach(function(val, index) {
  //       allProbs.push(probs_s[val]);
  //     });
  //   } else {
  //     pos.forEach(function(val, index) {
  //       allProbs.push(probs_c[val]);
  //     });
  //   }
  //   return Math.max(...allProbs);
  // }

  toggleOptimisation(event) {
    this.setState(
      {
        isShowOptimisation: !this.state.isShowOptimisation,
      },
      () =>
        ReactGA.event({
          category: "Razor results",
          action: "Optimisation form shown: " + this.state.isShowOptimisation,
        })
    );
  }

  convertSequence() {
    let currentProtein = this.state.currentSelectedSequence;
    let nucleotide = this.props.nucleotide;
    let currentSlider = this.state.sliderValue;
    let currentNucleotide = !nucleotide
      ? null
      : nucleotide.substring((currentSlider[0] - 1) * 3, currentSlider[1] * 3);

    this.setState({
      sequenceToShow: !nucleotide
        ? currentProtein
        : this.state.convertClicked
        ? currentProtein
        : currentNucleotide,
      hasNucleotide: !nucleotide ? false : true,
      avatarLetter: !nucleotide ? "P" : this.state.convertClicked ? "P" : "N",
      currentNucleotide: currentNucleotide,
    });
  }

  convertSequenceButton(event) {
    this.setState(
      {
        convertClicked: !this.state.convertClicked,
      },
      () => this.convertSequence()
    );
    ReactGA.event({
      category: "Razor results",
      action: "View Nucleotide/Protein button clicked.",
    });
  }

  updateDimensions = () => {
    this.setState({
      width: this.domainsRef.current ? this.domainsRef.current.offsetWidth : 0,
    });
  };

  componentDidMount() {
    // window.addEventListener("resize", this.updateDimensions);
    // this.setState({
    //   width: this.domainsRef.current ? this.domainsRef.current.offsetWidth : 0,
    //   sequenceToShow: this.props.protein
    // });
    // this.computeProperties(this.state.sliderValue);
    ReactGA.event({
      category: "Razor results",
      action: "Razor results shown.",
    });
  }

  componentDidUpdate(prevState) {
    // window.addEventListener('resize', this.updateDimensions)
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  hmmScan(event) {
    event.persist(); // because setState is async and event gets null by the time we set a new state

    const userObject = {
      seq: this.props.protein, //Protein sequence here
      hmmdb: "pfam",
    };

    ReactGA.event({
      category: "Razor Result Page",
      action: "Analyse solubility button clicked.",
    });

    event.preventDefault();
    this.setState({
      [event.target.name + "isSubmitting"]: true,
      Razor_solubility: !this.state.Razor_solubility,
    });
    !this.state.sodopeResults
      ? axios
          .post("https://www.ebi.ac.uk/Tools/hmmer/search/hmmscan", userObject)
          .then((res) => {
            // console.log(res)
            this.setState({
              sodopeResults: res.data,
              [event.target.name + "isSubmitting"]: false,
            });
            ReactGA.event({
              category: "Razor Result Page",
              action: "Analyse solubility: ",
              label: "HMMER results received.",
            });
          })
          .catch((error) => {
            this.setState({
              isServerError: true,
              serverError: error,
              [event.target.name + "isSubmitting"]: false,
            });
            ReactGA.event({
              category: "Razor Result Page",
              action: "Analyse solubility: ",
              label: "HMMER query failed.",
            });
            // console.log(error); //error message
            // console.log(error.response.status); //error status
            // console.log(error.response.headers); //error header
          })
      : this.setState({ [event.target.name + "isSubmitting"]: false });
  }

  render() {
    let data = this.props.data;

    function createData(name, model1, model2, model3, model4, model5, Median) {
      return { name, model1, model2, model3, model4, model5, Median };
    }

    const rows = [
      createData(
        "Signal peptide prediction",
        data.predictions[0] === true
          ? `Yes (${data.y_score[0]})`
          : `No  (${data.y_score[0]})`,
        data.predictions[1] === true
          ? `Yes (${data.y_score[1]})`
          : `No  (${data.y_score[1]})`,
        data.predictions[2] === true
          ? `Yes (${data.y_score[2]})`
          : `No  (${data.y_score[2]})`,
        data.predictions[3] === true
          ? `Yes (${data.y_score[3]})`
          : `No  (${data.y_score[3]})`,
        data.predictions[4] === true
          ? `Yes (${data.y_score[4]})`
          : `No  (${data.y_score[4]})`,
        data.final_score_sp
      ),

      createData(
        "Toxin prediction",
        data.toxin_preds[0] === true
          ? `Yes (${data.toxin_scores[0]})`
          : `No  (${data.toxin_scores[0]})`,
        data.toxin_preds[1] === true
          ? `Yes (${data.toxin_scores[1]})`
          : `No  (${data.toxin_scores[1]})`,
        data.toxin_preds[2] === true
          ? `Yes (${data.toxin_scores[2]})`
          : `No  (${data.toxin_scores[2]})`,
        data.toxin_preds[3] === true
          ? `Yes (${data.toxin_scores[3]})`
          : `No  (${data.toxin_scores[3]})`,
        data.toxin_preds[4] === true
          ? `Yes (${data.toxin_scores[4]})`
          : `No  (${data.toxin_scores[4]})`,
        data.final_score_toxin
      ),

      createData(
        "Fungi prediction",
        data.fungi_preds[0] === true
          ? `Yes (${data.fungi_scores[0]})`
          : `No  (${data.fungi_scores[0]})`,
        data.fungi_preds[1] === true
          ? `Yes (${data.fungi_scores[1]})`
          : `No  (${data.fungi_scores[1]})`,
        data.fungi_preds[2] === true
          ? `Yes (${data.fungi_scores[2]})`
          : `No  (${data.fungi_scores[2]})`,
        data.fungi_preds[3] === true
          ? `Yes (${data.fungi_scores[3]})`
          : `No  (${data.fungi_scores[3]})`,
        data.fungi_preds[4] === true
          ? `Yes (${data.fungi_scores[4]})`
          : `No  (${data.fungi_scores[4]})`,
        data.final_score_fungi
      ),
    ];

    if (this.state.isShowOptimisation) {
      return (
        <Fragment>
          <div className="field has-addons">
            <p className="control">
              <button
                className="button is-rounded"
                onClick={this.toggleOptimisation}
              >
                <span className="icon is-small">
                  <i className="fa fa-backward"></i>
                </span>
                <span>
                  {this.state.isShowOptimisation ? "SoDoPE results" : ""}
                </span>
              </button>
            </p>
          </div>

          {/* Input for TIsigner */}
          <Input
            inputSequenceSodope={
              (this.state.currentNucleotide.substr(0, 3) === "ATG"
                ? ""
                : "ATG") +
              this.state.currentNucleotide +
              (["TAG", "TAA", "TGA"].includes(
                this.state.currentNucleotide.length - 3,
                this.state.currentNucleotide.length
              )
                ? ""
                : "TAG")
            }
            calledFromRazor={true}
          />
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          {!data.all_probs ? null : (
            <Fragment>
              {!data.all_probs || !data.hasOwnProperty("all_probs") ? (
                <Fragment>
                  <div className="card">
                    <header className="card-header">
                      <p className="card-header-title">
                        Error: We were unable to scan this sequence.
                      </p>
                    </header>
                    <div className="card-content has-text-danger">
                      <div className="content">
                        <small>
                          This might happen if your input sequence has some
                          problems for example: non standard residues. This
                          might also happen if our server is too busy or is
                          undergoing maintenence or you are having network
                          issues! You can refresh the page and try again. If the
                          error persists, please report it on our GitHub!
                        </small>
                      </div>
                    </div>
                  </div>
                  <hr />
                </Fragment>
              ) : null}
            </Fragment>
          )}

          <Fragment>
            <div className="column has-text-centered is-full">
              <p className="heading">C-scores along the sequence</p>
              <RazorLine
                data={data}
                inputProt={this.props.protein}
                key={"razor_plot_1" + this.props.protein.slice(1, 30)}
              />
            </div>

            <hr />
            <nav className="level">
              <div className="level-item has-text-centered">
                <div>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title="Votes of 5 models."
                    placement="top"
                    arrow
                  >
                    <p className="heading">Signal Peptide</p>
                  </Tooltip>
                  <p className="title">
                    <Rating
                      name="signal-peptide-rating"
                      value={data.predictions.filter((x) => x === true).length}
                      readOnly
                    />
                  </p>
                </div>
              </div>

              {data.toxin_preds.filter((x) => x === true).length ===
              0 ? null : (
                <Fragment>
                  <div className="level-item has-text-centered">
                    <div>
                      <p className="heading">Toxin</p>
                      <p className="title">
                        <Rating
                          name="signal-peptide-rating"
                          value={
                            data.toxin_preds.filter((x) => x === true).length
                          }
                          readOnly
                        />
                      </p>
                    </div>
                  </div>
                </Fragment>
              )}

              {data.fungi_preds.filter((x) => x === true).length ===
              0 ? null : (
                <Fragment>
                  <div className="level-item has-text-centered">
                    <div>
                      <p className="heading">Fungi</p>
                      <p className="title">
                        <Rating
                          name="signal-peptide-rating"
                          value={
                            data.fungi_preds.filter((x) => x === true).length
                          }
                          readOnly
                        />
                      </p>
                    </div>
                  </div>
                </Fragment>
              )}

              <div className="level-item has-text-centered">
                <div>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title="The median of Y scores of 5 models."
                    placement="top"
                    arrow
                  >
                    <p className="heading">Signal peptide score</p>
                  </Tooltip>
                  <p className="title">
                    {
                      // this.getMaxCleavageProb(data, 'signal')
                      data.final_score_sp
                    }
                  </p>
                </div>
              </div>

              {data.predictions.filter((x) => x === true).length ===
              0 ? null : (
                <Fragment>
                  <div className="level-item has-text-centered">
                    <div>
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        title="The median of max C scores of 5 models."
                        placement="top"
                        arrow
                      >
                        <p className="heading">Region</p>
                      </Tooltip>
                      <p className="title">
                        {data.cleavage === 0 ? "-" : "1-" + data.cleavage}
                      </p>
                    </div>
                  </div>

                  <div className="level-item has-text-centered">
                    <div>
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        title="The median of max C scores of 5 models."
                        placement="top"
                        arrow
                      >
                        <p className="heading">Cleavage site score</p>
                      </Tooltip>
                      <p className="title">
                        {
                          // this.getMaxCleavageProb(data, 'cleavage')
                          data.final_cleavage_prob
                        }
                      </p>
                    </div>
                  </div>
                </Fragment>
              )}
            </nav>

            <hr />

            <div className="field is-grouped is-grouped-multiline">
              <p className="control">
                <button
                  className="button are-medium button is-rounded is-link"
                  onClick={this.showFullResults}
                >
                  {this.state.fullResults
                    ? "Hide full results"
                    : "Full results"}
                </button>
              </p>

              {!this.props.calledFromRazor ? null : (
                <Fragment>
                  <p className="control">
                    <button
                      // className="button are-medium is-primary is-rounded"
                      className={`button is-rounded ${
                        this.state["SoDoPE_inside_Razor" + "isSubmitting"] &&
                        !this.state.isServerError
                          ? " is-loading "
                          : null
                      }`}
                      name="SoDoPE_inside_Razor"
                      onClick={this.hmmScan}
                    >
                      {this.props.nucleotide === ""
                        ? "Optimise solubility "
                        : "Optimise solubility and expression"}
                    </button>
                  </p>
                </Fragment>
              )}
            </div>

            {this.state.fullResults ? (
              <Fragment>
                <TableContainer component={Paper}>
                  <Table aria-label="full results">
                    <TableHead>
                      <TableRow>
                        <TableCell>Results</TableCell>
                        <TableCell align="right">Model 1</TableCell>
                        <TableCell align="right">Model 2</TableCell>
                        <TableCell align="right">Model 3</TableCell>
                        <TableCell align="right">Model 4</TableCell>
                        <TableCell align="right">Model 5</TableCell>
                        <TableCell align="right">Median</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.name}>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.model1}</TableCell>
                          <TableCell align="right">{row.model2}</TableCell>
                          <TableCell align="right">{row.model3}</TableCell>
                          <TableCell align="right">{row.model4}</TableCell>
                          <TableCell align="right">{row.model5}</TableCell>
                          <TableCell align="right">{row.Median}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Fragment>
            ) : null}
            <br />
          </Fragment>

          {this.state["Razor_solubility"] ? (
            <Fragment>
              <hr />
              {!this.state.sodopeResults && !this.state.isServerError ? (
                <Fragment>
                  <div className="card">
                    <header className="card-header">
                      <p className="card-header-title has-text-info">
                        Loading domains...
                      </p>
                    </header>
                    <div className="card-content">
                      <div className="content">
                        <small>
                          We are now querying{" "}
                          <a
                            href="https://www.ebi.ac.uk/Tools/hmmer/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            HMMER
                          </a>{" "}
                          for domain annotations. You can use the slider to
                          explore the sequence or wait till the domains load.
                        </small>
                      </div>
                    </div>
                  </div>
                  <br />
                </Fragment>
              ) : !this.state.isServerError ? null : (
                <Fragment>
                  <div className="card">
                    <header className="card-header">
                      <p className="card-header-title has-text-danger">
                        Error: Network.
                      </p>
                    </header>
                    <div className="card-content">
                      <div className="content">
                        <small>
                          This happens when HMMER webserver is either too busy
                          or is undergoing maintenence or you are having network
                          issues! You can use the slider to explore the
                          sequence.
                        </small>
                      </div>
                    </div>
                  </div>
                  <br />
                </Fragment>
              )}

              <SodopeResults
                data={this.state.sodopeResults}
                protein={this.props.protein}
                nucleotide={this.props.nucleotide}
                key={"Razor_solubility"}
                calledFromRazor={true}
                calledFromSodope={true}
              />
            </Fragment>
          ) : null}
        </Fragment>
      );
    }
  }
}

export default withStyles(styles)(RazorResults);
