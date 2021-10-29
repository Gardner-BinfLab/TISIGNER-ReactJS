/**
 * @Author: Bikash Kumar Bhandari <bikash>
 * @Date:   2021-04-06T21:07:49+12:00
 * @Filename: index.jsx
 * @Last modified by:   bikash
 * @Last modified time: 2021-10-30T08:40:25+13:00
 */



import React, { Component } from "react";
import Particles from "react-particles-js";

class AnimatedParticles extends Component {
  render() {
    return (
        <Particles
          params={{
            particles: {
              number: {
                value: 50
              },
              size: {
                value: 0.5
              }
            },
            interactivity: {
              events: {
                onhover: {
                  enable: false,
                  mode: "repulse"
                }
              }
            }
          }}
          style={{
            position: "fixed",
            height: "100%",
            top: "0",
            left: "0",
            width: "100%"
          }}
        />
    );
  }
}

export default AnimatedParticles;
