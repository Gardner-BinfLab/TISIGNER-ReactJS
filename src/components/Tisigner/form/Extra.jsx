import React, { Component, Fragment } from "react";
import Slider from "@material-ui/core/Slider";
import ReactGA from "react-ga";

const marks = [
  {
    value: 4,
    label: "4"
  },
  {
    value: 5,
    label: "5 "
  },
  {
    value: 6,
    label: "6 "
  },
  {
    value: 7,
    label: "7 "
  },
  {
    value: 8,
    label: "8 "
  },
  {
    value: 9,
    label: "9"
  }
];

class Extra extends Component {
  constructor(props) {
    super(props);

    this.state = {
      substitutionMode: "transInit",
      numberOfCodons: 9,
      customRestriction: "",
      customRestrictionError: "",
      isValidated:
        JSON.parse(localStorage.getItem("isValidatedExtra")) !== null
          ? JSON.parse(localStorage.getItem("isValidatedExtra"))
          : true
    };
    this.radioChange = this.radioChange.bind(this);
    this.sliderChange = this.sliderChange.bind(this);
    this.customRestrictionInput = this.customRestrictionInput.bind(this);
  }

  radioChange(event) {
    this.setState({
      substitutionMode: event.target.value
    });
    ReactGA.event({
      category: "TIsigner Customisation",
      action: "Substitution mode: " + event.target.value,
      label: "Extra"
    });
  }

  sliderChange = (event, value) => {
    this.setState({
      numberOfCodons: value
    });
  };

  customRestrictionInput(event) {
    let inp = event.target.value.toUpperCase();
    let rms = inp.replace(/U/gi, "T");
    let filter = /^[ACGTU]+(,{0,1}[AGCTU])+$/;
    let isValid = true;
    let errors = "";
    if (rms) {
      if (!filter.test(rms)) {
        isValid = false;
        errors = "Restriction modification sites not in proper format.";
      }
    }

    this.setState({
      customRestriction: event.target.value,
      customRestrictionError: errors,
      isValidated: isValid
    });
    ReactGA.event({
      category: "TIsigner Customisation",
      action: "Custom RMS was entered.",
      label: "Extra"
    });
  }

  componentDidUpdate() {
    localStorage.setItem(
      "substitutionMode",
      JSON.stringify(this.state.substitutionMode)
    );
    localStorage.setItem(
      "numberOfCodons",
      JSON.stringify(this.state.numberOfCodons)
    );
    localStorage.setItem(
      "customRestriction",
      JSON.stringify(this.state.customRestriction)
    );
    localStorage.setItem(
      "isValidatedExtra",
      JSON.stringify(this.state.isValidated)
    );
    localStorage.setItem(
      "customRestrictionError",
      JSON.stringify(this.state.customRestrictionError)
    );
  }

  componentDidMount() {
    const substitutionMode = JSON.parse(
      localStorage.getItem("substitutionMode")
    );
    !substitutionMode
      ? localStorage.setItem(
          "substitutionMode",
          JSON.stringify(this.state.substitutionMode)
        )
      : this.setState({
          substitutionMode: substitutionMode
        });

    const numberOfCodons = JSON.parse(localStorage.getItem("numberOfCodons"));
    !numberOfCodons
      ? localStorage.setItem(
          "numberOfCodons",
          JSON.stringify(this.state.numberOfCodons)
        )
      : this.setState({
          numberOfCodons: numberOfCodons
        });

    const customRestriction = JSON.parse(
      localStorage.getItem("customRestriction")
    );
    !customRestriction
      ? localStorage.setItem(
          "customRestriction",
          JSON.stringify(this.state.customRestriction)
        )
      : this.setState({
          customRestriction: customRestriction
        });

    const isValidated = JSON.parse(localStorage.getItem("isValidatedExtra"));
    !isValidated
      ? localStorage.setItem(
          "isValidatedExtra",
          JSON.stringify(this.state.isValidated)
        )
      : this.setState({
          isValidated: isValidated
        });

    const customRestrictionError = JSON.parse(
      localStorage.getItem("customRestrictionError")
    );
    !customRestrictionError
      ? localStorage.setItem(
          "customRestrictionError",
          JSON.stringify(this.state.customRestrictionError)
        )
      : this.setState({
          customRestrictionError: customRestrictionError
        });

    ReactGA.event({
      category: "TIsigner Customisation",
      action: "Extra Tab was clicked.",
      label: "Extra"
    });
  }

  render() {
    return (
      <Fragment>
        <div className="control">
          <label className="label">Synonymous codon substitution</label>
          <label className="radio">
            <input
              type="radio"
              value="transInit"
              onChange={this.radioChange}
              checked={this.state.substitutionMode === "transInit"}
            />
            Translation initiation coding region
          </label>
          <label className="radio">
            <input
              type="radio"
              value="fullGene"
              onChange={this.radioChange}
              checked={this.state.substitutionMode === "fullGene"}
            />
            Full-length sequence
          </label>
        </div>
        <br />

        {this.state.substitutionMode === "transInit" ? (
          <div className="control">
            <label className="label">Maximum number of replaceable codons</label>
            <Slider
              value={this.state.numberOfCodons}
              valueLabelDisplay="auto"
              marks={marks}
              min={4}
              max={9}
              onChange={this.sliderChange}
              onChangeCommitted={() => {
                ReactGA.event({
                  category: "TIsigner Customisation",
                  action:
                    "Number of codons to substitute: " +
                    this.state.numberOfCodons,
                  label: "Extra"
                });
              }}
            />
          </div>
        ) : null}

        <div className="field">
          <label className="label">Restriction sites to avoid</label>
          <div className="control">
            <input
              className={
                "input is-rounded " +
                (this.state.isValidated ? " is-success " : " is-danger ")
              }
              type="text"
              placeholder="Multiple sites can be separated by comma. For example: GAATTC,GGATTC,AAGCTT. Reverse complements are also filtered."
              onChange={this.customRestrictionInput}
              value={this.state.customRestriction}
            />
          </div>
          <p className="help ">
            AarI, BsaI, BsmBI are filtered out by default. Leave blank if none.
          </p>
          {!this.state.customRestrictionError ? null : (
            <p className="help is-danger">
              <span className="icon is-small is-right">
                <i className="fas fa-exclamation-triangle"></i>
              </span>
              {this.state.customRestrictionError}
            </p>
          )}
        </div>
      </Fragment>
    );
  }
}

export default Extra;
