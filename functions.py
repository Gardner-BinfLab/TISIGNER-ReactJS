#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue May  7 20:56:34 2019

@author: bikash
"""

import os
#import sys
import datetime
import secrets
import string
import tempfile
import re
from subprocess import run, PIPE, DEVNULL
from functools import lru_cache
import numpy as np
import pandas as pd
import data
from terminators import AnalyseTerminators


REFDF = pd.read_csv(os.path.join(os.path.dirname(__file__), \
                                 'lookup_table.csv')) #table for likelihood/thresh
PRIOR_PROB = 0.49 #success/(success+failure)
PRIOR_ODDS = PRIOR_PROB/(1-PRIOR_PROB)
CM = os.path.join(os.path.dirname(__file__), 'term.cm')








class Optimiser:
    '''Optimises the given sequence by minimizing/maximising opening energy

    Args:
        seq = Your sequence.
        ncodons = Number of codons to substitute at 5' end. Default (5)
        utr = UTR of your choice. Default = pET21
        niter = Number of iterations for simulated annealing. Default 1000
        threshold = The value of accessibility you're aiming for. If we get
                     this value, simulated annealing will stop. Else, we
                     will run to specified iterations and give the sequence
                     with maximum/minimum possible opening energy.

    '''


    def __init__(self, seq, host='ecoli', ncodons=None, utr=None, niter=None,\
                 threshold=None,rms_sites=None,\
                 direction='increase-accessibility'):
        self.seq = seq
        self.host = host
        self.ncodons = ncodons
        self.utr = utr
        self.niter = niter
        self.threshold = threshold
        self.annealed_seq = None #result of simulated annealing
        self.rms_sites = rms_sites
        self.cnst = data.CNST #to prevent overflows
        self.direction = direction
        if self.threshold is not None and \
        Optimiser.accessibility(self) <= self.threshold:
            self.direction = 'decrease-accessibility'
        if self.direction == 'decrease-accessibility':
            self.cnst = -1






    @staticmethod
    def accession_gen():
        '''Random accession numbers
        '''
        rand_string = ''.join(secrets.choice(string.ascii_uppercase + \
                                            string.digits) for _ in range(10))
        accession = '>' + rand_string + '\n'
        return accession, rand_string


    @staticmethod
    def splitter(seq):
        seq = seq.upper()
        length = (len(seq)- len(seq)%3)
        split_func = lambda seq, n: [seq[i:i+n] for\
                                        i in range(0, length, n)]
        return split_func(seq, 3)


    @staticmethod
    def substitute_codon(seq, ncodons, nsubst, rms_sites=None, rand_state=None):
        '''randomly substitute codons along the sequence at random positions
        partial substitution for intial n codons after ATG
        '''
        if rand_state is None:
            rand_state = np.random.RandomState(data.RANDOM_SEED)
        if rms_sites is None:
            rms_sites = data.RMS_SITES
        seq = seq.upper()
        num_nts = (ncodons)*3
        start = seq[:3]
        new_seq = seq[3:num_nts]


        counter = 0
        while True:
            for _ in range(nsubst):
                codons = Optimiser.splitter(new_seq)
                subst_codon_position = rand_state.choice(list(range(len(codons))))
                subst_synonymous_codons = data.AA_TO_CODON[data.CODON_TO_AA[codons[\
                                                        subst_codon_position]]]
                subst_codon = rand_state.choice(subst_synonymous_codons)
                new_seq = new_seq[:subst_codon_position*3]+ subst_codon +\
                            new_seq[subst_codon_position*3+3:]
            counter += 1
            if not re.findall(rms_sites, new_seq):
                return start + new_seq + seq[num_nts:]
            if counter == 1000:
                raise UnableToSubstituteError('Taking too long to get new'+
                                              ' sequences without given '+
                                              'restriction modification sites'+
                                              '. Enter new rms sites.')



    @lru_cache(maxsize=128, typed=True)
    def accessibility(self, new_seq=None):
        '''Sequence accessibility
        '''
        tmp = os.path.join(tempfile.gettempdir(), 'plfold')
        try:
            os.makedirs(tmp)
        except FileExistsError:
            pass

        try:
            nt_pos, subseg_length = data.ACCS_POS[self.host]
        except KeyError:
            if 'custom' in self.host:
                nt_pos, subseg_length = get_plfold_args(self.host)
        utr = self.utr.upper()

        if new_seq is None:
            seq = self.seq
        else:
            seq = new_seq


#        all_args = ['RNAplfold'] + self.plfold_args.split(' ')
        winsize = 210
        all_args = ['RNAplfold', '-W', str(winsize), '-u', str(subseg_length), '-O']

        ## Part of UTR and sequence we need for computation
        utr = utr[-(winsize - nt_pos + 1):]
        seq = seq[:(winsize - (subseg_length - nt_pos) + 1)]
        sequence = utr + seq
        seq_accession, rand_string = Optimiser.accession_gen()
        input_seq = seq_accession + sequence
        run(all_args, stdout=PIPE, stderr=DEVNULL, input=input_seq, cwd=tmp, \
                    encoding='utf-8')
        out1 = '/' + rand_string + '_openen'
        out2 = '/' + rand_string + '_dp.ps'
        try:
            open_en = pd.read_csv(tmp+out1, sep='\t', skiprows=2, header=None)\
                    [subseg_length][len(utr) + nt_pos - 1]
        except Exception:
            raise CustomRangeException("The given custom range was out of"+\
                                " the length of sequence and 5′ UTR.")
        if np.isnan(open_en):
            raise AccessibilityCalculationException("Could not calculate the"+\
                    " opening energy for given custom positions because the"+\
                    " position lies outside of the given sequence and"+\
                    " 5′ UTR.")


        os.remove(tmp+out1)
        os.remove(tmp+out2)

        return open_en



    def simulated_anneal(self, rand_state=None):
        '''
        preforms a simulated annealing
        Returns:
            Optimised sequence with its accessibility
            New: optimises posterior probability using accessibility

        '''
        seq = self.seq
        if self.ncodons is None:
            ncodons = 9
        else:
            ncodons = self.ncodons
        if self.niter is None:
            niter = 25
        else:
            niter = self.niter
        rms_ = self.rms_sites

        temperatures = np.geomspace(ncodons, 0.00001, niter)
        num_of_subst = [int((ncodons-1)*np.exp(-_/int(niter/2))+1) \
                         for _ in range(niter)] #same as floor but returns int
        scurr = seq
        sbest = seq
        initial_cost = Optimiser.accessibility(self, seq)
        curr_cost = Optimiser.accessibility(self, scurr) #we are here
        curr_best_cost = Optimiser.accessibility(self, sbest) # best so far

        for idx, temp in enumerate(temperatures):
            snew = self.substitute_codon(sbest, ncodons, num_of_subst[idx], \
                                         rms_sites=rms_, rand_state=rand_state)
            new_cost = Optimiser.accessibility(self, snew) #new move


            #simulated annealing
            if new_cost/self.cnst <= curr_cost/self.cnst:
                #is new move better then our current position?
                scurr = snew #accept
                curr_cost = Optimiser.accessibility(self, scurr)#update cost
                if curr_cost/self.cnst <= curr_best_cost/self.cnst:
                    #is the accepted move better then the best move so far?
                    sbest = snew #accept
                    curr_best_cost = Optimiser.accessibility(self, sbest)#update cost
            elif np.exp(-(new_cost - curr_cost)/(temp*self.cnst)) >= \
            np.random.rand(1)[0]:
                #if the move wasn't better, accept or reject probabilistically
                scurr = snew
                curr_cost = Optimiser.accessibility(self, scurr)#update cost



            #early stopping if we pass the threshold
            if self.threshold != None:
                if self.direction == 'decrease-accessibility' and \
                curr_best_cost >= self.threshold:
                    break
                elif self.direction == 'increase-accessibility' and \
                curr_best_cost <= self.threshold:
                    break



        final_cost = curr_best_cost
        self.annealed_seq = (sbest, final_cost)
        results = [sbest, final_cost, seq, initial_cost]

        if self.utr == data.pET21_UTR and self.host=='ecoli':
            #also return posterior probs for ecoli and pET_21_UTR
            results.insert(2, get_prob_pos(final_cost))
            results.append(get_prob_pos(initial_cost))
        return results



def progress(iteration, total, message=None):
    if message is None:
        message = ''
    bars_string = int(float(iteration) / float(total) * 50.)
    print("\r|%-50s| %d%% (%s/%s) %s "% ('█'*bars_string+ "░" * \
                                     (50 - bars_string), float(iteration) / float(total) * 100,\
                                     iteration,total,message),end='\r',flush=True)

    if iteration == total:
        print('\nCompleted!') 


def mismatches(seq1, seq2):
    '''Counts mismatches between two equal length sequences
    '''
    assert len(seq1) == len(seq2)
    return sum(nt1 != nt2 for nt1, nt2 in zip(seq1, seq2))



def get_ss(val):
    index = abs(REFDF["Thresholds"] - val).idxmin()
    return REFDF.iloc[index][["Sensitivity", "Specificity"]].values


def get_prob_pos(accs):
    '''gives the posterior probability of success.
    Input is an accessibility/openen
    '''
    index = abs(REFDF["Thresholds"] - accs).idxmin()
    plr = REFDF.iloc[index]['Plr']
    post_odds_pos = PRIOR_ODDS*plr
    post_prob_pos = float(post_odds_pos/(1+post_odds_pos))
    return post_prob_pos


def get_accs(prob):
    '''gets accessibility/openen from post prob
    '''
    post_odds_pos = prob/(1-prob)
    plr = post_odds_pos/PRIOR_ODDS
    index = abs(REFDF["Plr"] - plr).idxmin()
    accs = REFDF.iloc[index]['Thresholds']
    return accs


def scaled_prob(post_prob):
    '''Scales post probability from min value (prior) to 100 (equal to post
    prob of 0.70 (max in our case).
    '''
    scaled_p = 100*(post_prob - PRIOR_PROB )/(0.70 - PRIOR_PROB)
    return scaled_p



def min_dist_from_start(refseq, tstseq, max_len=50):
    '''max_len in codons (useful for primer selection only)
    max_len is used to generate scores which again are useful for primer only.
    returns hamming distance and distance from start nt
    '''
    if len(refseq) != len(tstseq):
        raise ValueError('Sequence length mismatch for Hamming '
                         'distance computation.')
    hamming_dist = sum(nt1 != nt2 for nt1, nt2 in zip(refseq, tstseq))
    elem1 = [refseq[i:i+1] for i in range(0, len(refseq))]
    elem2 = [tstseq[i:i+1] for i in range(0, len(tstseq))]

    high_seq = '' #sequence with highlighted difference
    for i, v in enumerate(elem1):
        if elem2[i] == v:
            high_seq+=elem2[i]
        else:
            high_seq+="<mark>"+elem2[i]+"</mark>"
    return hamming_dist, high_seq

def reverse_complement(seq):
    seq = seq.upper().replace("U", "T")
    complement = {'A': 'T', 'C': 'G', 'G': 'C', 'T': 'A'}
    return ''.join([complement[nt] for nt in seq[::-1]])


def parse_rms(rms_in=None):
    default_rms = data.RMS_SITES
    if rms_in is not None:
        rms_in = rms_in.upper().split(',')
        rms_given = '|'.join([val+'|'+reverse_complement(val)  for _,val in\
                              enumerate(rms_in)])
        return rms_given+'|'+default_rms
    else:
        return default_rms



def sa_results_parse(results, threshold=None, termcheck=False):
    '''returns dataframe for results from simulated annealing
    '''
    if len(results[0]) == 6: #for pET21 and ecoli
        df = pd.DataFrame(results, columns=['Sequence', 'Accessibility',\
                                        'pExpressed',\
                                        'org_sq', 'org_accs', 'org_pexpr'])
    else:
        df = pd.DataFrame(results, columns=['Sequence', 'Accessibility', 'org_sq', \
                                        'org_accs'])
    if termcheck is True:
        tmp_df = AnalyseTerminators(cm=CM, seq_df=df)
        res_df = tmp_df.term_check()
        df = res_df.drop(columns=['Min_E_val', 'Accession'])



    if threshold is not None:
        df['closetothreshold'] = df['Accessibility'].apply(lambda x:abs(x\
           - threshold))


    return df


def sort_results(df, direction='decrease', termcheck=False):
    '''sorting results
    Sequenceh has sequences with difference highlighted by using
    <mark></mark tag.
    '''
    org_seq = df['org_sq'][0]
    cols = ['Sequence', 'Accessibility']
    cols_for_mismatches = ['Mismatches', 'Sequenceh']
    cols_for_sort = ['Mismatches', 'Accessibility']
    bool_for_sort = [True]
    if direction == 'decrease':
        bool_for_sort.append('True')
    else:
        bool_for_sort.append('False')
    ecoli = False

    if 'pExpressed' in df.columns: #for pET21 and ecoli
         cols.append('pExpressed')
         cols_for_sort.insert(0, 'pExpressed')
         if 'closetothreshold' in df.columns:
             cols.append('closetothreshold')
             cols_for_sort.insert(0, 'closetothreshold')
             bool_for_sort.insert(0, True)
         if direction == 'decrease':
             bool_for_sort.insert(cols_for_sort.index('pExpressed'), False) #sort by pexpressed
         else:
            bool_for_sort.insert(cols_for_sort.index('pExpressed'), True)
         ecoli = True


    if 'Hits' in df.columns:
         cols.append('Hits')
         cols_for_sort.insert(0, 'Hits')
         bool_for_sort.insert(cols_for_sort.index('Hits'), True)
    if 'E_val' in df.columns:
         cols.append('E_val')



    sequences_df = df[cols].copy()
    sequences_df['Type'] = 'Optimised'
    sequences_df[cols_for_mismatches] = pd.DataFrame(sequences_df['Sequence']\
                .apply(lambda x:min_dist_from_start(org_seq, x)).values.\
                tolist(), index=sequences_df.index)


    sequences_df.sort_values(cols_for_sort, ascending=bool_for_sort, \
                             inplace=True)
    if 'closetothreshold' in sequences_df.columns:
        sequences_df.drop(['closetothreshold'], inplace=True, axis=1)

    if ecoli is True:
        res_df = sequences_df.append({"Sequenceh":org_seq, \
                              "Accessibility":df['org_accs'][0], \
                              "pExpressed":df['org_pexpr'][0], \
                              "Type":"Input"}, ignore_index=True)
        res_df['pExpressed'] = res_df['pExpressed'].apply(scaled_prob).round(2)
    else:
        res_df = sequences_df.append({"Sequenceh":org_seq, \
                              "Accessibility":df['org_accs'][0], \
                              "Type":"Input"}, ignore_index=True)

    res_df.loc[0,"Type"]="Selected"
    res_df["Accessibility"] = res_df["Accessibility"].round(2)

    if termcheck is True:
        o_hit, o_eval = check_term_org(org_seq)
        res_df.loc[res_df.index[res_df['Type'] == 'Input']]['Hits'] = o_hit
        res_df.loc[res_df.index[res_df['Type'] == 'Input']]['E_val'] = o_eval
    return res_df


def send_data(x, utr=data.pET21_UTR, host='ecoli'):
    '''send json data back
    '''
    if utr == data.pET21_UTR and host=='ecoli':
        if 'Hits' in x.columns and 'E_val' in x.columns:
            return (dict({'Sequence':x.Sequenceh.iloc[0]},\
              **{'Accessibility':x.Accessibility.iloc[0]},\
              **{'pExpressed':x.pExpressed.iloc[0]},\
              **{'Hits':x.Hits.iloc[0]},\
              **{'E_val':x['E_val'].iloc[0]}))
        else:

            return (dict({'Sequence':x.Sequenceh.iloc[0]},\
                          **{'Accessibility':x.Accessibility.iloc[0]},\
                          **{'pExpressed':x.pExpressed.iloc[0]}))
    else:
        if 'Hits' in x.columns and 'E_val' in x.columns:
                return (dict({'Sequence':x.Sequenceh.iloc[0]},\
                  **{'Accessibility':x.Accessibility.iloc[0]},\
                  **{'Hits':x.Hits.iloc[0]},\
                  **{'E_val':x['E_val'].iloc[0]}))
        return (dict({'Sequence':x.Sequenceh.iloc[0]},\
                      **{'Accessibility':x.Accessibility.iloc[0]}))



#for web interface
class UnableToSubstituteError(Exception):
    '''if restriction modification sites are too constraining to get new
    sequences.
    '''
    pass

class SubstitutionException(Exception):
    '''Exception when codon substitution range greater then sequence.
    '''
    pass

class PrematureStopCodonException(Exception):
    '''Exception when stop codons encountered inside substitutable region.
    '''
    pass

class ShortSequenceException(Exception):
    '''Exception when sequence too short.
    '''
    pass


class MissingStartCodonException(Exception):
    '''Exception when no start codon.
    '''
    pass


class UnknownNucleotidesException(Exception):
    '''Exception when codon substitution range greater then sequence.
    '''
    pass

class InvalidRmsPatternException(Exception):
    '''Exception when RMS is in unknown format.
    '''
    pass

class InvalidSequenceException(Exception):
    '''Exception when sequence is not multiple of 3.
    '''
    pass

class TerminatorCheckFailException(Exception):
    '''Exception when sequence has terminators
    '''
    pass

class CustomRangeException(Exception):
    '''Exception for custom range
    '''
    pass

class AccessibilityCalculationException(Exception):
    '''Exception when calculating accessibility
    '''
    pass



def valid_input_seq(seq):
    '''check if given sequence is valid.
    '''
    seq = re.sub('\s+', '', seq.upper()).rstrip()
    pattern = re.compile('^[ATGCU]*$')
    cod = Optimiser.splitter(seq)
    if list(set(cod[1:-1]) & set(data.STOP_CODONS)):
        raise PrematureStopCodonException('Premature stop codons.')
    elif len(seq) < 75:
        raise ShortSequenceException('Sequence too short. Min length = 75'
                                         +' nuclotides.')
    elif cod[0] != 'ATG':
        raise MissingStartCodonException('No start codon.')
    elif not pattern.match(seq):
        raise UnknownNucleotidesException('Unknown nucleotides.')
    elif len(seq)%3 != 0:
        raise InvalidSequenceException('Sequence is not divisible by 3.')
    elif len(seq) >= 300000:
        raise InvalidSequenceException('Sequence too long for web version.'+
                                       'Try command line version.')

    return seq



def valid_rms(rms=None):
    '''check if given restriction modification site pattern is valid.
    '''
    rms = re.sub('\s+', '', rms.upper()).rstrip()
    if rms:
        pattern = re.compile('^[ACGTU]+(\,{0,1}[AGCTU])+$')
        valid_nt = re.compile('^[ATGCU]*$')
        if not pattern.match(rms):
            raise InvalidRmsPatternException('Please seperate multiple RMS '+
                                             'sites by single comma ",". ')
        if not valid_nt.match(('').join(i for i in rms.split(','))):
            raise UnknownNucleotidesException('Unknown nucleotides.')
    return rms


def valid_utr(seq):
    '''validate UTR
    '''
    seq = seq.upper()
    pattern = re.compile('^[ATGCU]*$')
    if len(seq) < 70:
        raise ShortSequenceException('UTR is too short.')
    elif not pattern.match(seq):
        raise UnknownNucleotidesException('Unknown nucleotides.')
    elif len(seq) >= 3000:
        raise InvalidSequenceException('UTR too long for web version.'+
                                       'Try command line version.')
    return seq


def parse_input_sequence(request_json):
    '''parse sequence and number of codons to substitute
    '''
    seq = valid_input_seq(request_json.get('inputSequence').\
                                   upper().replace("U", "T"))
    if request_json.get('substitutionMode') != 'fullGene':
        #count including start codon so + 1
        ncodons = int(request_json.get('numberOfCodons')) + 1
        if ncodons*3 >= len(seq):
            ncodons = int((len(seq) - len(seq)%3)/3) - 1
    else:
        ncodons = int((len(seq) - len(seq)%3)/3) - 1

    return seq, ncodons


def parse_input_utr(request_json):
    '''parse utr
    '''
    try:
        utr = data.UTR_INPUT[request_json.get('promoter')]
    except KeyError:
        if request_json['customPromoter']:
            utr = valid_utr(request_json.get('customPromoter').\
                                  upper().replace("U", "T"))
        else:
            utr = data.pET21_UTR

    return utr

def parse_hosts(request_json):
    '''parse hosts
    '''
    if not request_json.get('customRegion'):
        try:
            host = data.HOST_INPUT[request_json.get('host')]
        except KeyError:
            host = data.HOST_INPUT['Escherichia coli']
    else:
        host = make_plfoldargs(request_json)
    return host


def make_plfoldargs(request_json):
    '''determine plfold args from custom range
    '''
    try:
        start, end = request_json.get('customRegion').split(':')
        start = int(start)
        end = int(end)
    except ValueError:
        raise CustomRangeException("Bad values for custom range.")

    nt_pos = end if end > start else start
    subseg_len = abs(end - start)
    if subseg_len >= 151:
        raise CustomRangeException("Custom region is greater then 150 " + \
                                   "nucleotides.")
    host = 'custom' + ':' + str(nt_pos) + ':' + str(subseg_len)
    return host


def get_plfold_args(host):
    '''make plfold args for custom host
    '''
    if 'custom' in host:
        try:
            a, b, c = host.split(':')
            nt_pos = int(b)
            subseg_len = int(c)
        except ValueError:
            nt_pos = data.ACCS_POS['ecoli'][0]
            subseg_len = data.ACCS_POS['ecoli'][1]
    else:
        nt_pos = data.ACCS_POS['ecoli'][0]
        subseg_len = data.ACCS_POS['ecoli'][1]
    return nt_pos, subseg_len



def parse_algorithm_settings(request_json):
    '''algorithm settings
    '''

    try:
        niter, num_seq = data.ALGORITHM_SETTINGS[request_json.get('samplingMethod')]
    except KeyError:
        niter, num_seq = data.ALGORITHM_SETTINGS['quick']
    return niter, num_seq

def parse_input_rms(request_json):
    '''parse rms
    '''
    if not request_json['customRestriction']:
        rms = parse_rms()
    else:
        rms = parse_rms(valid_rms(request_json.get('customRestriction')))
    return rms


def parse_fine_tune(request_json):
    '''parse fine tune level to accs
    '''
    if request_json['targetExpression']:
#        print(int(request_json['targetExpression']))
        post_prob = (int(request_json['targetExpression']) * \
                               (0.70 - PRIOR_PROB)/100) + PRIOR_PROB
        threshold = get_accs(post_prob) #accs threshold
    else:
        threshold = None
    return threshold


def parse_term_check(request_json):
    '''parse term check bool
    '''
    if request_json.get('terminatorCheck'):
        return request_json.get('terminatorCheck')
    else:
        return False

def parse_seed(request_json):
    '''
    parse seed
    '''
    if request_json.get('randomSeed'):
        try:
            seed = int(request_json.get('randomSeed'))
            if seed >=999999999:
                seed = 0
        except ValueError:
            seed = 0
    else:
        seed = 0

    return seed

def check_term_org(seq):
    df = pd.DataFrame({'Sequence':[seq]})
    tmp_ = AnalyseTerminators(cm=CM, seq_df=df)
    res = tmp_.term_check()
    hits = res['Hits'].values
    e_val = res['E_val']
    return hits, e_val


def tips():
    return np.random.choice(data.tips_list)

def last_modified(filepath):
    last_modif = os.path.getmtime(filepath)
    datim = str(datetime.datetime.fromtimestamp(last_modif))
    return datim.split(" ")[0]



##### FOR RAZOR
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Aug 17 10:36:23 2020
@author: bikash
"""

