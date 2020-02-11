import React, { Component, Fragment } from "react";
import Slider from "@material-ui/core/Slider";
import roundTo from "round-to";
import { withStyles } from "@material-ui/core/styles";
// import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Popover from "@material-ui/core/Popover";
import { zoomIn, rubberBand } from "react-animations";
import Radium, { StyleRoot } from "radium";
import SodopeChart from "./SodopeChart";
import {
  getSequence,
  gravy,
  hydropathy,
  flexibility,
  averageArr,
  logistic,
  solubilityWeightedIndex,
  repeatSimAnneal
} from "../Utils/Utils";
import Input from "../../Tisigner/Input";
import ReactGA from "react-ga";

const styles = {
  paper: {
    padding: "20px"
  },
  popover: {
    pointerEvents: "none"
  }
};

const anim = {
  zoomIn: {
    animation: "x 1s",
    animationName: Radium.keyframes(zoomIn, "zoomIn")
  },
  rubberBand: {
    animation: "x 1s",
    animationName: Radium.keyframes(rubberBand, "rubberBand")
  }
};

class SodopeResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: null,
      open: false,
      anchorEl: null,
      sliderValue: [1, this.props.protein.length],
      showResults: false,
      sequenceTooSmall: false,
      suggestedRegions: "",
      defaultRegionForSuggestion: 50,
      convertClicked: true,
      avatarLetter: "P",
      isShowOptimisation: false,
      sequenceToShow: ""
    };
    this.domainsRef = React.createRef();
    this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
    this.handlePopoverClose = this.handlePopoverClose.bind(this);
    this.updateEvents = this.updateEvents.bind(this);
    this.sliderStop = this.sliderStop.bind(this);
    this.regionSuggestion = this.regionSuggestion.bind(this);
    this.convertSequence = this.convertSequence.bind(this);
    this.convertSequenceButton = this.convertSequenceButton.bind(this);
    this.toggleOptimisation = this.toggleOptimisation.bind(this);
  }

  toggleOptimisation(event) {
    this.setState(
      {
        isShowOptimisation: !this.state.isShowOptimisation
      },
      () =>
        ReactGA.event({
          category: "SoDoPE results",
          action: "Optimisation form shown: " + this.state.isShowOptimisation
        })
    );
  }

  handlePopoverOpen(event, popoverId) {
    this.setState({
      openedPopoverId: popoverId,
      anchorEl: event.target
    });
  }

  handlePopoverClose() {
    this.setState({
      openedPopoverId: null,
      anchorEl: null
    });
  }

  updateEvents(event) {
    let newValue = event.target.value.split(",").map(e => Number(e));
    let key = event.target.getAttribute("idx");
    let suggReg = !key
      ? null
      : key.includes("suggested_region_")
      ? "Suggested region clicked."
      : null;

    this.setState(
      {
        sliderValue: newValue,
        sequenceTooSmall:
          Math.abs(newValue[0] - newValue[1]) < 11 ? true : false
      },
      () => this.convertSequence()
    );
    this.computeProperties(newValue);
    this.regionSuggestion(newValue);
    ReactGA.event({
      category: "SoDoPE results",
      action: "SoDoPE results shown.",
      label: suggReg
    });
  }

  sliderChange = (e, newValue) => {
    // let a = newValue[0]
    // let b = newValue[1]
    // (Math.abs(a-b) < 11) ? a = a + 10 : a
    // newValue = [a,b]
    this.setState(
      {
        sliderValue: newValue,
        sequenceTooSmall:
          Math.abs(newValue[0] - newValue[1]) < 11 ? true : false
      },
      () => this.convertSequence()
    );
  };

  sliderStop = (e, newValue) => {
    this.computeProperties(newValue);
    this.regionSuggestion(newValue);
    this.setState(
      {
        sliderValue: newValue,
        sequenceTooSmall:
          Math.abs(newValue[0] - newValue[1]) < 11 ? true : false
      },
      () => this.convertSequence()
    );
    ReactGA.event({
      category: "SoDoPE results",
      action: "SoDoPE Slider clicked."
    });
  };

  regionSuggestion(position) {
    let region = this.state.defaultRegionForSuggestion;
    // let position = this.state.sliderValue
    let sequence = this.props.protein;
    // console.log(region, position, sequence)
    let separation = Math.abs(position[0] - position[1]);

    let new_results =
      separation < 11 ? null : repeatSimAnneal(sequence, position, region);
    this.setState({
      suggestedRegions: new_results
    });
  }

  computeProperties(coords) {
    let currentSelectedSequence = getSequence(this.props.protein, coords);
    let gravyAll =
      currentSelectedSequence.length < 11
        ? "Sequence too small"
        : gravy(currentSelectedSequence);
    let gravyAvr =
      currentSelectedSequence.length < 11
        ? "Sequence too small"
        : averageArr(gravyAll);
    let flexibilities =
      currentSelectedSequence.length < 11
        ? "Sequence too small"
        : flexibility(currentSelectedSequence);
    let averageFlexibility =
      currentSelectedSequence.length < 11
        ? "Sequence too small"
        : averageArr(flexibilities);
    let hydropathicities =
      currentSelectedSequence.length < 11
        ? "Sequence too small"
        : hydropathy(currentSelectedSequence);
    let probOfSolubility =
      currentSelectedSequence.length < 11
        ? "Sequence too small"
        : logistic(solubilityWeightedIndex(currentSelectedSequence));
    this.setState({
      currentSelectedSequence: currentSelectedSequence,
      showResults: currentSelectedSequence.length < 11 ? false : true,
      sequenceTooSmall: currentSelectedSequence.length < 11 ? true : false,
      probOfSolubility:
        currentSelectedSequence.length < 11 ? 0 : roundTo(probOfSolubility, 4),
      hydropathicities: hydropathicities,
      flexibilities: flexibilities,
      gravy: currentSelectedSequence.length < 11 ? 0 : roundTo(gravyAvr, 4),
      averageFlexibility:
        currentSelectedSequence.length < 11 ? 0 : roundTo(averageFlexibility, 4)
    });
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
      currentNucleotide: currentNucleotide
    });
  }

  convertSequenceButton(event) {
    this.setState(
      {
        convertClicked: !this.state.convertClicked
      },
      () => this.convertSequence()
    );
    ReactGA.event({
      category: "SoDoPE results",
      action: "View Nucleotide/Protein button clicked."
    });
  }

  updateDimensions = () => {
    this.setState({
      width: this.domainsRef.current ? this.domainsRef.current.offsetWidth : 0
    });
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.setState({
      width: this.domainsRef.current ? this.domainsRef.current.offsetWidth : 0,
      sequenceToShow: this.props.protein
    });
    this.computeProperties(this.state.sliderValue);
    ReactGA.event({
      category: "SoDoPE results",
      action: "SoDoPE results shown."
    });
  }

  componentDidUpdate(prevState) {
    // window.addEventListener('resize', this.updateDimensions)
  }

  render() {
    let data = this.props.data;
    let prot = this.props.protein;
    const { classes } = this.props;
    const { anchorEl, openedPopoverId } = this.state;

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
            calledFromSodope={true}
          />
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          {!data.results ? null : (
            <Fragment>
              {!data.results.hits.length ||
              !data.results.hasOwnProperty("hits") ? (
                <Fragment>
                  <div className="card">
                    <header className="card-header">
                      <p className="card-header-title">
                        Error: No hits found in the given sequence.
                      </p>
                    </header>
                    <div className="card-content has-text-danger">
                      <div className="content">
                        <small>
                          This happens when no known domains were identified
                          inside this sequence. This could also happen if HMMER
                          webserver is either too busy or is undergoing
                          maintenence or you are having network issues! You can
                          use the slider to explore the sequence.
                        </small>
                      </div>
                    </div>
                  </div>
                  <hr />
                </Fragment>
              ) : null}

              <p>
                Protein domains annotated by
                <a
                  href={
                    "https://www.ebi.ac.uk/Tools/hmmer/results/" +
                    data.results.uuid
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  HMMER
                </a>
              </p>
              <br />
            </Fragment>
          )}

          <Fragment key="domain-graphics">
            <div ref={this.domainsRef}>
              <div
                style={{
                  height: 25,
                  backgroundColor: "#e0e0e0",
                  marginBottom: -32
                }}
              ></div>
              {!data.results || !data.results.hits
                ? null
                : data.results.hits.map((item, index) =>
                    item.domains.map((d, idx) =>
                      d.display ? (
                        <Fragment key={idx + "domainButton_Fragment"}>
                          <button
                            key={index + "domainButton" + idx}
                            className="button is-info is-rounded is-link"
                            style={{
                              width:
                                ((d.jenv - d.ienv) * this.state.width) /
                                  prot.length +
                                12,
                              left:
                                (d.ienv * this.state.width) / prot.length + 12,
                              position: "absolute"
                            }}
                            onMouseEnter={e =>
                              this.handlePopoverOpen(
                                e,
                                index + "domainButton" + idx
                              )
                            }
                            onMouseLeave={this.handlePopoverClose}
                            value={[d.ienv, d.jenv]}
                            onClick={this.updateEvents}
                          >
                            {d.alihmmname}
                          </button>
                          <Popover
                            className={classes.popover}
                            classes={{
                              paper: classes.paper
                            }}
                            open={
                              openedPopoverId === index + "domainButton" + idx
                            }
                            anchorEl={anchorEl}
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "center"
                            }}
                            transformOrigin={{
                              vertical: "bottom",
                              horizontal: "center"
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              {d.alihmmname} ({d.alihmmacc})
                            </Typography>
                            <hr />
                            <b>{d.alihmmdesc}</b>
                            <br />
                            Coordinates : {d.ienv} - {d.jenv}
                            <br />
                            Alignment region: {d.iali} - {d.jali}
                          </Popover>
                        </Fragment>
                      ) : null
                    )
                  )}
            </div>
          </Fragment>
          <br />
          <br />

          <Slider
            valueLabelDisplay="auto"
            min={1}
            max={prot.length}
            value={this.state.sliderValue}
            onChange={this.sliderChange}
            step={1}
            onChangeCommitted={this.sliderStop}
          />

          <br />
          {!this.state.suggestedRegions ||
          this.state.sequenceTooSmall ? null : !this.state.suggestedRegions
              .Positions.length ? null : (
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              gutterBottom
            >
              Regions with higher probability of solubility:
            </Typography>
          )}

          <div className="buttons">
            {!this.state.suggestedRegions || this.state.sequenceTooSmall
              ? null
              : this.state.suggestedRegions.Positions.map((e, i) => (
                  <Fragment key={"suggested_region_fragment_" + i}>
                    <StyleRoot>
                      <button
                        key={"suggested_region_" + i}
                        className="button is-success is-rounded is-link is-small"
                        value={e}
                        onClick={this.updateEvents}
                        idx={"suggested_region_" + i}
                        style={anim.zoomIn}
                      >
                        {e[0]} - {e[1]}
                      </button>
                    </StyleRoot>
                  </Fragment>
                ))}
          </div>

          {!this.state.showResults ? (
            this.state.sequenceTooSmall ? (
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                gutterBottom
              >
                Selection should be greater than 11 amino acids.
              </Typography>
            ) : null
          ) : this.state.sequenceTooSmall ? (
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              gutterBottom
            >
              Selection should be greater than 11 amino acids.
            </Typography>
          ) : (
            <Fragment>
              <hr />
              <nav className="level">
                <div className="level-item has-text-centered">
                  <div>
                    <p className="heading">Probability of Solubility</p>
                    <p className="title">{this.state.probOfSolubility}</p>
                  </div>
                </div>
                <div className="level-item has-text-centered">
                  <div>
                    <p className="heading">Flexibility</p>
                    <p className="title">{this.state.averageFlexibility}</p>
                  </div>
                </div>
                <div className="level-item has-text-centered">
                  <div>
                    <p className="heading">GRAVY</p>
                    <p className="title">{this.state.gravy}</p>
                  </div>
                </div>
              </nav>
            </Fragment>
          )}
          <hr />
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            gutterBottom
          >
            Currently selected sequence:
          </Typography>
          <div className="field has-addons">
            <p className="control is-expanded">
              <input
                className="input is-rounded"
                type="text"
                readOnly
                value={this.state.sequenceToShow}
              />
            </p>

            <p className="control">
              <button
                className="button is-danger is-rounded"
                onClick={() => {
                  let clip = navigator.clipboard;
                  if (clip === undefined) {
                    this.setState({
                      copyToClipboard: true,
                      clipboardCopiedMessage:
                        "Upgrade your browser to use the clipboard feature."
                    });
                  } else {
                    navigator.clipboard.writeText(this.state.sequenceToShow);
                    this.setState({
                      copyToClipboard: true,
                      clipboardCopiedMessage: "Copied to clipboard!"
                    });
                  }
                  setTimeout(() => {
                    this.setState({
                      copyToClipboard: false,
                      clipboardCopiedMessage: ""
                    });
                  }, 1000);
                  // this.setState({ : true });
                }}
              >
                <i className="fas fa-copy"></i>
              </button>

              {/*              <span className="icon is-small is-left">
                <Avatar>{this.state.avatarLetter}</Avatar>
              </span>*/}
            </p>
            {!this.props.nucleotide ? null : (
              <Fragment>
                <p className="control">
                  <button
                    className="button is-info is-rounded"
                    onClick={this.convertSequenceButton}
                  >
                    {this.state.convertClicked
                      ? "View DNA " +
                        (!this.props.calledFromSodope
                          ? ""
                          : "| Optimise expression")
                      : "Translate"}
                  </button>
                </p>

                {!this.props.calledFromSodope ? null : !this.state
                    .convertClicked ? (
                  <p className="control">
                    <button
                      className="button is-success is-rounded"
                      onClick={this.toggleOptimisation}
                    >
                      {this.state.isShowOptimisation
                        ? "Hide optimisation"
                        : "Optimise expression"}
                    </button>
                  </p>
                ) : null}
              </Fragment>
            )}
          </div>

          {this.state.copyToClipboard ? (
            <p className="help is-success has-text-right">
              {this.state.clipboardCopiedMessage}
            </p>
          ) : null}
          {/*!this.props.calledFromSodope ? null : this.state.convertClicked ? (
            <p className="help is-success has-text-right">
              Nucleotide can be optimised for expression.
            </p>
          ) : null*/}

          {!this.state.sequenceTooSmall ? (
            <SodopeChart
              currentSelectedSequence={this.state.currentSelectedSequence}
              key={this.props.key}
              region={this.state.sliderValue}
              hydropathy={this.state.hydropathicities}
              flexibilities={this.state.flexibilities}
            />
          ) : null}
        </Fragment>
      );
    }
  }
}

export default withStyles(styles)(SodopeResults);
