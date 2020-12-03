# TISIGNER web app
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/Gardner-BinfLab/TISIGNER-ReactJS)
[![GitHub contributors](https://img.shields.io/github/contributors/Naereen/StrapDown.js.svg)](https://github.com/Gardner-BinfLab/TISIGNER-ReactJS/graphs/contributors/)

TISIGNER (tie-SIGN-er) runs at [https://tisigner.com](https://tisigner.com), which includes **TIsigner**, **SoDoPE** and **Razor**, the protein expression optimisation, solubility optimisation and signal peptides prediction tools, respectively.

This is a reimplementation of TISIGNER in ReactJS, with more features and smoother integration between the biological sequence optimisation tools. The source code for the older website can be found [here](https://github.com/Gardner-BinfLab/TIsigner/tree/master/TIsigner_web).

## Installation

### Requirements
 - ```Python v3.6.9``` and optionally ```git```.
 - ```Node.js v8.10.0```. See instructions on the [Node.js website](https://nodejs.org/en/).
 - ```ViennaRNA v2.4.11```. Newer versions may also work. See instructions on the [ViennaRNA website](https://www.tbi.univie.ac.at/RNA/).
 - ```INFERNAL v1.1.2 ```. Newer versions may also work. See instructions on the [INFERNAL website](http://eddylab.org/infernal/).

Download the source and extract to a folder. If you have ```git``` installed, please run the following commands:

```sh
$ git clone https://github.com/Gardner-BinfLab/TISIGNER-ReactJS.git
$ cd TISIGNER-ReactJS/
```
Once you are in the source code directory, run the following commands:
```sh
$ npm install
$ npm run build
```
You may want to install the python dependencies on a ```venv```. This can be done by the following commands:
```sh
python3 -m venv env
source env/bin/activate
```
Then you can run the following commands to activate the backend:
```sh
$ pip3 install -r requirements.txt
$ python3 tisigner.py
```

The local website will now run at [http://localhost:5050](http://localhost:5050).
**TIsigner** will run at [http://localhost:5050/tisigner](http://localhost:5050/tisigner), **SoDoPE** at [http://localhost:5050/sodope](http://localhost:5050/sodope) and **Razor** at [http://localhost:5050/razor](http://localhost:5050/razor).

### Bugs/Errors
If you found any bugs or errors, please report it to us by opening an issue!

### Cite
- Bhandari BK, Lim CS, Gardner PP. (2019). Highly accessible translation initiation sites are predictive of successful heterologous protein expression. bioRxiv. DOI:[10.1101/726752](https://www.biorxiv.org/content/10.1101/726752v1)
- Bikash K Bhandari, Paul P Gardner, Chun Shen Lim. (2020). Solubility-Weighted Index: fast and accurate prediction of protein solubility. Bioinformatics. DOI:[10.1093/bioinformatics/btaa578](https://dx.doi.org/10.1093/bioinformatics/btaa578)
- Bikash K Bhandari, Paul P Gardner, Chun Shen Lim. (2020). Annotating eukaryotic and toxin-specific signal peptides using Razor. bioRxiv. DOI:[10.1101/2020.11.30.405613](https://doi.org/10.1101/2020.11.30.405613)
