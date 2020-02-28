export function substr(seq, pos) {
  let a = Number(pos[0]) - 1;
  let b = Number(pos[1]);
  return seq.substring(a, b);
}

export function subsq(seq, pos, maxRange) {
  if (maxRange <= 1) {
    maxRange = 2;
  } else if (maxRange >= 200) {
    maxRange = 200;
  }
  let subst = substr(seq, pos);
  let a = Number(pos[0]) - 1;
  let b = Number(pos[1]);
  let l = Math.floor(Math.random() * Number(maxRange));
  let r = Math.floor(Math.random() * Number(maxRange - l));

  let leftString = seq.substring(a - l, a);
  let rightString = seq.substring(b, b + r);
  /* console.log(a, b, l, r, leftString, subst, rightString); */
  return leftString + subst + rightString;
}

export const cost_func = (function() {
  let cache = {};
  return function(seq) {
    if (!(seq in cache)) {
      // cache[seq] = logistic(avr_flex(seq)); //maximise probability
      cache[seq] = logistic(solubilityWeightedIndex(seq)); //maximise probability
    }
    return cache[seq];
  };
})();

export function simulatedAnnealing(seq, pos, maxRange = 200, niter = 50) {
  let temp = 1;

  //initial region
  let subseq = substr(seq, pos);

  //current and best
  let scurr = subseq;
  let sbest = scurr;
  let initial_cost = cost_func(subseq);
  let curr_cost = cost_func(scurr);
  let curr_best_cost = cost_func(scurr);

  for (let i = 0; i < niter; i++) {
    //new move is to expand the initial region a bit
    let snew = subsq(seq, pos, maxRange);
    let new_cost = cost_func(snew);

    if (new_cost / 1000 > curr_cost / 1000) {
      scurr = snew;
      curr_cost = cost_func(scurr);
      if (curr_cost / 1000 > curr_best_cost / 1000) {
        sbest = snew;
        curr_best_cost = cost_func(sbest);
      }
    } else if (
      Math.exp(-(new_cost - curr_cost) / (1000 * temp)) < Math.random()
    ) {
      scurr = snew;
      curr_cost = cost_func(scurr);
    }
    temp -= 0.01;
  }

  let results = {};
  //check if result is actually better then original sequence
  if (cost_func(sbest) > initial_cost) {
    results.Sequence = sbest;
    results.solubilityWeightedIndexScore = cost_func(sbest);
    return results;
  }
}

export function repeatSimAnneal(seq, region, maxRange, niter = 50) {
  let results = {};
  let sequences = [];
  let swi = [];
  let positions = [];
  for (let i = 0; i < 10; i++) {
    let new_res = simulatedAnnealing(seq, region, maxRange, niter);
    if (new_res) {
      if (!sequences.includes(new_res.Sequence)) {
        let re = new RegExp(new_res.Sequence, "g");
        let matches = re.exec(seq);
        if (matches) {
          let matchStart = matches.index + 1;
          let matchEnd = new_res.Sequence.length + matches.index;
          positions.push([matchStart, matchEnd]);
        }

        sequences.push(new_res.Sequence);
        swi.push(new_res.solubilityWeightedIndexScore);
      }
    }
  }
  results.Sequence = sequences;
  results.solubilityWeightedIndexScore = swi;
  results.Positions = positions;

  // console.log(JSON.stringify(results));
  return results;
}

export function solubilityWeightedIndex(seq) {
  let swi = {'A': 0.8356471476582918,
 'C': 0.5208088354857734,
 'E': 0.9876987431418378,
 'D': 0.9079044671339564,
 'G': 0.7997168496420723,
 'F': 0.5849790194237692,
 'I': 0.6784124413866582,
 'H': 0.8947913996466419,
 'K': 0.9267104557513497,
 'M': 0.6296623675420369,
 'L': 0.6554221515081433,
 'N': 0.8597433107431216,
 'Q': 0.789434648348208,
 'P': 0.8235328714705341,
 'S': 0.7440908318492778,
 'R': 0.7712466317693457,
 'T': 0.8096922697856334,
 'W': 0.6374678690957594,
 'V': 0.7357837119163659,
 'Y': 0.6112801822947587};

  let scores = [];

  for (let i = 0; i < seq.length; i++) {
    scores.push(swi[seq[i]]);
  }
  return averageArr(scores);
}

export function averageArr(scores) {
  //compute average from given array
  let sum = 0;
  for (let k = 0; k < scores.length; k++) {
    sum += scores[k];
  }

  let avg = sum / scores.length;
  return avg;
}

export function logistic(x, a = 81.0581, b = -62.7775) {
  return 1 / (1 + Math.exp(-(a * x + b)));
}