#import re
import warnings
#import numpy as np
import pandas as pd
from scipy.signal import savgol_filter

# Constants
S_MODELS = pd.read_pickle(os.path.join(os.path.dirname(__file__), "S.pkl.gz"))
C_MODELS = pd.read_pickle(os.path.join(os.path.dirname(__file__), "C.pkl.gz"))
FUNGI = pd.read_pickle(os.path.join(os.path.dirname(__file__), "Fungi_Classifier.pkl.gz"))
TOXIN = pd.read_pickle(os.path.join(os.path.dirname(__file__), "Toxin_Classifier.pkl.gz"))
weights_df = pd.read_pickle(os.path.join(os.path.dirname(__file__), "Cleavage_weights.pkl.gz"))
WEIGHTS = [w.to_dict() for w in weights_df.Weight]
# Weights dataframe is of order weight['Position']['AA]
# where position is 0 based.

# Kyte & Doolittle index of hydrophobicity
# J. Mol. Biol. 157:105-132(1982).

# Normalized flexibility parameters (B-values),
# Vihinen M., Torkkila E., Riikonen P. Proteins. 19(2):141-9(1994).

# Solubility Weighted Index,
# Bhandari, B.K., Gardner, P.P. and Lim, C.S.,(2020),
# doi: 10.1093/bioinformatics/btaa578

