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
              style={{
                color: "inherit",
                textDecoration: "inherit",
                borderBottom:
                  props.link === "/tisigner"
                    ? "1px solid rgb(212, 212, 212)"
                    : null
              }}
            >
              TIsigner
            </Link>
          </p>

          <p className="navbar-item">
            <Link
              to={{ pathname: "/sodope", key: "nav-sodope" }}
              style={{
                color: "inherit",
                textDecoration: "inherit",
                borderBottom:
                  props.link === "/sodope"
                    ? "1px solid rgb(212, 212, 212)"
                    : null
              }}
            >
              SoDoPE
            </Link>
          </p>
        </div>

        <div className="navbar-end">
          <p className="navbar-item">
            <Link
              to={props.link + "/faq"}
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <span className="icon">
                <i className="fab far fa-question-circle"></i>
              </span>
              <span>FAQ</span>
            </Link>
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
