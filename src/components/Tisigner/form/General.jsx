import React, { Component, Fragment } from "react";
import Slider from "@material-ui/core/Slider";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import ReactGA from 'react-ga';

const hosts = [
  { value: "Escherichia coli", label: "Escherichia coli" },
  { value: "Saccharomyces cerevisiae", label: "Saccharomyces cerevisiae" },
  { value: "Mus musculus", label: "Mus musculus" },
  { value: "Other", label: "Other" }
];

const promoters = [
  { value: "T7", label: "T7lac promoter (e.g., pET21)" },
  { value: "Custom", label: "Custom" }
];

const marks = [
  {
    value: 5,
    label: "5"
  },
  {
    value: 30,
    label: "30 (Low)"
  },
  {
    value: 70,
    label: "70 (High)"
  },
  {
    value: 100,
    label: "100"
  }
];

class General extends Component {
  constructor(props) {
    super(props);

    this.state = {
      host: "Escherichia coli",
      promoter: "T7",
      targetExpression: 100,
      substitutionMode: "transInit",
      numberOfCodons: 9,
      customPromoter: "",
      optimisationDirection: "increase-accessibility",
      customPromoterError: "",
      isValidated:
        JSON.parse(localStorage.getItem("isValidatedGeneral")) !== null
          ? JSON.parse(localStorage.getItem("isValidatedGeneral"))
          : true
    };
    // this.selectUtr = this.selectUtr.bind(this);
    this._selectHost = this._selectHost.bind(this);
    this._selectPromoter = this._selectPromoter.bind(this);
    this.sliderChange = this.sliderChange.bind(this);
    this.radioChange = this.radioChange.bind(this);
    this.customPromoterInput = this.customPromoterInput.bind(this);
  }

  _selectHost = option => {
    // console.log(`You selected ${option.label}, with value ${option.value}`)
    this.setState({
      host: option.value,
      customPromoter: "",
      promoter:
        option.value === "Escherichia coli" ? this.state.promoter : "Custom",
      isValidated: false,
      customPromoterError:
        option.value !== "Escherichia coli" ? "Empty custom promoter." : ""
    });
    ReactGA.event({
      category: 'TIsigner Customisation',
      action: 'Host selected: ' + option.value,
      label: 'General'
    });
  };

  _selectPromoter = option => {
    // console.log(`You selected ${option.label}, with value ${option.value}`)
    this.setState({
      promoter: option.value,
      customPromoter: "",
      isValidated: false,
      customPromoterError: option.value === "T7" ? "" : "Empty custom promoter."
    });
    ReactGA.event({
      category: 'TIsigner Customisation',
      action: 'Promoter selected: ' + option.value,
      label: 'General'
    });

  };

  sliderChange = (event, value) => {
    this.setState({
      targetExpression: value
    });
  };

  radioChange(event) {
    this.setState({
      optimisationDirection: event.target.value
    });

    ReactGA.event({
      category: 'TIsigner Customisation',
      action: 'Optimisation Direction: ' + event.target.value,
      label: 'General'
    });

  }

  customPromoterInput(event) {
    let input = event.target.value.replace(/U/gi, "T").toUpperCase();
    let promoter = "";
    let filter = /^[ACGTU]+$/;
    let isValid = true;
    let errors = "";
    if (input) {
      if (!filter.test(input)) {
        isValid = false;
        errors = "Unknown nucleotides in custom promoter.";
      } else if (input.length <= 71) {
        isValid = false;
        errors = "Custom promoter should be greater than 71 nucleotides.";
      }
      promoter = input;
    } else {
      isValid = false;
      errors = "Empty custom promoter.";
    }

    this.setState({
      customPromoter: promoter,
      isValidated: this.state.promoter === "T7" ? true : isValid,
      customPromoterError: errors
    });


    ReactGA.event({
      category: 'TIsigner Customisation',
      action: 'Custom promoter was entered.',
      label: 'General'
    });

  }