export function flexibility(seq) {
  //adapted from biopython
  let flexibilities = {
    A: 0.984,
    C: 0.906,
    E: 1.094,
    D: 1.068,
    G: 1.031,
    F: 0.915,
    I: 0.927,
    H: 0.95,
    K: 1.102,
    M: 0.952,
    L: 0.935,
    N: 1.048,
    Q: 1.037,
    P: 1.049,
    S: 1.046,
    R: 1.008,
    T: 0.997,
    W: 0.904,
    V: 0.931,
    Y: 0.929
  };
  let win_size = 9;
  let weights = [0.25, 0.4375, 0.625, 0.8125, 1];
  let scores = [];

  for (let i = 0; i < seq.length - win_size; i++) {
    let subseq = seq.slice(i, i + win_size);
    let score = 0.0;

    for (let j = 0; j < Math.floor(win_size / 2); j++) {
      let front = subseq[j];
      let back = subseq[win_size - j - 1];
      score += (flexibilities[front] + flexibilities[back]) * weights[j];
    }

    let middle = subseq[Math.floor(win_size / 2) + 1];
    score += flexibilities[middle];
    scores.push(score / 5.25);
  }
  return scores;
}

export function hydropathy(seq) {
  //adapted from flexibility
  //for plot
  let kd = {
    A: 1.8,
    R: -4.5,
    N: -3.5,
    D: -3.5,
    C: 2.5,
    Q: -3.5,
    E: -3.5,
    G: -0.4,
    H: -3.2,
    I: 4.5,
    L: 3.8,
    K: -3.9,
    M: 1.9,
    F: 2.8,
    P: -1.6,
    S: -0.8,
    T: -0.7,
    W: -0.9,
    Y: -1.3,
    V: 4.2
  };
  let win_size = 9;
  //    let weights = [0.25, 0.4375, 0.625, 0.8125, 1];
  let weights = [1, 1, 1, 1, 1]; //equal weights for hydrophobicity
  let scores = [];

  for (let i = 0; i < seq.length - win_size; i++) {
    let subseq = seq.slice(i, i + win_size);
    let score = 0.0;

    for (let j = 0; j < Math.floor(win_size / 2); j++) {
      let front = subseq[j];
      let back = subseq[win_size - j - 1];
      score += (kd[front] + kd[back]) * weights[j];
    }

    let middle = subseq[Math.floor(win_size / 2) + 1];
    score += kd[middle];
    scores.push(score / 5.25);
  }
  return scores;
}

export function gravy(seq) {
  //biopython
  let kd = {
    A: 1.8,
    R: -4.5,
    N: -3.5,
    D: -3.5,
    C: 2.5,
    Q: -3.5,
    E: -3.5,
    G: -0.4,
    H: -3.2,
    I: 4.5,
    L: 3.8,
    K: -3.9,
    M: 1.9,
    F: 2.8,
    P: -1.6,
    S: -0.8,
    T: -0.7,
    W: -0.9,
    Y: -1.3,
    V: 4.2
  };
  let scores = [];

  for (let i = 0; i < seq.length; i++) {
    scores.push(kd[seq[i]]);
  }
  return scores;
}

export function getSequence(seq, coord) {
  //get selected sequence when using slider etc
  let start = coord[0];
  let end = coord[1];
  let selectedSeq =
    start < end ? seq.slice(start - 1, end) : seq.slice(end - 1, start);
  return selectedSeq;
}

export function demoTisigner() {
  let data =
    '{"Input":[{"Sequenceh":"ATGAAGAAGAGTTTGAGTGTGTCGGGGCCAGGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTGCAGCGATGTCACGCGCCCGTATTTCCGTGGTGCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTTCTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAATGCAGGAAGAGTTCTACCTGGAAACCTCTGAGGATCATAAACACAAGGAGGAAGATCATGACGGAGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG","Accessibility":14.34,"pExpressed":32.2,"Hits":0.0,"E_val":null}],"Optimised":[{"Sequenceh":"ATGAA<mark>A</mark>AA<mark>A</mark><mark>T</mark><mark>C</mark><mark>G</mark>TT<mark>A</mark><mark>T</mark><mark>C</mark><mark>A</mark>GT<mark>C</mark><mark>A</mark><mark>G</mark><mark>T</mark>GG<mark>C</mark>CC<mark>C</mark>GGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTGCAGCGATGTCACGCGCCCGTATTTCCGTGGTGCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTTCTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAATGCAGGAAGAGTTCTACCTGGAAACCTCTGAGGATCATAAACACAAGGAGGAAGATCATGACGGAGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG","Accessibility":4.81,"pExpressed":98.01,"Hits":0.0,"E_val":null},{"Sequenceh":"ATGAA<mark>A</mark>AA<mark>A</mark><mark>T</mark><mark>C</mark><mark>A</mark><mark>C</mark>T<mark>A</mark>AGTGT<mark>T</mark><mark>A</mark><mark>G</mark><mark>C</mark>GG<mark>C</mark>CC<mark>G</mark>GGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTGCAGCGATGTCACGCGCCCGTATTTCCGTGGTGCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTTCTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAATGCAGGAAGAGTTCTACCTGGAAACCTCTGAGGATCATAAACACAAGGAGGAAGATCATGACGGAGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG","Accessibility":5.24,"pExpressed":97.89,"Hits":0.0,"E_val":null},{"Sequenceh":"ATGAA<mark>A</mark>AA<mark>A</mark>AGTTT<mark>A</mark>AG<mark>C</mark>GTG<mark>A</mark><mark>G</mark><mark>T</mark>GGGCC<mark>T</mark>GGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTGCAGCGATGTCACGCGCCCGTATTTCCGTGGTGCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTTCTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAATGCAGGAAGAGTTCTACCTGGAAACCTCTGAGGATCATAAACACAAGGAGGAAGATCATGACGGAGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG","Accessibility":5.27,"pExpressed":97.87,"Hits":0.0,"E_val":null},{"Sequenceh":"ATGAA<mark>A</mark>AA<mark>A</mark><mark>T</mark><mark>C</mark><mark>A</mark><mark>C</mark>T<mark>A</mark>AGTGT<mark>T</mark><mark>A</mark><mark>G</mark><mark>C</mark>GG<mark>T</mark>CC<mark>G</mark>GGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTGCAGCGATGTCACGCGCCCGTATTTCCGTGGTGCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTTCTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAATGCAGGAAGAGTTCTACCTGGAAACCTCTGAGGATCATAAACACAAGGAGGAAGATCATGACGGAGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG","Accessibility":5.94,"pExpressed":97.52,"Hits":0.0,"E_val":null}],"Selected":[{"Sequenceh":"ATGAA<mark>A</mark>AA<mark>A</mark>AGT<mark>C</mark>T<mark>A</mark>AG<mark>C</mark>GT<mark>C</mark><mark>A</mark><mark>G</mark><mark>T</mark>GGGCC<mark>C</mark>GGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTGCAGCGATGTCACGCGCCCGTATTTCCGTGGTGCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTTCTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAATGCAGGAAGAGTTCTACCTGGAAACCTCTGAGGATCATAAACACAAGGAGGAAGATCATGACGGAGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG","Accessibility":4.56,"pExpressed":98.06,"Hits":0.0,"E_val":null}]}';
  return JSON.parse(data);
}

