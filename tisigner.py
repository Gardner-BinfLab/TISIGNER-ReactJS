#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon May 20 10:36:23 2019

@author: bikash
"""



import os
from multiprocessing import Pool
from flask import Flask
from flask import request
from flask import send_from_directory
from flask import make_response
from flask import jsonify
from flask_cors import CORS
from flask import send_file
import pandas as pd
import numpy as np
import functions
from functions import Optimiser
from razor import RAZOR
import data
import io


app = Flask(__name__, static_folder='build')
cors = CORS(app)


@app.route('/optimise', methods=["POST"])
def optimiser():
    '''Optimisation
    '''
    try:
        seq, ncodons = functions.parse_input_sequence(request.json)
        utr = functions.parse_input_utr(request.json)
        host = functions.parse_hosts(request.json)
        niter, num_seq = functions.parse_algorithm_settings(request.json)
        rms = functions.parse_input_rms(request.json)
        if utr == data.pET21_UTR and host == 'ecoli':
            threshold = functions.parse_fine_tune(request.json)
        else:
            threshold = None


        termcheck = functions.parse_term_check(request.json)

        seed = functions.parse_seed(request.json)
        if request.json.get('optimisationDirection'):
            direction = request.json.get('optimisationDirection')
        else:
            direction = 'increase-accessibility'

        seeds = list(range(seed, seed+num_seq))
        rand_states = [np.random.RandomState(i) for i in seeds]
        new_opt = Optimiser(seq=seq, host=host, ncodons=ncodons, utr=utr, \
                         niter=niter, threshold=threshold, \
                         rms_sites=rms, direction=direction)


        pools = Pool(num_seq)
        results = []
        for result in pools.imap(new_opt.simulated_anneal,\
                                    rand_states):
            results.append(result)
        pools.close()
        pools.join()

        result_df = functions.sort_results(functions.sa_results_parse(results,\
                                            threshold=threshold, \
                                            termcheck=termcheck),\
                               direction=direction, termcheck=termcheck)

        json_data = result_df.groupby(['Type', 'Sequence'], sort=False).apply(lambda x:\
                                     functions.send_data(x, utr=utr,
                                    host=host)).groupby(level=0).\
                                     apply(lambda x: x.tolist()).to_json(\
                                          orient='columns')
        return json_data


    except Exception as exp:
        if 'pools' in locals():
            pools.close()
            pools.join()
        return make_response(jsonify({'data':str(exp), 'status':500}), 500)


@app.route('/razor', methods=['POST'])
def razor_predict():
    try:
        seq, max_scan = functions.parse_input_razor(request.json)
        # print(seq, max_scan)
        newObj = RAZOR(seq=seq, max_scan=max_scan)
        _ = newObj.predict()
        try:
            _ = newObj.fungi()
            _ = newObj.toxin()
        except TypeError:
            pass
        try:
            cleav = newObj.final_cleavage.tolist()[0]
        except Exception:
            cleav = 0
        response_dict = {
            'y_score':np.around(newObj.y_scores, 2).tolist(),
            'all_probs':newObj.cs_probs_all.tolist(),
            'predictions':newObj.preds.tolist(),
            'cleavage':cleav,
            'final_score_sp':np.around(newObj.final_score_sp, 2),
            'final_cleavage_prob':newObj.final_cleavage_prob,
            'fungi_scores':newObj.fungi_scores.tolist(),
            'fungi_preds':newObj.fungi_preds.tolist(),
            'final_score_fungi':newObj.final_score_fungi,
            'toxin_scores':newObj.toxin_scores.tolist(),
            'toxin_preds':newObj.toxin_preds.tolist(),
            'final_score_toxin':newObj.final_score_toxin,
        }
        return make_response(jsonify(response_dict), 200)
    except Exception as exp:
        return make_response(jsonify({'data':str(exp), }), 500)

@app.route('/interactions', methods=["POST"])
def scallion_web():
    try:
        file = request.json.get('inputSequenceScallion').\
                                       upper()
        df = functions.fasta_reader(io.StringIO(file))
        res = functions.scallion(df).to_csv(index=False)
        return make_response(jsonify(res), 200)
    except Exception as exp:
        return make_response(jsonify({'data':str(exp), }), 500)


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')





if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5050', threaded=True, debug=False)
