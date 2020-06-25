import React, { Component, Fragment } from "react";
import { Line } from "react-chartjs-2";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: this.props.region[0],
      hydropathy: this.props.hydropathy,
      flexibilities: this.props.flexibilities,
      inputProt: this.props.inputProt
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

    const data = {
      labels: Object.keys(hydro),
      datasets: [
        {
          label: "Hydrophobicity",
          fill: false,
          // lineTension: 0.01,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "#1f77b4",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "#1f77b4",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#1f77b4",
          pointHoverBorderColor: "rgba(220,220,220,1)'",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: Object.values(hydro),
          yAxisID: "Hydrophobicity"
        },
        {
          label: "Flexibility",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "#d62728",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "#d62728",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#d62728",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: Object.values(flex),
          yAxisID: "Flexibility"
        }
      ]
    };

    return (
      <Fragment>
        <div>
          <Line
            data={data}
            width={400}
            height={300}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                yAxes: [
                  {
                    id: "Hydrophobicity",
                    type: "linear",
                    position: "left",
                    scaleLabel: {
                      display: true,
                      labelString: "Hydrophobicity"
                    }
                  },
                  {
                    id: "Flexibility",
                    type: "linear",
                    position: "right",
                    scaleLabel: {
                      display: true,
                      labelString: "Flexibility"
                    },
                    ticks: {
                      suggestedMin: 1,
                    }
                  }
                ],
                xAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: "Position"
                    }
                  }
                ]
              }
            }}
          />
        </div>
      </Fragment>
    );
  }
}

export default Profile;
