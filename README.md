# TISIGNER
This is the repository for TISIGNER website. It consists source code for both frontend and backend. TISIGNER includes gene optimisation tool **TIsigner** and protein solubility optimisation tool **SoDoPE**.

# Installation
You need to have ```npm``` installed on your computer. Check [npm website](https://www.npmjs.com/get-npm) for instructions.
We also require ViennaRNA suite to be installed on your machine. The instructions to do so can be found [here](https://www.tbi.univie.ac.at/RNA/documentation.html#install).
TIsigner also requires Infernal installed on your machine. Instructions to install Infernal can be found [here](http://eddylab.org/infernal/).  We also need Python 3.6 +. 

After that you can simply use these commands to setup a local TISIGNER website.
```sh
$ npm install https://github.com/Gardner-BinfLab/TISIGNER-ReactJS.git
$ cd  TISIGNER-ReactJS
$ pip3 install -r requirements.txt
$ npm run build
$ python3 tisigner.py
```
The local website will run at [http://localhost:5050](http://localhost:5050). **TIsigner** will run at [http://localhost:5050/tisigner](http://localhost:5050/tisigner) and **SoDoPE** runs at [http://localhost:5050/sodope](http://localhost:5050/sodope).

# Bugs/Errors
If you find any bugs or errors, please report it to us by opening an issue!