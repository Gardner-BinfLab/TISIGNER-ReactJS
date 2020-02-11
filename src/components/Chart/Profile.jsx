import React, { Component } from "react";
import { LineChart } from "react-chartkick";
import "chart.js";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: this.props.region[0],
      hydropathy: this.props.hydropathy,
      flexibilities: this.props.flexibilities
    };
  }

  componentDidUpdate(prevProps, prevState) {
    let start = this.props.region[0];
    if (this.state.start !== start) {
      this.setState({
        start: start
      });
    }

    let hydropathy = this.props.hydropathy;
    if (this.state.hydropathy !== hydropathy) {
      this.setState({
        hydropathy: hydropathy
      });
    }

    let flexibilities = this.props.flexibilities;
    if (this.state.flexibilities !== flexibilities) {
      this.setState({
        flexibilities: flexibilities
      });
    }
  }

  render() {
    //due to sliding window we add 5
    let start = this.state.start + 5;
    // let end = this.props.region[1] - 4

    let hydro = {};
    this.state.hydropathy.map((e, i) => (hydro[i + start] = e));
    let flex = {};
    this.state.flexibilities.map((e, i) => (flex[i + start] = e));

    var plotData = [
      { name: "Hydrophilicity", data: hydro },
      { name: "Flexibility", data: flex }
    ];

    return (
      <LineChart
        data={plotData}
        xtitle="Position"
        ytitle=""
        dataset={{
          pointRadius: 0,
          pointHoverRadius: 0.5,
          linetension: 1.5
        }}
        library={{
          responsive: true
        }}
      />
    );
  }
}

export default Profile;