export function demoSodope() {
  let data =
    '{"results":{"hits":[{"flags":3,"nregions":2,"ndom":2,"name":"Homoserine_dh","score":"166.3","bias":"0.0","taxid":"PF00742.19","acc":"PF00742.19","domains":[{"alisqacc":"","aliIdCount":13,"alirfline":"","is_included":0,"alihmmname":"Homoserine_dh","bitscore":-1.70366358757019,"ievalue":"2400","alisqto":357,"aliSim":0.714285714285714,"jali":357,"bias":"0.01","ienv":293,"cevalue":"0.66","alimline":"g++ + ++++v+gis+l++  +   +        g+  ++ a++ +ar+++ l+ +s++ +s","alihmmfrom":79,"aliL":820,"alihindex":"9362","is_reported":"0","alintseq":"","jenv":360,"alimmline":"","alihmmacc":"PF00742.19","oasc":"0.63","aliaseq":"GASRDEDELPVKGISNLNNMAMFSVSgpgmkgMVGMAARVFAAMSRARISVVLITQSSSEYS","alihmmto":134,"aliId":0.232142857142857,"alippline":"55566788899999999988754444222111345555666555688888888888876665","alimodel":"gleveledvevegiskltaedikeak......eegkvlklvasavearVkpelvpkshplas","aliM":173,"iali":296,"alicsline":"TTT--GGGSEE--STTS-HHHHHHHH......CTTEEEEEEEEECEEEEEEEEEETTSGGGH","aliSimCount":40,"alihmmdesc":"Homoserine dehydrogenase","alisqdesc":"","alisqname":">Query","alisqfrom":296,"aliN":62},{"alisqacc":"","aliIdCount":77,"alirfline":"","is_included":"1","alihmmname":"Homoserine_dh","bitscore":"164.059127807617","display":1,"ievalue":"2.9e-48","alisqto":"811","aliSim":0.890173410404624,"jali":811,"bias":"0.00","ienv":"614","cevalue":"8.1e-52","significant":"1","alimline":"P+i+ l ++ ++gd++ +++Gil+g+l+yi+ +++e g+sfse+   a+e+Gy+e+Dp+dD++G+D+arKl+ilar+  g e+el+d+e+e +                +l++ d      +++a++egkvl++v+ +    v +rVk+++v+ ++pl++vk+ ena++++++++++  lv++G gaG+++TA++v++Dll","alihmmfrom":"1","clan":"CL0139","aliL":820,"alihindex":"9362","is_reported":"1","alintseq":"","jenv":"811","alimmline":"","alihmmacc":"PF00742.19","oasc":"0.93","aliaseq":"PVIENLqNLLNAGDELMKFSGILSGSLSYIFGKLDE-GMSFSEATTLAREMGYTEPDPRDDLSGMDVARKLLILARET-GRELELADIEIEPVLpaefnaegdvaafmaNLSQLDdlfaarVAKARDEGKVLRYVGNIdedgV-CRVKIAEVDGNDPLFKVKNGENALAFYSHYYQPlpLVLRGYGAGNDVTAAGVFADLL","alihmmto":"173","aliId":0.445086705202312,"alippline":"9*****9999*************************6.999**************************************.*************77777777777777777666666666777****************877744.*********************************99********************96","alimodel":"Piiktl.keilsgdritrieGilngtlnyiltemeeegasfsevlkeaqelGyaeaDptdDveGlDaarKlailarlafgleveledvevegis...............kltaed......ikeakeegkvlklvasa....vearVkpelvpkshplasvkgsenavlvetdrlge..lviqGpgaGaepTAsavlsDll","aliM":"173","iali":614,"alicsline":"--HHHH.HHTCTTSEEEEEEEE--HHHHHHHHHHHCHTT-HHHHHHHHHHTTSS-SSTHHHHTTHHHHHHHHHHHHHHCTTT--GGGSEE--ST...............TS-HHH......HHHHHCTTEEEEEEEEE....CEEEEEEEEEETTSGGGHSSST-EEEEEEESSSEE..EEEEES-SSHHHHHHHHHHHHH","aliSimCount":154,"alihmmdesc":"Homoserine dehydrogenase","alisqdesc":"","outcompeted":"0","alisqname":">Query","alisqfrom":"614","uniq":"1","aliN":201}],"nincluded":1,"evalue":"6.0e-49","desc":"Homoserine dehydrogenase","pvalue":-120.827088390264,"nreported":1,"hindex":"9362"},{"flags":3,"nregions":2,"ndom":2,"name":"AA_kinase","score":"158.4","bias":"0.3","taxid":"PF00696.28","acc":"PF00696.28","domains":[{"alisqacc":"","aliIdCount":74,"alirfline":"","is_included":"1","alihmmname":"AA_kinase","bitscore":"156.823013305664","display":1,"ievalue":"6.7e-46","alisqto":"284","aliSim":0.732217573221757,"jali":284,"bias":"0.10","ienv":"1","cevalue":"1.9e-49","significant":"1","alimline":" V+K+GG+s++++e+  + r+a++++  +++  +++ V ++  ++t++l+a  ++ +s + + +             +                                                        +al   ge+++ a++a  l+a+g ++  +d++e+     ++ ++ ++   +++ i+ +   a++ + ++gf + +e+ge   lgr++sD++aa lA++l+Ad+++i+tdVdGVy++dp++vpdarll+ +s++ea+e    l+++G+kv+hp+++ ++ + +ip+ I+n","alihmmfrom":"3","aliL":820,"alihindex":"157","is_reported":"1","alintseq":"","jenv":"284","alimmline":"","alihmmacc":"PF00696.28","oasc":"0.87","aliaseq":"RVLKFGGTSVANAER--FLRVADILESNARQ-GQVATVLSApAKITNHLVAMiEKTISGQDALPnisdaerifaellT-------------GlaaaqpgfplaqlktfvdqefaqikhvlhgisllgqcpdsinAALICRGEKMSIAIMAGVLEARGHNVTVIDPVEKLLavgHYLESTVDIAESTRRIAASRiPADHMVLMAGFTAGNEKGElvvLGRNGSDYSAAVLAACLRADCCEIWTDVDGVYTCDPRQVPDARLLKSMSYQEAME----LSYFGAKVLHPRTITPIAQFQIPCLIKN","alihmmto":"241","aliId":0.309623430962343,"alippline":"69*************..***********555.5999999999**********74444444444344455443433330.............133344666666677777777888889****************************************************999777777777777888888875668**************************************************************************....**************************98","alimodel":"vVvKlGGssltdkeeaslrrlaeqiaalkesgnklvvVhGg.gsftdgllal.ksglssgelaa.............glrstleeagevatr..........................................dalaslgerlvaallaaglpavglsaaaldateagr...degsdgnvesvdaeaieell.eagvvpvltgfigldeege...lgrgssDtiaallAealgAdkliiltdVdGVydadpkkvpdarllpeisvdeaeesaselatgGmkvkhpaalaaarrggipvvItn","aliM":"241","iali":2,"alicsline":"EEEEE-TTCCCCTCCHHHHHHHHHHHHHHHHTTEEEEEE--.HHHHHHHHHH.TCCCCCHHHC.................E..HHHHHHHHH..........................................HHHHHHHHHHHHHHHHTTHGEEEE-GGGTCEECCCE.....HHHTTTCEEECCHHHHHH.HTT-EEEEESEEEEETTTE...EEEE-HHHHHHHHHHHCTSSEEEEEESSSSCESSTTTTCCTTCECCEEEHHHCHHCSSS.TTTHHHHCHHHHHHHHHCTT-EEEEEE","aliSimCount":175,"alihmmdesc":"Amino acid kinase family","alisqdesc":"","outcompeted":0,"alisqname":">Query","alisqfrom":"2","uniq":"2","aliN":303},{"alisqacc":"","aliIdCount":6,"alirfline":"","is_included":0,"alihmmname":"AA_kinase","bitscore":-1.68059587478638,"ievalue":"1700","alisqto":487,"aliSim":0.823529411764706,"jali":487,"bias":"0.02","ienv":433,"cevalue":"0.49","alimline":"v V+G g+++ +ll++   +","alihmmfrom":38,"aliL":820,"alihindex":"157","is_reported":"0","alintseq":"","jenv":575,"alimmline":"","alihmmacc":"PF00696.28","oasc":"0.73","aliaseq":"VFVIGVGGVGGALLEQlkrQ","alihmmto":54,"aliId":0.352941176470588,"alippline":"67777777888877775331","alimodel":"vvVhGggsftdgllal...k","aliM":241,"iali":468,"alicsline":"EEEE--HHHHHHHHHH...T","aliSimCount":14,"alihmmdesc":"Amino acid kinase family","alisqdesc":"","alisqname":">Query","alisqfrom":468,"aliN":20}],"nincluded":1,"evalue":"2.2e-46","desc":"Amino acid kinase family","pvalue":-114.914539369609,"nreported":1,"hindex":"157"},{"flags":3,"nregions":1,"ndom":1,"name":"NAD_binding_3","score":"117.3","bias":"0.0","taxid":"PF03447.16","acc":"PF03447.16","domains":[{"alisqacc":"","aliIdCount":46,"alirfline":"","is_included":"1","alihmmname":"NAD_binding_3","bitscore":"115.841293334961","display":1,"ievalue":"1.6e-33","alisqto":"605","aliSim":0.948275862068966,"jali":605,"bias":"0.01","ienv":"472","cevalue":"4.4e-37","significant":"1","alimline":"G+G++G+a+leqlkrqqs+     i+l++++va+++  l++ +      ++++la+++++ +l +li+ +      ++v+V+c+ss+ava++++++L++g++vvt+nk+a++ ++++y++Lr+aae++++k+++","alihmmfrom":"1","clan":"CL0063","aliL":820,"alihindex":"11415","is_reported":"1","alintseq":"","jenv":"606","alimmline":"","alihmmacc":"PF03447.16","oasc":"0.97","aliaseq":"GVGGVGGALLEQLKRQQSWlknkhIDLRVCGVANSKaLLTNVHglnlenWQEELAQAKEPFNLGRLIRLVkeyhlLNPVIVDCTSSQAVADQYADFLREGFHVVTPNKKANTsSMDYYHQLRYAAEKSRRKFLY","alihmmto":"116","aliId":0.396551724137931,"alippline":"9***********************************8888888*************************88***977*******************************************************998","alimodel":"GlGaiGsavleqlkrqqse.....ielelvavadrd.sllskd......rkallasealtldlddliahl.....dpdvvVEcasseavaelvlkaLkagkdvvtankgala.dealyeeLreaaeangakiyv","aliM":"117","iali":472,"alicsline":"--SHHHHHHHHHHHH---S.....SEEEEEEEEESS.EEE-TT......HHHHHT--CB---HHHHHHHH.....S-EEEEE-S--HHHHTTHHHHHHTTEEEE-S--CGGG.-HHHHHHHTSSSTTS--.EE-","aliSimCount":110,"alihmmdesc":"Homoserine dehydrogenase, NAD binding domain","alisqdesc":"","outcompeted":"0","alisqname":">Query","alisqfrom":"472","uniq":"3","aliN":134}],"nincluded":1,"evalue":"5.4e-34","desc":"Homoserine dehydrogenase, NAD binding domain","pvalue":-86.3900813723343,"nreported":1,"hindex":"11415"},{"flags":3,"nregions":2,"ndom":2,"name":"ACT_7","score":"68.4","bias":"1.3","taxid":"PF13840.6","acc":"PF13840.6","domains":[{"alisqacc":"","aliIdCount":15,"alirfline":"","is_included":"1","alihmmname":"ACT_7","bitscore":"31.0239086151123","display":0,"ievalue":"1.6e-07","alisqto":"374","aliSim":0.830508474576271,"jali":374,"bias":"0.04","ienv":"312","cevalue":"4.4e-11","significant":"1","alimline":"+++++sv+g+g+++ ++G++a+++++ ++a Is+  i+   +++++++ Vp++d  +A +a ","alihmmfrom":"5","clan":"CL0070","aliL":820,"alihindex":"299","is_reported":"1","alintseq":"","jenv":"376","alimmline":"","alihmmacc":"PF13840.6","oasc":"0.90","aliaseq":"NMAMFSVSGPGMKG-MVGMAARVFAAMSRARISVVLITqssSEYSISFCVPQSDCVRAERAM","alihmmto":"63","aliId":0.254237288135593,"alippline":"6799**********.******************87665556**************9998886","alimodel":"gwiklsvvgsglpfdvtGivaklaspLaeagIsifqiS...tyrtdyiLVpeedlekAveaL","aliM":"65","iali":314,"alicsline":"EEEEEEE-S-.---SS--HHHHHHHHHHTTT---EEEE...-SS-EEEEEEGGGHHHHHHHH","aliSimCount":49,"alihmmdesc":"ACT domain","alisqdesc":"","outcompeted":"1","alisqname":">Query","alisqfrom":"314","uniq":"4","aliN":62},{"alisqacc":"","aliIdCount":19,"alirfline":"","is_included":"1","alihmmname":"ACT_7","bitscore":"35.6038932800293","display":1,"ievalue":"5.8e-09","alisqto":"453","aliSim":0.813559322033898,"jali":453,"bias":"0.29","ienv":"391","cevalue":"1.6e-12","significant":"1","alimline":" ++ + +svvg+g+++ + Gi ak +++La+a+I+i +i+   ++r+++++V+ +d+ + v+","alihmmfrom":"3","clan":"CL0070","aliL":820,"alihindex":"299","is_reported":"1","alintseq":"","jenv":"457","alimmline":"","alihmmacc":"PF13840.6","oasc":"0.92","aliaseq":"TERLAIISVVGDGMRT-LRGISAKFFAALARANINIVAIAqgsSERSISVVVNNDDATTGVR","alihmmto":"61","aliId":0.322033898305085,"alippline":"57899***********.**********************9999*************987665","alimodel":"edgwiklsvvgsglpfdvtGivaklaspLaeagIsifqiS...tyrtdyiLVpeedlekAve","aliM":"65","iali":393,"alicsline":"EEEEEEEEE-S-.---SS--HHHHHHHHHHTTT---EEEE...-SS-EEEEEEGGGHHHHHH","aliSimCount":48,"alihmmdesc":"ACT domain","alisqdesc":"","outcompeted":"0","alisqname":">Query","alisqfrom":"393","uniq":"5","aliN":62}],"nincluded":2,"evalue":"3.4e-19","desc":"ACT domain","pvalue":-52.310165958671,"nreported":2,"hindex":"299"},{"flags":3,"nregions":2,"ndom":2,"name":"ACT","score":"62.9","bias":"0.3","taxid":"PF01842.25","acc":"PF01842.25","domains":[{"alisqacc":"","aliIdCount":18,"alirfline":"","is_included":"1","alihmmname":"ACT","bitscore":"31.9564876556396","display":1,"ievalue":"7.8e-08","alisqto":"376","aliSim":0.849056603773585,"jali":376,"bias":"0.00","ienv":"320","cevalue":"2.2e-11","significant":"1","alimline":"g+++++G++arvf+a++++ i+++ i+q+sse+   +i+f+v   d  ++e ++++","alihmmfrom":"6","clan":"CL0070","aliL":820,"alihindex":"283","is_reported":"1","alintseq":"","jenv":"381","alimmline":"","alihmmacc":"PF01842.25","oasc":"0.91","aliaseq":"GMKGMVGMAARVFAAMSRARISVVLITQSSSEY---SISFCVPQSDCVRAERAMQE","alihmmto":"61","aliId":0.339622641509434,"alippline":"7999*****************************...89999999988888888877","alimodel":"gvpDrPGlLarvfgaladrgiNidsieqrssedkvagivfvvivvdeedleevlea","aliM":"67","iali":324,"alicsline":"EEESSTTHHHHHHHHHHHTTSEEEEEEEEEESTTECEEEEEEEEEEHHHHHHHHHH","aliSimCount":45,"alihmmdesc":"ACT domain","alisqdesc":"","outcompeted":"0","alisqname":">Query","alisqfrom":"324","uniq":"6","aliN":56},{"alisqacc":"","aliIdCount":19,"alirfline":"","is_included":"1","alihmmname":"ACT","bitscore":"27.5466766357422","display":0,"ievalue":"1.9e-06","alisqto":"447","aliSim":0.790697674418605,"jali":447,"bias":"0.52","ienv":"400","cevalue":"5.2e-10","significant":"1","alimline":"g++   G+ a++f+ala+++iNi+ i q+sse+   +i++vv   d","alihmmfrom":"6","clan":"CL0070","aliL":820,"alihindex":"283","is_reported":"1","alintseq":"","jenv":"453","alimmline":"","alihmmacc":"PF01842.25","oasc":"0.81","aliaseq":"GMRTLRGISAKFFAALARANINIVAIAQGSSER---SISVVVNNDD","alihmmto":"51","aliId":0.441860465116279,"alippline":"677778*************************88...5665555544","alimodel":"gvpDrPGlLarvfgaladrgiNidsieqrssedkvagivfvvivvd","aliM":"67","iali":405,"alicsline":"EEESSTTHHHHHHHHHHHTTSEEEEEEEEEESTTECEEEEEEEEEE","aliSimCount":34,"alihmmdesc":"ACT domain","alisqdesc":"","outcompeted":"1","alisqname":">Query","alisqfrom":"405","uniq":"7","aliN":46}],"nincluded":2,"evalue":"1.7e-17","desc":"ACT domain","pvalue":-48.4304661781845,"nreported":2,"hindex":"283"}],"algo":"hmmscan","stats":{"page":1,"nhits":"5","elapsed":"0.06","Z":17929,"Z_setby":0,"n_past_msv":567,"unpacked":5,"user":0,"domZ_setby":0,"nseqs":1,"n_past_bias":535,"sys":0,"n_past_fwd":6,"total":1,"nmodels":17929,"nincluded":5,"n_past_vit":38,"nreported":5,"domZ":5},"uuid":"FD86A0A6-30EA-11EA-9D76-01E3DBC3747A","_internal":{"lowevalue":"1.7e-17","highevalue":"6.0e-49"}}}';
  return JSON.parse(data);
}

