import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import ChartAnnotationsPlugin from "chartjs-plugin-annotation";

class Chart extends Component {
  render() {
    // appx openingEnergy: kde obtained from PSI:Biology
    const data = {
      labels: [
        0,
        0.67346939,
        1.34693878,
        2.02040816,
        2.69387755,
        3.36734694,
        4.04081633,
        4.71428571,
        5.3877551,
        6.06122449,
        6.73469388,
        7.40816327,
        8.08163265,
        8.75510204,
        9.42857143,
        10.10204082,
        10.7755102,
        11.44897959,
        12.12244898,
        12.79591837,
        13.46938776,
        14.14285714,
        14.81632653,
        15.48979592,
        16.16326531,
        16.83673469,
        17.51020408,
        18.18367347,
        18.85714286,
        19.53061224,
        20.20408163,
        20.87755102,
        21.55102041,
        22.2244898,
        22.89795918,
        23.57142857,
        24.24489796,
        24.91836735,
        25.59183673,
        26.26530612,
        26.93877551,
        27.6122449,
        28.28571429,
        28.95918367,
        29.63265306,
        30.30612245,
        30.97959184,
        31.65306122,
        32.32653061,
        33
      ],
      datasets: [
        {
          label: "Success",
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
          data: [
            1.98738964346095e-6,
            1.98738964346095e-6,
            1.98738964346095e-6,
            3.979134904699868e-5,
            0.0005614693463309397,
            0.0015994783332591886,
            0.007059343154791341,
            0.01959674401987233,
            0.03344511636457853,
            0.05846219766091034,
            0.08812439667470215,
            0.11259352563647178,
            0.1357682202648517,
            0.14211606213908856,
            0.14570074633478247,
            0.1351020183433137,
            0.1268336184495585,
            0.10785947362483832,
            0.09562433135532121,
            0.07934998819340157,
            0.05797529403020855,
            0.04464152892547112,
            0.031056912967964322,
            0.019465426689115016,
            0.013458606780850584,
            0.009290589646287092,
            0.0072191819217718774,
            0.00481998609914608,
            0.003381550290010877,
            0.0027037492134495186,
            0.0018640790321791344,
            0.0010672153576768515,
            0.00030447049761963126,
            0.0001961151937122446,
            4.936898440389916e-5,
            4.358236613730531e-5,
            0.0002030749922550749,
            0.00014137135559688042,
            0.00010345471895537332,
            4.37357584524152e-5,
            1.1173963588429985e-6,
            1.1173963588429985e-6,
            1.1173963588429985e-6,
            1.1173963588429985e-6,
            1.1173963588429985e-6,
            1.1173963588429985e-6,
            1.1173963588429985e-6,
            1.1173963588429985e-6,
            1.1173963588429985e-6,
            1.1173963588429985e-6
          ]
        },
        {
          label: "Failure",
          fill: false,
          // lineTension: 0.01,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: '#d62728',
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
          data: [
            5.437758361148604e-6,
            5.437758361148604e-6,
            5.437758361148604e-6,
            5.397169299206176e-5,
            0.00032248749940829824,
            0.0012660911082912243,
            0.005280751012420593,
            0.009821077717552978,
            0.015469945304867552,
            0.023015782861449723,
            0.033982478828445295,
            0.048250752743149404,
            0.06741365641897708,
            0.07535156640619728,
            0.0834311789634686,
            0.09314100388060208,
            0.10061604385988879,
            0.10365480589977134,
            0.10144817567167914,
            0.09734173335858409,
            0.09274376624962825,
            0.08880318802397255,
            0.08443827862752538,
            0.07766982571253733,
            0.06290949102413919,
            0.051156199195859016,
            0.03966004606891997,
            0.03015605437361742,
            0.023554815332062107,
            0.0191747904887778,
            0.013276183928893279,
            0.00912923396576851,
            0.005819565146953443,
            0.004128214349275207,
            0.0036718639573756536,
            0.0034950737504194852,
            0.002985476454187301,
            0.0018129676325811912,
            0.0012868050108287184,
            0.0009077691932529392,
            0.0005222456180022826,
            0.0002047648974706759,
            6.214594206722606e-5,
            0.00011287484615139223,
            0.00019046772982714063,
            0.00016835234521245699,
            7.676975792930047e-5,
            1.805206870461312e-5,
            2.1888850127133413e-6,
            2.1888850127133413e-6
          ]
        }
      ],
    };

    return (
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
                  id: "probDensity",
                  type: "linear",
                  ticks: {
                    //beginAtZero: true,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "Density"
                  }
                }
              ],

              xAxes: [
                {
                  beginAtZero: true,
                  // type: 'category',
                  position: "bottom",
                  display: false
                },
                {
                  id: "x-axis-2",
                  type: "linear",
                  position: "bottom",
                  display: true,

                  scaleLabel: {
                    display: true,
                    labelString: "Opening energy (kcal/mol)"
                  },

                  ticks: {
                    min: 0,
                    max: 35,
                    stepSize: 2
                  }
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
                  value: this.props.current,
                  borderColor: "rgb(75, 192, 192)",
                  borderWidth: 2,
                  label: {
                    enabled: true,
                    content: "This sequence",
                    position: "bottom"
                  }
                },
                {
                  type: "line",
                  drawTime: "afterDatasetsDraw",
                  mode: "vertical",
                  scaleID: "x-axis-2",
                  value: this.props.selected,
                  borderColor: "rgba(75, 192, 192, 0.8)",
                  borderWidth: 2,
                  label: {
                    enabled: true,
                    content: "Top optimised",
                    position: "top"
                  }
                },
                {
                  type: "line",
                  drawTime: "afterDatasetsDraw",
                  mode: "vertical",
                  scaleID: "x-axis-2",
                  value: this.props.input,
                  borderColor: "rgb(75, 192, 192, 0.8)",
                  borderWidth: 2,
                  label: {
                    enabled: true,
                    content: "Input",
                    position: "center"
                  }
                }
              ]
            }
          }}
        />
      </div>
    );
  }
}

export default Chart;
