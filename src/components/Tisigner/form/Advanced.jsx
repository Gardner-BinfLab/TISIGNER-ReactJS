import React, { Component, Fragment } from "react";
import ReactGA from "react-ga";

class Advanced extends Component {
  constructor(props) {
    super(props);
    this.state = {
      samplingMethod: "quick",
      terminatorCheck: true,
      customRegion: "",
      randomSeed: 0,
      randomSeedError: "",
      customRegionError: "",
      isValidated:
        JSON.parse(localStorage.getItem("isValidatedAdvanced")) !== null
          ? JSON.parse(localStorage.getItem("isValidatedAdvanced"))
          : true
    };
    this.radioChange = this.radioChange.bind(this);
    this.updateCheck = this.updateCheck.bind(this);
    this.customRegionInput = this.customRegionInput.bind(this);
    this.customSeedInput = this.customSeedInput.bind(this);
  }

  radioChange(event) {
    this.setState({
      samplingMethod: event.target.value
    });

    ReactGA.event({
      category: "TIsigner Customisation",
      action: "Sampling method: " + event.target.value,
      label: "Advanced"
    });
  }

  updateCheck() {
    this.setState(
      {
        terminatorCheck: !this.state.terminatorCheck
      },
      () =>
        ReactGA.event({
          category: "TIsigner Customisation",
          action: "Terminator check: " + this.state.terminatorCheck,
          label: "Advanced"
        })
    );
  }

  customRegionInput(event) {
    let isValid = true;
    let errors = "";

    if (event.target.value) {
      let region = event.target.value;
      let reg = region.split(":");

      if (reg.length === 2) {
        let dist;
        if (
          (reg[0] < 0 && reg[1] < 0) ||
          (reg[0] > 0 && reg[1] > 0) ||
          reg[0] > reg[1]
        ) {
          dist = Math.abs(reg[0] - reg[1]);
        } else if (reg[1] > reg[0]) {
          dist = Math.abs(reg[1] - reg[0]);
        }

        if (isNaN(dist)) {
          isValid = false;
          errors = "The custom region input has non numeric values.";
        } else if (dist <= 4) {
          isValid = false;
          errors = "The custom region is too small.";
        } else if (dist >= 151) {
          isValid = false;
          errors = "The custom region is greater then 150 nts.";
        } else if (!reg[0] || !reg[1]) {
          isValid = false;
          errors = "The custom region should be of the form start:end";
        }
      } else {
        isValid = false;
        errors = "The custom region should be of the form start:end";
      }
    }

    this.setState({
      customRegion: event.target.value,
      customRegionError: errors,
      isValidated: isValid
    });

    ReactGA.event({
      category: "TIsigner Customisation",
      action: "Custom Region; " + event.target.value,
      label: "Advanced"
    });
  }

  customSeedInput(event) {
    let errors = "";
    let isValid = true;
    let seed = event.target.value;
    let reg = /^[0-9]+$/;
    if (reg.test(seed)) {
      if (isNaN(seed) || seed > 999999999) {
        isValid = false;
        errors =
          "Ony integers from 0 to 999999999 allowed in random seed field.";
      }
    } else {
      isValid = false;
      errors = "Only numbers are allowed in random seed field.";
    }

    this.setState({
      randomSeed: event.target.value,
      randomSeedError: errors,
      isValidated: isValid
    });

    ReactGA.event({
      category: "TIsigner Customisation",
      action: "Custom Seed: " + event.target.value,
      label: "Advanced"
    });
  }

