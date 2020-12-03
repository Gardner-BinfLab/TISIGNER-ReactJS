import React, { Fragment, useEffect } from "react";
import Navigation from "../Common/Navigation";
import Footer from "../Homepage/Footer";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import ReactGA from "react-ga";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import Chart from "../Chart/Chart";
import TIsignerData from "./TIsigner_training_seqs.7z";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Slider from "@material-ui/core/Slider";

const TisignerDocumentation = (props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  ReactGA.event({
    category: "Documentation",
    action: "Documentation clicked.",
    label: "TIsigner",
  });

  const marks = [
    {
      value: 5,
      label: "5",
    },
    {
      value: 30,
      label: "30 (Low)",
    },
    {
      value: 70,
      label: "70 (High)",
    },
    {
      value: 100,
      label: "100",
    },
  ];

  return (
    <Fragment>
      <Navigation link={"/tisigner"} />
      <section
        className="hero is-fullheight"
        style={{
          backgroundImage: "linear-gradient(to right, #1a2b32, #355664)",
        }}
      >
        <div className="hero-head"></div>
        <div className="hero-body">
          <div className="container is-fluid is-paddingless">
            <br />
            <div className="box">
              <div className="content">
                <Typography variant="h2" component="h3" gutterBottom>
                  Interpreting results
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Optimised sequences
                </Typography>
                <Typography variant="body2" gutterBottom>
                  The best solution is always displayed at the top, followed by
                  the results of the input sequence and alternative solutions.
                  TIsigner employs a stochastic optimisation routine (
                  <a
                    href="https://en.wikipedia.org/wiki/Simulated_annealing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    simulated annealing
                  </a>
                  ) to optimise sequences. Consequently, the optimised sequences
                  may exceed or slightly below the target expression score (see
                  the below example). We also highlight the synonymous changes
                  made to the input sequence.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Sequence properties
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Lower opening energy implies that the RNA can be{" "}
                  <em>opened</em> more readily, thus may be more accessible to
                  initiating ribosomes. We use the accessibility of translation
                  initiation sites as a proxy to protein level.
                </Typography>
                {/*                <Typography variant="body2" gutterBottom>
                  We display sequence properties for all sequences. A sample
                  display is shown below:
                </Typography>*/}
                <div className="card">
                  <div className="card-content">
                    <nav className="level">
                      <div className="level-item has-text-centered">
                        <div>
                          <p className="heading">Opening energy (KCal/mol)</p>
                          <p className="title">4.56</p>
                        </div>
                      </div>
                      <div className="level-item has-text-centered">
                        <div>
                          <p className="heading">Expression score</p>
                          <p className="title">98.06</p>
                        </div>
                      </div>
                      <div className="level-item has-text-centered">
                        <div>
                          <p className="heading">Terminator Hits (E values)</p>
                          <p className="title">4 (6.3, 6.2, 8.7, 4.2)</p>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>

                <List>
                  <Divider variant="middle" />
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                        >
                          Opening energy (KCal/mol)
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          style={{ display: "inline" }}
                          color="textPrimary"
                        >
                          Opening energy &nbsp;
                          <math
                            xmlns="http://www.w3.org/1998/Math/MathML"
                            display="inline"
                            title="Opening energy"
                          >
                            <mrow>
                              <mi>Δ</mi>
                              <msub>
                                <mrow>
                                  <mi>G</mi>
                                </mrow>
                                <mrow>
                                  <mi>i</mi>
                                  <mo>,</mo>
                                  <mi>j</mi>
                                </mrow>
                              </msub>
                            </mrow>
                          </math>{" "}
                          is the <em>pseudoenergy</em> required to unpair the
                          nucleotides{" "}
                          <math
                            xmlns="http://www.w3.org/1998/Math/MathML"
                            display="inline"
                            title="i...j "
                          >
                            <mrow>
                              <mi>i</mi>
                              <mi>.</mi>
                              <mi>.</mi>
                              <mi>.</mi>
                              <mi>j</mi>
                            </mrow>
                          </math>
                          . Formally, the opening energy can be written as:
                          <math
                            xmlns="http://www.w3.org/1998/Math/MathML"
                            display="block"
                            title="Opening energy is the log of ratio of Zunpaired to Z"
                          >
                            <mrow>
                              <mi>Δ</mi>
                              <msub>
                                <mrow>
                                  <mi>G</mi>
                                </mrow>
                                <mrow>
                                  <mi>i</mi>
                                  <mo>,</mo>
                                  <mi>j</mi>
                                </mrow>
                              </msub>
                              <mo>=</mo>
                              <mo>-</mo>
                              <mfrac>
                                <mrow>
                                  <mn>1</mn>
                                </mrow>
                                <mrow>
                                  <mi>β</mi>
                                </mrow>
                              </mfrac>
                              <mo>ln</mo>
                              <mfrac>
                                <mrow>
                                  <msub>
                                    <mrow>
                                      <mi>Z</mi>
                                    </mrow>
                                    <mrow>
                                      <mi>u</mi>
                                      <mi>n</mi>
                                      <mi>p</mi>
                                      <mi>a</mi>
                                      <mi>i</mi>
                                      <mi>r</mi>
                                      <mi>e</mi>
                                      <mi>d</mi>
                                    </mrow>
                                  </msub>
                                </mrow>
                                <mrow>
                                  <mi>Z</mi>
                                </mrow>
                              </mfrac>
                            </mrow>
                          </math>
                          where{" "}
                          <math
                            xmlns="http://www.w3.org/1998/Math/MathML"
                            display="inline"
                            title="Z_unpaired "
                          >
                            <mrow>
                              <msub>
                                <mrow>
                                  <mi>Z</mi>
                                </mrow>
                                <mrow>
                                  <mi>u</mi>
                                  <mi>n</mi>
                                  <mi>p</mi>
                                  <mi>a</mi>
                                  <mi>i</mi>
                                  <mi>r</mi>
                                  <mi>e</mi>
                                  <mi>d</mi>
                                </mrow>
                              </msub>
                            </mrow>
                          </math>{" "}
                          is the partition function over all possible structures
                          where{" "}
                          <math
                            xmlns="http://www.w3.org/1998/Math/MathML"
                            display="inline"
                            title="i...j "
                          >
                            <mrow>
                              <mi>i</mi>
                              <mi>.</mi>
                              <mi>.</mi>
                              <mi>.</mi>
                              <mi>j</mi>
                            </mrow>
                          </math>{" "}
                          is unpaired,{" "}
                          <math
                            xmlns="http://www.w3.org/1998/Math/MathML"
                            display="inline"
                            title="Z"
                          >
                            <mrow>
                              <msub>
                                <mrow>
                                  <mi>Z</mi>
                                </mrow>
                                <mrow />
                              </msub>
                            </mrow>
                          </math>{" "}
                          is the total partition function and{" "}
                          <math
                            xmlns="http://www.w3.org/1998/Math/MathML"
                            display="inline"
                            title="1/KT "
                          >
                            <mrow>
                              <mi>β</mi>
                            </mrow>
                          </math>{" "}
                          is the thermodynamic beta. The ratio of these two
                          partition functions is also the probability that the
                          region{" "}
                          <math
                            xmlns="http://www.w3.org/1998/Math/MathML"
                            display="inline"
                            title="i...j "
                          >
                            <mrow>
                              <mi>i</mi>
                              <mi>.</mi>
                              <mi>.</mi>
                              <mi>.</mi>
                              <mi>j</mi>
                            </mrow>
                          </math>{" "}
                          is unpaired. We use{" "}
                          <a
                            href="https://www.tbi.univie.ac.at/RNA/RNAplfold.1.html"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            RNAplfold
                          </a>{" "}
                          from ViennaRNA to compute the opening energy.
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider variant="middle" />
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                        >
                          Expression score
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          style={{ display: "inline" }}
                          color="textPrimary"
                          gutterBottom
                        >
                          Since opening energy might not be intuitive to all
                          users, we rescaled the opening energy distribution
                          obtained from{" "}
                          <a
                            href="http://targetdb.rcsb.org/metrics/index.html"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            PSI:Biology
                          </a>{" "}
                          (8,780 'success' and 2,650 'failure' experiments using
                          an <i>Escherichia coli</i> T7 lac promoter system) by
                          using logistic regression. We call these rescaled
                          values as the expression scores, and the default score
                          is 100. Users can set a score between 5 and 100 (low
                          and high protein levels, respectively) using the
                          expression tuner available at{" "}
                          <em>Settings > General</em>, which appears as follows:
                        </Typography>
                      }
                    />
                  </ListItem>

                  <div className="card">
                    <div className="card-content">
                      <Slider
                        defaultValue={100}
                        valueLabelDisplay="auto"
                        marks={marks}
                        min={5}
                        max={100}
                      />
                    </div>
                  </div>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          style={{ display: "inline" }}
                          color="textPrimary"
                        >
                          By default, the expression host is <i>E. coli</i> and
                          promoter is T7 lac, thus the expression score is
                          tunable. For other cases, opening energy can be either
                          maximised or minimised.
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider variant="middle" />
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                        >
                          Terminator Hits (E values)
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          style={{ display: "inline" }}
                          color="textPrimary"
                        >
                          We also check for the presence of terminators in the
                          input sequence using cmsearch (
                          <a
                            href="http://http://eddylab.org/infernal/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            INFERNAL
                          </a>
                          ) and{" "}
                          <a
                            href="https://github.com/ppgardne/RMfam"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            RMfam
                          </a>
                          . If there are any hits, we report the number of those
                          hits and their corresponding E values. If there are no
                          hits, then these two fields are not displayed.
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider variant="middle" />
                </List>

                <Typography variant="subtitle2" gutterBottom>
                  Plot
                </Typography>
                <Typography variant="body2" gutterBottom>
                  On the distribution of opening energy of 'failure' and
                  'success' experiments form PSI:Biology , we annotate the
                  opening energy of each sequence in the results. For
                  comparision, the opening energy of the input sequence and the
                  optimised sequence closest to the input parameters (Top
                  optimised) are always displayed. A sample display of the plot
                  is shown below.
                </Typography>
                <div className="card">
                  <div className="card-content">
                    <Chart selected={4.56} input={14.34} current={11} />
                  </div>
                </div>
                <br />

                <Typography variant="h2" component="h3" gutterBottom>
                  Data used
                </Typography>
                <Typography variant="body2" gutterBottom>
                  The data used in TIsigner is curated by{" "}
                  <a
                    href="http://dnasu.org/DNASU/Home.do"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    DNASU
                  </a>{" "}
                  and can be downloaded{" "}
                  <a href={TIsignerData} download>
                    here
                  </a>
                  . The data is of the following format:
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>DNASU Clone ID</TableCell>
                        <TableCell align="right">Sequence</TableCell>
                        <TableCell align="right">Label</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          BbCD00385183
                        </TableCell>
                        <TableCell align="right">
                          ATGCTCACTATCGATACGGCGTCCCGCACTTTTCACTGCAAGACCT..
                        </TableCell>
                        <TableCell align="right">1</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <br />
                <Typography variant="body2" gutterBottom>
                  The label is either 0 ('Failure') or 1 ('Success'). The
                  default promoter is
                </Typography>
                <pre>
                  <code>
                    >T7lac
                    <br />
                    GGGGAATTGTGAGCGGATAACAATTCCCCTCTAGAAATAATTTTGTTTAACTTTAAGAAGGAGATATACAT
                  </code>
                </pre>

                <Typography variant="h2" component="h3" gutterBottom>
                  FAQ
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  What is TIsigner?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  TIsigner (Translation Initiation coding region designer) is a
                  gene optimisation tool.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Why TIsigner requires a 5&prime; UTR (promoter) sequence to
                  run?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  TIsigner takes a 5&prime; UTR sequence into account when
                  calculating the opening energy (accessibility) of translation
                  initiation site.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  What should I do if the promoter of my expression vector is
                  not available in the drop down menu and I can not figure out
                  the transcription start site?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  If unsure input the 71 nt vector-encoded sequence preceding
                  the start codon.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Could I optimise multiple sequences per job?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  TIsigner webserver limits one sequence per job to control work
                  load. For scaling up, please consider using the{" "}
                  <a
                    href="https://github.com/Gardner-BinfLab/TIsigner"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    command line version
                  </a>
                  .
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Could TIsigner optimise the full-length sequence of a gene of
                  interest?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  TIsigner has an option for full-length sequence optimisation
                  but this approach will have limited returns in general. The
                  exception is, if your expression vector encodes a short
                  N-terminal fusion tag.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Why not optimise the full-length sequence?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Codon adaptation index (CAI) is the most popular feature for
                  full-length gene optimisation. However, many evaluations have
                  shown that CAI has a limited relationship with protein
                  expression (0.54 AUC, in our evaluations using 11,430{" "}
                  <a
                    href="http://targetdb.rcsb.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    recombinant protein expression experiments
                  </a>{" "}
                  in <i>E. coli</i>). An AUC score of 0.5 is expected for
                  tossing a coin, suggesting that CAI has limited use in gene
                  optimisation. In contrast, the accessibility of translation
                  initiation sites has an AUC score of 0.7. Furthermore,
                  optimising as few as the first nine codons is sufficient to
                  improve the accessibility of the translation initiation
                  region.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Could I copy and distribute TIsigner for commercial purposes?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  See our <Link to="/license">License page</Link>.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  How to cite TIsigner?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Bhandari, B.K., Lim, C.S., Gardner, P.P. (2019) Highly
                  accessible translation initiation sites are predictive of
                  successful heterologous protein expression.
                  <cite title="Highly accessible translation initiation sites are predictive of successful heterologous protein expression.">
                    {" "}
                    bioRxiv
                  </cite>
                  . DOI:
                  <a
                    href="https://doi.org/10.1101/726752"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    10.1101/726752
                  </a>
                  .<br />
                  If you find protein solubility prediction and optimisation
                  useful, please cite :
                  <br />
                  Bhandari, B.K., Gardner, P.P., Lim, C.S.
                  (2020) Solubility-Weighted Index: Fast and Accurate Prediction
                  of Protein Solubility.
                  <cite title="Solubility-Weighted Index: Fast and Accurate Prediction of Protein Solubility ">
                    {" "}
                    Bioinformatics.
                  </cite>{" "}
                  DOI:
                  <a
                    href="https://doi.org/10.1093/bioinformatics/btaa578"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    10.1093/bioinformatics/btaa578
                  </a>
                  .<br />
                  If you find signal peptide prediction useful, please cite the
                  following preprint:
                  <br />
                  Bhandari, B.K., Gardner, P.P., Lim, C.S. (2020) Annotating
                  eukaryotic and toxin-specific signal peptides using Razor.
                  <cite title="Annotating eukaryotic and toxin-specific signal peptides using Razor.">
                    {" "}
                    bioRxiv.
                  </cite>{" "}
                  DOI:
                  <a
                    href="https://doi.org/10.1101/2020.11.30.405613"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    10.1101/2020.11.30.405613
                  </a>
                  .
                </Typography>
              </div>
            </div>
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
};

export default TisignerDocumentation;
