import React from "react";
import { Link } from "react-router-dom";

const Navigation = props => {
  // set active state for hamburger
  const [isActive, setisActive] = React.useState(false);

  return (
    <nav
      className="navbar is-black is-fixed-top"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
{/*}        <Link to="/">
          <p className="navbar-item" alt="TIsigner logo">
            <img
              src="/favicon.png"
              width="28"
              height="28"
              alt="TIsigner icon"
            />
          </p>
        </Link>*/}

        <p
          role="button"
          className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbar"
          onClick={() => {
            setisActive(!isActive);
          }}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </p>
      </div>

      <div id="navbar" className={`navbar-menu ${isActive ? "is-active" : ""}`}>
        <div className="navbar-start">

        <p className="navbar-item">
          <Link
            to={{ pathname: "/", key: "nav-tisigner" }}
            style={{ color: "inherit", textDecoration: "inherit" }}
          >
            Home
          </Link>
        </p>


          <p className="navbar-item">
            <Link
              to={{ pathname: "/tisigner", key: "nav-tisigner" }}
              style={{ color: "inherit", textDecoration: "inherit",
              borderBottom: props.link === '/tisigner' ? "1px solid rgb(212, 212, 212)": null}}
            >
              TIsigner
            </Link>
          </p>

          <p className="navbar-item">
            <Link
              to={{ pathname: "/sodope", key: "nav-sodope" }}
              style={{ color: "inherit", textDecoration: "inherit" ,
              borderBottom: props.link === '/sodope' ? "1px solid rgb(212, 212, 212)": null}}
            >
              SoDoPE
            </Link>
          </p>


        </div>

        <div className="navbar-end">

        <p className="navbar-item">
          <Link
            to={props.link + "/faq"}
            style={{ color: "inherit", textDecoration: "inherit"}}
          >
            FAQ
          </Link>
        </p>

{/*          <p className="navbar-item">
            <a
              href="https://github.com/Gardner-BinfLab/TIsigner"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <span className="icon">
                <i className="fab fa-circle fa-github"></i>
              </span>
              <span>GitHub</span>
            </a>
          </p>*/}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