hydrop_flex_swi = {
    "R": [-4.5, 1.008, 0.771],
    "K": [-3.9, 1.102, 0.927],
    "N": [-3.5, 1.048, 0.86],
    "D": [-3.5, 1.068, 0.908],
    "Q": [-3.5, 1.037, 0.789],
    "E": [-3.5, 1.094, 0.988],
    "H": [-3.2, 0.95, 0.895],
    "P": [-1.6, 1.049, 0.824],
    "Y": [-1.3, 0.929, 0.611],
    "W": [-0.9, 0.904, 0.637],
    "S": [-0.8, 1.046, 0.744],
    "T": [-0.7, 0.997, 0.81],
    "G": [-0.4, 1.031, 0.8],
    "A": [1.8, 0.984, 0.836],
    "M": [1.9, 0.952, 0.63],
    "C": [2.5, 0.906, 0.521],
    "F": [2.8, 0.915, 0.585],
    "L": [3.8, 0.935, 0.655],
    "V": [4.2, 0.931, 0.736],
    "I": [4.5, 0.927, 0.678],
}

def validate(seq, max_scan=45):
    """
    - Replaces 'U' with 'C'
    - Pads shorter sequence with 'S' so that the length
    is 30 residues.
    - Raises ValueError if 'X' is within the residues
    defined by max_scan + 15.
    """
    seq = seq.upper()[: max_scan + 15].replace("U", "C")
    valid_aa = re.compile("^[RKNDQEHPYWSTGAMCFLVI]*$")
    match = re.match(valid_aa, seq)

    if match:
        length = len(seq)
        if length < 30:
            seq = seq + "S" * (30 - length)
        return seq
    else:
        raise ValueError(
            "Unknown residues in the input "
            "sequence.\n Only standard amino acid codes "
            "are allowed."
        )

