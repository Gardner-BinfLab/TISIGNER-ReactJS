/**
 * @Author: Bikash Kumar Bhandari <bikash>
 * @Date:   2021-04-06T21:07:49+12:00
 * @Filename: index.jsx
 * @Last modified by:   bikash
 * @Last modified time: 2021-10-30T08:40:36+13:00
 */



import React, { Fragment, Component } from "react";
import Navigation from "../Common/Navigation";
import RazorInput from "./Input";
import Footer from "../Homepage/Footer";
import CookieConsent from "react-cookie-consent";
import { Link } from "react-router-dom";

class Razor extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Fragment
        key={!this.props.location.key ? "initial" : this.props.location.key}
      >
        <Navigation link={"/razor"} />
        <section
          className="hero is-fullheight"
          style={{
            backgroundImage: "linear-gradient(to right, #1a2b32, #355664)"
          }}
        >
          <div className="hero-head"></div>
          <div className="hero-body">
            <div className="container is-fluid is-paddingless">
              <RazorInput />
            </div>
          </div>
        </section>

        <CookieConsent>
          This website uses cookies and local storage to enhance the user
          experience. You can read our privacy policy{" "}
          <Link to="/privacy">here</Link>.
        </CookieConsent>

        <Footer />
      </Fragment>
    );
  }
}

export default Razor;
