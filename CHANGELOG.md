# 2.0.1 (19-11-2020)
### Bug Fixes
* **TIsigner:** Backend fixes for warnings from pandas: ```SettingWithCopyWarning``` and ```pandas.util.testing```.

### Features
* **Razor:** Model updates.

# 2.0.0 (17-10-2020)

### Bug Fixes
* **TIsigner:** Fixed overflow of opening energy chart when screen is resized.
* **TIsigner:** Fixed input sequence validation where 'Early stop codon found' was shown erroneously for other errors.
* **SoDoPE:** Fixed the missing domain display after using TIsigner from SoDoPE.
* **TISIGNER:** Fixed ```Warning: Can't perform a React state update on an unmounted component```

### Features
* **GitHub:** Added changelog and releases (MAJOR.MINOR.PATCH).
* **TIsigner:** Better display of sequence in results page. Long sequences are automatically warped, making results page clutter free.
* **SoDoPE:** Fixed the scale of Hydrophobicity and Flexibility in charts, so both are visible at the same time.
* **Razor:** Added a new tool ```Razor``` for predicting signal peptides. This also predicts fungi signal peptide as well as signal peptides which harbours toxin.
* **FAQ:** FAQ for all tools are updated with a better explanation of tools and interpration of their results.
* **TISIGNER:** Improved error catching for all tools.


### Performance Improvements
* **TIsigner:** Backend optimisation for faster sequence optimisation.
* **SoDoPE:** Domain querying no longer blocks solubility analysis.
* **TISIGNER:** Lazy loading for a faster page load time.
