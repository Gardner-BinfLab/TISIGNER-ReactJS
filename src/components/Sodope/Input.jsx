/**
 * @Author: Bikash Kumar Bhandari <bikash>
 * @Date:   2021-04-06T21:07:49+12:00
 * @Filename: Input.jsx
 * @Last modified by:   bikash
 * @Last modified time: 2021-10-30T08:40:45+13:00
 */

import React, { Component, Fragment } from "react";
import axios from "axios";
import SodopeResults from "./result/Result";
import ReactGA from "react-ga";
import {
  demoSodope,
  defaultProteinSodope,
  defaultNucleotideSodope,
} from "./Utils/Utils";

class SodopeInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sequenceType: "Nucleotide",
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
    this.handleChangeSequenceType = this.handleChangeSequenceType.bind(this);
    this.sequenceInput = this.sequenceInput.bind(this);
    this.checkValidProtein = this.checkValidProtein.bind(this);
    this.example = this.example.bind(this);
    this.submitInput = this.submitInput.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      this.submitInput(event);
    }
  };

  handleChangeSequenceType(event) {
    if (event.target.value) {
      this.setState({
        sequenceType: event.target.value,
        currentInputSequence: "",
        inputSequenceProtein: "",
        inputSequenceNucleotide: "",
        inputSequenceError: "",
        isValidatedSequence: true
      });
      ReactGA.event({
        category: "SoDoPE sequence type selection",
        action: "Type: " + event.target.value,
      });
    }
  }

  handleInput(event) {
    let currentSequence = event.target.value;
    if (this.state.sequenceType) {
      if (this.state.sequenceType === "Nucleotide") {
        this.sequenceInput(event, currentSequence);
      } else {
        this.checkValidProtein(event, currentSequence);
      }
    }
  }

  example(event) {
    let exampleProtein = defaultProteinSodope();
    let exampleNucleotide = defaultNucleotideSodope();
    if (this.state.sequenceType === "Nucleotide") {
      this.setState({
        currentInputSequence: exampleNucleotide,
        inputSequenceNucleotide: exampleNucleotide,
        inputSequenceProtein:
          this.translateSequence(exampleNucleotide).toUpperCase(),
        inputSequenceError: "",
        isValidatedSequence: true,
      });
    } else {
      this.setState({
        sequenceType: "Protein",
        currentInputSequence: exampleProtein,
        inputSequenceNucleotide: "",
        inputSequenceProtein: exampleProtein,
        inputSequenceError: "",
        isValidatedSequence: true,
      });
    }

    ReactGA.event({
      category: "SoDoPE example",
      action: "SoDoPE example button clicked.",
    });
  }

  showDemo = () => {
    let data = demoSodope();
    let seq = defaultNucleotideSodope();
    this.setState({
      showResult: true,
      result: data,
      isSubmitting: false,
      currentInputSequence: seq,
      inputSequenceNucleotide: seq,
      inputSequenceProtein: this.translateSequence(seq).toUpperCase(),
      sequenceType: "Nucleotide",
    });
    ReactGA.event({
      category: "SoDoPE demo",
      action: "SoDoPE demo button clicked.",
    });
  };

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
        GGG: "G",
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
    // let re = /\r\n|\n\r|\n|\r/g;
    // let fasta = event.target.value
    // let input = fasta.replace(re, "\n").split("\n");

    let isValid = true;
    let error = "";
    let s = seq === null ? event.target.value : seq;
    let sequence = s.replace(/ /g, "").replace(/U/gi, "T").toUpperCase();
    //check valid fasta
    // if (input[0][0] == ">") {
    //     input.shift()
    //     let seq = input.join('').toUpperCase();
    //     console.log(input, fasta, seq)
    //     if (seq.split('>').length >= 2) {
    //       isValid = false
    //       error = "Multi-fasta not supported."
    //     }
    // } else {
    //     sequence = input.join('').replace(/U/gi, 'T').toUpperCase();
    // }

    if (sequence) {
      //check valid sequence
      let filter = /^[ATGCU]*$/;
      let stop = ["TAG", "TGA", "TAA", "UAG", "UGA", "UAA"];
      if (75 < sequence.length && sequence.length < 15000) {
        if (!filter.test(sequence)) {
          isValid = false;
          error = "Ambiguity/unrecognised nucleotide codes.";
        } else {
          // console.log(sequence, 'filter test pass')
          if (sequence.length % 3 !== 0) {
            isValid = false;
            error = "Sequence length is not a multiple of 3 (codon).";
          } else {
            let codons = sequence.match(/.{1,3}/g);
            if (codons[0] !== "ATG") {
              isValid = false;
              error = "ATG/AUG start codon is absent.";
            } else if (!stop.includes(codons[codons.length - 1])) {
              isValid = false;
              error = "Stop codon is absent.";
            } else {
              codons.shift();
              codons.pop();
              let common = codons.filter((value) => stop.includes(value));
              if (common.length !== 0) {
                isValid = false;
                error = "Early stop codon found.";
              }
            }
            //   codons.shift();
            //   if (stop.includes(codons[codons.length - 1])) {
            //     codons.pop(); //remove stop codon
            //   }
            // }
            // let common = codons.filter(value => stop.includes(value));
            // if (common.length !== 0) {
            //   isValid = false;
            //   error = "Early stop codon found.";
            // }
          }
        }
      } else {
        isValid = false;
        error = "Sequence length should be 75 to 80,000 nucleotides.";
      }
    } else {
      isValid = true;
      error = "";
    }

    this.setState({
      currentInputSequence: sequence,
      inputSequenceNucleotide: sequence,
      inputSequenceProtein: this.translateSequence(sequence).toUpperCase(),
      inputSequenceError: error,
      isValidatedSequence: isValid,
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
      if (25 < sequence.length && sequence.length < 5000) {
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
        /* else if (seq[0] != 'M') {
                   throw "Sequence did not start with Methionine."
                 } */
      } else {
        isValid = false;
        error =
          "Sequence length should be greater than 25 and less then 10,000 residues.";
      }
    } else if (sequence.length !== 0) {
      isValid = false;
      error =
        "Looks like a nucleotide sequenece. Please upload a protein sequence or change the type to Nucleotide.";
    }

    this.setState({
      currentInputSequence: sequence,
      inputSequenceNucleotide: "",
      inputSequenceProtein: sequence.split("*")[0],
      inputSequenceError: error,
      isValidatedSequence: isValid,
    });
  }

