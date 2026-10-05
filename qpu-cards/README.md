# QPU Cards on GitHub Pages

This directory is a zero-build static site generated from the public observations in `quantum_cloud_benchmarking_metrics.xlsx`.

To publish it, push the repository to GitHub, open **Settings → Pages**, select **Deploy from a branch**, choose the publishing branch and set the folder to **/docs**. GitHub Pages will publish `docs/index.html`.

The cards use `data/qpu-cards.json`; edit that file or regenerate it from the workbook when observations change. Keep a metric's `qpu`, `asOf`, `sourceId`, `comparator`, and `note` intact so the displayed value remains traceable.