  componentDidMount() {
    const samplingMethod = JSON.parse(localStorage.getItem("samplingMethod"));
    !samplingMethod
      ? localStorage.setItem(
          "samplingMethod",
          JSON.stringify(this.state.samplingMethod)
        )
      : this.setState({
          samplingMethod: samplingMethod
        });

    const terminatorCheck = JSON.parse(localStorage.getItem("terminatorCheck"));
    terminatorCheck === null
      ? localStorage.setItem(
          "terminatorCheck",
          JSON.stringify(this.state.terminatorCheck)
        )
      : this.setState({
          terminatorCheck: terminatorCheck
        });

    const customRegion = JSON.parse(localStorage.getItem("customRegion"));
    !customRegion
      ? localStorage.setItem(
          "customRegion",
          JSON.stringify(this.state.customRegion)
        )
      : this.setState({
          customRegion: customRegion
        });

    const randomSeed = JSON.parse(localStorage.getItem("randomSeed"));
    !randomSeed
      ? localStorage.setItem(
          "randomSeed",
          JSON.stringify(this.state.randomSeed)
        )
      : this.setState({
          randomSeed: randomSeed
        });

    const isValidated = JSON.parse(localStorage.getItem("isValidatedAdvanced"));
    !isValidated
      ? localStorage.setItem(
          "isValidatedAdvanced",
          JSON.stringify(this.state.isValidated)
        )
      : this.setState({
          isValidated: isValidated
        });

    const randomSeedError = JSON.parse(localStorage.getItem("randomSeedError"));
    !randomSeedError
      ? localStorage.setItem(
          "randomSeedError",
          JSON.stringify(this.state.randomSeedError)
        )
      : this.setState({
          randomSeedError: randomSeedError
        });

    const customRegionError = JSON.parse(
      localStorage.getItem("customRegionError")
    );
    !customRegionError
      ? localStorage.setItem(
          "customRegionError",
          JSON.stringify(this.state.customRegionError)
        )
      : this.setState({
          customRegionError: customRegionError
        });

    //
    // const errors. = JSON.parse(localStorage.getItem('errorsAdvanced'));
    // !errors ? localStorage.setItem('errorsAdvanced', JSON.stringify(this.state.errors)) :
    // this.setState({
    //   isValidated: errors
    //   });
    ReactGA.event({
      category: "TIsigner Customisation",
      action: "Advanced Tab was clicked.",
      label: "Advanced"
    });
  }

  componentDidUpdate() {
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
      "isValidatedAdvanced",
      JSON.stringify(this.state.isValidated)
    );
    localStorage.setItem(
      "randomSeedError",
      JSON.stringify(this.state.randomSeedError)
    );
    localStorage.setItem(
      "customRegionError",
      JSON.stringify(this.state.customRegionError)
    );
  }

  render() {
    return (
      <Fragment>
        <div className="control">
          <label className="label">Sampling method</label>
          <label className="radio">
            <input
              type="radio"
              value="quick"
              onChange={this.radioChange}
              checked={this.state.samplingMethod === "quick"}
            />
            Quick (Faster)
          </label>
          <label className="radio">
            <input
              type="radio"
              value="deep"
              onChange={this.radioChange}
              checked={this.state.samplingMethod === "deep"}
            />
            Deep (Slower)
          </label>
        </div>

        <div className="control">
          <label className="label">Terminator</label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={this.state.terminatorCheck}
              onChange={this.updateCheck}
            />
            Check and report
          </label>
        </div>

        <div className="is-grouped is-grouped-multiline">
          <div className="control">
            <div className="field">
              <label className="label">
                Custom region to optimise accessibility
              </label>
              <div className="control">
                <input
                  className={
                    "input is-rounded " +
                    (this.state.isValidated ? " is-success " : " is-danger ")
                  }
                  type="text"
                  placeholder="Format start:end"
                  onChange={this.customRegionInput}
                  value={this.state.customRegion}
                />
              </div>
              <p className="help ">
                A in start codon ATG is refered to position 1. Custom region
                should be relative to this.{" "}
              </p>

              {!this.state.customRegionError ? null : (
                <p className="help is-danger">
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                  {this.state.customRegionError}
                </p>
              )}
            </div>
          </div>

          <div className="control">
            <div className="field">
              <label className="label">Random seed </label>
              <div className="control">
                <input
                  className={
                    "input is-rounded " +
                    (this.state.isValidated ? " is-success " : " is-danger ")
                  }
                  type="text"
                  onChange={this.customSeedInput}
                  value={this.state.randomSeed}
                />
              </div>
              <p className="help ">
                Changing this will usually give a different set of optimised
                sequences.{" "}
              </p>

              {!this.state.randomSeedError ? null : (
                <p className="help is-danger">
                  <span className="icon is-small is-right">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                  {this.state.randomSeedError}
                </p>
              )}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Advanced;
