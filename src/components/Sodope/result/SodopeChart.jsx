/**
 * @Author: Bikash Kumar Bhandari <bikash>
 * @Date:   2021-04-06T21:07:49+12:00
 * @Filename: SodopeChart.jsx
 * @Last modified by:   bikash
 * @Last modified time: 2021-10-30T08:40:56+13:00
 */



import React, { Component, Fragment } from "react";
import Barplot from "../../Chart/Bar";
import Profile from "../../Chart/Profile";
import ReactGA from "react-ga";
import axios from "axios";
import RazorResults from "../../Razor/result/Result";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import { RazorLink } from "../../EndPoints";

class SodopeChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sequenceType: "Protein",
      showCustomTagInput: false,
      showProfilePlot: false,
      inputSequenceProtein: "",
      isValidatedSequence: true,
      currentInputTag: "",
      showRazorResults: false,
      isServerError: false
    };
    this.showTag = this.showTag.bind(this);
    this.showPlot = this.showPlot.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleChangeSequenceType = this.handleChangeSequenceType.bind(this);
    this.sequenceInput = this.sequenceInput.bind(this);
    this.checkValidProtein = this.checkValidProtein.bind(this);
    this.submitInputRazor = this.submitInputRazor.bind(this);
  }

  showTag() {
    this.setState({
      showCustomTagInput: !this.state.showCustomTagInput
    });
    ReactGA.event({
      category: "SoDoPE results",
      action: "Custom Tag button clicked"
    });
  }

  showPlot() {
    this.setState({
      showProfilePlot: !this.state.showProfilePlot
    });
    ReactGA.event({
      category: "SoDoPE results",
      action: "Profile plot button clicked"
    });
  }

  handleInput(event) {
    let currentTag = event.target.value;
    if (this.state.sequenceType) {
      if (this.state.sequenceType === "Nucleotide") {
        this.sequenceInput(event, currentTag);
      } else {
        this.checkValidProtein(event, currentTag);
      }
    }
  }

  handleChangeSequenceType(event) {
    if (event.target.value) {
      this.setState({
        sequenceType: event.target.value,
        currentInputTag: ""
      });
    }
    ReactGA.event({
      category: "SoDoPE results",
      action: "Custom Tag: " + event.target.value
    });
  }

  translateSequence(seq) {
    let sequence = seq.replace(/U/gi, "T").toUpperCase();
    if (sequence) {
      let codonToAminoAcid = {
        TTT: "F",
        TCT: "S",
        TAT: "Y",
        TGT: "C",
        TTC: "F",
        TCC: "S",
        TAC: "Y",
        TGC: "C",
        TTA: "L",
        TCA: "S",
        TTG: "L",
        TCG: "S",
        TGG: "W",
        CTT: "L",
        CCT: "P",
        CAT: "H",
        CGT: "R",
        CTC: "L",
        CCC: "P",
        CAC: "H",
        CGC: "R",
        CTA: "L",
        CCA: "P",
        CAA: "Q",
        CGA: "R",
        CTG: "L",
        CCG: "P",
        CAG: "Q",
        CGG: "R",
        ATT: "I",
        ACT: "T",
        AAT: "N",
        AGT: "S",
        ATC: "I",
        ACC: "T",
        AAC: "N",
        AGC: "S",
        ATA: "I",
        ACA: "T",
        AAA: "K",
        AGA: "R",
        ATG: "M",
        ACG: "T",
        AAG: "K",
        AGG: "R",
        GTT: "V",
        GCT: "A",
        GAT: "D",
        GGT: "G",
        GTC: "V",
        GCC: "A",
        GAC: "D",
        GGC: "G",
        GTA: "V",
        GCA: "A",
        GAA: "E",
        GGA: "G",
        GTG: "V",
        GCG: "A",
        GAG: "E",
        GGG: "G"
      };

      let codons = sequence.match(/.{1,3}/g);
      codons.pop(); //remove stop codon
      let proteinSeq = codons.map((v, k) => codonToAminoAcid[v]).join("");
      return proteinSeq;
    } else {
      return "";
    }
  }

  sequenceInput(event, seq = null) {
    let isValid = true;
    let error = "";
    let s = seq === null ? event.target.value.replace(/U/gi, "T") : seq;
    let sequence = s.replace(/ /g, "").toUpperCase();

    if (sequence) {
      //check valid sequence
      let filter = /^[ATGCU]*$/;
      let stop = ["TAG", "TGA", "TAA", "UAG", "UGA", "UAA"];
      if (sequence.length < 80000) {
        if (!filter.test(sequence)) {
          isValid = false;
          error = "Ambiguity/unrecognised nucleotide codes.";
        } else {
          if (sequence.length % 3 !== 0) {
            isValid = false;
            error = "Sequence length is not a multiple of 3 (codon).";
          } else {
            let codons = sequence.match(/.{1,3}/g);

            codons.shift();
            codons.pop();

            let common = codons.filter(value => stop.includes(value));
            if (common.length !== 0) {
              isValid = false;
              error = "Early stop codon found.";
            }
          }
        }
      } else {
        isValid = false;
        error = "Sequence length should be less than 80,000 nucleotides.";
      }
    } else {
      isValid = true;
      error = "";
    }

    this.setState({
      currentInputTag: sequence,
      inputSequence: sequence,
      inputSequenceProtein: this.translateSequence(sequence).toUpperCase(),
      inputSequenceError: error,
      isValidatedSequence: isValid
    });
  }

  checkValidProtein(event, seq = null) {
    let s = seq === null ? event.target.value : seq;
    let sequence = s.replace(/ /g, "").toUpperCase();
    let ntreg = /^[ATGCU]*$/;
    let protreg = /^[ACDEFGHIKLMNPQRSTVWY*]*$/;
    let error = "";
    let isValid = true;

    if (!ntreg.test(sequence)) {
      if (sequence.length < 10000) {
        if (!protreg.test(sequence)) {
          isValid = false;
          error = "Ambiguity/unrecognised amino acid codes.";
        } else if ((sequence.match(/\*/g) || []).length > 1) {
          isValid = false;
          error = "Multiple stop characters.";
        } else if (sequence.split("*")[1]) {
          isValid = false;
          error = "* is allowed only at the end.";
        }
      } else {
        isValid = false;
        error = "Sequence length should be less then 10,000 residues.";
      }
    } else {
    }

    this.setState({
      currentInputTag: sequence,
      inputSequence: "",
      inputSequenceProtein: sequence.split("*")[0],
      inputSequenceError: error,
      isValidatedSequence: isValid
    });
  }

  submitInputRazor(event) {
    let sequence = this.props.protein;
    let isValid = true;

    ReactGA.event({
      category: "RAZOR Input Page From SoDoPE",
      action: "Submit button clicked."
    });

    event.preventDefault();
    if (!this.state.result) {
      if (sequence && isValid) {
        const userObject = {
          inputSequenceRazor: sequence, //Protein sequence here
          maxScan: 80
        };
        this.setState({ isSubmitting: true });

        axios
          .post(RazorLink, userObject)
          .then(res => {
            // console.log(res)
            this.setState({
              showRazorResults: true,
              result: res.data,
              isSubmitting: false
            });
            ReactGA.event({
              category: "RAZOR Input Page From SoDoPE",
              action: "Submit button clicked.",
              label: "RAZOR results received."
            });
          })
          .catch(error => {
            this.setState({
              isServerError: true,
              showRazorResults: !this.state.showRazorResults,
              serverError: error,
              isSubmitting: false
            });
            ReactGA.event({
              category: "RAZOR Input Page From SoDoPE",
              action: "Submit button clicked.",
              label: "RAZOR query failed."
            });
          });
      }
    } else {
      this.setState({
        showRazorResults: !this.state.showRazorResults
      });
    }
  }

  render() {
    return (
      <Fragment>
        <br />
        {Math.abs(this.props.region[0] - this.props.region[1]) < 11 ? null : (
          <Fragment>
            <div className="field is-grouped is-grouped-multiline">
              <p className="control">
                <button
                  className="button are-medium button is-rounded is-link"
                  onClick={this.showTag}
                >
                  {this.state.showCustomTagInput
                    ? "Hide solubility tags"
                    : "Add solubility tags"}
                </button>
              </p>

              <p className="control">
                <button
                  className="button are-medium is-primary is-rounded"
                  onClick={this.showPlot}
                >
                  {this.state.showProfilePlot
                    ? "Hide profile plot"
                    : "Show profile plot"}
                </button>
              </p>

              {!this.props.calledFromRazor ? (
                <p className="control">
                  <button
                    className={
                      "button are-medium  is-rounded " +
                      (this.state.isSubmitting ? " is-loading " : null)
                    }
                    onClick={this.submitInputRazor}
                  >
                    {!this.state.showRazorResults
                      ? "Detect signal peptide"
                      : "Hide signal peptide"}
                  </button>
                </p>
              ) : null}
            </div>
            <br />
          </Fragment>
        )}

        {!this.state.showCustomTagInput ? null : (
          <Fragment>
            <div className="field has-addons">
              <p className="control">
                <span className="select is-rounded">
                  <select
                    value={this.state.sequenceType}
                    onChange={this.handleChangeSequenceType}
                  >
                    <option value="Protein">Protein</option>
                    <option value="Nucleotide">Nucleotide</option>
                  </select>
                </span>
              </p>
              <div className="control is-expanded">
                <input
                  autoFocus
                  className="input is-rounded"
                  type="text"
                  placeholder="Custom Tag"
                  onChange={this.handleInput}
                  value={this.state.currentInputTag}
                  disabled={!this.state.sequenceType ? true : false}
                />
              </div>
            </div>

            {!this.state.sequenceType ? (
              <p className="help is-danger has-text-centered">
                <span className="icon is-small is-right">
                  <i className="fas fa-exclamation-triangle"></i>
                </span>
                Please select a sequence type first!
              </p>
            ) : null}

            {!this.state.isValidatedSequence ? (
              <p className="help is-danger has-text-centered">
                <span className="icon is-small is-right">
                  <i className="fas fa-exclamation-triangle"></i>
                </span>
                {this.state.inputSequenceError}
              </p>
            ) : null}


            <div className="columns">
              {this.state.showProfilePlot ? (
                <Fragment>
                  <div className="column has-text-centered is-half">
                    <p className="heading">
                      Comparision of different tags with the selected region
                    </p>
                    <Barplot
                      customTag={this.state.inputSequenceProtein}
                      currentSelectedSequence={
                        this.props.currentSelectedSequence
                      }
                      key={`bar_plot_`}
                    />
                  </div>

                  <div className="column has-text-centered is-half">
                    <p className="heading">
                      Hydrophobicity and Flexibility of the selected region
                    </p>
                    <Profile
                      hydropathy={this.props.hydropathy}
                      flexibilities={this.props.flexibilities}
                      region={this.props.region}
                      key={`profile_plot_`}
                      inputProt={this.state.inputSequenceProtein}
                    />
                  </div>
                </Fragment>
              ) : (
                <div className="column has-text-centered is-full">
                  <p className="heading">
                    Comparision of different tags with the selected region
                  </p>
                  <Barplot
                    customTag={this.state.inputSequenceProtein}
                    currentSelectedSequence={this.props.currentSelectedSequence}
                    key={`bar_plot_1`}
                  />
                </div>
              )}
            </div>
          </Fragment>
        )}

        {this.state.showProfilePlot && !this.state.showCustomTagInput ? (
          <div className="column has-text-centered is-full">
            <p className="heading">
              Hydrophobicity and Flexibility of the selected region
            </p>
            <Profile
              hydropathy={this.props.hydropathy}
              flexibilities={this.props.flexibilities}
              region={this.props.region}
              key={
                `profile_plot_1  ${this.state.inputSequenceProtein.slice(1, 30)}`
              }
            />
          </div>
        ) : null}

        {this.state.isSubmitting ? (
          <Fragment>
            <br />
            <div className="box">
              <Typography variant="h5" gutterBottom>
                Results
              </Typography>
              <article className="media">
                <div className="media-content">
                  <div className="content">
                    <Skeleton variant="rect" height={220} />
                    <hr />
                  </div>

                  <Skeleton animation={false} />
                  <Typography component="div" key={"h2"} variant={"h2"}>
                    <Skeleton />
                  </Typography>
                  <hr />
                  <Typography component="div" key={"h5"} variant={"h2"}>
                    <Skeleton width="30%" />
                  </Typography>
                </div>
              </article>
            </div>
          </Fragment>
        ) : !this.state.showRazorResults ? null : (
          <Fragment>
          <hr />
            {this.state.isServerError ? (
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
                        problems for example: non standard residues. This might
                        also happen if our server is too busy or is undergoing
                        maintenence or you are having network issues! You can
                        refresh the page and try again. If the error persists,
                        please report it on our GitHub!
                      </small>
                    </div>
                  </div>
                </div>
                <hr />
              </Fragment>
            ) : (
              <RazorResults
                data={this.state.result}
                protein={this.props.protein}
                nucleotide={this.props.nucleotide}
                calledFromRazor={this.props.calledFromRazor}
                key={"new-razor-from-sodope"}
              />
            )}
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default SodopeChart;
