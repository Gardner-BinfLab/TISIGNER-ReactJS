/**
 * @Author: Bikash Kumar Bhandari <bikash>
 * @Date:   2021-04-06T21:07:49+12:00
 * @Filename: Domain.jsx
 * @Last modified by:   bikash
 * @Last modified time: 2021-10-30T08:40:52+13:00
 */



import React, { Component, Fragment } from "react";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

class Domain extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let data = this.props.data;
    // {
    //   !(data && data.results.hits.length) ?
    //
    // }

    return (
      <Slider
        value={this.state.targetExpression}
        valueLabelDisplay="auto"
        marks={marks}
        min={5}
        max={100}
        onChange={this.sliderChange}
      />
    );
  }
}

export default Domain;
