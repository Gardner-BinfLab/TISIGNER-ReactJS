import React, { Component, Fragment } from "react";
import { Line } from "react-chartjs-2";
import ChartAnnotationsPlugin from "chartjs-plugin-annotation";

class RazorLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      inputProt: this.props.inputProt,
      probs: this.props.data.all_probs
    };
    // this.selectBestModel =  this.selectBestModel.bind(this)
  }

  // selectBestModel(data) {
  //   let preds = data.predictions
  //   // let cleavageSites = data.cleavage_sites
  //   let probs_c = data.c_score
  //   let probs_s = data.y_score
  //   // let cleavage = data.cleavage
  //
  //   // Position of picked cleavage site inside all
  //   // predictions where SP is true
  //   console.log(data.predictions)
  //   let pos = preds.map((e, i) => e === true ? i : '').filter(String)
  //   // Pick respective probability
  //   let allProbs = []
  //   pos.forEach(function (val, index) { allProbs.push(probs_s[val]) })
  //   let max_prob_index =  allProbs.indexOf(Math.max(...allProbs));
  //   let best_models = []
  //   for (var i=0; i<preds.length; i++){
  //     if (i===max_prob_index){
  //       best_models.push(true)
  //     } else {
  //       best_models.push(false)
  //     }
  //   }
  //   return best_models
  // }

  componentDidUpdate(prevProps, prevState) {
    let data = this.props.data;
    if (this.state.data !== data) {
      this.setState({
        data: data
      });
    }
  }

  render() {
    // //due to sliding window we add 5
    // let start = this.state.start + 5;
    // // let end = this.props.region[1] - 4

    // let hydro = {};
    // this.state.hydropathy.map((e, i) => (hydro[i + start] = e));
    // let flex = {};
    // this.state.flexibilities.map((e, i) => (flex[i + start] = e));

    let residue_pos = [];
    this.state.probs[0].map((e, i) =>
      residue_pos.push([
        this.state.inputProt[i + 15] === undefined
          ? "'S'"
          : this.state.inputProt[i + 15],
        i + 15 + 1
      ])
    );
    // let best_model_ = this.selectBestModel(this.props.data)
    // const cleav = this.state.data.cleavage;


    const data = {
      labels: residue_pos,


      datasets: [
        {
          label: "Model 1",
          fill: false,
          // lineTension: 0.01,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "#636efa", //"#1f77b4",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "#636efa",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#636efa",
          pointHoverBorderColor: "rgba(220,220,220,1)'",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.probs[0],
          yAxisID: "C score",
          steppedLine: "after"
          // hidden: best_model_[0],
        },
        {
          label: "Model 2",
          fill: false,
          // lineTension: 0.01,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "#ef553b",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "#ef553b",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#ef553b",
          pointHoverBorderColor: "rgba(220,220,220,1)'",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.probs[1],
          yAxisID: "C score",
          steppedLine: "after"
          // hidden: best_model_[1],
        },
        {
          label: "Model 3",
          fill: false,
          // lineTension: 0.01,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "#00cc96",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "#00cc96",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#00cc96",
          pointHoverBorderColor: "rgba(220,220,220,1)'",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.probs[2],
          yAxisID: "C score",
          steppedLine: "after"
          // hidden: best_model_[2],
        },
        {
          label: "Model 4",
          fill: false,
          // lineTension: 0.01,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "#d6272",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "#d6272",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#d6272",
          pointHoverBorderColor: "rgba(220,220,220,1)'",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.probs[3],
          yAxisID: "C score",
          steppedLine: "after"
          // hidden: best_model_[3],
        },
        {
          label: "Model 5",
          fill: false,
          // lineTension: 0.01,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "#9467bd",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "#9467bd",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#9467bd",
          pointHoverBorderColor: "rgba(220,220,220,1)'",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.probs[4],
          yAxisID: "C score",
          steppedLine: "after"
          // hidden: best_model_[4],
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
                    id: "C score",
                    type: "linear",
                    position: "left",
                    scaleLabel: {
                      display: true,
                      labelString: "C score"
                    },
                    ticks: {
                      max: 1,
                      min: 0
                    }
                  }
                  //   {
                  //     id: "Flexibility",
                  //     type: "linear",
                  //     position: "right",
                  //     scaleLabel: {
                  //       display: true,
                  //       labelString: "Flexibility"
                  //     },
                  //     ticks: {
                  //       suggestedMin: 1,
                  //     }
                  //   }
                ],
                xAxes: [
                  {
                    id: "x-axis-2",
                    scaleLabel: {
                      display: true,
                      labelString: "Residue (Position)"
                    },
                    ticks: {
                      autoSkip: true,
                      // maxTicksLimit: 80,
                      maxRotation: 0,
                      // callback: function(tickValue, index, ticks) {
                      //   return tickValue;
                      //   // return ["     " + tickValue[0], "     " + tickValue[1]];
                      //   // if (index > (cleav - 16)){
                      //   //   return tickValue;
                      //   // } else {
                      //   //   return ['__' +tickValue[0], tickValue[1]]
                      //   // }
                      // }
                    }
                    // gridlines: {
                    //   color: ['#FFFFFF']
                    // }
                  }
                ]
              },
              annotation: {
                annotations: [
                  {
                    type: "line",
                    drawTime: "afterDatasetsDraw",
                    mode: "vertical",
                    scaleID: "x-axis-2",
                    value:
                      this.state.data.predictions.filter(x => x === true)
                        .length === 0
                        ? null
                        : this.state.data.cleavage - 16 + 0.5,
                    // value: this.state.data.cleavage_sites[0] - 16 + 0.5,
                    borderColor: "black",
                    borderWidth: 2,
                    borderDash: [2, 1],
                    label: {
                      // enabled: true,
                      // content: "Current",
                      // position: "bottom"
                    }
                  }
                  // {
                  //   type: "line",
                  //   drawTime: "afterDatasetsDraw",
                  //   mode: "vertical",
                  //   scaleID: "x-axis-2",
                  //   value: this.state.data.cleavage_sites[1] - 16 + 0.5,
                  //   // borderColor: "rgba(75, 192, 192, 0.8)",
                  //   borderColor:'black',
                  //   borderWidth: 2,
                  //   borderDash: [2, 1],
                  //   label: {
                  //     // enabled: true,
                  //     // content: "Top optimised",
                  //     // position: "top"
                  //   }
                  // },
                  // {
                  //   type: "line",
                  //   drawTime: "afterDatasetsDraw",
                  //   mode: "vertical",
                  //   scaleID: "x-axis-2",
                  //   value: this.state.data.cleavage_sites[2] - 16 + 0.5,
                  //   // borderColor: "rgb(75, 192, 192, 0.8)",
                  //   borderColor:'black',
                  //   borderWidth: 2,
                  //   borderDash: [2, 1],
                  //   label: {
                  //     // enabled: true,
                  //     // content: "Input",
                  //     // position: "center"
                  //   }
                  // },
                  // {
                  //   type: "line",
                  //   drawTime: "afterDatasetsDraw",
                  //   mode: "vertical",
                  //   scaleID: "x-axis-2",
                  //   value: this.state.data.cleavage_sites[3] - 16 + 0.5,
                  //   // borderColor: "rgb(75, 192, 192, 0.8)",
                  //   borderColor:'black',
                  //   borderWidth: 2,
                  //   borderDash: [2, 1],
                  //   label: {
                  //     // enabled: true,
                  //     // content: "Input",
                  //     // position: "center"
                  //   }
                  // },
                  // {
                  //   type: "line",
                  //   drawTime: "afterDatasetsDraw",
                  //   mode: "vertical",
                  //   scaleID: "x-axis-2",
                  //   value: this.state.data.cleavage_sites[4] - 16 + 0.5,
                  //   // borderColor: "rgb(75, 192, 192, 0.8)",
                  //   borderColor:'black',
                  //   borderWidth: 2,
                  //   borderDash: [2, 1],
                  //   label: {
                  //     // enabled: true,
                  //     // content: "Input",
                  //     // position: "center"
                  //   }
                  // }
                ]
              }
              // elements: {
              //   point: {
              //     pointStyle: 'line'
              //   }
              // }
            }}
          />
        </div>
      </Fragment>
    );
  }
}

export default RazorLine;
