#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Aug 17 19:37:34  2020
@author: bikash
"""

#from collections import Counter
import functions
#import numpy.ma as ma

# Threshold for Max MCC
# For detecting signal peptides
SP_THRESHOLD = 0.56
# For signal peptides from fungi
FUNGI_THRESHOLD = 0.23
# For signal peptides with toxic protein
TOXIN_THRESHOLD = 0.33

class RAZOR:
    def __init__(self, seq, max_scan=45):
        """
        cs_probs_all = probability of finding a cleavage site at all
        positions. Scored by 5 random forests. The position
        here is 0 based. shape=(5, num_subseqs)
        cleavage_sites = Max of cs_probs_all for each random forest
        (length 5)

        """
        self.max_scan = functions.validate_scan(seq, max_scan)
        self.seq = functions.validate(seq, self.max_scan)
        self.s_scores = None
        self.c_scores = None
        self.y_scores = None
        self.cs_probs_all = None
        self.cleavage_sites = None
        self.preds = None
        self.final_cleavage_prob = None
        self.final_cleavage = 0
        self.final_score_sp = None
        self.fungi_scores = functions.np.zeros(5)
        self.fungi_preds = functions.np.zeros(5, dtype=bool)
        self.final_score_fungi = None
        self.toxin_scores = functions.np.zeros(5)
        self.toxin_preds = functions.np.zeros(5, dtype=bool)
        self.final_score_toxin = None
        self.run_fungi = False
        self.run_toxin = False

    def run(self):

        features = functions.features(self.seq[:30])
        self.s_scores = functions.s_score(features)
        self.c_scores, self.cs_probs_all, self.cleavage_sites = functions.c_score(
            self.seq, max_scan=self.max_scan
        )
        self.y_scores = functions.np.sqrt(self.s_scores * self.c_scores)

    def predict(self):
        self.run()
        self.preds = self.y_scores > SP_THRESHOLD
        self.final_score_sp = functions.np.median(self.y_scores)
        self.final_cleavage_prob = functions.np.median(self.c_scores)
        if not functions.np.all(self.preds == False):
            self.final_cleavage = self.cleavage_sites[functions.np.where(self.c_scores == \
                                                       self.final_cleavage_prob)]

        return [self.preds, self.final_score_sp, self.final_cleavage_prob, self.final_cleavage]

    def fungi(self):
        # Check if we already ran signal peptide detection
        if self.s_scores is None:
            self.predict()
        if not functions.np.all(self.preds == False):
            self.fungi_scores = functions.check_fungi(self.seq) if self.run_fungi is False  else self.fungi_scores
            self.run_fungi = True
            self.fungi_preds = self.fungi_scores > FUNGI_THRESHOLD
            self.final_score_fungi = functions.np.median(self.fungi_scores)
            return [self.fungi_preds, self.fungi_scores]
        else:
            raise TypeError('Signal peptide is required to run fungi detection.')

    def toxin(self):
        # Check if we already ran signal peptide detection
        if self.s_scores is None:
            self.predict()

        if not functions.np.all(self.preds == False):
            self.toxin_scores = functions.check_toxin(self.seq) if self.run_toxin is False else self.toxin_scores
            self.run_toxin = True
            self.toxin_preds = self.toxin_scores > TOXIN_THRESHOLD
            self.final_score_toxin = functions.np.median(self.toxin_scores)
            return [self.toxin_preds, self.toxin_scores]
        else:
            raise TypeError('Signal peptide is required to run toxin detection.')