def features(seq):
    """
    Features.
    Used to compute S score. So the sequence length should be 30.
    """

    seq = seq[:30]
    if len(seq) != 30:
        raise ValueError(
            "Input sequence must be 30 residues long!"
            "\nExpected length 30: Got {}".format(len(seq))
        )
    aa_list = 'RKNDCEVIYFWL' + 'STG'
    converted = np.array([hydrop_flex_swi[i] for i in seq])
    hydro = converted[:, 0]
    flex = converted[:, 1]
    swi = converted[:, 2]
    aa_counts = [seq.count(i) for i in aa_list]

    return np.concatenate(
        [savgol_filter(hydro, 15, 2), savgol_filter(swi, 15, 2), flex, aa_counts]
    )

def s_score(feat):
    """
    S score of sequence.
    Input is an array of features (102)
    """
    if len(feat) != 105:
        raise ValueError(
            "Input features length is incorrect!"
            "Expected length 105: Got {}".format(len(feat))
        )

    if feat.dtype != np.float64:
        raise TypeError("Non numeric characters not allowed!")

    classifiers = S_MODELS.Classifier
    S = np.array([clf.predict_proba([feat]) for clf in classifiers])[:, :, 1].flatten()
    return S

def validate_scan(seq, max_scan):

    if not isinstance(max_scan, int):
        raise TypeError("Only integers allowed for scan length.")
    if max_scan < 16:
        warnings.warn(
            "The minimum length to take for evaluating C score "
            "must be greater than 16 but received {max_scan}."
            " Correcting it to 45.".format(max_scan=max_scan)
        )
        max_scan = 45
    if max_scan > len(seq):
        warnings.warn(
            "The given maximum length to take for evaluating C score {max_scan} "
            "is greater than the input sequence length {len_seq}."
            " Correcting it to sequence length {len_seq}.".format(
                max_scan=max_scan, len_seq=len(seq)
            )
        )
        max_scan = len(seq)
    return max_scan

