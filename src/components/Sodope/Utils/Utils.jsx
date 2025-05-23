/**
 * @Author: Bikash Kumar Bhandari <bikash>
 * @Date:   2021-04-06T21:07:49+12:00
 * @Filename: Utils.jsx
 * @Last modified by:   bikash
 * @Last modified time: 2021-10-30T08:40:49+13:00
 */



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
  let swi = {
    A: 0.8356471476582918,
    C: 0.5208088354857734,
    E: 0.9876987431418378,
    D: 0.9079044671339564,
    G: 0.7997168496420723,
    F: 0.5849790194237692,
    I: 0.6784124413866582,
    H: 0.8947913996466419,
    K: 0.9267104557513497,
    M: 0.6296623675420369,
    L: 0.6554221515081433,
    N: 0.8597433107431216,
    Q: 0.789434648348208,
    P: 0.8235328714705341,
    S: 0.7440908318492778,
    R: 0.7712466317693457,
    T: 0.8096922697856334,
    W: 0.6374678690957594,
    V: 0.7357837119163659,
    Y: 0.6112801822947587
  };

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
    scores.push(score);
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
    '{"Input":[{"Sequence":"ATGAAGAAGAGTTTGAGTGTGTCGGGGCCAGGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTGCAGCGATGTCACGCGCCCGTATTTCCGTGGTGCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTTCTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAATGCAGGAAGAGTTCTACCTGGAAACCTCTGAGGATCATAAACACAAGGAGGAAGATCATGACGGAGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG","Accessibility":14.34,"pExpressed":32.2,"Hits":0.0,"E_val":null}],"Optimised":[{"Sequence":"ATGAA<mark>A</mark>AA<mark>A</mark><mark>T</mark><mark>C</mark><mark>G</mark>TT<mark>A</mark><mark>T</mark><mark>C</mark><mark>A</mark>GT<mark>C</mark><mark>A</mark><mark>G</mark><mark>T</mark>GG<mark>C</mark>CC<mark>C</mark>GGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTGCAGCGATGTCACGCGCCCGTATTTCCGTGGTGCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTTCTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAATGCAGGAAGAGTTCTACCTGGAAACCTCTGAGGATCATAAACACAAGGAGGAAGATCATGACGGAGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG","Accessibility":4.81,"pExpressed":98.01,"Hits":0.0,"E_val":null},{"Sequence":"ATGAA<mark>A</mark>AA<mark>A</mark><mark>T</mark><mark>C</mark><mark>A</mark><mark>C</mark>T<mark>A</mark>AGTGT<mark>T</mark><mark>A</mark><mark>G</mark><mark>C</mark>GG<mark>C</mark>CC<mark>G</mark>GGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTGCAGCGATGTCACGCGCCCGTATTTCCGTGGTGCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTTCTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAATGCAGGAAGAGTTCTACCTGGAAACCTCTGAGGATCATAAACACAAGGAGGAAGATCATGACGGAGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG","Accessibility":5.24,"pExpressed":97.89,"Hits":0.0,"E_val":null},{"Sequence":"ATGAA<mark>A</mark>AA<mark>A</mark>AGTTT<mark>A</mark>AG<mark>C</mark>GTG<mark>A</mark><mark>G</mark><mark>T</mark>GGGCC<mark>T</mark>GGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTGCAGCGATGTCACGCGCCCGTATTTCCGTGGTGCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTTCTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAATGCAGGAAGAGTTCTACCTGGAAACCTCTGAGGATCATAAACACAAGGAGGAAGATCATGACGGAGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG","Accessibility":5.27,"pExpressed":97.87,"Hits":0.0,"E_val":null},{"Sequence":"ATGAA<mark>A</mark>AA<mark>A</mark><mark>T</mark><mark>C</mark><mark>A</mark><mark>C</mark>T<mark>A</mark>AGTGT<mark>T</mark><mark>A</mark><mark>G</mark><mark>C</mark>GG<mark>T</mark>CC<mark>G</mark>GGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTGCAGCGATGTCACGCGCCCGTATTTCCGTGGTGCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTTCTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAATGCAGGAAGAGTTCTACCTGGAAACCTCTGAGGATCATAAACACAAGGAGGAAGATCATGACGGAGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG","Accessibility":5.94,"pExpressed":97.52,"Hits":0.0,"E_val":null}],"Selected":[{"Sequence":"ATGAA<mark>A</mark>AA<mark>A</mark>AGT<mark>C</mark>T<mark>A</mark>AG<mark>C</mark>GT<mark>C</mark><mark>A</mark><mark>G</mark><mark>T</mark>GGGCC<mark>C</mark>GGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTGCAGCGATGTCACGCGCCCGTATTTCCGTGGTGCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTTCTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAATGCAGGAAGAGTTCTACCTGGAAACCTCTGAGGATCATAAACACAAGGAGGAAGATCATGACGGAGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG","Accessibility":4.56,"pExpressed":98.06,"Hits":0.0,"E_val":null}]}';
  return JSON.parse(data);
}

