#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue May  7 20:55:11 2019

@author: bikash
"""

import os

#DEFAULT SETTINGS AND CONSTANTS
STOP_CODONS = ['TAG', 'TAA', 'TGA']

AA_TO_CODON = {'A' : ['GCT', 'GCC', 'GCA', 'GCG'],
               'C' : ['TGT', 'TGC'],
               'D' : ['GAT', 'GAC'],
               'E' : ['GAA', 'GAG'],
               'F' : ['TTT', 'TTC'],
               'G' : ['GGT', 'GGC', 'GGA', 'GGG'],
               'H' : ['CAT', 'CAC'],
               'I' : ['ATT', 'ATC', 'ATA'],
               'K' : ['AAG', 'AAA'],
               'L' : ['TTA', 'TTG', 'CTT', 'CTC', 'CTG', 'CTA'],
               'M' : ['ATG'],
               'N' : ['AAT', 'AAC'],
               'P' : ['CCT', 'CCC', 'CCA', 'CCG'],
               'Q' : ['CAA', 'CAG'],
               'R' : ['CGT', 'CGC', 'CGA', 'CGG', 'AGA', 'AGG'],
               'S' : ['TCT', 'TCC', 'TCA', 'TCG', 'AGT', 'AGC'],
               'T' : ['ACT', 'ACC', 'ACA', 'ACG'],
               'V' : ['GTT', 'GTC', 'GTA', 'GTG'],
               'W' : ['TGG'],
               'Y' : ['TAT', 'TAC']}


CODON_TO_AA = {'TTT' : 'F', 'TCT' : 'S', 'TAT' : 'Y', 'TGT' : 'C',
               'TTC' : 'F', 'TCC' : 'S', 'TAC' : 'Y', 'TGC' : 'C',
               'TTA' : 'L', 'TCA' : 'S', 'TTG' : 'L', 'TCG' : 'S',
               'TGG' : 'W', 'CTT' : 'L', 'CCT' : 'P', 'CAT' : 'H',
               'CGT' : 'R', 'CTC' : 'L', 'CCC' : 'P', 'CAC' : 'H',
               'CGC' : 'R', 'CTA' : 'L', 'CCA' : 'P', 'CAA' : 'Q',
               'CGA' : 'R', 'CTG' : 'L', 'CCG' : 'P', 'CAG' : 'Q',
               'CGG' : 'R', 'ATT' : 'I', 'ACT' : 'T', 'AAT' : 'N',
               'AGT' : 'S', 'ATC' : 'I', 'ACC' : 'T', 'AAC' : 'N',
               'AGC' : 'S', 'ATA' : 'I', 'ACA' : 'T', 'AAA' : 'K',
               'AGA' : 'R', 'ATG' : 'M', 'ACG' : 'T', 'AAG' : 'K',
               'AGG' : 'R', 'GTT' : 'V', 'GCT' : 'A', 'GAT' : 'D',
               'GGT' : 'G', 'GTC' : 'V', 'GCC' : 'A', 'GAC' : 'D',
               'GGC' : 'G', 'GTA' : 'V', 'GCA' : 'A', 'GAA' : 'E',
               'GGA' : 'G', 'GTG' : 'V', 'GCG' : 'A', 'GAG' : 'E',
               'GGG' : 'G'}


CNST = 100000 #prevent overflows 
pET21_UTR = 'GGGGAATTGTGAGCGGATAACAATTCCCCTCTAGAAATAATTTTGTTTAACTTTAAGAAGGAGATATACAT'
UTR5_AOX1_promoter = 'ACCTTTTTTTTTATCATCATTATTAGCTTACTTTCATAATTGCGACTGGTTCCAATTGACAAGCTTTTGATTTTAACGACTTTTAACGACAACTTGAGAAGATCAAAAAACAACTAATTATTCGAAACC'
#RNAPLFOLD_ECOLI = '-W 210 -u 50 -O'
#RNAPLFOLD_YEAST  = '-W 210 -u 100 -O'
#RNAPLFOLD_YEAST
RANDOM_SEED = 12345
RMS_SITES = 'TTTTT|CACCTGC|GCAGGTG|GGTCTC|GAGACC|CGTCTC|GAGACG|AGGAGG'
#AGGAGG is ShineDalgarno
ACCS_POS = {'yeast':[89,96], 'ecoli':[24,48], 'mouse':[11,19], \
            'other':[89,113]} #nt_pos, subseg_length



#For web input
UTR_INPUT = {'T7':pET21_UTR, 'AOX':UTR5_AOX1_promoter}
HOST_INPUT = {'Saccharomyces cerevisiae':'yeast',
              'Escherichia coli':'ecoli',
              'Mus musculus':'mouse',
              'Other':'other'}

#algorithm settings = [number of iterations, number of sequences to gen]
ALGORITHM_SETTINGS = {'deep':[20, 8], 'quick':[10, 4]}

DASHBOARD = os.path.join(os.path.dirname(__file__),'dashboard.config')


tips_list = ["Lost? Click example.",\
        "You can select a custom region to maximise accessibility under" +\
        " advanced parameters of <a href=#nav-demo>customise</a> section. ",\
        "We can also check for terminators. This option is found under" +\
        " advanced parameters of <a href=#nav-demo>customise</a> section.", \
        "You can change the results if you change the seed in " + \
        "advanced parameters of <a href=#nav-demo>customise</a> section.", \
        "If you find any bugs, please report us by opening an issue " + \
        "in our <a href=https://github.com/Gardner-BinfLab/TIsigner>github" +\
        " page</a> or contact one of the authors!", \
        "Many parameters are customisable. Check out the " + \
        "<a href=#nav-demo>customise</a> section.", \
        "Target expression is tunable for " + \
        "<span class=font-italic>Escherichia coli</span>. For other" + \
        " organisms, we provide a maximise and minimise option." + \
        "The results are sorted by minimum mismatches first, except when" + \
        " you select tunable expression.", \
        "Not getting accurate results? Try Deep Sampling option under" + \
        " advanced parameters. (This option may take some extra time!)", \
        "Check our FAQ."]


#INFO AND MANUAL
VERSION =  '1.0'
AUTHORS = 'Bikash<bikash.bhandari@postgrad.otago.ac.nz> '+\
' Lim<chunshen.lim@otago.ac.nz> '+\
' Gardner-Binflab (2019)'
MANUAL = 'Translation Initiation coding region deSIGNER.'


