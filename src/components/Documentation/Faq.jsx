import React, { Fragment, useEffect } from "react";
import Navigation from "../Common/Navigation";
import Footer from "../Homepage/Footer";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import ReactGA from "react-ga";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const Faq = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  ReactGA.event({
    category: "FAQ",
    action: "General FAQ clicked.",
  });

  return (
    <Fragment>
      <Navigation />
      <section
        className="hero is-fullheight"
        style={{
          backgroundImage: "linear-gradient(to right, #1a2b32, #355664)",
        }}
      >
        <div className="hero-head"></div>
        <div className="hero-body">
          <div className="container is-fluid is-paddingless">
            <div className="box">
              <div className="content">
                <Typography variant="h2" component="h3" gutterBottom>
                  Help
                </Typography>

                {/* <Typography variant="subtitle2" gutterBottom>
                  General
                </Typography> */}
                <Typography variant="body2" gutterBottom>
                  TISIGNER is a set of tools to improve the outcomes of
                  recombinant protein expression experiment.
                </Typography>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tools</TableCell>
                        <TableCell align="right">Purpose</TableCell>
                        <TableCell align="right">FAQ link</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <Link to="/tisigner">TIsigner</Link>
                        </TableCell>
                        <TableCell align="right">
                          Checking and optimising protein expression
                        </TableCell>
                        <TableCell align="right">
                          <Link to="/tisigner/faq">TIsigner FAQ</Link>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <Link to="/sodope">SoDoPE</Link>
                        </TableCell>
                        <TableCell align="right">
                          Checking and optimising protein solubility
                        </TableCell>
                        <TableCell align="right">
                          <Link to="/sodope/faq">SoDoPE FAQ</Link>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <Link to="/razor">Razor</Link>
                        </TableCell>
                        <TableCell align="right">
                          Detecting eukaryotic signal peptides. Additionally,
                          detects whether the signal peptide harbours a toxic
                          protein or is from fungi.
                        </TableCell>
                        <TableCell align="right">
                          <Link to="/razor/faq">Razor FAQ</Link>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h2" component="h3" gutterBottom>
                  Browser compatibility
                </Typography>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>OS</TableCell>
                        <TableCell align="right">Version</TableCell>
                        <TableCell align="right">Chrome</TableCell>
                        <TableCell align="right">Firefox</TableCell>
                        <TableCell align="right">Microsoft Edge</TableCell>
                        <TableCell align="right">Safari</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Linux
                        </TableCell>
                        <TableCell align="right">
                          Ubuntu (20.04.1), Debian GNU/Linux 10
                        </TableCell>
                        <TableCell align="right">83.0</TableCell>
                        <TableCell align="right">81.0</TableCell>
                        <TableCell align="right">n/a</TableCell>
                        <TableCell align="right">n/a</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          MacOS
                        </TableCell>
                        <TableCell align="right">10.14</TableCell>
                        <TableCell align="right">Not tested</TableCell>
                        <TableCell align="right">Not tested</TableCell>
                        <TableCell align="right">Not tested</TableCell>
                        <TableCell align="right">14.0</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Windows
                        </TableCell>
                        <TableCell align="right">10</TableCell>
                        <TableCell align="right">85.0</TableCell>
                        <TableCell align="right">81.0</TableCell>
                        <TableCell align="right">85.0</TableCell>
                        <TableCell align="right">Not tested</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>


              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </Fragment>
  );
};

export default Faq;