export function defaultNucleotideSodope() {
  let seq =
    "ATGCGAGTGTTGAAGTTCGGCGGTACATCAGTGGCAAATGCAGAACGTTTTCTGCGTGTTGCCGATATTCTGGAAAGCAA" +
    "TGCCAGGCAGGGGCAGGTGGCCACCGTCCTCTCTGCCCCCGCCAAAATCACCAACCACCTGGTGGCGATGATTGAAAAAA" +
    "CCATTAGCGGCCAGGATGCTTTACCCAATATCAGCGATGCCGAACGTATTTTTGCCGAACTTTTGACGGGACTCGCCGCC" +
    "GCCCAGCCGGGGTTCCCGCTGGCGCAATTGAAAACTTTCGTCGATCAGGAATTTGCCCAAATAAAACATGTCCTGCATGG" +
    "CATTAGTTTGTTGGGGCAGTGCCCGGATAGCATCAACGCTGCGCTGATTTGCCGTGGCGAGAAAATGTCGATCGCCATTA" +
    "TGGCCGGCGTATTAGAAGCGCGCGGTCACAACGTTACTGTTATCGATCCGGTCGAAAAACTGCTGGCAGTGGGGCATTAC" +
    "CTCGAATCTACCGTCGATATTGCTGAGTCCACCCGCCGTATTGCGGCAAGCCGCATTCCGGCTGATCACATGGTGCTGAT" +
    "GGCAGGTTTCACCGCCGGTAATGAAAAAGGCGAACTGGTGGTGCTTGGACGCAACGGTTCCGACTACTCTGCTGCGGTGC" +
    "TGGCTGCCTGTTTACGCGCCGATTGTTGCGAGATTTGGACGGACGTTGACGGGGTCTATACCTGCGACCCGCGTCAGGTG" +
    "CCCGATGCGAGGTTGTTGAAGTCGATGTCCTACCAGGAAGCGATGGAGCTTTCCTACTTCGGCGCTAAAGTTCTTCACCC" +
    "CCGCACCATTACCCCCATCGCCCAGTTCCAGATCCCTTGCCTGATTAAAAATACCGGAAATCCTCAAGCACCAGGTACGC" +
    "TCATTGGTGCCAGCCGTGATGAAGACGAATTACCGGTCAAGGGCATTTCCAATCTGAATAACATGGCAATGTTCAGCGTT" +
    "TCTGGTCCGGGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTGCAGCGATGTCACGCGCCCGTATTTCCGTGGT" +
    "GCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTTCTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAA" +
    "TGCAGGAAGAGTTCTACCTGGAACTGAAAGAAGGCTTACTGGAGCCGCTGGCAGTGACGGAACGGCTGGCCATTATCTCG" +
    "GTGGTAGGTGATGGTATGCGCACCTTGCGTGGGATCTCGGCGAAATTCTTTGCCGCACTGGCCCGCGCCAATATCAACAT" +
    "TGTCGCCATTGCTCAGGGATCTTCTGAACGCTCAATCTCTGTCGTGGTAAATAACGATGATGCGACCACTGGCGTGCGCG" +
    "TTACTCATCAGATGCTGTTCAATACCGATCAGGTTATCGAAGTGTTTGTGATTGGCGTCGGTGGCGTTGGCGGTGCGCTG" +
    "CTGGAGCAACTGAAGCGTCAGCAAAGCTGGCTGAAGAATAAACATATCGACTTACGTGTCTGCGGTGTTGCCAACTCGAA" +
    "GGCTCTGCTCACCAATGTACATGGCCTTAATCTGGAAAACTGGCAGGAAGAACTGGCGCAAGCCAAAGAGCCGTTTAATC" +
    "TCGGGCGCTTAATTCGCCTCGTGAAAGAATATCATCTGCTGAACCCGGTCATTGTTGACTGCACTTCCAGCCAGGCAGTG" +
    "GCGGATCAATATGCCGACTTCCTGCGCGAAGGTTTCCACGTTGTCACGCCGAACAAAAAGGCCAACACCTCGTCGATGGA" +
    "TTACTACCATCAGTTGCGTTATGCGGCGGAAAAATCGCGGCGTAAATTCCTCTATGACACCAACGTTGGGGCTGGATTAC" +
    "CGGTTATTGAGAACCTGCAAAATCTGCTCAATGCAGGTGATGAATTGATGAAGTTCTCCGGCATTCTTTCTGGTTCGCTT" +
    "TCTTATATCTTCGGCAAGTTAGACGAAGGCATGAGTTTCTCCGAGGCGACCACGCTGGCGCGGGAAATGGGTTATACCGA" +
    "ACCGGACCCGCGAGATGATCTTTCTGGTATGGATGTGGCGCGTAAACTATTGATTCTCGCTCGTGAAACGGGACGTGAAC" +
    "TGGAGCTGGCGGATATTGAAATTGAACCTGTGCTGCCCGCAGAGTTTAACGCCGAGGGTGATGTTGCCGCTTTTATGGCG" +
    "AATCTGTCACAACTCGACGATCTCTTTGCCGCGCGCGTGGCGAAGGCCCGTGATGAAGGAAAAGTTTTGCGCTATGTTGG" +
    "CAATATTGATGAAGATGGCGTCTGCCGCGTGAAGATTGCCGAAGTGGATGGTAATGATCCGCTGTTCAAAGTGAAAAATG" +
    "GCGAAAACGCCCTGGCCTTCTATAGCCACTATTATCAGCCGCTGCCGTTGGTACTGCGCGGATATGGTGCGGGCAATGAC" +
    "GTTACAGCTGCCGGTGTCTTTGCTGATCTGCTACGTACCCTCTCATGGAAGTTAGGAGTCTGA";
  return seq;
}