  componentDidMount() {
    // check if we saved values previously and load them else assign current
    // state to local storage.
    const host = JSON.parse(localStorage.getItem("host"));
    !host
      ? localStorage.setItem("host", JSON.stringify(this.state.host))
      : this.setState({
          host: host
        });

    const promoter = JSON.parse(localStorage.getItem("promoter"));
    !promoter
      ? localStorage.setItem("promoter", JSON.stringify(this.state.promoter))
      : this.setState({
          promoter: promoter
        });

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

    const customPromoter = JSON.parse(localStorage.getItem("customPromoter"));
    !customPromoter
      ? localStorage.setItem(
          "customPromoter",
          JSON.stringify(this.state.customPromoter)
        )
      : this.setState({
          customPromoter: customPromoter
        });

    const targetExpression = JSON.parse(
      localStorage.getItem("targetExpression")
    );
    !targetExpression
      ? localStorage.setItem(
          "targetExpression",
          JSON.stringify(this.state.targetExpression)
        )
      : this.setState({
          targetExpression: targetExpression
        });

    const optimisationDirection = JSON.parse(
      localStorage.getItem("optimisationDirection")
    );
    !optimisationDirection
      ? localStorage.setItem(
          "optimisationDirection",
          JSON.stringify(this.state.optimisationDirection)
        )
      : this.setState({
          optimisationDirection: optimisationDirection
        });

    const isValidated = JSON.parse(localStorage.getItem("isValidatedGeneral"));
    !isValidated
      ? localStorage.setItem(
          "isValidatedGeneral",
          JSON.stringify(this.state.isValidated)
        )
      : this.setState({
          isValidated: this.state.promoter === "T7" ? true : isValidated
        });

    const customPromoterError = JSON.parse(
      localStorage.getItem("customPromoterError")
    );
    !customPromoterError
      ? localStorage.setItem(
          "customPromoterError",
          JSON.stringify(this.state.customPromoterError)
        )
      : this.setState({
          customPromoterError: !(promoter === "T7") ? customPromoterError : ""
        });

  ReactGA.event({
    category: 'TIsigner Customisation',
    action: 'General Tab was clicked.',
    label: 'General'
  });
  }

  componentDidUpdate() {
    localStorage.setItem("host", JSON.stringify(this.state.host));
    localStorage.setItem("promoter", JSON.stringify(this.state.promoter));
    localStorage.setItem(
      "targetExpression",
      JSON.stringify(this.state.targetExpression)
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
      "isValidatedGeneral",
      JSON.stringify(
        this.state.promoter === "T7" ? true : this.state.isValidated
      )
    );
    let errors = this.state.customPromoterError;
    !(this.state.promoter === "T7")
      ? localStorage.setItem("customPromoterError", JSON.stringify(errors))
      : localStorage.setItem("customPromoterError", JSON.stringify(""));


  }

  render() {
    return (
      <Fragment>
        <div className="field is-grouped is-grouped-multiline">
          <div className="control">
            <div className="field">
              <label className="label">Host</label>
              <Dropdown
                options={hosts}
                onChange={this._selectHost}
                value={this.state.host}
                placeholder="Host"
              />
            </div>
          </div>

          <div className="control">
            <div className="field">
              <label className="label">Promoter</label>
              <Dropdown
                options={promoters}
                onChange={this._selectPromoter}
                value={this.state.promoter}
                placeholder="Promoter"
              />
            </div>
          </div>
        </div>

        {this.state.host !== "Escherichia coli" ||
        this.state.promoter !== "T7" ? (
          <Fragment>
            {this.state.promoter === "T7" ? null : (
              <div className="field">
                <label className="label">5&prime; UTR (Promoter)</label>
                <div className="control">
                  <input
                    className={
                      "input is-rounded " +
                      (this.state.isValidated ? " is-success " : " is-danger ")
                    }
                    type="text"
                    placeholder="5&prime; UTR (Promoter)"
                    onChange={this.customPromoterInput}
                    value={this.state.customPromoter}
                  />
                </div>
                <p className="help ">
                  Length should be greater than 71 nucleotides.{" "}
                </p>
              </div>
            )}
            {!this.state.customPromoterError ? null : (
              <p className="help is-danger">
                <span className="icon is-small is-right">
                  <i className="fas fa-exclamation-triangle"></i>
                </span>
                {this.state.customPromoterError}
              </p>
            )}

            <div className="control">
              <label className="label">Optimisation type</label>
              <label className="radio">
                <input
                  type="radio"
                  value="increase-accessibility"
                  onChange={this.radioChange}
                  checked={
                    this.state.optimisationDirection ===
                    "increase-accessibility"
                  }
                />
                Maximise expression
              </label>
              <label className="radio">
                <input
                  type="radio"
                  value="decrease-accessibility"
                  onChange={this.radioChange}
                  checked={
                    this.state.optimisationDirection ===
                    "decrease-accessibility"
                  }
                />
                Minimise expression
              </label>
            </div>
          </Fragment>
        ) : (
          <div className="control">
            <label className="label">Target expression score</label>
            <Slider
              value={this.state.targetExpression}
              valueLabelDisplay="auto"
              marks={marks}
              min={5}
              max={100}
              onChange={this.sliderChange}
              onChangeCommitted={() => {
                ReactGA.event({
                  category: 'TIsigner Customisation',
                  action: 'Target Expression: ' + this.state.targetExpression,
                  label: 'General'
                });
              }}
            />
          {/*this.state.targetExpression <= 80 ? null : (
              <Fragment>
                <p className="help is-danger">
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                  Selecting a higher expression may lead to overexpression, thus
                  killing the host. This might impact the final expression!
                </p>
              </Fragment>
            )*/}
          </div>
        )}
      </Fragment>
    );
  }
}

export default General;
