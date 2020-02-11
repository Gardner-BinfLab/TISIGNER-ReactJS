# TISIGNER
This is a reimplementation of older TISIGNER in ReactJS, with more features and smoother integration between the available tools. The source code for old website can be found [here](https://github.com/Gardner-BinfLab/TIsigner/tree/master/TIsigner_web).

## About TISIGNER
TISIGNER includes gene optimisation tool **TIsigner** and protein solubility optimisation tool **SoDoPE**. The website runs at [https://tisigner.otago.ac.nz](https://tisigner.otago.ac.nz).

# Installation

## Requirements
 - ```Python 3.6``` and optionally ```git```.
 - ```Node.js```. Instructions on [Node.js website](https://nodejs.org/en/).
 - ```ViennaRNA v2.4.11```. Newer versions may also work. Instructions on [ViennaRNA website](https://www.tbi.univie.ac.at/RNA/).
 - ```INFERNAL v1.1.2 ```. Newer versions may also work. Instructions on [INFERNAL website](http://eddylab.org/infernal/).

You can download the source and extract to a folder. If you have ```git``` installed, you can directly do so by using this commands:

```sh
$ git clone https://github.com/Gardner-BinfLab/TISIGNER-ReactJS.git
$ cd  TISIGNER-ReactJS/
```
Once you are in the source code directory, use these commands:
```sh
$ npm install
$ npm run build
$ pip3 install -r requirements.txt
$ python3 tisigner.py
```

The local website will run at [http://localhost:5050](http://localhost:5050).
**TIsigner** will run at [http://localhost:5050/tisigner](http://localhost:5050/tisigner) and **SoDoPE** runs at [http://localhost:5050/sodope](http://localhost:5050/sodope).

## Bugs/Errors
If you find any bugs or errors, please report it to us by opening an issue!
