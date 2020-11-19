#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun May 26 20:17:27 2019

@author: bikash
"""

from subprocess import run, PIPE, DEVNULL
import tempfile
import os
import pandas as pd
import numpy as np

class AnalyseTerminators:
    '''Analyses terminators for a dataframe of sequences using cmsearch
    Takes sequence dataframe and location of cm file.
    '''


    def __init__(self, seq_df, cm):
        self.seq_df = seq_df
        self.cm = cm
        self.tempdir = os.path.join(tempfile.gettempdir(), 'cmsearch')
        self.tempfname = pd._testing.rands_array(15, 1)[0]
        self.cm_output = None
        self.results = None
        self.tblout_fname = None


    def make_rand_accs(self):
        '''Generate some random accession for sequences.
        '''
        self.seq_df['Accession'] = pd._testing.rands_array(10, len(self.seq_df))


    def make_tmp_dir(self):
        '''Make temporary directory for files from cmsearch.
        '''
        try:
            os.makedirs(self.tempdir)
        except FileExistsError:
            pass


    def dataframe_to_fasta(self):
        '''Export sequences to fasta. (Required for cmsearch input.)
        '''
        self.make_rand_accs()
        self.make_tmp_dir()
        file_contents = ''
        for ind, val in enumerate(self.seq_df.Accession):
            file_contents += '>'+val+'\n'+self.seq_df.Sequence[ind]+'\n'
        with open(self.tempdir+'/'+ self.tempfname + '.fa', 'w') as file_out:
            file_out.write(file_contents)


    def run_cmsearch(self):
        '''Run cmsearch
        '''
        self.dataframe_to_fasta()
        output_table = pd._testing.rands_array(12, 1)[0] + '.csv'
        inp_f = self.tempdir + '/' + self.tempfname +'.fa'
        self.tblout_fname = self.tempdir + '/' + output_table
        proc = run(['cmsearch', '--tblout',  self.tblout_fname, \
                    self.cm, inp_f], stdout=PIPE, stderr=DEVNULL, \
                   encoding='utf-8')
        os.remove(inp_f)
        self.cm_output = str(proc.stdout)


    def term_check(self):
        '''Parse results from cmsearch.
        It chops the table from cmsearch output and returns the dataframe
        with number of hits and E values.
        Note: No hits will have zero hits and high E value.
        '''
        if self.cm_output is None:
            self.run_cmsearch()


        cm_df_tmp = pd.read_csv(self.tblout_fname, skiprows=2, header=None, \
                                sep=r"\s+", skipfooter=10, engine='python')

        #check for duplicates and group them
        cm_df = pd.DataFrame({})
        try:
            cm_df[['Accession', 'E_val']] = cm_df_tmp[14].groupby(cm_df_tmp[0]).\
                                            apply(list).reset_index()

            #count number of hits.
            cm_df['Hits'] = cm_df['E_val'].apply(len)

            #find min eval (useful when sequence has multiple hits)
            cm_df['Min_E_val'] = cm_df['E_val'].apply(min)
        except KeyError:
            cm_df['Hits'] = [0]*self.seq_df.shape[0]
            cm_df['E_val'] = [np.nan]*self.seq_df.shape[0]
            cm_df['Min_E_val'] = [np.nan]*self.seq_df.shape[0]
            cm_df['Accession'] = self.seq_df['Accession']


        #merge with original dataframe
        final_results = pd.merge(self.seq_df, cm_df, on='Accession',\
                                 how='outer')

        #no hits are replaced by 0
        final_results['Hits'] = final_results['Hits'].fillna(0)

        #no hits are replaced by very high E-value
        final_results['Min_E_val'] = final_results['Min_E_val'].fillna(10000)

        self.results = final_results.sort_values(['Hits', 'Min_E_val'],\
                                         ascending=[True, False]).\
                                         reset_index(drop=True)
        os.remove(self.tblout_fname)
        return self.results
