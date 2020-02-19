import React, { Component, Fragment } from "react";
import Chart from "../../Chart/Chart";
import axios from "axios";
import SodopeResults from "../../Sodope/result/Result";
import ReactGA from "react-ga";

class TisignerResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
      reOptimiseResult: "",
      showResult: false
    };

    this.graphButton = this.graphButton.bind(this);
    this.hmmScan = this.hmmScan.bind(this);
    this.reOptimise = this.reOptimise.bind(this);
  }

  graphButton(event) {
    let a =
      this.state[event.target.name] === null
        ? event.target.value
        : !this.state[event.target.name];
    this.setState({
      [event.target.name]: a
    });

    ReactGA.event({
      category: "TIsigner Result Page",
      action: "View Plot clicked"
    });
  }

  hmmScan(event) {
    event.persist(); // because setState is async and event gets null by the time we set a new state
    this.graphButton(event);
    const userObject = {
      seq: this.props.inputSequenceProtein, //Protein sequence here
      hmmdb: "pfam"
    };

    ReactGA.event({
      category: "TIsigner Result Page",
      action: "Analyse solubility button clicked."
    });

    event.preventDefault();
    this.setState({ [event.target.name + "isSubmitting"]: true });
    !this.state.result
      ? axios
          .post("https://www.ebi.ac.uk/Tools/hmmer/search/hmmscan", userObject)
          .then(res => {
            // console.log(res)
            this.setState({
              result: res.data,
              [event.target.name + "isSubmitting"]: false
            });
            ReactGA.event({
              category: "TIsigner Result Page",
              action: "Analyse solubility: ",
              label: "HMMER results received."
            });
          })
          .catch(error => {
            this.setState({
              isServerError: true,
              serverError: error,
              [event.target.name + "isSubmitting"]: false
            });
            ReactGA.event({
              category: "TIsigner Result Page",
              action: "Analyse solubility: ",
              label: "HMMER query failed."
            });
            // console.log(error); //error message
            // console.log(error.response.status); //error status
            // console.log(error.response.headers); //error header
          })
      : this.setState({ [event.target.name + "isSubmitting"]: false });
  }

  reOptimise(event) {
    event.persist();
    let sequenceValid = true;
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
    this.setState({ [event.target.name + "isSubmitting"]: true });

    if (sequenceValid && generalValid && extraValid && advancedValid) {
      const userObject = {
        inputSequence: this.props.inputSequence,
        host: JSON.parse(localStorage.getItem("host")),
        promoter: JSON.parse(localStorage.getItem("promoter")),
        targetExpression: JSON.parse(localStorage.getItem("targetExpression")),
        substitutionMode: "fullGene",
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
        randomSeed: JSON.parse(localStorage.getItem("randomSeed"))
      };

      !this.state.reOptimiseResult
        ? // https://www.ebi.ac.uk/Tools/hmmer/search/hmmscan //http://10.96.88.251:5000/optimise1
          axios
            .post("http://localhost:5050/optimise", userObject)
            .then(res => {
              this.setState({
                showResult: true,
                reOptimiseResult: res.data,
                [event.target.name + "isSubmitting"]: false
              });
              ReactGA.event({
                category: "TIsigner Result Page",
                action: "Reoptimise with full sequence option clicked. ",
                label: "Reoptimisation success."
              });
            })
            .catch(error => {
              this.setState({
                isServerError: true,
                serverError: error,
                [event.target.name + "isSubmitting"]: false
              });
              ReactGA.event({
                category: "TIsigner Result Page",
                action: "Reoptimise with full sequence option clicked. ",
                label:
                  "Reoptimisation failed with error: " +
                  JSON.stringify(error.response)
              });
              // console.log(error.response.data);
              // console.log(error.response.status);
              // console.log(error.response.headers);
            })
        : this.setState({ [event.target.name + "isSubmitting"]: false });
    }

    ReactGA.event({
      category: "TIsigner Result Page",
      action: "Reoptimise with full sequence option clicked. ",
      label: "This button appears when there is a terminator."
    });
  }

  componentDidMount() {
    ReactGA.event({
      category: "TIsigner Result Page",
      action: "TIsigner result page shown.",
      label: this.props.calledFromSodope
        ? "Called from SoDoPE"
        : "Called from TIsigner"
    });
  }

  render() {
    var data = !this.state.reOptimiseResult
      ? this.props.result
      : this.state.reOptimiseResult;
    var names = [
      "Optimised sequence close to selected parameters",
      "Input sequence",
      "Optimised sequence"
    ];
    var types = ["Selected", "Input", "Optimised"]; //Object.keys(data)
    var allData = types.map((v, k) => data[v]);
    // console.log(allData.map((k,v)=> k.map((item, index) => item['Sequenceh'])))

    return (
      <Fragment>
        {allData.map((type, index) =>
          type.map((item, idx) => (
            <Fragment key={idx + "a" + index}>
              <div className="box">
                <article className="media">
                  <div className="media-content">
                    <div className="content">
                      <strong>{names[index]}</strong>
                      <div style={{ wordBreak: "break-all" }}>
                        <br />
                        <p
                          dangerouslySetInnerHTML={{ __html: item.Sequenceh }}
                        />
                      </div>
                    </div>

                    {!item.Hits ? null : !this.state.reOptimiseResult ? (
                      <Fragment key="term-found-warning">
                        <div className="card" id="ignorePDF">
                          <header className="card-header">
                            <p className="card-header-title has-text-danger">
                              Notice
                            </p>
                          </header>
                          <div className="card-content">
                            <div className="content">
                              <small>
                                Terminator(s) is detected inside this sequence.
                                If you want to use this sequence for expression,
                                we recommend doing a full length substitution
                                for optimisation and use the optimised sequence
                                instead.
                              </small>
                            </div>

                            <div className="field has-addons">
                              <p className="control">
                                <button
                                  name={
                                    index +
                                    "_term-found-warning_" +
                                    item.Accessibility
                                  }
                                  className={
                                    "button is-info is-rounded is-outlined " +
                                    (this.state[
                                      index +
                                        "_term-found-warning_" +
                                        item.Accessibility +
                                        "isSubmitting"
                                    ]
                                      ? " is-loading "
                                      : null)
                                  }
                                  onClick={this.reOptimise}
                                >
                                  Full length substitution
                                </button>
                              </p>
                            </div>
                          </div>
                        </div>
                        <br />
                      </Fragment>
                    ) : null}

                    <nav className="level">
                      <div className="level-item has-text-centered">
                        <div>
                          <p className="heading">Opening energy (KCal/mol)</p>
                          <p className="title">{item.Accessibility}</p>
                        </div>
                      </div>
                      {!item.pExpressed ? null : (
                        <div className="level-item has-text-centered">
                          <div>
                            <p className="heading">Expression score</p>
                            <p className="title">{item.pExpressed}</p>
                          </div>
                        </div>
                      )}
                      {!item.Hits ? null : (
                        <div className="level-item has-text-centered">
                          <div>
                            <p className="heading">Terminator Hits</p>
                            <p className="title">{item.Hits}</p>
                          </div>
                        </div>
                      )}
                      {!item["E_val"] ? null : (
                        <div className="level-item has-text-centered">
                          <div>
                            <p className="heading">E value</p>
                            <p className="title">{item["E_val"].join(", ")}</p>
                          </div>
                        </div>
                      )}
                    </nav>
                    <hr />

                    <div
                      className="field is-grouped is-grouped-multiline"
                      id="ignorePDF"
                    >
                      {!item.pExpressed ? null : (
                        <p className="control">
                          <button
                            name={idx + "graph" + index}
                            className="button is-rounded is-link"
                            value="false"
                            onClick={this.graphButton}
                          >
                            {!this.state[idx + "graph" + index]
                              ? "View plot"
                              : "Hide plot"}
                          </button>
                        </p>
                      )}
                      {this.props.calledFromSodope ? null : (
                        <p className="control">
                          <button
                            name={idx + "solubility" + index}
                            className={
                              "button is-rounded " +
                              (!item.pExpressed
                                ? " is-link "
                                : " is-outlined is-inverted ") +
                              (this.state[
                                idx + "solubility" + index + "isSubmitting"
                              ] && !this.state.isServerError
                                ? " is-loading "
                                : null)
                            }
                            onClick={this.hmmScan}
                            value="false"
                          >
                            Analyse solubility
                          </button>
                        </p>
                      )}
                    </div>

                    {this.state[idx + "graph" + index] ? (
                      <Chart
                        selected={allData[0][0]["Accessibility"]}
                        input={allData[1][0]["Accessibility"]}
                        current={
                          item.Accessibility ===
                            allData[0][0]["Accessibility"] ||
                          item.Accessibility === allData[1][0]["Accessibility"]
                            ? null
                            : item.Accessibility
                        }
                      />
                    ) : null}

                    {this.state[idx + "solubility" + index] ? (
                      <Fragment>
                        <div id="ignorePDF">
                          <br />
                          {!this.state.result && !this.state.isServerError ? (
                            <progress
                              className="progress is-large is-info"
                              max="100"
                            >
                              60%
                            </progress>
                          ) : !this.state.isServerError ? (
                            <SodopeResults
                              data={this.state.result}
                              protein={this.props.inputSequenceProtein}
                              nucleotide={item.Sequenceh.replace(
                                /<\/?(mark|...)\b[^<>]*>/g,
                                ""
                              )}
                              key={idx + "solubility" + index}
                            />
                          ) : (
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
                                      This happens when HMMER webserver is
                                      either too busy or is undergoing
                                      maintenence or you are having network
                                      issues! You can use the slider to explore
                                      the sequence.
                                    </small>
                                  </div>
                                </div>
                              </div>
                              <br />

                              <SodopeResults
                                data={this.state.result}
                                protein={this.props.inputSequenceProtein}
                                nucleotide={item.Sequenceh.replace(
                                  /<\/?(mark|...)\b[^<>]*>/g,
                                  ""
                                )}
                                key={idx + "solubility" + index}
                              />
                            </Fragment>
                          )}
                          <br />
                        </div>
                      </Fragment>
                    ) : null}
                  </div>
                </article>
              </div>
            </Fragment>
          ))
        )}
      </Fragment>
    );
  }
}

export default TisignerResult;