def c_score(seq, max_scan=45):
    """
    C score of sequence (Max probs in cleavage sites)
    Also returns the possible cleavage site and a probability of
    cleavage sites along the sequence as scored by 5 models,
    possible cleavage site (sites with max probs).
    """
    max_scan = validate_scan(seq, max_scan)

    if len(seq) <= len(seq[: max_scan + 15]):
        seq = seq + "S" * (15 - abs(len(seq) - max_scan))

    subseqs = [seq[i : i + 30] for i in range(max_scan - 15)]

    # Each subsequence is scored using each weight matrix.
    scored_subseqs = np.array(
        [
            [[weight[p][q] for p, q in enumerate(x)] for x in subseqs]
            for weight in WEIGHTS
        ]
    )

    # Each score is then classified by classifier corresponding to the weight.
    classifiers = C_MODELS.Classifier
    all_probs_ = np.array(
        [i[0].predict_proba(i[1]) for i in zip(classifiers, scored_subseqs)]
    )
    # Take the probability of class 1 only.
    all_probs = all_probs_[:, :, 1]

    c_scores = all_probs.max(axis=1)

    # Positions of cleavage site from each model.
    possible_cleavage_sites = all_probs.argmax(axis=1) + 15
    # These positions are counted on 0 based index.
    # Make sure to add one for the 'usual' position.

    return c_scores, all_probs, possible_cleavage_sites

