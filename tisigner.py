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
import numpy as np
import functions
from functions import Optimiser
import data


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
#        print(direction, seq, ncodons, utr, host, niter, num_seq, rms, threshold, seeds, termcheck)
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

        json_data = result_df.groupby(['Type', 'Sequenceh'], sort=False).apply(lambda x:\
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


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')





if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5050', threaded=True, debug=True)
