import React, { Fragment, Component } from "react";
import Navigation from "../Common/Navigation";
import Input from "./Input";
import Footer from "../Homepage/Footer";
import CookieConsent from "react-cookie-consent";
import { Link } from "react-router-dom";

class TIsigner extends Component {
  componentDidMount() {
    localStorage.setItem("isValidatedGeneral", true);
    localStorage.setItem("isValidatedExtra", true);
    localStorage.setItem("isValidatedAdvanced", true);
  }

  componentDidUpdate() {
    localStorage.setItem("isValidatedGeneral", true);
    localStorage.setItem("isValidatedExtra", true);
    localStorage.setItem("isValidatedAdvanced", true);
  }

  render() {
    return (
      <Fragment
        key={!this.props.location.key ? "initial" : this.props.location.key}
      >
        <Navigation link={"/tisigner"} />
        <section
          className="hero is-fullheight"
          style={{
            backgroundImage: "linear-gradient(to right, #1a2b32, #355664)"
          }}
        >
          <div className="hero-body">
            <div className="container is-fluid is-paddingless">
              <Input />
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

export default TIsigner;
