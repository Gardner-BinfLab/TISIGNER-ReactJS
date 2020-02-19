# TISIGNER web app
This is a reimplementation of TISIGNER in ReactJS, with more features and smoother integration between the biological sequence optimisation tools. The source code for the older website can be found [here](https://github.com/Gardner-BinfLab/TIsigner/tree/master/TIsigner_web).

## About
TISIGNER runs at [https://tisigner.com](https://tisigner.com), which includes **TIsigner** and **SoDoPE**, the protein expression and solubility optimisation tools, respectively.

# Installation

## Requirements
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
$ pip3 install -r requirements.txt
$ python3 tisigner.py
```

The local website will run at [http://localhost:5050](http://localhost:5050).
**TIsigner** will run at [http://localhost:5050/tisigner](http://localhost:5050/tisigner) and **SoDoPE** at [http://localhost:5050/sodope](http://localhost:5050/sodope).

## Bugs/Errors
If you found any bugs or errors, please report it to us by opening an issue!
