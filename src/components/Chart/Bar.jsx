import React, { Component } from "react";
import { ColumnChart } from "react-chartkick";
import "chart.js";
import { solubilityWeightedIndex, logistic } from "../Sodope/Utils/Utils";

class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSelectedSequence: this.props.currentSelectedSequence,
      customTag: this.props.customTag
    };
    this.barPlotValues = this.barPlotValues.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    let currentSelectedSequence = this.props.currentSelectedSequence;
    if (this.state.currentSelectedSequence !== currentSelectedSequence) {
      this.setState({
        currentSelectedSequence: currentSelectedSequence
      });
    }

    let customTag = this.props.customTag;
    if (this.state.customTag !== customTag) {
      this.setState({
        customTag: customTag
      });
    }
  }

  translateSequence(seq) {
    let sequence = seq.replace(/U/gi, "T").toUpperCase();
    if (sequence) {
      let codonToAminoAcid = {
        TTT: "F",
        TCT: "S",
        TAT: "Y",
        TGT: "C",
        TTC: "F",
        TCC: "S",
        TAC: "Y",
        TGC: "C",
        TTA: "L",
        TCA: "S",
        TTG: "L",
        TCG: "S",
        TGG: "W",
        CTT: "L",
        CCT: "P",
        CAT: "H",
        CGT: "R",
        CTC: "L",
        CCC: "P",
        CAC: "H",
        CGC: "R",
        CTA: "L",
        CCA: "P",
        CAA: "Q",
        CGA: "R",
        CTG: "L",
        CCG: "P",
        CAG: "Q",
        CGG: "R",
        ATT: "I",
        ACT: "T",
        AAT: "N",
        AGT: "S",
        ATC: "I",
        ACC: "T",
        AAC: "N",
        AGC: "S",
        ATA: "I",
        ACA: "T",
        AAA: "K",
        AGA: "R",
        ATG: "M",
        ACG: "T",
        AAG: "K",
        AGG: "R",
        GTT: "V",
        GCT: "A",
        GAT: "D",
        GGT: "G",
        GTC: "V",
        GCC: "A",
        GAC: "D",
        GGC: "G",
        GTA: "V",
        GCA: "A",
        GAA: "E",
        GGA: "G",
        GTG: "V",
        GCG: "A",
        GAG: "E",
        GGG: "G"
      };

      let codons = sequence.match(/.{1,3}/g);
      codons.pop(); //remove stop codon
      let proteinSeq = codons.map((v, k) => codonToAminoAcid[v]).join("");
      return proteinSeq;
    } else {
      return "";
    }
  }

  barPlotValues() {
    let currentSelectedSequence = this.state.currentSelectedSequence;
    let tags = {
      "No tag": "",
      Trx:
        "ATGAGCGATAAAATTATTCACCTGACTGACGACAGTTTTGACACGGATGTACTCAAAGCGGACGGGGCGATCCTCGTCGA" +
        "TTTCTGGGCAGAGTGGTGCGGTCCGTGCAAAATGATCGCCCCGATTCTGGATGAAATCGCTGACGAATATCAGGGCAAAC" +
        "TGACCGTTGCAAAACTGAACATCGATCAAAACCCTGGCACTGCGCCGAAATATGGCATCCGTGGTATCCCGACTCTGCTG" +
        "CTGTTCAAAAACGGTGAAGTGGCGGCAACCAAAGTGGGTGCACTGTCTAAAGGTCAGTTGAAAGAGTTCCTCGACGCTAA" +
        "CCTGGCC",
      MBP:
        "ATGAAAATCGAAGAAGGTAAACTGGTAATCTGGATTAACGGCGATAAAGGCTATAACGGTCTCGCTGAAGTCGGTAAGAA" +
        "ATTCGAGAAAGATACCGGAATTAAAGTCACCGTTGAGCATCCGGATAAACTGGAAGAGAAATTCCCACAGGTTGCGGCAA" +
        "CTGGCGATGGCCCTGACATTATCTTCTGGGCACACGACCGCTTTGGTGGCTACGCTCAATCTGGCCTGTTGGCTGAAATC" +
        "ACCCCGGACAAAGCGTTCCAGGACAAGCTGTATCCGTTTACCTGGGATGCCGTACGTTACAACGGCAAGCTGATTGCTTA" +
        "CCCGATCGCTGTTGAAGCGTTATCGCTGATTTATAACAAAGATCTGCTGCCGAACCCGCCAAAAACCTGGGAAGAGATCC" +
        "CGGCGCTGGATAAAGAACTGAAAGCGAAAGGTAAGAGCGCGCTGATGTTCAACCTGCAAGAACCGTACTTCACCTGGCCG" +
        "CTGATTGCTGCTGACGGGGGTTATGCGTTCAAGTATGAAAACGGCAAGTACGACATTAAAGACGTGGGCGTGGATAACGC" +
        "TGGCGCGAAAGCGGGTCTGACCTTCCTGGTTGACCTGATTAAAAACAAACACATGAATGCAGACACCGATTACTCCATCG" +
        "CAGAAGCTGCCTTTAATAAAGGCGAAACAGCGATGACCATCAACGGCCCGTGGGCATGGTCCAACATCGACACCAGCAAA" +
        "GTGAATTATGGTGTAACGGTACTGCCGACCTTCAAGGGTCAACCATCCAAACCGTTCGTTGGCGTGCTGAGCGCAGGTAT" +
        "TAACGCCGCCAGTCCGAACAAAGAGCTGGCAAAAGAGTTCCTCGAAAACTATCTGCTGACTGATGAAGGTCTGGAAGCGG" +
        "TTAATAAAGACAAACCGCTGGGTGCCGTAGCGCTGAAGTCTTACGAGGAAGAGTTGGCGAAAGATCCACGTATTGCCGCC" +
        "ACTATGGAAAACGCCCAGAAAGGTGAAATCATGCCGAACATCCCGCAGATGTCCGCTTTCTGGTATGCCGTGCGTACTGC" +
        "GGTGATCAACGCCGCCAGCGGTCGTCAGACTGTCGATGAAGCCCTGAAAGACGCGCAGACT",
      SUMO:
        "ATGTCGGACTCAGAAGTCAATCAAGAAGCTAAGCCAGAGGTCAAGCCAGAAGTCAAGCCTGAGACTCACATCAATTTAAA" +
        "GGTGTCCGATGGATCTTCAGAGATCTTCTTCAAGATCAAAAAGACCACTCCTTTAAGAAGGCTGATGGAAGCGTTCGCTA" +
        "AAAGACAGGGTAAGGAAATGGACTCCTTAAGATTCTTGTACGACGGTATTAGAATTCAAGCTGATCAGACCCCTGAAGAT" +
        "TTGGACATGGAGGATAACGATATTATTGAGGCTCACAGAGAACAGATTGGTGGT",
      GST:
        "ATGTCCCCTATACTAGGTTATTGGAAAATTAAGGGCCTTGTGCAACCCACTCGACTTCTTTTGGAATATCTTGAAGAAAA" +
        "ATATGAAGAGCATTTGTATGAGCGCGATGAAGGTGATAAATGGCGAAACAAAAAGTTTGAATTGGGTTTGGAGTTTCCCA" +
        "ATCTTCCTTATTATATTGATGGTGATGTTAAATTAACACAGTCTATGGCCATCATACGTTATATAGCTGACAAGCACAAC" +
        "ATGTTGGGTGGTTGTCCAAAAGAGCGTGCAGAGATTTCAATGCTTGAAGGAGCGGTTTTGGATATTAGATACGGTGTTTC" +
        "GAGAATTGCATATAGTAAAGACTTTGAAACTCTCAAAGTTGATTTTCTTAGCAAGCTACCTGAAATGCTGAAAATGTTCG" +
        "AAGATCGTTTATGTCATAAAACATATTTAAATGGTGATCATGTAACCCATCCTGACTTCATGTTGTATGACGCTCTTGAT" +
        "GTTGTTTTATACATGGACCCAATGTGCCTGGATGCGTTCCCAAAATTAGTTTGTTTTAAAAAACGTATTGAAGCTATCCC" +
        "ACAAATTGATAAGTACTTGAAATCCAGCAAGTATATAGCATGGCCTTTGCAGGGCTGGCAAGCCACGTTTGGTGGTGGCG" +
        "ACCATCCTCCAAAA"
    };
    if (this.state.customTag) {
      tags["Custom tag"] = this.state.customTag;
    }
    let plotData = {};
    Object.keys(tags).map(
      e =>
        (plotData[e] = logistic(
          solubilityWeightedIndex(
            (!tags[e]
              ? ""
              : e === "Custom tag"
              ? tags[e]
              : this.translateSequence(tags[e])) + currentSelectedSequence
          )
        ))
    );
    return plotData;
  }

  render() {
    return (
      <ColumnChart
        data={this.barPlotValues()}
        xtitle="Tags"
        ytitle="Probability of solubility"
        library={{
          responsive: true
        }}
      />
    );
  }
}

export default Bar;
