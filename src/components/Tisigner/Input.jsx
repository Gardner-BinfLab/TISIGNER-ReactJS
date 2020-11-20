import React, { Component, Fragment } from "react";
import Customise from "./Customise";
import axios from "axios";
import TisignerResult from "./result/TisignerResult";
import Error from "../Error/Error";
import { demoTisigner, defaultNucleotideTIsigner } from "../Sodope/Utils/Utils";
import ReactGA from "react-ga";
import Typography from "@material-ui/core/Typography";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import Skeleton from "@material-ui/lab/Skeleton";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import {TIsignerLink} from "../EndPoints";

const style = {
  margin: 0,
  top: "auto",
  right: 40,
  bottom: 40,
  left: "auto",
  position: "fixed",
};

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowCustomise: false,
      inputSequence: "",
      inputSequenceProtein: "",
      host: "Escherichia coli",
      promoter: "T7",
      targetExpression: 100,
      substitutionMode: "transInit",
      numberOfCodons: 9,
      optimisationDirection: "increase-accessibility",
      isValidatedSequence: false,
      customPromoter: "",
      customRestriction: "",
      samplingMethod: "quick",
      terminatorCheck: true,
      customRegion: "",
      randomSeed: 0,
      inputSequenceError: "",
      customPromoterError: "",
      customRestrictionError: "",
      randomSeedError: "",
      customRegionError: "",
      isSubmitting: false,
      showResult: false,
      result: "",
      isServerError: false,
      serverError: "",
      fabOpen: false,
      actions: [
        { icon: <i className="far fa-file-pdf"></i>, name: "PDF" },
        { icon: <i className="fas fa-file"></i>, name: "CSV" },
      ],
    };
    this.toggleCustomise = this.toggleCustomise.bind(this);
    this.sequenceInput = this.sequenceInput.bind(this);
    this.submitInput = this.submitInput.bind(this);
    this.example = this.example.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      this.submitInput(event);
    }
  };

  saveAsPdf = () => {
    const pdfConverter = require("jspdf");
    const pdf = new pdfConverter("p", "mm", "a4");

    var elementHandler = {
      "#ignorePDF": function (element, renderer) {
        return true;
      },
    };

    let logo =
      "data:image/png;base64,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";
    //Banner
    pdf.setTextColor(150);
    let today = new Date();
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + " " + time;
    let msg = "TIsigner report generated at: " + dateTime + "\n";
    let info = "Bold nucleotides represent mismatches. \n ";
    let url = "https://tisigner.otago.ac.nz";
    let hr =
      "\n_____________________________________________________________\n";
    let inputParams =
      "\nHost: " +
      this.state.userObject.host +
      "\n" +
      "Promoter: " +
      this.state.userObject.promoter +
      "\n" +
      (this.state.userObject.promoter !== "T7"
        ? "Custom Promoter: " +
          this.state.userObject.customPromoter.replace(
            /(.{50})/g,
            "$1\n\t\t\t"
          ) +
          "\n"
        : "") +
      (this.state.userObject.promoter === "T7" &&
      this.state.userObject.host === "Escherichia coli"
        ? "Target Expression: " + this.state.userObject.targetExpression + "\n"
        : "Optimisation type: " +
          this.state.userObject.optimisationDirection +
          "\n") +
      "Substitution Mode: " +
      (this.state.userObject.substitutionMode === "transInit"
        ? "Translation Initiation Region\n"
        : "Full Sequence\n") +
      (this.state.userObject.substitutionMode === "transInit"
        ? "Number of Codons to substitute: " +
          this.state.userObject.numberOfCodons +
          "\n"
        : "") +
      "Custom RMS sites: " +
      this.state.userObject.customRestriction +
      "\n" +
      "Check Terminator: " +
      this.state.userObject.terminatorCheck +
      "\n" +
      "Custom Region to optimise accessibility: " +
      this.state.userObject.customRegion +
      "\n" +
      "Random Seed: " +
      this.state.userObject.randomSeed +
      "\n";

    pdf.setProperties({
      title: "TIsigner Results",
      subject: "Optimised sequences from TIsigner",
      author: "TIsigner",
      keywords: "optimisation, gene, solubility, accessibility, protein",
      creator: "https://tisigner.otago.ac.nz",
    });

    pdf.addImage(logo, "PNG", 30, 4);

    pdf.text(pdf.internal.pageSize.width / 2, 10, msg + hr, {
      align: "center",
      // rotationDirection: 0,
      // angle:90,
    });

    pdf.setFont("courier");
    pdf.setFontSize(9);
    pdf.text(pdf.internal.pageSize.width / 2, 14, info, {
      align: "center",
    });

    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 255);
    pdf.textWithLink(url, pdf.internal.pageSize.width / 2 - 30, 18, {
      align: "center",
      url: url,
    });

    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica");
    pdf.setFontSize(16);
    pdf.text(10, 35, "Input parameters: ");
    pdf.setFontSize(12);
    pdf.text(10, 40, inputParams);

    pdf.text(
      pdf.internal.pageSize.width / 2,
      Math.round(this.state.userObject.customPromoter.length / 50) * 5 + 100,
      hr,
      {
        align: "center",
      }
    );

    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica");
    pdf.setFontSize(16);
    pdf.text(
      10,
      Math.round(this.state.userObject.customPromoter.length / 50) * 5 + 120,
      "Results: "
    );

    pdf.fromHTML(
      document.getElementById("tisignerResultPdf"),
      10,
      Math.round(this.state.userObject.customPromoter.length / 50) * 5 + 130,
      {
        width: 155,
        elementHandlers: elementHandler,
      }
    );
    pdf.save("results_TIsigner.pdf");

    ReactGA.event({
      category: "TIsigner PDF results",
      action: "TIsigner PDF button clicked and results generated.",
    });
  };

  saveasCSV = () => {
    //First loop through data to get all values
    let data = this.state.result;
    let colnames = [
      "",
      "Type",
      "Sequence",
      "Accessibility",
      "Expression score",
      "Terminator Hits",
      "E-value",
      "\n",
    ];

    Object.entries(data).forEach(([key, value]) => {
      value.forEach(function (item, index) {
        colnames.push(key); //Pushes type: Input, Optimised or Selected
        Object.entries(item).forEach((v, k) => {
          //For each type loop to get sequences and other info
          if (String(v[1]).includes("<mark>")) {
            colnames.push(v[1].replace(/<\/?[^>]+(>|$)/g, ""));
            //remove tags
          } else if (v[1] === null) {
            colnames.push("NaN");
          } else {
            colnames.push(v[1]);
          }
        });
        colnames.push("\n");
      });
    });

    var link = window.document.createElement("a");
    link.setAttribute(
      "href",
      "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(colnames)
    );
    link.setAttribute("download", "results_TIsigner.csv");
    link.click();
  };

  example(event) {
    let exSeq =
      "ATGAAGAAGAGTTTGAGTGTGTCGGGGCCAGGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTG" +
      "CAGCGATGTCACGCGCCCGTATTTCCGTGGTGCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTT" +
      "CTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAATGCAGGAAGAGTTCTACCTGGAAACCTCT" +
      "GAGGATCATAAACACAAGGAGGAAGATCATGACGGAGCTCGCCTCGAGGGAGGACTATCTATCTATCTAT" +
      "CTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTT" +
      "CTAG";
    this.sequenceInput(event, exSeq);

    ReactGA.event({
      category: "TIsigner Example",
      action: "TIsigner example clicked.",
    });
  }

  toggleCustomise() {
    this.setState({
      isShowCustomise: !this.state.isShowCustomise,
    });
    ReactGA.event({
      category: "TIsigner Customise",
      action: "TIsigner customisation/settings clicked.",
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
      if (75 < sequence.length && sequence.length < 80000) {
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
              //allow even if start codon is absent
              isValid = false;
              error =
                "ATG/AUG start codon is absent. Please make sure that this is a coding sequence that has an initiation codon.";
            }
            if (!stop.includes(codons[codons.length - 1])) {
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
          }
        }
      } else {
        isValid = false;
        error = "Sequence length should be 75 to 80,000 nucleotides.";
      }
    } else {
      isValid = false;
      error = "The input sequence should be longer than 75 nucleotides.";
    }

    this.setState({
      inputSequence: sequence,
      inputSequenceProtein: this.translateSequence(sequence),
      inputSequenceError: error,
      isValidatedSequence: isValid,
    });
  }

  componentDidMount() {
    localStorage.setItem("host", JSON.stringify(this.state.host));

    localStorage.setItem("promoter", JSON.stringify(this.state.promoter));

    localStorage.setItem(
      "substitutionMode",
      JSON.stringify(this.state.substitutionMode)
    );

    localStorage.setItem(
      "targetExpression",
      JSON.stringify(this.state.targetExpression)
    );

    localStorage.setItem(
      "numberOfCodons",
      JSON.stringify(this.state.numberOfCodons)
    );

    localStorage.setItem(
      "optimisationDirection",
      JSON.stringify(this.state.optimisationDirection)
    );

    localStorage.setItem(
      "customPromoter",
      JSON.stringify(this.state.customPromoter)
    );

    localStorage.setItem(
      "customRestriction",
      JSON.stringify(this.state.customRestriction)
    );

    localStorage.setItem(
      "samplingMethod",
      JSON.stringify(this.state.samplingMethod)
    );

    localStorage.setItem(
      "terminatorCheck",
      JSON.stringify(this.state.terminatorCheck)
    );

    localStorage.setItem(
      "customRegion",
      JSON.stringify(this.state.customRegion)
    );

    localStorage.setItem("randomSeed", JSON.stringify(this.state.randomSeed));

    localStorage.setItem(
      "customPromoterError",
      JSON.stringify(this.state.customPromoterError)
    );

    localStorage.setItem(
      "randomSeedError",
      JSON.stringify(this.state.randomSeedError)
    );

    localStorage.setItem(
      "customRestrictionError",
      JSON.stringify(this.state.customRestrictionError)
    );

    localStorage.setItem(
      "customRegionError",
      JSON.stringify(this.state.customRegionError)
    );

    this.setState({
      inputSequence: !this.props.inputSequenceSodope
        ? ""
        : this.props.inputSequenceSodope,
      isValidatedSequence: !this.props.inputSequenceSodope ? false : true,
    });
  }

  // componentDidUpdate(){
  // const customPromoterError = JSON.parse(localStorage.getItem('customPromoterError'));
  // if (!(customPromoterError === '')) {
  //   this.setState({
  //     customPromoterError: customPromoterError
  //   })
  // }
  // }

  showDemo = () => {
    let data = demoTisigner();
    let seq = defaultNucleotideTIsigner();
    const userObject = {
      inputSequence: seq,
      host: JSON.parse(localStorage.getItem("host")),
      promoter: JSON.parse(localStorage.getItem("promoter")),
      targetExpression: JSON.parse(localStorage.getItem("targetExpression")),
      substitutionMode: JSON.parse(localStorage.getItem("substitutionMode")),
      numberOfCodons: JSON.parse(localStorage.getItem("numberOfCodons")),
      optimisationDirection: JSON.parse(
        localStorage.getItem("optimisationDirection")
      ),
      customPromoter: JSON.parse(localStorage.getItem("customPromoter")),
      customRestriction: JSON.parse(localStorage.getItem("customRestriction")),
      samplingMethod: JSON.parse(localStorage.getItem("samplingMethod")),
      terminatorCheck: JSON.parse(localStorage.getItem("terminatorCheck")),
      customRegion: JSON.parse(localStorage.getItem("customRegion")),
      randomSeed: JSON.parse(localStorage.getItem("randomSeed")),
    };

    this.setState({
      showResult: true,
      result: data,
      isSubmitting: false,
      inputSequence: seq,
      inputSequenceProtein: this.translateSequence(seq),
      userObject: userObject,
    });

    ReactGA.event({
      category: "TIsigner Demo",
      action: "TIsigner Demo clicked.",
    });
  };

  submitInput(event) {
    let sequenceValid = this.state.isValidatedSequence;
    let generalValid =
      JSON.parse(localStorage.getItem("isValidatedGeneral")) === null
        ? true
        : JSON.parse(localStorage.getItem("isValidatedGeneral"));
    let extraValid =
      JSON.parse(localStorage.getItem("isValidatedExtra")) === null
        ? true
        : JSON.parse(localStorage.getItem("isValidatedExtra"));
    let advancedValid =
      JSON.parse(localStorage.getItem("isValidatedAdvanced")) === null
        ? true
        : JSON.parse(localStorage.getItem("isValidatedAdvanced"));

    // console.log(sequenceValid , generalValid , extraValid , advancedValid )
    event.preventDefault();
    if (sequenceValid && generalValid && extraValid && advancedValid) {
      const userObject = {
        inputSequence: this.state.inputSequence,
        host: JSON.parse(localStorage.getItem("host")),
        promoter: JSON.parse(localStorage.getItem("promoter")),
        targetExpression: JSON.parse(localStorage.getItem("targetExpression")),
        substitutionMode: JSON.parse(localStorage.getItem("substitutionMode")),
        numberOfCodons: JSON.parse(localStorage.getItem("numberOfCodons")),
        optimisationDirection: JSON.parse(
          localStorage.getItem("optimisationDirection")
        ),
        customPromoter: JSON.parse(localStorage.getItem("customPromoter")),
        customRestriction: JSON.parse(
          localStorage.getItem("customRestriction")
        ),
        samplingMethod: JSON.parse(localStorage.getItem("samplingMethod")),
        terminatorCheck: JSON.parse(localStorage.getItem("terminatorCheck")),
        customRegion: JSON.parse(localStorage.getItem("customRegion")),
        randomSeed: JSON.parse(localStorage.getItem("randomSeed")),
      };
      // console.log(userObject)
      this.setState({
        isSubmitting: true,
        userObject: userObject,
      });
      axios
        .post(TIsignerLink, userObject)
        .then((res) => {
          this.setState({
            showResult: true,
            result: res.data,
            isSubmitting: false,
          });

          ReactGA.event({
            category: "Submit Result Success",
            action: "Optimisation result from TIsigner received.",
          });
        })
        .catch((error) => {
          this.setState({
            isServerError: true,
            serverError: error,
            isSubmitting: false,
          });

          ReactGA.event({
            category: "Submit Result Failed",
            action:
              "TIsigner optimisation failed with error: " +
              JSON.stringify(error.response),
          });
        });
    }

    ReactGA.event({
      category: "Submit",
      action: "TIsigner Submit clicked.",
    });
  }

  render() {
    if (this.state.isSubmitting) {
      return (
        <Fragment>
          <br />
          <br />

          <Snackbar open={this.state.isSubmitting} autoHideDuration={5000}>
            <MuiAlert elevation={6} variant="filled" severity="info">
              Your sequence was submitted successfully.{" "}
              {JSON.parse(localStorage.getItem("substitutionMode")) ===
              "transInit"
                ? "It may take upto 20 seconds to optimise the sequence."
                : "Full sequence optimisation may take upto 30 seconds."}
            </MuiAlert>
          </Snackbar>

          <div className={this.props.inputSequenceSodope ? "" : "box"}>
            <div className="box">
              <article className="media">
                <div className="media-content">
                  <div className="content">
                    <strong>
                      Optimised sequence close to the selected parameters
                    </strong>
                    <br />
                    <br />
                    <pre>
                    <Skeleton animation="wave" />
                    </pre>
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

            <div className="box">

                <div className="media-content">
                  <div className="content">
                    <strong>Input sequence</strong>
                    <div style={{ wordBreak: "break-all" }}>
                      <br />
                      <br />
                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          backgroundColor: "#FFFFFF",
                          display: 'inline-block',
                          border:'1px solid #c0cbfc',
                          borderRadius: '10px',
                          boxShadow: '2px 2px 5px #c0cbfc',
                          maxHeight: '200px',
                          overflow: 'auto',
                        }}
                      >
                      <p
                        dangerouslySetInnerHTML={{
                          __html: this.state.inputSequence,
                        }}
                      />
                      </pre>
                    </div>
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

            </div>

            <div className="box">
              <article className="media">
                <div className="media-content">
                  <div className="content">
                    <strong>Optimised sequence</strong>
                    <br />
                    <br />

                    <pre>
                    <Skeleton animation="wave" />
                    </pre>
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

            <div className="box">
              <article className="media">
                <div className="media-content">
                  <div className="content">
                    <strong>Optimised sequence</strong>
                    <br />
                    <br />

                    <pre>
                    <Skeleton animation="wave" />
                    </pre>
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
          </div>
        </Fragment>
      );
    } else if (this.state.showResult) {
      return (
        <Fragment>
          <br />
          <br />
          <div
            id="tisignerResultPdf"
            className={this.props.inputSequenceSodope ? "" : "box"}
          >
            <TisignerResult
              result={this.state.result}
              inputSequenceProtein={this.state.inputSequenceProtein}
              inputSequence={this.state.inputSequence}
              calledFromSodope={this.props.inputSequenceSodope ? true : null}
            />
          </div>
          <br />
          <SpeedDial
            ariaLabel="Download button"
            style={style}
            icon={<i className="fa fa-download" aria-hidden="true"></i>}
            onClose={(e) => this.setState({ fabOpen: false })}
            onOpen={(e) => this.setState({ fabOpen: true })}
            open={this.state.fabOpen}
            direction={"up"}
          >
            {this.state.actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                tooltipOpen
                onClick={(e) => {
                  action.name === "PDF" ? this.saveAsPdf() : this.saveasCSV();
                }}
              />
            ))}
          </SpeedDial>
        </Fragment>
      );
    } else if (this.state.isServerError) {
      return <Error error={this.state.serverError} />;
    } else {
      return (
        <Fragment>
          {this.state.isShowCustomise ? null : (
            <Fragment>
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input
                    autoFocus
                    className="input is-rounded"
                    type="text"
                    placeholder="Enter a coding nucleotide sequence to optimise protein expression."
                    onChange={this.sequenceInput}
                    value={this.state.inputSequence}
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

              {!this.state.inputSequenceError ? null : (
                <p className="help is-warning has-text-centered">
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                  {this.state.inputSequenceError}
                </p>
              )}

              {JSON.parse(localStorage.getItem("customPromoterError")) ===
                null ||
              JSON.parse(localStorage.getItem("customPromoterError")) ===
                "" ? null : (
                <p className="help is-warning has-text-centered">
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                  {JSON.parse(localStorage.getItem("customPromoterError"))}
                </p>
              )}

              {JSON.parse(localStorage.getItem("customRestrictionError")) ===
                null ||
              JSON.parse(localStorage.getItem("customRestrictionError")) ===
                "" ? null : (
                <p className="help is-warning has-text-centered">
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>;
                  </span>
                  {JSON.parse(localStorage.getItem("customRestrictionError"))}
                </p>
              )}

              {JSON.parse(localStorage.getItem("customRegionError")) === null ||
              JSON.parse(localStorage.getItem("customRegionError")) ===
                "" ? null : (
                <p className="help is-warning has-text-centered">
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                  {JSON.parse(localStorage.getItem("customRegionError"))}
                </p>
              )}

              {JSON.parse(localStorage.getItem("randomSeedError")) === null ||
              JSON.parse(localStorage.getItem("randomSeedError")) ===
                "" ? null : (
                <p className="help is-warning has-text-centered">
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                  {JSON.parse(localStorage.getItem("randomSeedError"))}
                </p>
              )}
            </Fragment>
          )}
          <br />
          <Customise isShowCustomise={this.state.isShowCustomise} />

          <div className="buttons has-addons is-grouped is-multiline is-centered">
            <button
              className="button are-medium is-success is-outlined is-rounded"
              onClick={this.toggleCustomise}
            >
              {this.state.isShowCustomise ? "Save settings" : "Settings"}
            </button>
            {!this.state.isShowCustomise && !this.props.calledFromSodope ? (
              <Fragment>
                <button
                  className="button are-medium is-info is-outlined is-rounded"
                  onClick={this.example}
                >
                  Demo input
                </button>
                <button
                  className="button are-medium is-primary is-outlined is-rounded"
                  onClick={this.showDemo}
                >
                  Demo results
                </button>
              </Fragment>
            ) : null}
          </div>
        </Fragment>
      );
    }
  }
}

export default Input;