pollJobStatus = (jobId) => {
  axios
    .get(`https://www.ebi.ac.uk/Tools/hmmer/api/v1/result/${jobId}`)
    .then((resultRes) => {
      if (resultRes.data.status === 'SUCCESS') {
        let jsondata = resultRes.data
        jsondata.result.uuid = jobId
        this.setState({
          showResult: true,
          result: jsondata,
          isSubmitting: false,
        });
        ReactGA.event({
          category: "SoDoPE Input Page",
          action: "Submit button clicked.",
          label: "HMMER results received.",
        });
      } else {
        setTimeout(() => this.pollJobStatus(jobId), 5000); // Poll every 5 seconds
      }
    })
    .catch((error) => {
      this.setState({
        isServerError: true,
        serverError: error,
        isSubmitting: false,
      });
      ReactGA.event({
        category: "SoDoPE Input Page",
        action: "Submit button clicked.",
        label: "HMMER query failed.",
      });
    });
};


  submitInput(event) {
    let sequence = this.state.inputSequenceProtein;
    let isValid = this.state.isValidatedSequence;

    ReactGA.event({
      category: "SoDoPE Input Page",
      action: "Submit button clicked.",
    });

    event.preventDefault();
    if (sequence && isValid) {
      const userObject = {
        input: ">test\n" + sequence, //Protein sequence here
        database: "pfam",
      };
      this.setState({ isSubmitting: true, showResult: true });

      axios
        .post("https://www.ebi.ac.uk/Tools/hmmer/api/v1/search/hmmscan", userObject)
          .then((res) => {
            // console.log(res)
            const jobId = res.data.id; // Assuming the job ID is in the response data
            this.pollJobStatus(jobId);
        })
        .catch((error) => {
          this.setState({
            isServerError: true,
            serverError: error,
            isSubmitting: false,
          });
          ReactGA.event({
            category: "SoDoPE Input Page",
            action: "Submit button clicked.",
            label: "HMMER query failed.",
          });
        });
    }
  }

  render() {
    if (this.state.showResult) {
      return (
        <Fragment key="sodope_result">
          <section
            className="hero is-fullheight"
            style={{
              backgroundImage: "linear-gradient(to right, #1a2b32, #355664)",
            }}
          >
            <div className="hero-body">
              <div className="container is-fluid is-paddingless">
                <div className="box">
                  {this.state.isSubmitting ? (
                    this.state.isServerError ? null : (
                      <Fragment>
                        <br />
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
                                for domain annotations. You can use the slider
                                to explore the sequence or wait till the domains
                                load.
                              </small>
                            </div>
                          </div>
                        </div>
                        <br />
                      </Fragment>
                    )
                  ) : null}
                  {this.state.isServerError ? (
                    <Fragment>
                      <div className="card">
                        <header className="card-header">
                          <p className="card-header-title has-text-danger">
                            Error:{" "}
                            {this.state.serverError.response ? (
                              <>
                                {this.state.serverError.response.status
                                  ? this.state.serverError.response.status
                                  : "Network"}{" "}
                                {this.state.serverError.response.statusText
                                  ? "| " +
                                    this.state.serverError.response.statusText
                                  : ""}
                              </>
                            ) : null}
                          </p>
                          <p className="card-header-title has-text-danger"></p>
                        </header>
                        <div className="card-content">
                          <div className="content">
                            <small>
                              {this.state.serverError.response ? (
                                <>
                                  {this.state.serverError.response.data.seq[0]
                                    ? this.state.serverError.response.data
                                        .seq[0]
                                    : "This happens when HMMER webserver is either too busy or is undergoing maintenence or you are having network issues! You can use the slider to explore the sequence."}{" "}
                                </>
                              ) : (
                                "This happens when HMMER webserver is not responding in the way we expect! We are working on fixing this. In the meantime, you can use the slider to explore the sequence."
                              )}
                            </small>
                          </div>
                        </div>
                      </div>
                      <br />
                    </Fragment>
                  ) : null}
                  <SodopeResults
                    data={this.state.result}
                    protein={this.state.inputSequenceProtein}
                    nucleotide={this.state.inputSequenceNucleotide}
                    calledFromSodope={true}
                    isServerError={this.state.isServerError}
                    serverError={this.state.serverError}
                    key={"new-sodope"}
                  />
                </div>
              </div>
            </div>
          </section>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <div className="field has-addons">
            <p className="control">
              <span className="select is-rounded">
                <select
                  value={this.state.sequenceType}
                  onChange={this.handleChangeSequenceType}
                >
                  <option value="Nucleotide">Nucleotide</option>
                  <option value="Protein">Protein</option>
                </select>
              </span>
            </p>
            <div className="control is-expanded">
              <input
                autoFocus
                className="input is-rounded"
                type="text"
                placeholder="Enter a sequence to optimise solubility."
                onChange={this.handleInput}
                value={this.state.currentInputSequence}
                disabled={!this.state.sequenceType ? true : false}
                onKeyDown={this.handleKeyDown}
              />
            </div>
            <div className="control">
              <button
                className={
                  "button is-info is-rounded " +
                  (this.state.isSubmitting ? " is-loading " : null)
                }
                onClick={this.submitInput}
              >
                Submit
              </button>
            </div>
          </div>

          {!this.state.sequenceType ? (
            <p className="help is-success has-text-centered">
              <span className="icon is-small is-right">
                <i className="fas fa-info-circle"></i>
              </span>
              Please select a sequence type first!
            </p>
          ) : null}

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
              className="button are-medium is-info is-outlined is-rounded"
              onClick={this.example}
            >
              Demo{" "}
              {this.state.sequenceType === "Nucleotide"
                ? "nucleotide"
                : "protein"}
            </button>
            <button
              className="button are-medium is-primary is-outlined is-rounded"
              onClick={this.showDemo}
            >
              Demo results
            </button>
          </div>
        </Fragment>
      );
    }
  }
}

export default SodopeInput;
