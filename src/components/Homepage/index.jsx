import React, { Fragment } from "react";
import Banner from "./Banner";
import Tools from "./Tools";
// import Collabs from "./Collabs";
import Footer from "./Footer";
import CookieConsent from "react-cookie-consent";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <Fragment>
      <Banner />
      <Tools />
      {/*      <Collabs />*/}
      <Footer />
      <CookieConsent>
        This website uses cookies and local storage to enhance the user
        experience. You can read our privacy policy{" "}
        <Link to="/privacy">here</Link>.
      </CookieConsent>
    </Fragment>
  );
};

export default Homepage;