export function demoSodope() {
  let data =
    // '{"results":{"hits":[{"flags":3,"nregions":2,"ndom":2,"name":"Homoserine_dh","score":"166.3","bias":"0.0","taxid":"PF00742.19","acc":"PF00742.19","domains":[{"alisqacc":"","aliIdCount":13,"alirfline":"","is_included":0,"alihmmname":"Homoserine_dh","bitscore":-1.70366358757019,"ievalue":"2400","alisqto":357,"aliSim":0.714285714285714,"jali":357,"bias":"0.01","ienv":293,"cevalue":"0.66","alimline":"g++ + ++++v+gis+l++  +   +        g+  ++ a++ +ar+++ l+ +s++ +s","alihmmfrom":79,"aliL":820,"alihindex":"9362","is_reported":"0","alintseq":"","jenv":360,"alimmline":"","alihmmacc":"PF00742.19","oasc":"0.63","aliaseq":"GASRDEDELPVKGISNLNNMAMFSVSgpgmkgMVGMAARVFAAMSRARISVVLITQSSSEYS","alihmmto":134,"aliId":0.232142857142857,"alippline":"55566788899999999988754444222111345555666555688888888888876665","alimodel":"gleveledvevegiskltaedikeak......eegkvlklvasavearVkpelvpkshplas","aliM":173,"iali":296,"alicsline":"TTT--GGGSEE--STTS-HHHHHHHH......CTTEEEEEEEEECEEEEEEEEEETTSGGGH","aliSimCount":40,"alihmmdesc":"Homoserine dehydrogenase","alisqdesc":"","alisqname":">Query","alisqfrom":296,"aliN":62},{"alisqacc":"","aliIdCount":77,"alirfline":"","is_included":"1","alihmmname":"Homoserine_dh","bitscore":"164.059127807617","display":1,"ievalue":"2.9e-48","alisqto":"811","aliSim":0.890173410404624,"jali":811,"bias":"0.00","ienv":"614","cevalue":"8.1e-52","significant":"1","alimline":"P+i+ l ++ ++gd++ +++Gil+g+l+yi+ +++e g+sfse+   a+e+Gy+e+Dp+dD++G+D+arKl+ilar+  g e+el+d+e+e +                +l++ d      +++a++egkvl++v+ +    v +rVk+++v+ ++pl++vk+ ena++++++++++  lv++G gaG+++TA++v++Dll","alihmmfrom":"1","clan":"CL0139","aliL":820,"alihindex":"9362","is_reported":"1","alintseq":"","jenv":"811","alimmline":"","alihmmacc":"PF00742.19","oasc":"0.93","aliaseq":"PVIENLqNLLNAGDELMKFSGILSGSLSYIFGKLDE-GMSFSEATTLAREMGYTEPDPRDDLSGMDVARKLLILARET-GRELELADIEIEPVLpaefnaegdvaafmaNLSQLDdlfaarVAKARDEGKVLRYVGNIdedgV-CRVKIAEVDGNDPLFKVKNGENALAFYSHYYQPlpLVLRGYGAGNDVTAAGVFADLL","alihmmto":"173","aliId":0.445086705202312,"alippline":"9*****9999*************************6.999**************************************.*************77777777777777777666666666777****************877744.*********************************99********************96","alimodel":"Piiktl.keilsgdritrieGilngtlnyiltemeeegasfsevlkeaqelGyaeaDptdDveGlDaarKlailarlafgleveledvevegis...............kltaed......ikeakeegkvlklvasa....vearVkpelvpkshplasvkgsenavlvetdrlge..lviqGpgaGaepTAsavlsDll","aliM":"173","iali":614,"alicsline":"--HHHH.HHTCTTSEEEEEEEE--HHHHHHHHHHHCHTT-HHHHHHHHHHTTSS-SSTHHHHTTHHHHHHHHHHHHHHCTTT--GGGSEE--ST...............TS-HHH......HHHHHCTTEEEEEEEEE....CEEEEEEEEEETTSGGGHSSST-EEEEEEESSSEE..EEEEES-SSHHHHHHHHHHHHH","aliSimCount":154,"alihmmdesc":"Homoserine dehydrogenase","alisqdesc":"","outcompeted":"0","alisqname":">Query","alisqfrom":"614","uniq":"1","aliN":201}],"nincluded":1,"evalue":"6.0e-49","desc":"Homoserine dehydrogenase","pvalue":-120.827088390264,"nreported":1,"hindex":"9362"},{"flags":3,"nregions":2,"ndom":2,"name":"AA_kinase","score":"158.4","bias":"0.3","taxid":"PF00696.28","acc":"PF00696.28","domains":[{"alisqacc":"","aliIdCount":74,"alirfline":"","is_included":"1","alihmmname":"AA_kinase","bitscore":"156.823013305664","display":1,"ievalue":"6.7e-46","alisqto":"284","aliSim":0.732217573221757,"jali":284,"bias":"0.10","ienv":"1","cevalue":"1.9e-49","significant":"1","alimline":" V+K+GG+s++++e+  + r+a++++  +++  +++ V ++  ++t++l+a  ++ +s + + +             +                                                        +al   ge+++ a++a  l+a+g ++  +d++e+     ++ ++ ++   +++ i+ +   a++ + ++gf + +e+ge   lgr++sD++aa lA++l+Ad+++i+tdVdGVy++dp++vpdarll+ +s++ea+e    l+++G+kv+hp+++ ++ + +ip+ I+n","alihmmfrom":"3","aliL":820,"alihindex":"157","is_reported":"1","alintseq":"","jenv":"284","alimmline":"","alihmmacc":"PF00696.28","oasc":"0.87","aliaseq":"RVLKFGGTSVANAER--FLRVADILESNARQ-GQVATVLSApAKITNHLVAMiEKTISGQDALPnisdaerifaellT-------------GlaaaqpgfplaqlktfvdqefaqikhvlhgisllgqcpdsinAALICRGEKMSIAIMAGVLEARGHNVTVIDPVEKLLavgHYLESTVDIAESTRRIAASRiPADHMVLMAGFTAGNEKGElvvLGRNGSDYSAAVLAACLRADCCEIWTDVDGVYTCDPRQVPDARLLKSMSYQEAME----LSYFGAKVLHPRTITPIAQFQIPCLIKN","alihmmto":"241","aliId":0.309623430962343,"alippline":"69*************..***********555.5999999999**********74444444444344455443433330.............133344666666677777777888889****************************************************999777777777777888888875668**************************************************************************....**************************98","alimodel":"vVvKlGGssltdkeeaslrrlaeqiaalkesgnklvvVhGg.gsftdgllal.ksglssgelaa.............glrstleeagevatr..........................................dalaslgerlvaallaaglpavglsaaaldateagr...degsdgnvesvdaeaieell.eagvvpvltgfigldeege...lgrgssDtiaallAealgAdkliiltdVdGVydadpkkvpdarllpeisvdeaeesaselatgGmkvkhpaalaaarrggipvvItn","aliM":"241","iali":2,"alicsline":"EEEEE-TTCCCCTCCHHHHHHHHHHHHHHHHTTEEEEEE--.HHHHHHHHHH.TCCCCCHHHC.................E..HHHHHHHHH..........................................HHHHHHHHHHHHHHHHTTHGEEEE-GGGTCEECCCE.....HHHTTTCEEECCHHHHHH.HTT-EEEEESEEEEETTTE...EEEE-HHHHHHHHHHHCTSSEEEEEESSSSCESSTTTTCCTTCECCEEEHHHCHHCSSS.TTTHHHHCHHHHHHHHHCTT-EEEEEE","aliSimCount":175,"alihmmdesc":"Amino acid kinase family","alisqdesc":"","outcompeted":0,"alisqname":">Query","alisqfrom":"2","uniq":"2","aliN":303},{"alisqacc":"","aliIdCount":6,"alirfline":"","is_included":0,"alihmmname":"AA_kinase","bitscore":-1.68059587478638,"ievalue":"1700","alisqto":487,"aliSim":0.823529411764706,"jali":487,"bias":"0.02","ienv":433,"cevalue":"0.49","alimline":"v V+G g+++ +ll++   +","alihmmfrom":38,"aliL":820,"alihindex":"157","is_reported":"0","alintseq":"","jenv":575,"alimmline":"","alihmmacc":"PF00696.28","oasc":"0.73","aliaseq":"VFVIGVGGVGGALLEQlkrQ","alihmmto":54,"aliId":0.352941176470588,"alippline":"67777777888877775331","alimodel":"vvVhGggsftdgllal...k","aliM":241,"iali":468,"alicsline":"EEEE--HHHHHHHHHH...T","aliSimCount":14,"alihmmdesc":"Amino acid kinase family","alisqdesc":"","alisqname":">Query","alisqfrom":468,"aliN":20}],"nincluded":1,"evalue":"2.2e-46","desc":"Amino acid kinase family","pvalue":-114.914539369609,"nreported":1,"hindex":"157"},{"flags":3,"nregions":1,"ndom":1,"name":"NAD_binding_3","score":"117.3","bias":"0.0","taxid":"PF03447.16","acc":"PF03447.16","domains":[{"alisqacc":"","aliIdCount":46,"alirfline":"","is_included":"1","alihmmname":"NAD_binding_3","bitscore":"115.841293334961","display":1,"ievalue":"1.6e-33","alisqto":"605","aliSim":0.948275862068966,"jali":605,"bias":"0.01","ienv":"472","cevalue":"4.4e-37","significant":"1","alimline":"G+G++G+a+leqlkrqqs+     i+l++++va+++  l++ +      ++++la+++++ +l +li+ +      ++v+V+c+ss+ava++++++L++g++vvt+nk+a++ ++++y++Lr+aae++++k+++","alihmmfrom":"1","clan":"CL0063","aliL":820,"alihindex":"11415","is_reported":"1","alintseq":"","jenv":"606","alimmline":"","alihmmacc":"PF03447.16","oasc":"0.97","aliaseq":"GVGGVGGALLEQLKRQQSWlknkhIDLRVCGVANSKaLLTNVHglnlenWQEELAQAKEPFNLGRLIRLVkeyhlLNPVIVDCTSSQAVADQYADFLREGFHVVTPNKKANTsSMDYYHQLRYAAEKSRRKFLY","alihmmto":"116","aliId":0.396551724137931,"alippline":"9***********************************8888888*************************88***977*******************************************************998","alimodel":"GlGaiGsavleqlkrqqse.....ielelvavadrd.sllskd......rkallasealtldlddliahl.....dpdvvVEcasseavaelvlkaLkagkdvvtankgala.dealyeeLreaaeangakiyv","aliM":"117","iali":472,"alicsline":"--SHHHHHHHHHHHH---S.....SEEEEEEEEESS.EEE-TT......HHHHHT--CB---HHHHHHHH.....S-EEEEE-S--HHHHTTHHHHHHTTEEEE-S--CGGG.-HHHHHHHTSSSTTS--.EE-","aliSimCount":110,"alihmmdesc":"Homoserine dehydrogenase, NAD binding domain","alisqdesc":"","outcompeted":"0","alisqname":">Query","alisqfrom":"472","uniq":"3","aliN":134}],"nincluded":1,"evalue":"5.4e-34","desc":"Homoserine dehydrogenase, NAD binding domain","pvalue":-86.3900813723343,"nreported":1,"hindex":"11415"},{"flags":3,"nregions":2,"ndom":2,"name":"ACT_7","score":"68.4","bias":"1.3","taxid":"PF13840.6","acc":"PF13840.6","domains":[{"alisqacc":"","aliIdCount":15,"alirfline":"","is_included":"1","alihmmname":"ACT_7","bitscore":"31.0239086151123","display":0,"ievalue":"1.6e-07","alisqto":"374","aliSim":0.830508474576271,"jali":374,"bias":"0.04","ienv":"312","cevalue":"4.4e-11","significant":"1","alimline":"+++++sv+g+g+++ ++G++a+++++ ++a Is+  i+   +++++++ Vp++d  +A +a ","alihmmfrom":"5","clan":"CL0070","aliL":820,"alihindex":"299","is_reported":"1","alintseq":"","jenv":"376","alimmline":"","alihmmacc":"PF13840.6","oasc":"0.90","aliaseq":"NMAMFSVSGPGMKG-MVGMAARVFAAMSRARISVVLITqssSEYSISFCVPQSDCVRAERAM","alihmmto":"63","aliId":0.254237288135593,"alippline":"6799**********.******************87665556**************9998886","alimodel":"gwiklsvvgsglpfdvtGivaklaspLaeagIsifqiS...tyrtdyiLVpeedlekAveaL","aliM":"65","iali":314,"alicsline":"EEEEEEE-S-.---SS--HHHHHHHHHHTTT---EEEE...-SS-EEEEEEGGGHHHHHHHH","aliSimCount":49,"alihmmdesc":"ACT domain","alisqdesc":"","outcompeted":"1","alisqname":">Query","alisqfrom":"314","uniq":"4","aliN":62},{"alisqacc":"","aliIdCount":19,"alirfline":"","is_included":"1","alihmmname":"ACT_7","bitscore":"35.6038932800293","display":1,"ievalue":"5.8e-09","alisqto":"453","aliSim":0.813559322033898,"jali":453,"bias":"0.29","ienv":"391","cevalue":"1.6e-12","significant":"1","alimline":" ++ + +svvg+g+++ + Gi ak +++La+a+I+i +i+   ++r+++++V+ +d+ + v+","alihmmfrom":"3","clan":"CL0070","aliL":820,"alihindex":"299","is_reported":"1","alintseq":"","jenv":"457","alimmline":"","alihmmacc":"PF13840.6","oasc":"0.92","aliaseq":"TERLAIISVVGDGMRT-LRGISAKFFAALARANINIVAIAqgsSERSISVVVNNDDATTGVR","alihmmto":"61","aliId":0.322033898305085,"alippline":"57899***********.**********************9999*************987665","alimodel":"edgwiklsvvgsglpfdvtGivaklaspLaeagIsifqiS...tyrtdyiLVpeedlekAve","aliM":"65","iali":393,"alicsline":"EEEEEEEEE-S-.---SS--HHHHHHHHHHTTT---EEEE...-SS-EEEEEEGGGHHHHHH","aliSimCount":48,"alihmmdesc":"ACT domain","alisqdesc":"","outcompeted":"0","alisqname":">Query","alisqfrom":"393","uniq":"5","aliN":62}],"nincluded":2,"evalue":"3.4e-19","desc":"ACT domain","pvalue":-52.310165958671,"nreported":2,"hindex":"299"},{"flags":3,"nregions":2,"ndom":2,"name":"ACT","score":"62.9","bias":"0.3","taxid":"PF01842.25","acc":"PF01842.25","domains":[{"alisqacc":"","aliIdCount":18,"alirfline":"","is_included":"1","alihmmname":"ACT","bitscore":"31.9564876556396","display":1,"ievalue":"7.8e-08","alisqto":"376","aliSim":0.849056603773585,"jali":376,"bias":"0.00","ienv":"320","cevalue":"2.2e-11","significant":"1","alimline":"g+++++G++arvf+a++++ i+++ i+q+sse+   +i+f+v   d  ++e ++++","alihmmfrom":"6","clan":"CL0070","aliL":820,"alihindex":"283","is_reported":"1","alintseq":"","jenv":"381","alimmline":"","alihmmacc":"PF01842.25","oasc":"0.91","aliaseq":"GMKGMVGMAARVFAAMSRARISVVLITQSSSEY---SISFCVPQSDCVRAERAMQE","alihmmto":"61","aliId":0.339622641509434,"alippline":"7999*****************************...89999999988888888877","alimodel":"gvpDrPGlLarvfgaladrgiNidsieqrssedkvagivfvvivvdeedleevlea","aliM":"67","iali":324,"alicsline":"EEESSTTHHHHHHHHHHHTTSEEEEEEEEEESTTECEEEEEEEEEEHHHHHHHHHH","aliSimCount":45,"alihmmdesc":"ACT domain","alisqdesc":"","outcompeted":"0","alisqname":">Query","alisqfrom":"324","uniq":"6","aliN":56},{"alisqacc":"","aliIdCount":19,"alirfline":"","is_included":"1","alihmmname":"ACT","bitscore":"27.5466766357422","display":0,"ievalue":"1.9e-06","alisqto":"447","aliSim":0.790697674418605,"jali":447,"bias":"0.52","ienv":"400","cevalue":"5.2e-10","significant":"1","alimline":"g++   G+ a++f+ala+++iNi+ i q+sse+   +i++vv   d","alihmmfrom":"6","clan":"CL0070","aliL":820,"alihindex":"283","is_reported":"1","alintseq":"","jenv":"453","alimmline":"","alihmmacc":"PF01842.25","oasc":"0.81","aliaseq":"GMRTLRGISAKFFAALARANINIVAIAQGSSER---SISVVVNNDD","alihmmto":"51","aliId":0.441860465116279,"alippline":"677778*************************88...5665555544","alimodel":"gvpDrPGlLarvfgaladrgiNidsieqrssedkvagivfvvivvd","aliM":"67","iali":405,"alicsline":"EEESSTTHHHHHHHHHHHTTSEEEEEEEEEESTTECEEEEEEEEEE","aliSimCount":34,"alihmmdesc":"ACT domain","alisqdesc":"","outcompeted":"1","alisqname":">Query","alisqfrom":"405","uniq":"7","aliN":46}],"nincluded":2,"evalue":"1.7e-17","desc":"ACT domain","pvalue":-48.4304661781845,"nreported":2,"hindex":"283"}],"algo":"hmmscan","stats":{"page":1,"nhits":"5","elapsed":"0.06","Z":17929,"Z_setby":0,"n_past_msv":567,"unpacked":5,"user":0,"domZ_setby":0,"nseqs":1,"n_past_bias":535,"sys":0,"n_past_fwd":6,"total":1,"nmodels":17929,"nincluded":5,"n_past_vit":38,"nreported":5,"domZ":5},"uuid":"FD86A0A6-30EA-11EA-9D76-01E3DBC3747A","_internal":{"lowevalue":"1.7e-17","highevalue":"6.0e-49"}}}';
    // return JSON.parse(data);
    {"status": "SUCCESS", "result": {"uuid":"FD86A0A6-30EA-11EA-9D76-01E3DBC3747A", "stats": {"id": null, "algo": "hmmscan", "database": "pfam", "elapsed": 0.061071598902344704, "user": 0.0, "sys": 0.0, "Z": 24076.0, "domZ": 6.0, "Z_setby": 0, "domZ_setby": 0, "nmodels": 24076, "nseqs": 1, "n_past_msv": 790, "n_past_bias": 712, "n_past_vit": 54, "n_past_fwd": 7, "nhits": 6, "nreported": 6, "nincluded": 6}, "hits": [{"index": 0, "window_length": 3355674832, "sortkey": 168.970947265625, "score": 168.970947265625, "pre_score": 168.9940643310547, "sum_score": 166.81735229492188, "bias": 0.0231170654296875, "lnP": -122.79907278263192, "pre_lnP": -122.81542232713502, "sum_lnP": -121.27594274165597, "nexpected": 2.1420538425445557, "nregions": 3, "nclustered": 0, "noverlaps": 0, "nenvelopes": 3, "ndom": 3, "is_reported": true, "is_included": true, "is_new": false, "is_dropped": false, "nreported": 1, "nincluded": 1, "best_domain": 2, "seqidx": 12726, "subseq_start": 140169613523632, "name": "000012726", "acc": "PF00742.24", "evalue": 1.123633405681914e-49, "metadata": {"accession": "PF00742", "identifier": "Homoserine_dh", "description": "Homoserine dehydrogenase", "clan": "CL0139", "type": "Domain", "seq_ga": 22.9, "dom_ga": 22.9, "nested": null, "model_length": 173, "color": "#acefd7", "active_sites": null, "external_link": "https://www.ebi.ac.uk/interpro/entry/pfam/PF00742", "clan_link": "https://www.ebi.ac.uk/interpro/set/pfam/CL0139"}, "domains": [{"size": 92, "ienv": 293, "jenv": 359, "iali": 296, "jali": 355, "iorf": 1984274891213, "jorf": 1992864825807, "envsc": -6.377575397491455, "domcorrection": 0.3951950967311859, "dombias": 0.0057884217239916325, "oasc": 38.67788314819336, "bitscore": -2.053368330001831, "lnP": -1.8421257407263454, "ievalue": 3815.5688139705026, "cevalue": 0.9508810800723964, "is_reported": false, "is_included": false, "scores_per_pos_length": 0, "scores_per_pos": [], "alignment_display": {"size": 557, "n": 61, "hmmfrom": 79, "hmmto": 132, "m": 173, "sqfrom": 296, "sqto": 355, "l": 820, "string_presence_flags": {"_flagsenum": true, "RFLINE_PRESENT": false, "MMLINE_PRESENT": false, "CSLINE_PRESENT": true, "PPLINE_PRESENT": true, "ASEQ_PRESENT": true, "NTSEQ_PRESENT": false}, "rfline": null, "mmline": null, "csline": "TTT--GGGSEE--STTS-HHHHHHHHCTTEEEEEEEEE.......CEEEEEEEEEETTSGG", "model": "gleveledvevegisklteedieeakeegkviklvasa.......vearVkpelvpkshpl", "mline": "g++ + ++ +v+gis+l++  +  ++  g++   v+ a        +ar+++ l+ +s+  ", "aseq": "GASRDEDELPVKGISNLNNMAMFSVSGPGMKGM-VGMAarvfaamSRARISVVLITQSSSE", "ntseq": null, "ppline": "666677889999999998887555554443321.222223233225778887777777665", "hmmname": "000012726", "hmmacc": "PF00742.24", "hmmdesc": "{\"i\": \"Homoserine_dh\", \"a\": \"PF00742\", \"c\": \"CL0139\", \"d\": \"Homoserine dehydrogenase\", \"sg\": 22.9, \"dg\": 22.9, \"t\": \"Domain\", \"n\": null, \"l\": 173, \"as\": null, \"cl\": \"#acefd7\"}", "sqname": "tt", "sqacc": "", "sqdesc": "", "identity": [0.24074074074074073, 13], "similarity": [0.6666666666666666, 36]}, "display": true, "outcompeted": false, "significant": false, "uniq": 1, "segments": null, "predicted_active_sites": null}, {"size": 92, "ienv": 403, "jenv": 475, "iali": 441, "jali": 472, "iorf": 2087354106341, "jorf": 2095944040935, "envsc": -7.314953327178955, "domcorrection": 1.7553656101226807, "dombias": 0.02236620895564556, "oasc": 35.5186653137207, "bitscore": -3.3980250358581543, "lnP": -0.8911172867918253, "ievalue": 9875.907515749763, "cevalue": 2.4611831323516604, "is_reported": false, "is_included": false, "scores_per_pos_length": 0, "scores_per_pos": [], "alignment_display": {"size": 417, "n": 33, "hmmfrom": 124, "hmmto": 156, "m": 173, "sqfrom": 441, "sqto": 472, "l": 820, "string_presence_flags": {"_flagsenum": true, "RFLINE_PRESENT": false, "MMLINE_PRESENT": false, "CSLINE_PRESENT": true, "PPLINE_PRESENT": true, "ASEQ_PRESENT": true, "NTSEQ_PRESENT": false}, "rfline": null, "mmline": null, "csline": "EEEETTSGGGHSSST.EEEEEEESSSEEEEEEE", "model": "elvpkshplasvkgsenavvvetdrvgelvvyG", "mline": "  v++++    v+ ++  ++++td+v e++v G", "aseq": "VVVNNDDATTGVR-VTHQMLFNTDQVIEVFVIG", "ntseq": null, "ppline": "2333444444443.4445566777777776666", "hmmname": "000012726", "hmmacc": "PF00742.24", "hmmdesc": "{\"i\": \"Homoserine_dh\", \"a\": \"PF00742\", \"c\": \"CL0139\", \"d\": \"Homoserine dehydrogenase\", \"sg\": 22.9, \"dg\": 22.9, \"t\": \"Domain\", \"n\": null, \"l\": 173, \"as\": null, \"cl\": \"#acefd7\"}", "sqname": "tt", "sqacc": "", "sqdesc": "", "identity": [0.25, 8], "similarity": [0.6875, 22]}, "display": true, "outcompeted": false, "significant": false, "uniq": 1, "segments": null, "predicted_active_sites": null}, {"size": 92, "ienv": 614, "jenv": 811, "iali": 614, "jali": 811, "iorf": 459561500778, "jorf": 468151435372, "envsc": 110.1923828125, "domcorrection": -0.7323673963546753, "dombias": 0.0018772660987451673, "oasc": 188.0023193359375, "bitscore": 166.81735229492188, "lnP": -121.27594274165597, "ievalue": 5.153610761372933e-49, "cevalue": 1.2843356275227445e-52, "is_reported": true, "is_included": true, "scores_per_pos_length": 0, "scores_per_pos": [], "alignment_display": {"size": 1252, "n": 200, "hmmfrom": 1, "hmmto": 173, "m": 173, "sqfrom": 614, "sqto": 811, "l": 820, "string_presence_flags": {"_flagsenum": true, "RFLINE_PRESENT": false, "MMLINE_PRESENT": false, "CSLINE_PRESENT": true, "PPLINE_PRESENT": true, "ASEQ_PRESENT": true, "NTSEQ_PRESENT": false}, "rfline": null, "mmline": null, "csline": "..HHHH.HHTCTTSEEEEEEEE--HHHHHHHHHHHCHTT-HHHHHHHHHHTTSS-SSTHHHHTTHHHHHHHHHHHHHHCTTT--GGGSEE--ST...............TS-HHH......HHHHHCTTEEEEEEEEE...CEEEEEEEEEETTSGGGHSSST.EEEEEEESSSEE..EEEEES-SSHHHHHHHHHHHHH", "model": "Piiktl.reslagdeierieGilnGTtnyiltkmeeegasfsealkeAqelGyaEaDptaDveGlDaarKlvIlarlafgleveledvevegis...............klteed......ieeakeegkviklvasa...vearVkpelvpkshplasvkgsenavvvetdrvge..lvvyGkgaGaepTAsavlaDll", "mline": "P+i++l ++ +agde+ +++Gil+G+++yi+ k++e g+sfsea   A+e+Gy+E+Dp++D++G+D+arKl+Ilar+  g e+el+d+e+e +                +l++ d      +++a++egkv+++v+++     +rVk+++v+ ++pl++vk+ ena++++++++++  lv++G gaG+++TA++v+aDll", "aseq": "PVIENLqNLLNAGDELMKFSGILSGSLSYIFGKLDE-GMSFSEATTLAREMGYTEPDPRDDLSGMDVARKLLILARET-GRELELADIEIEPVLpaefnaegdvaafmaNLSQLDdlfaarVAKARDEGKVLRYVGNIdedGVCRVKIAEVDGNDPLFKVKNGENALAFYSHYYQPlpLVLRGYGAGNDVTAAGVFADLL", "ntseq": null, "ppline": "9*****99999***********************96.*****************************************.*************99999999999999999666666677777****************877657*********************************999*******************97", "hmmname": "000012726", "hmmacc": "PF00742.24", "hmmdesc": "{\"i\": \"Homoserine_dh\", \"a\": \"PF00742\", \"c\": \"CL0139\", \"d\": \"Homoserine dehydrogenase\", \"sg\": 22.9, \"dg\": 22.9, \"t\": \"Domain\", \"n\": null, \"l\": 173, \"as\": null, \"cl\": \"#acefd7\"}", "sqname": "tt", "sqacc": "", "sqdesc": "", "identity": [0.4508670520231214, 78], "similarity": [0.8959537572254336, 155]}, "display": true, "outcompeted": false, "significant": true, "uniq": 1, "segments": null, "predicted_active_sites": null}]}, {"index": 1, "window_length": 872461088, "sortkey": 157.03927612304688, "score": 157.03927612304688, "pre_score": 158.00296020507812, "sum_score": 155.81871032714844, "bias": 0.96368408203125, "lnP": -113.917820489946, "pre_lnP": -114.59584935744596, "sum_lnP": -113.05905478058838, "nexpected": 2.1453521251678467, "nregions": 2, "nclustered": 0, "noverlaps": 0, "nenvelopes": 2, "ndom": 2, "is_reported": true, "is_included": true, "is_new": false, "is_dropped": false, "nreported": 1, "nincluded": 1, "best_domain": 0, "seqidx": 188, "subseq_start": 1229773025243561997, "name": "000000188", "acc": "PF00696.33", "evalue": 8.085437146897762e-46, "metadata": {"accession": "PF00696", "identifier": "AA_kinase", "description": "Amino acid kinase family", "clan": null, "type": "Family", "seq_ga": 24.9, "dom_ga": 24.9, "nested": null, "model_length": 234, "color": "#b0650a", "active_sites": null, "external_link": "https://www.ebi.ac.uk/interpro/entry/pfam/PF00696", "clan_link": "https://www.ebi.ac.uk/interpro/set/pfam/None"}, "domains": [{"size": 92, "ienv": 1, "jenv": 284, "iali": 2, "jali": 284, "iorf": 5774213106299380256, "jorf": 3180163906227155014, "envsc": 102.30814361572266, "domcorrection": 2.6788930892944336, "dombias": 0.05536486208438873, "oasc": 250.1993865966797, "bitscore": 155.81871032714844, "lnP": -113.05905478058838, "ievalue": 1.9083617983203183e-45, "cevalue": 4.755844322114101e-49, "is_reported": true, "is_included": true, "scores_per_pos_length": 0, "scores_per_pos": [], "alignment_display": {"size": 1739, "n": 299, "hmmfrom": 3, "hmmto": 234, "m": 234, "sqfrom": 2, "sqto": 284, "l": 820, "string_presence_flags": {"_flagsenum": true, "RFLINE_PRESENT": false, "MMLINE_PRESENT": false, "CSLINE_PRESENT": true, "PPLINE_PRESENT": true, "ASEQ_PRESENT": true, "NTSEQ_PRESENT": false}, "rfline": null, "mmline": null, "csline": "EEEEE-TTCCCCTCCHHHHHHHHHHHHHHHTTEEEEEE--.HHHHHHHHHH.TCCCCCHHHC............E..HHHHHHHHH............................................HHHHHHHHHHHHHHHHTTHGEEEE-GGGTCEECCCE......HHHTTTCEEECCHHHHHHHTT-EEEEESEEEEETTTE...EEEE-HHHHHHHHHHHCTSSEEEEEESSSSCESSTTTTSCTTCECCEEEHHHCHHCSSS.TTTHHHHCHHHHHHHHHCTT-EEEEEE", "model": "iViKlGGssltdkeralkrlaeeiaklreegrklvvVhGg.gavtdgllal.ksglesrear............ltdeetlevvte............................................dalgslgerlsaallaagleavglsaaqllateagf......gsngkveevdtealeellekgvvpvitgfigideege...lgrgssDtlAallAealgAdkliiltdvdGvytadpkkvpdakllpeisydeaeeskselatgGmkvklpaaleaarrggipvvivn", "mline": " V+K+GG+s++++er + r+a+++++  +++ +++ V ++  ++t++l+a  ++ ++ + a             l                                                       +al   ge++s a++a +lea+g ++  ++++e  +      +s+ ++ e +++  +  + ++  ++++gf + +e+ge   lgr++sD++Aa lA++l+Ad+++i+tdvdGvyt+dp++vpda+ll+++sy+ea+e    l+++G+kv++p+++ ++ + +ip+ i+n", "aseq": "RVLKFGGTSVANAER-FLRVADILESN-ARQGQVATVLSApAKITNHLVAMiEKTISGQDALpnisdaerifaeL----------LtglaaaqpgfplaqlktfvdqefaqikhvlhgisllgqcpdsinAALICRGEKMSIAIMAGVLEARGHNVTVIDPVEKLLavghylESTVDIAESTRRIAASRIPADHMVLMAGFTAGNEKGElvvLGRNGSDYSAAVLAACLRADCCEIWTDVDGVYTCDPRQVPDARLLKSMSYQEAME----LSYFGAKVLHPRTITPIAQFQIPCLIKN", "ntseq": null, "ppline": "69*************.***********.6666********9**********855555555545545444444330..........144555567777777777888888899999*****************************************************9997777777777777777777889**************************************************************************....**************************98", "hmmname": "000000188", "hmmacc": "PF00696.33", "hmmdesc": "{\"i\": \"AA_kinase\", \"a\": \"PF00696\", \"c\": null, \"d\": \"Amino acid kinase family\", \"sg\": 24.9, \"dg\": 24.9, \"t\": \"Family\", \"n\": null, \"l\": 234, \"as\": null, \"cl\": \"#b0650a\"}", "sqname": "tt", "sqacc": "", "sqdesc": "", "identity": [0.33189655172413796, 77], "similarity": [0.7586206896551724, 176]}, "display": true, "outcompeted": false, "significant": true, "uniq": 1, "segments": null, "predicted_active_sites": null}, {"size": 92, "ienv": 305, "jenv": 350, "iali": 317, "jali": 349, "iorf": 2459014240732016160, "jorf": 3185227126839845484, "envsc": -6.537735939025879, "domcorrection": 2.8147268295288086, "dombias": 0.06318068504333496, "oasc": 35.94762420654297, "bitscore": -2.4778695106506348, "lnP": -1.6847436782289833, "ievalue": 4465.904705680973, "cevalue": 1.1129518289618638, "is_reported": false, "is_included": false, "scores_per_pos_length": 0, "scores_per_pos": [], "alignment_display": {"size": 409, "n": 33, "hmmfrom": 202, "hmmto": 233, "m": 234, "sqfrom": 317, "sqto": 349, "l": 820, "string_presence_flags": {"_flagsenum": true, "RFLINE_PRESENT": false, "MMLINE_PRESENT": false, "CSLINE_PRESENT": true, "PPLINE_PRESENT": true, "ASEQ_PRESENT": true, "NTSEQ_PRESENT": false}, "rfline": null, "mmline": null, "csline": "H.CSSS.TTTHHHHCHHHHHHHHHCTT-EEEEE", "model": "e.skselatgGmkvklpaaleaarrggipvviv", "mline": "  s s+ ++ Gm  +  + ++a+ r++i+vv++", "aseq": "MfSVSGPGMKGMVGMAARVFAAMSRARISVVLI", "ntseq": null, "ppline": "45567778899************9999999875", "hmmname": "000000188", "hmmacc": "PF00696.33", "hmmdesc": "{\"i\": \"AA_kinase\", \"a\": \"PF00696\", \"c\": null, \"d\": \"Amino acid kinase family\", \"sg\": 24.9, \"dg\": 24.9, \"t\": \"Family\", \"n\": null, \"l\": 234, \"as\": null, \"cl\": \"#b0650a\"}", "sqname": "tt", "sqacc": "", "sqdesc": "", "identity": [0.28125, 9], "similarity": [0.6875, 22]}, "display": true, "outcompeted": false, "significant": false, "uniq": 1, "segments": null, "predicted_active_sites": null}]}, {"index": 2, "window_length": 872757456, "sortkey": 145.1426239013672, "score": 145.1426239013672, "pre_score": 152.42294311523438, "sum_score": 135.68858337402344, "bias": 7.2803192138671875, "lnP": -107.5293117862517, "pre_lnP": -112.76327882049611, "sum_lnP": -100.73261304174105, "nexpected": 2.6760025024414062, "nregions": 2, "nclustered": 0, "noverlaps": 0, "nenvelopes": 2, "ndom": 2, "is_reported": true, "is_included": true, "is_new": false, "is_dropped": false, "nreported": 2, "nincluded": 2, "best_domain": 1, "seqidx": 379, "subseq_start": 1229773025243561997, "name": "000000379", "acc": "PF22468.2", "evalue": 4.810581569168719e-43, "metadata": {"accession": "PF22468", "identifier": "ACT_9", "description": "ACT domain", "clan": "CL0070", "type": "Domain", "seq_ga": 27.0, "dom_ga": 27.0, "nested": null, "model_length": 61, "color": "#e1b0d9", "active_sites": null, "external_link": "https://www.ebi.ac.uk/interpro/entry/pfam/PF22468", "clan_link": "https://www.ebi.ac.uk/interpro/set/pfam/CL0070"}, "domains": [{"size": 92, "ienv": 318, "jenv": 378, "iali": 319, "jali": 378, "iorf": 13428810261658988724, "jorf": 13405115038754645111, "envsc": 45.47022247314453, "domcorrection": 4.230222702026367, "dombias": 0.23802658915519714, "oasc": 60.06468963623047, "bitscore": 72.38053131103516, "lnP": -55.2191887307896, "ievalue": 2.513016694410828e-20, "cevalue": 6.2627098215920286e-24, "is_reported": true, "is_included": true, "scores_per_pos_length": 0, "scores_per_pos": [], "alignment_display": {"size": 528, "n": 60, "hmmfrom": 2, "hmmto": 61, "m": 61, "sqfrom": 319, "sqto": 378, "l": 820, "string_presence_flags": {"_flagsenum": true, "RFLINE_PRESENT": false, "MMLINE_PRESENT": false, "CSLINE_PRESENT": true, "PPLINE_PRESENT": true, "ASEQ_PRESENT": true, "NTSEQ_PRESENT": false}, "rfline": null, "mmline": null, "csline": "EEE-GGGSS-TTHHHHHHHHHHHTT--EEEEEESS-TTEEEEEEEGGGHHHHHHHHHHHT", "model": "svvGagmrgnpGvaariFeaLaeaginirmIsqgsSeinIsvvvdeedaekAvralheaF", "mline": "sv G gm+g++G+aar+F+a+++a i++ +I+q+sSe++Is++v+++d+ +A ra  e+F", "aseq": "SVSGPGMKGMVGMAARVFAAMSRARISVVLITQSSSEYSISFCVPQSDCVRAERAMQEEF", "ntseq": null, "ppline": "89********************************************************99", "hmmname": "000000379", "hmmacc": "PF22468.2", "hmmdesc": "{\"i\": \"ACT_9\", \"a\": \"PF22468\", \"c\": \"CL0070\", \"d\": \"ACT domain\", \"sg\": 27.0, \"dg\": 27.0, \"t\": \"Domain\", \"n\": null, \"l\": 61, \"as\": null, \"cl\": \"#e1b0d9\"}", "sqname": "tt", "sqacc": "", "sqdesc": "", "identity": [0.4666666666666667, 28], "similarity": [0.8666666666666667, 52]}, "display": true, "outcompeted": false, "significant": true, "uniq": 1, "segments": null, "predicted_active_sites": null}, {"size": 92, "ienv": 399, "jenv": 459, "iali": 399, "jali": 457, "iorf": 4141227486569693142, "jorf": 4215922856292001627, "envsc": 48.467342376708984, "domcorrection": 6.354828834533691, "dombias": 1.1779704093933105, "oasc": 59.481231689453125, "bitscore": 75.3484115600586, "lnP": -57.35285717700083, "ievalue": 2.9754656523325596e-21, "cevalue": 7.415182718888253e-25, "is_reported": true, "is_included": true, "scores_per_pos_length": 0, "scores_per_pos": [], "alignment_display": {"size": 523, "n": 59, "hmmfrom": 1, "hmmto": 59, "m": 61, "sqfrom": 399, "sqto": 457, "l": 820, "string_presence_flags": {"_flagsenum": true, "RFLINE_PRESENT": false, "MMLINE_PRESENT": false, "CSLINE_PRESENT": true, "PPLINE_PRESENT": true, "ASEQ_PRESENT": true, "NTSEQ_PRESENT": false}, "rfline": null, "mmline": null, "csline": "EEEE-GGGSS-TTHHHHHHHHHHHTT--EEEEEESS-TTEEEEEEEGGGHHHHHHHHHH", "model": "vsvvGagmrgnpGvaariFeaLaeaginirmIsqgsSeinIsvvvdeedaekAvralhe", "mline": "+svvG+gmr+  G++a++F+aLa+a+ini +I+qgsSe +Isvvv+++da + vr+ h+", "aseq": "ISVVGDGMRTLRGISAKFFAALARANINIVAIAQGSSERSISVVVNNDDATTGVRVTHQ", "ntseq": null, "ppline": "8******************************************************9997", "hmmname": "000000379", "hmmacc": "PF22468.2", "hmmdesc": "{\"i\": \"ACT_9\", \"a\": \"PF22468\", \"c\": \"CL0070\", \"d\": \"ACT domain\", \"sg\": 27.0, \"dg\": 27.0, \"t\": \"Domain\", \"n\": null, \"l\": 61, \"as\": null, \"cl\": \"#e1b0d9\"}", "sqname": "tt", "sqacc": "", "sqdesc": "", "identity": [0.559322033898305, 33], "similarity": [0.8813559322033898, 52]}, "display": true, "outcompeted": false, "significant": true, "uniq": 1, "segments": null, "predicted_active_sites": null}]}, {"index": 3, "window_length": 0, "sortkey": 108.35045623779297, "score": 108.35045623779297, "pre_score": 108.36409759521484, "sum_score": 106.90208435058594, "bias": 0.013641357421875, "lnP": -79.95739648850645, "pre_lnP": -79.96713900964892, "sum_lnP": -78.92298376132089, "nexpected": 1.839320421218872, "nregions": 1, "nclustered": 0, "noverlaps": 0, "nenvelopes": 1, "ndom": 1, "is_reported": true, "is_included": true, "is_new": false, "is_dropped": false, "nreported": 1, "nincluded": 1, "best_domain": 0, "seqidx": 15518, "subseq_start": 140169613523632, "name": "000015518", "acc": "PF03447.22", "evalue": 4.534487952172113e-31, "metadata": {"accession": "PF03447", "identifier": "NAD_binding_3", "description": "Homoserine dehydrogenase, NAD binding domain", "clan": "CL0063", "type": "Domain", "seq_ga": 24.0, "dom_ga": 24.0, "nested": null, "model_length": 116, "color": "#c03cfe", "active_sites": null, "external_link": "https://www.ebi.ac.uk/interpro/entry/pfam/PF03447", "clan_link": "https://www.ebi.ac.uk/interpro/set/pfam/CL0063"}, "domains": [{"size": 92, "ienv": 472, "jenv": 606, "iali": 472, "jali": 605, "iorf": 4886353460256629992, "jorf": 5060868972264435123, "envsc": 68.8999252319336, "domcorrection": 0.8873396515846252, "dombias": 0.009450111538171768, "oasc": 128.00291442871094, "bitscore": 106.90208435058594, "lnP": -78.92298376132089, "ievalue": 1.2757570934527741e-30, "cevalue": 3.179324871538729e-34, "is_reported": true, "is_included": true, "scores_per_pos_length": 0, "scores_per_pos": [], "alignment_display": {"size": 807, "n": 134, "hmmfrom": 1, "hmmto": 115, "m": 116, "sqfrom": 472, "sqto": 605, "l": 820, "string_presence_flags": {"_flagsenum": true, "RFLINE_PRESENT": false, "MMLINE_PRESENT": false, "CSLINE_PRESENT": false, "PPLINE_PRESENT": true, "ASEQ_PRESENT": true, "NTSEQ_PRESENT": false}, "rfline": null, "mmline": null, "csline": null, "model": "GlGaiGsevleqlkrqqse.....iplelvavadrd..llske......rkalladealtldlddlvall.....dvdvvVEvasseavaelvlkaLkagkdvvtaskgala.dealreeLleaaeangvkiyv", "mline": "G+G++G+++leqlkrqqs+     i+l++++va+++  l++ +      ++++la+++++ +l +l++l+      ++v+V+++ss+ava++++++L++g++vvt++k+a++ +++++++L+ aae++++k+++", "aseq": "GVGGVGGALLEQLKRQQSWlknkhIDLRVCGVANSKalLTNVHglnlenWQEELAQAKEPFNLGRLIRLVkeyhlLNPVIVDCTSSQAVADQYADFLREGFHVVTPNKKANTsSMDYYHQLRYAAEKSRRKFLY", "ntseq": null, "ppline": "9***********************************7544444999999*******************88***977*******************************************************998", "hmmname": "000015518", "hmmacc": "PF03447.22", "hmmdesc": "{\"i\": \"NAD_binding_3\", \"a\": \"PF03447\", \"c\": \"CL0063\", \"d\": \"Homoserine dehydrogenase, NAD binding domain\", \"sg\": 24.0, \"dg\": 24.0, \"t\": \"Domain\", \"n\": null, \"l\": 116, \"as\": null, \"cl\": \"#c03cfe\"}", "sqname": "tt", "sqacc": "", "sqdesc": "", "identity": [0.3565217391304348, 41], "similarity": [0.9565217391304348, 110]}, "display": true, "outcompeted": false, "significant": true, "uniq": 1, "segments": null, "predicted_active_sites": null}]}, {"index": 4, "window_length": 872417312, "sortkey": 71.7157211303711, "score": 71.7157211303711, "pre_score": 72.61424255371094, "sum_score": 62.103370666503906, "bias": 0.8985214233398438, "lnP": -54.67508677594344, "pre_lnP": -55.320970921188405, "sum_lnP": -47.765440993572724, "nexpected": 2.761098861694336, "nregions": 2, "nclustered": 0, "noverlaps": 0, "nenvelopes": 2, "ndom": 2, "is_reported": true, "is_included": true, "is_new": false, "is_dropped": false, "nreported": 2, "nincluded": 2, "best_domain": 1, "seqidx": 377, "subseq_start": 1228370061291620357, "name": "000000377", "acc": "PF13840.12", "evalue": 4.330079302904081e-20, "metadata": {"accession": "PF13840", "identifier": "ACT_7", "description": "ACT domain", "clan": "CL0070", "type": "Domain", "seq_ga": 27.0, "dom_ga": 27.0, "nested": null, "model_length": 65, "color": "#73f44b", "active_sites": null, "external_link": "https://www.ebi.ac.uk/interpro/entry/pfam/PF13840", "clan_link": "https://www.ebi.ac.uk/interpro/set/pfam/CL0070"}, "domains": [{"size": 92, "ienv": 312, "jenv": 376, "iali": 314, "jali": 375, "iorf": 4300792277741076480, "jorf": 4298584484162306048, "envsc": 17.45833969116211, "domcorrection": 1.4931139945983887, "dombias": 0.017238130792975426, "oasc": 57.890342712402344, "bitscore": 32.307533264160156, "lnP": -26.347299508489982, "ievalue": 8.691556247663929e-08, "cevalue": 2.1660299670204177e-11, "is_reported": true, "is_included": true, "scores_per_pos_length": 0, "scores_per_pos": [], "alignment_display": {"size": 544, "n": 63, "hmmfrom": 5, "hmmto": 64, "m": 65, "sqfrom": 314, "sqto": 375, "l": 820, "string_presence_flags": {"_flagsenum": true, "RFLINE_PRESENT": false, "MMLINE_PRESENT": false, "CSLINE_PRESENT": true, "PPLINE_PRESENT": true, "ASEQ_PRESENT": true, "NTSEQ_PRESENT": false}, "rfline": null, "mmline": null, "csline": "EEEEEEE-S-.---SS--HHHHHHHHHHTTT--...-EEEE-SS-EEEEEEGGGHHHHHHHHH", "model": "gwaklsvvgagldfdvpGvvakltsaLaeagIs...ifqissyttdyvLVpeedlekAveaLh", "mline": "++a++sv g+g+++ ++G++a++++a ++a Is   i+q+ss++++++ Vp++d  +A +a +", "aseq": "NMAMFSVSGPGMKG-MVGMAARVFAAMSRARISvvlITQSSSEYSISFCVPQSDCVRAERAMQ", "ntseq": null, "ppline": "6899**********.******************44445666*****************99876", "hmmname": "000000377", "hmmacc": "PF13840.12", "hmmdesc": "{\"i\": \"ACT_7\", \"a\": \"PF13840\", \"c\": \"CL0070\", \"d\": \"ACT domain\", \"sg\": 27.0, \"dg\": 27.0, \"t\": \"Domain\", \"n\": null, \"l\": 65, \"as\": null, \"cl\": \"#73f44b\"}", "sqname": "tt", "sqacc": "", "sqdesc": "", "identity": [0.3333333333333333, 20], "similarity": [0.85, 51]}, "display": false, "outcompeted": true, "significant": true, "uniq": 1, "segments": null, "predicted_active_sites": null}, {"size": 92, "ienv": 391, "jenv": 457, "iali": 393, "jali": 453, "iorf": 4338309710424834048, "jorf": 4342077728183287808, "envsc": 21.013795852661133, "domcorrection": 3.9055776596069336, "dombias": 0.17745482921600342, "oasc": 62.03141784667969, "bitscore": 37.216365814208984, "lnP": -29.875915558571364, "ievalue": 2.5505806803801456e-09, "cevalue": 6.356323343695329e-13, "is_reported": true, "is_included": true, "scores_per_pos_length": 0, "scores_per_pos": [], "alignment_display": {"size": 539, "n": 62, "hmmfrom": 3, "hmmto": 61, "m": 65, "sqfrom": 393, "sqto": 453, "l": 820, "string_presence_flags": {"_flagsenum": true, "RFLINE_PRESENT": false, "MMLINE_PRESENT": false, "CSLINE_PRESENT": true, "PPLINE_PRESENT": true, "ASEQ_PRESENT": true, "NTSEQ_PRESENT": false}, "rfline": null, "mmline": null, "csline": "EEEEEEEEE-S-.---SS--HHHHHHHHHHTTT---EEEE...-SS-EEEEEEGGGHHHHHH", "model": "edgwaklsvvgagldfdvpGvvakltsaLaeagIsifqis...syttdyvLVpeedlekAve", "mline": " ++ a +svvg+g+++ + G+ ak ++aLa+a+I+i +i+   s+++++v+V+ +d+ + v+", "aseq": "TERLAIISVVGDGMRT-LRGISAKFFAALARANINIVAIAqgsSERSISVVVNNDDATTGVR", "ntseq": null, "ppline": "6899************.**********************9999*************987666", "hmmname": "000000377", "hmmacc": "PF13840.12", "hmmdesc": "{\"i\": \"ACT_7\", \"a\": \"PF13840\", \"c\": \"CL0070\", \"d\": \"ACT domain\", \"sg\": 27.0, \"dg\": 27.0, \"t\": \"Domain\", \"n\": null, \"l\": 65, \"as\": null, \"cl\": \"#73f44b\"}", "sqname": "tt", "sqacc": "", "sqdesc": "", "identity": [0.3559322033898305, 21], "similarity": [0.8135593220338984, 48]}, "display": false, "outcompeted": true, "significant": true, "uniq": 1, "segments": null, "predicted_active_sites": null}]}, {"index": 5, "window_length": 0, "sortkey": 51.39937973022461, "score": 51.39937973022461, "pre_score": 52.83359909057617, "sum_score": 42.555294036865234, "bias": 1.4342193603515625, "lnP": -40.172362891898956, "pre_lnP": -41.20574665343156, "sum_lnP": -33.80002209538361, "nexpected": 2.8727569580078125, "nregions": 3, "nclustered": 0, "noverlaps": 0, "nenvelopes": 3, "ndom": 3, "is_reported": true, "is_included": true, "is_new": false, "is_dropped": false, "nreported": 0, "nincluded": 0, "best_domain": 1, "seqidx": 360, "subseq_start": 1228370061291620357, "name": "000000360", "acc": "PF01842.31", "evalue": 8.608922648564522e-14, "metadata": {"accession": "PF01842", "identifier": "ACT", "description": "ACT domain", "clan": "CL0070", "type": "Domain", "seq_ga": 27.0, "dom_ga": 27.0, "nested": null, "model_length": 66, "color": "#37c642", "active_sites": null, "external_link": "https://www.ebi.ac.uk/interpro/entry/pfam/PF01842", "clan_link": "https://www.ebi.ac.uk/interpro/set/pfam/CL0070"}, "domains": [{"size": 92, "ienv": 323, "jenv": 380, "iali": 325, "jali": 375, "iorf": 140154247577296, "jorf": 140154247577568, "envsc": 10.88269329071045, "domcorrection": -1.0949028730392456, "dombias": 0.0013061738573014736, "oasc": 50.64435958862305, "bitscore": 22.80698585510254, "lnP": -19.57097069855081, "ievalue": 7.621136755523022e-05, "cevalue": 1.8992698344051393e-08, "is_reported": false, "is_included": false, "scores_per_pos_length": 0, "scores_per_pos": [], "alignment_display": {"size": 492, "n": 53, "hmmfrom": 7, "hmmto": 59, "m": 66, "sqfrom": 325, "sqto": 375, "l": 820, "string_presence_flags": {"_flagsenum": true, "RFLINE_PRESENT": false, "MMLINE_PRESENT": false, "CSLINE_PRESENT": true, "PPLINE_PRESENT": true, "ASEQ_PRESENT": true, "NTSEQ_PRESENT": false}, "rfline": null, "mmline": null, "csline": "EESSTTHHHHHHHHHHHTTSEEEEEEEEEESTSEEEEEEEEEEEHHHHHHHHH", "model": "vpDrpGlLarvlgalaergiNitsieqgtsedkggivfvvivvdeedleevle", "mline": "++  +G++arv++a++++ i+++ i+q++se   +i+f+v   d  + e +++", "aseq": "MKGMVGMAARVFAAMSRARISVVLITQSSSEY--SISFCVPQSDCVRAERAMQ", "ntseq": null, "ppline": "77889*************************98..9998888877777777766", "hmmname": "000000360", "hmmacc": "PF01842.31", "hmmdesc": "{\"i\": \"ACT\", \"a\": \"PF01842\", \"c\": \"CL0070\", \"d\": \"ACT domain\", \"sg\": 27.0, \"dg\": 27.0, \"t\": \"Domain\", \"n\": null, \"l\": 66, \"as\": null, \"cl\": \"#37c642\"}", "sqname": "tt", "sqacc": "", "sqdesc": "", "identity": [0.29411764705882354, 15], "similarity": [0.7647058823529411, 39]}, "display": true, "outcompeted": false, "significant": false, "uniq": 1, "segments": null, "predicted_active_sites": null}, {"size": 92, "ienv": 400, "jenv": 454, "iali": 404, "jali": 446, "iorf": 140154247580832, "jorf": 140154247581104, "envsc": 13.629003524780273, "domcorrection": 4.764217853546143, "dombias": 0.3773440718650818, "oasc": 42.808349609375, "bitscore": 26.210758209228516, "lnP": -22.023456821625587, "ievalue": 6.560222427461101e-06, "cevalue": 1.6348784916417431e-09, "is_reported": false, "is_included": false, "scores_per_pos_length": 0, "scores_per_pos": [], "alignment_display": {"size": 452, "n": 45, "hmmfrom": 5, "hmmto": 49, "m": 66, "sqfrom": 404, "sqto": 446, "l": 820, "string_presence_flags": {"_flagsenum": true, "RFLINE_PRESENT": false, "MMLINE_PRESENT": false, "CSLINE_PRESENT": true, "PPLINE_PRESENT": true, "ASEQ_PRESENT": true, "NTSEQ_PRESENT": false}, "rfline": null, "mmline": null, "csline": "EEEESSTTHHHHHHHHHHHTTSEEEEEEEEEESTSEEEEEEEEEE", "model": "vlvpDrpGlLarvlgalaergiNitsieqgtsedkggivfvvivv", "mline": " +++   G+ a+ ++ala+++iNi++i qg+se+  +i++vv + ", "aseq": "DGMRTLRGISAKFFAALARANINIVAIAQGSSER--SISVVVNND", "ntseq": null, "ppline": "5677778*************************87..444444433", "hmmname": "000000360", "hmmacc": "PF01842.31", "hmmdesc": "{\"i\": \"ACT\", \"a\": \"PF01842\", \"c\": \"CL0070\", \"d\": \"ACT domain\", \"sg\": 27.0, \"dg\": 27.0, \"t\": \"Domain\", \"n\": null, \"l\": 66, \"as\": null, \"cl\": \"#37c642\"}", "sqname": "tt", "sqacc": "", "sqdesc": "", "identity": [0.37209302325581395, 16], "similarity": [0.7906976744186046, 34]}, "display": true, "outcompeted": false, "significant": false, "uniq": 1, "segments": null, "predicted_active_sites": null}, {"size": 92, "ienv": 804, "jenv": 815, "iali": 805, "jali": 815, "iorf": 140154247584368, "jorf": 140154247584640, "envsc": -7.182738304138184, "domcorrection": 2.4078750610351562, "dombias": 0.04249691963195801, "oasc": 10.462129592895508, "bitscore": -3.5577006340026855, "lnP": -0.5746862744854297, "ievalue": 13551.933341811382, "cevalue": 3.3772885882566994, "is_reported": false, "is_included": false, "scores_per_pos_length": 0, "scores_per_pos": [], "alignment_display": {"size": 282, "n": 11, "hmmfrom": 12, "hmmto": 22, "m": 66, "sqfrom": 805, "sqto": 815, "l": 820, "string_presence_flags": {"_flagsenum": true, "RFLINE_PRESENT": false, "MMLINE_PRESENT": false, "CSLINE_PRESENT": true, "PPLINE_PRESENT": true, "ASEQ_PRESENT": true, "NTSEQ_PRESENT": false}, "rfline": null, "mmline": null, "csline": "THHHHHHHHHH", "model": "GlLarvlgala", "mline": "G++a++l++l+", "aseq": "GVFADLLRTLS", "ntseq": null, "ppline": "99*****9996", "hmmname": "000000360", "hmmacc": "PF01842.31", "hmmdesc": "{\"i\": \"ACT\", \"a\": \"PF01842\", \"c\": \"CL0070\", \"d\": \"ACT domain\", \"sg\": 27.0, \"dg\": 27.0, \"t\": \"Domain\", \"n\": null, \"l\": 66, \"as\": null, \"cl\": \"#37c642\"}", "sqname": "tt", "sqacc": "", "sqdesc": "", "identity": [0.36363636363636365, 4], "similarity": [1.0, 11]}, "display": true, "outcompeted": false, "significant": false, "uniq": 1, "segments": null, "predicted_active_sites": null}]}]}, "page_count": 1}
    return data;
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