export function defaultProteinSodope() {
  let seq =
    "MAGAASPCANGCGPSAPSDAEVVHLCRSLEVGTVMTLFYSKKSRPERKTFQVKLETRQITWSRGADKIEGAIDIREIKEI" +
    "RPGKTSRDFDRYQEDPAFRPDQSHCFVILYGMEFRLKTLSLQATSEDEVNMWIRGLTWLMEDTLQAATPLQIERWLRKQF" +
    "YSVDRNREDRISAKDLKNMLSQVNYRVPNMRFLRERLTDLEQRTSDITYGQFAQLYRSLMYSAQKTMDLPFLEASALRAG" +
    "ERPELCRVSLPEFQQFLLEYQGELWAVDRLQVQEFMLSFLRDPLREIEEPYFFLDEFVTFLFSKENSIWNSQLDEVCPDT" +
    "MNNPLSHYWISSSHNTYLTGDQFSSESSLEAYARCLRMGCRCIELDCWDGPDGMPVIYHGHTLTTKIKFSDVLHTIKEHA" +
    "FVASEYPVILSIEDHCSIAQQRNMAQYFKKVLGDTLLTKPVDIAADGLPSPNQLKRKILIKHKKLAEGSAYEEVPTSVMY" +
    "SENDISNSIKNGILYLEDPVNHEWYPHYFVLTSSKIYYSEETSSDQGNEDEEEPKEASGSTELHSNEKWFHGKLGAGRDG" +
    "RHIAERLLTEYCIETGAPDGSFLVRESETFVGDYTLSFWRNGKVQHCRIHSRQDAGTPKFFLTDNLVFDSLYDLITHYQQ" +
    "VPLRCNEFEMRLSEPVPQTNAHESKEWYHASLTRAQAEHMLMRVPRDGAFLVRKRNEPNSYAISFRAEGKIKHCRVQQEG" +
    "QTVMLGNSEFDSLVDLISYYEKHPLYRKMKLRYPINEEALEKIGTAEPDYGALYEGRNPGFYVEANPMPTFKCAVKALFD" +
    "YKAQREDELTFTKSAIIQNVEKQEGGWWRGDYGGKKQLWFPSNYVEEMVSPAALEPEREHLDENSPLGDLLRGVLDVPAC" +
    "QIAVRPEGKNNRLFVFSISMASVAHWSLDVAADSQEELQDWVKKIREVAQTADARLTEGKMMERRKKIALELSELVVYCR" +
    "PVPFDEEKIGTERACYRDMSSFPETKAEKYVNKAKGKKFLQYNRLQLSRIYPKGQRLDSSNYDPLPMWICGSQLVALNFQ" +
    "TPDKPMQMNQALFLAGGHCGYVLQPSVMRDEAFDPFDKSSLRGLEPCAICIEVLGARHLPKNGRGIVCPFVEIEVAGAEY" +
    "DSIKQKTEFVVDNGLNPVWPAKPFHFQISNPEFAFLRFVVYEEDMFSDQNFLAQATFPVKGLKTGYRAVPLKNNYSEGLE" +
    "LASLLVKIDVFPAKQENGDLSPFGGASLRERSCDASGPLFHGRAREGSFEARYQQPFEDFRISQEHLADHFDGRDRRTPR" +
    "RTRVNGDNRL";
  return seq;
}

export function defaultNucleotideTIsigner() {
  let seq =
    "ATGAAGAAGAGTTTGAGTGTGTCGGGGCCAGGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTG" +
    "CAGCGATGTCACGCGCCCGTATTTCCGTGGTGCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTT" +
    "CTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAATGCAGGAAGAGTTCTACCTGGAAACCTCT" +
    "GAGGATCATAAACACAAGGAGGAAGATCATGACGGAGCTCGCCTCGAGGGAGGACTATCTATCTATCTAT" +
    "CTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTT" +
    "CTAG";
  return seq;
}
