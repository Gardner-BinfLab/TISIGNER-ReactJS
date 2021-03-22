import React, { Fragment, useEffect } from "react";
import Navigation from "../Common/Navigation";
import Footer from "../Homepage/Footer";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import ReactGA from "react-ga";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import SoDoPETrain from "./sodope_train.csv.gz";
import SoDoPETestEsol from "./sodope_test_eSOL.csv.gz";
// import SoDoPETestStickiness from "./sodope_test_Stickiness.csv.gz";
import Slider from "@material-ui/core/Slider";

const SodopeDocumentation = (props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  ReactGA.event({
    category: "Documentation",
    action: "Documentation clicked.",
    label: "SoDoPE",
  });

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Fragment>
      <Navigation link={"/sodope"} />
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
                  Protein Solubility
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Protein solubility is computed using a new metric called the
                  <b> Solubility-Weighted Index (SWI)</b>. We derived this
                  metric from crystallographic B-factors using{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Nelder%E2%80%93Mead_method"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Nelder-Mead optimisation
                  </a>{" "}
                  on soluble and insoluble sequences from{" "}
                  <a
                    href="http://targetdb.rcsb.org/metrics/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PSI:Biology
                  </a>
                  . The mean of SWI across the protein sequence is converted to
                  probability using a logistic regression fitted to PSI:Biology
                  data.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Domains
                </Typography>
                <Typography variant="body2" gutterBottom>
                  We scan for the known domains using{" "}
                  <a
                    href="https://www.ebi.ac.uk/Tools/hmmer/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    HMMER
                  </a>{" "}
                  webservice and simplified them as domain graphics as follows:
                </Typography>

                <br />

                <div className="card">
                  <div className="card-content">
                    <div
                      style={{
                        height: 25,
                        backgroundColor: "#e0e0e0",
                        marginBottom: -32,
                      }}
                    ></div>
                    <button
                      key={1 + "domainButton" + 1}
                      className="button is-info is-rounded is-link"
                      style={{
                        width: 100,
                        left: 100,
                        position: "absolute",
                      }}
                      onMouseEnter={handlePopoverOpen}
                      onMouseLeave={handlePopoverClose}
                      value={[100, 200]}
                    >
                      Test Domain
                    </button>
                    <Popover
                      classes={{ paper: "MuiPopover-paper" }}
                      open={open}
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      style={{
                        pointerEvents: "none",
                        padding: "20px",
                      }}
                      onClose={handlePopoverClose}
                      disableRestoreFocus
                    >
                      <div
                        style={{
                          padding: "20px",
                        }}
                      >
                        <Typography variant="h6" gutterBottom>
                          Domain Name
                        </Typography>
                        <hr />
                        <b>Domain description</b>
                        <br />
                        Coordinates : 100 - 200
                        <br />
                        Alignment region: 99 - 200
                      </div>
                    </Popover>
                    <br />
                    <br />
                  </div>
                </div>
                <br />
                <List>
                  <Divider variant="middle" />
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary="Domain graphics"
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          style={{ display: "inline" }}
                          color="textPrimary"
                        >
                          The domain graphics on hover provide some information
                          about the domain. Clicking on the domains will
                          automatically select that region in the sequence for
                          computing solubility and other properties. A region
                          can also be selected using a two way slider as below:
                        </Typography>
                      }
                    />
                  </ListItem>
                  <div className="card">
                    <div className="card-content">
                      <Slider
                        valueLabelDisplay="auto"
                        min={1}
                        max={820}
                        defaultValue={[100, 200]}
                        step={1}
                      />
                    </div>
                  </div>
                </List>
                <List>
                  <Divider variant="middle" />
                </List>

                <Typography variant="subtitle2" gutterBottom>
                  Solubility optimisation
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Below the two way slider, we display regions that have higher
                  probability of solubility than the selected sequence using a
                  stochastic optimisation (
                  <a
                    href="https://en.wikipedia.org/wiki/Simulated_annealing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    simulated annealing
                  </a>
                  ). These were done by extending the selected region further
                  upstream and/or downstream. For example, if the selected
                  region is 50 - 100, the optimised regions may look like:
                </Typography>
                <div className="card">
                  <div className="card-content">
                    <div className="buttons">
                      <button
                        key={`suggested_region_faq-0`}
                        className="button is-success is-rounded is-link is-small"
                      >
                        45 - 105
                      </button>

                      <button
                        key={`suggested_region_faq1`}
                        className="button is-success is-rounded is-link is-small"
                      >
                        39 - 102
                      </button>
                    </div>
                  </div>
                </div>
                <br />
                <Typography variant="body2" gutterBottom>
                  Clicking these buttons for solubility otimised regions will
                  select these regions. Sequence properties of these regions
                  will be shown and visible plots updated. As JavaScript does
                  not have the provision for seeding the pseudo-random number
                  generator natively, these optimised regions will be different
                  each time.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Sequence properties
                </Typography>
                <Typography variant="body2" gutterBottom>
                  We display sequence properties for the submitted sequence. A
                  sample display is shown below:
                </Typography>
                <div className="card">
                  <div className="card-content">
                    <nav className="level">
                      <div className="level-item has-text-centered">
                        <div>
                          <p className="heading">Probability of Solubility</p>
                          <p className="title">0.5552</p>
                        </div>
                      </div>
                      <div className="level-item has-text-centered">
                        <div>
                          <p className="heading">Flexibility</p>
                          <p className="title">0.9974</p>
                        </div>
                      </div>
                      <div className="level-item has-text-centered">
                        <div>
                          <p className="heading">GRAVY</p>
                          <p className="title">0.0351</p>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
                <List>
                  <Divider variant="middle" />
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary="Computation of properties"
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          style={{ display: "inline" }}
                          color="textPrimary"
                        >
                          These properties are always computed for the selected
                          region in the sequence. The currently selected
                          sequence can be seen in this text field box:
                        </Typography>
                      }
                    />
                  </ListItem>
                  <div className="card">
                    <div className="card-content">
                      <div className="field has-addons">
                        <p className="control is-expanded">
                          <input
                            className="input is-rounded"
                            type="text"
                            readOnly
                            value={"CURRENTLY SELECTED SEQUENCE HERE"}
                          />
                        </p>
                        <p className="control">
                          <button className="button is-danger is-rounded">
                            <i className="fas fa-copy"></i>
                          </button>
                        </p>
                        <p className="control">
                          <button className="button is-info is-rounded">
                            Translate | Optimise expression
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  <ListItem>
                    The "Optimise expression" button is visible only if the
                    input was a nucleotide sequence. It redirects the selected
                    sequence to TIsigner.
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
                          Probability of solubility
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          style={{ display: "inline" }}
                          color="textPrimary"
                        >
                          This is the output of logistic regression trained on
                          PSI:Biology data. We use the mean of SWI across the
                          selected sequence as input for the logistic
                          regression.
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
                          Flexibility
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          style={{ display: "inline" }}
                          color="textPrimary"
                        >
                          The mean of normalised B-factors on a sliding window
                          of 9 residues (Vihinen, M. et al. (1994)).
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
                          GRAVY
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          style={{ display: "inline" }}
                          color="textPrimary"
                        >
                          GRand AVerage of hydropathY (Kyte, J. and Doolittle,
                          R.F. (1982))
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider variant="middle" />
                </List>

                <Typography variant="subtitle2" gutterBottom>
                  Plots
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Flexibility and hydrophobicity along the selected region is
                  also plotted. 'Show profile plot' button displays these plots.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Solubility tags
                </Typography>
                <Typography variant="body2" gutterBottom>
                  The effect of solubility tags (TRX, MBP, SUMP and GST) on the
                  solubility of the input sequence can be visualised using the
                  'Add solubility tag' button. A custom tag can also be
                  submitted.
                </Typography>

                <Typography variant="h2" component="h3" gutterBottom>
                  Data used
                </Typography>
                <Typography variant="body2" gutterBottom>
                  The training data for SWI is curated by{" "}
                  <a
                    href="http://dnasu.org/DNASU/Home.do"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    DNASU
                  </a>{" "}
                  and can be downloaded{" "}
                  <a href={SoDoPETrain} download>
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
                        <TableCell align="right">Solubility</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          BbCD00584211_pET15
                        </TableCell>
                        <TableCell align="right">
                          MGHHHHHHSHMIFVTKLNGDGYYLNPYHIESIEANPDTTILLMNG..
                        </TableCell>
                        <TableCell align="right">1</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <br />

                <Typography variant="body2" gutterBottom>
                  The data consists of sequences with pET21 and pET15 vector
                  with solubility as 1 (soluble) or 0 (insoluble). The
                  solubility tags for pET15 is MGHHHHHHSH at the N-terminal and
                  for pET21 it is LEHHHHHH at the C-terminal.
                </Typography>
                <Typography variant="body2" gutterBottom>
                  The testing data is from{" "}
                  <a
                    href="http://www.tanpaku.org/tp-esol/index.php?lang=en"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    eSOL
                  </a>{" "}
                  and can be downloaded{" "}
                  <a href={SoDoPETestEsol} download>
                    here
                  </a>
                  . The data is of the following format:
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ECK number</TableCell>
                        <TableCell align="right">Sequence</TableCell>
                        <TableCell align="right">Solubility(%)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          ECK0003
                        </TableCell>
                        <TableCell align="right">
                          MRGSHHHHHHTDPALRAMVKVYAPASSANMSVGFDVLGAAV...
                        </TableCell>
                        <TableCell align="right">32</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <br />
                <Typography variant="body2" gutterBottom>
                  The sequences have flanking regions with the amino acids
                  MRGSHHHHHHTDPALRA and GLCGR at the N and C terminal
                  respectively (
                  <a
                    href="https://www.pnas.org/content/106/11/4201.long"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Niwa et al. 2009
                  </a>
                  ). The solubility is the percentage of supernatent to the
                  total uncentrifuged fraction.
                </Typography>

                {/*<Typography variant="body2" gutterBottom>
                  To compare SWI with <em>stickiness</em> we used the stickiness
                  data from (
                  <a
                    href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3528536/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Levy, De, and Teichmann 2012
                  </a>
                  ). The data can be downloaded
                  <a href={SoDoPETestStickiness} download>
                    {" "}
                    here
                  </a>
                  . The data is of the following format:
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ECK number</TableCell>
                        <TableCell align="right">Sequence</TableCell>
                        <TableCell align="right">Surface stickiness</TableCell>
                        <TableCell align="right">Abundance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          ECK2226
                        </TableCell>
                        <TableCell align="right">
                          MNQNLLVTKRDGSTERINLDKIHRVLDWAAEGLHNV...
                        </TableCell>
                        <TableCell align="right">-0.168840807174888</TableCell>
                        <TableCell align="right">240</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <br />
                <Typography variant="body2" gutterBottom>
                  Surface stickiness is the average of surface propensity scores
                  of surface residues.
                </Typography>*/}

                <Typography variant="h2" component="h3" gutterBottom>
                  SoDoPE FAQ
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  What is SoDoPE?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  SoDoPE (Soluble Domain for Protein Expression) is a tool for
                  solubility prediction and optimisation.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  What should I do after submitting a sequence?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Results of full sequence will be shown. You may wish to
                  explore solubility by adjusting the boundaries using the
                  slider. Known domain will also be displayed and can be
                  clicked.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  How do you predict protein domains?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  SoDoPE sends a query to the HMMER web server to annotate
                  protein domains. We also provide a link to the HMMER results
                  page, which will expire after a week.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  What if no known domains are found?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  SoDoPE analysis report for the full-length input sequence will
                  be displayed. Profile plot (see below) may be useful in this
                  case.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  What is the profile plot?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Profile plot shows the flexibility and hydrophobicity profiles
                  of the selected region, which are calculated using a sliding
                  window of 9 amino acid residues. Flexibility is calculated
                  using a weighted variation in normalised B-factors{" "}
                  <cite title="Improved amino acid flexibility parameters.">
                    (Vihinen et al., 1994)
                  </cite>
                  , whereas hydrophobicity is calculated using a linear
                  variation in hydropathicity{" "}
                  <cite title="A simple method for displaying the hydropathic character of a protein.">
                    (Kyte and Doolittle, 1982)
                  </cite>
                  .
                </Typography>

                {/*<Typography variant="subtitle2" gutterBottom>
                  Why the flexibility profile appears as a straight line?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Flexibility has a narrow range compared to hydrophobicity. If
                  you wish to view the flexibility profile, please hide the
                  hydrophobicity profile by clicking on its legend.
                </Typography>*/}

                <Typography variant="subtitle2" gutterBottom>
                  How do you predict protein solubility?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  We used a set of 20 values for the standard amino acid
                  residues to score protein solubility. These values were
                  derived from the normalised B-factors{" "}
                  <cite title="Improved amino acid flexibility parameters.">
                    (Smith et al., 2003)
                  </cite>{" "}
                  using the Nelder-Mead algorithm. We call the solubility score
                  as the Solubility-Weighted Index (SWI).
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  How do I improve the solubility of a protein domain?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Regions with improved solubility will be automatically
                  displayed. If you wish to use a different fusion tag, please
                  click on 'Custom tag' button and choose a sequence type.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  How is SoDoPE different from other protein solubility
                  prediction tools?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  SoDoPE uses only one feature (SWI) to prediction solubility.
                  This key feature outperforms many existing tools. SoDoPE
                  streamlines the process of designing protein sequences for
                  tuning expression (see below) and solubility.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Is there an option for batch input mode?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Not yet. You can download the command line program from our
                  GitHub{" "}
                  <a
                    href="https://github.com/Gardner-BinfLab/SoDoPE_paper_2020/tree/master/SWI"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://github.com/Gardner-BinfLab/SoDoPE_paper_2020/tree/master/SWI
                  </a>{" "}
                  and run it locally. The command line program is optimised to
                  scan a large number of sequences.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  What is ‘optimise expression’ about?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  This is an option for optimising protein expression using our
                  TIsigner web app.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  How to cite SoDoPE?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <span className="icon">
                    <i className="fas fa-graduation-cap"></i>
                  </span>{" "}
                  Bhandari, B.K., Gardner, P.P., Lim, C.S. (2020){" "}
                  Solubility-Weighted Index: Fast and Accurate Prediction of
                  Protein Solubility.
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
                  .
                  <br />{" "}
                  <span className="icon">
                    <i className="fas fa-graduation-cap"></i>
                  </span>{" "}
                  Bhandari, B.K., Lim, C.S., Gardner, P.P., (2021) TISIGNER.com:
                  web services for improving recombinant protein production.
                  <cite title="TISIGNER.com: web services for improving recombinant protein production.">
                    {" "}
                    Nucleic Acids Research.
                  </cite>{" "}
                  DOI:
                  <a
                    href="https://doi.org/10.1093/nar/gkab175"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    10.1093/nar/gkab175
                  </a>
                  .
                  <br />
                  <br />
                  If you find optimising protein expression useful, please also
                  cite the following preprint:
                  <br />{" "}
                  <span className="icon">
                    <i className="fas fa-graduation-cap"></i>
                  </span>{" "}
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
                  If you find signal peptide prediction useful, please also cite
                  the following preprint:
                  <br />{" "}
                  <span className="icon">
                    <i className="fas fa-graduation-cap"></i>
                  </span>{" "}
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

                <Typography variant="subtitle2" gutterBottom>
                  Could I copy and distribute SoDoPE for commercial purposes?
                </Typography>
                <Typography variant="body2" gutterBottom>
                  See our <Link to="/license">License page</Link>.
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  References
                </Typography>
                <ul>
                  <li>
                    Kyte, J. and Doolittle, R.F. (1982) A simple method for
                    displaying the hydropathic character of a protein.
                    <cite title="A simple method for displaying the hydropathic character of a protein.">
                      {" "}
                      Journal of molecular Biology
                    </cite>{" "}
                    , 157, 105–132.
                  </li>
                  <li>
                    Smith, D.K. et al. (2003) Improved amino acid flexibility
                    parameters.
                    <cite title="Improved amino acid flexibility parameters.">
                      {" "}
                      Protein Science,
                    </cite>{" "}
                    12, 1060–1072.
                  </li>
                  <li>
                    Vihinen, M. et al. (1994) Accuracy of protein flexibility
                    predictions.
                    <cite title="Accuracy of protein flexibility predictions.">
                      {" "}
                      Proteins: Structure, Function, and Genetics,
                    </cite>{" "}
                    19, 141–149.
                  </li>
                </ul>
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

export default SodopeDocumentation;