def check_fungi(seq):
    '''
    Check if a sequence is from fungi.
    Features is the count of residues upto position 22
    '''
    seq = validate(seq)[:22]
    feat = np.array([seq.count(i) for i in 'RKNDQEHPYWSTGAMCFLVI'])

    classifiers = FUNGI.Classifier
    scores = np.array([clf.predict_proba([feat]) for clf in classifiers])[:, :, 1].flatten()
    return scores



def check_toxin(seq):
    '''
    Check if a sequence has toxic peptide.
    Features is hydrophobicity and SWI upto position 23
    '''
    seq = validate(seq)[:23]
    hydrop = np.array([hydrop_flex_swi[i] for i in seq])[:,0]
    swi = np.array([hydrop_flex_swi[i] for i in seq])[:,2]
    flex = np.array([hydrop_flex_swi[i] for i in seq])[:,1]
    turn = np.array([seq.count(i) for i in 'NPGS'])
    feat = np.concatenate([hydrop, swi, flex, turn])

    classifiers = TOXIN.Classifier
    scores = np.array([clf.predict_proba([feat]) for clf in classifiers])[:, :, 1].flatten()
    return scores



def parse_input_razor(request_json):
    '''parse sequence
    '''
    seq_ = request_json.get('inputSequenceRazor').\
                                   upper()
    max_scan_ = request_json.get('maxScan')
    if max_scan_ == None:
        max_scan = 45
    try:
        max_scan = int(max_scan_)
    except Exception:
        raise TypeError(
            "Only integers allowed for max scan length. "
        )
    try:
        seq = validate(seq_, max_scan)
    except Exception:
        raise ValueError(
            "Unknown residues in the input "
            "sequence.\n Only standard amino acid codes "
            "are allowed."
        )
    return seq, max_scan

