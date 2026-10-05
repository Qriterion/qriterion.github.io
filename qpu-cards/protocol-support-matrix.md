# QCVV protocol support matrix

This document records the actual scope of version 0.1.0.  “Executed” means the
included tutorial has run the protocol on the local noisy fake backend and
writes OpenQASM 3, a manifest, raw counts, and an analysis report.

| Plan ID | Protocol | Status | What is included | Important boundary |
|---|---|---|---|---|
| P01 | Readout response matrix | Executed | Computational-basis preparation, response matrix, mean diagonal fidelity | No mitigation/correction application yet |
| P02 | Truth-table tomography | Executed | Basis-input sampling and truth-table fidelity | Classical-basis behavior only |
| P03 | Robust phase estimation | Executed | Increasing-power RZ experiment and phase estimate | No rigorous confidence interval or alias-resolution proof |
| P04 | Local-Pauli QST | Executed | Bell-state XX/YY/ZZ measurements, linear-inversion reconstruction and PSD projection | Bell target and two qubits only; no MLE |
| P05 | Standard RB | Executed | Single-qubit random native-gate words, explicit inverse, decay fit | Educational pseudo-Clifford construction, not a full Clifford sampler |
| P06 | Interleaved RB | Executed | Reference/interleaved decay and target-gate infidelity estimate | Same single-qubit restricted ensemble as P05 |
| P07 | Simultaneous RB | Not implemented | — | Needs independent and concurrent layer scheduling plus a crosstalk model |
| P08 | Cycle benchmarking | Executed, minimal | One-qubit identity cycle `X; X`, Pauli-eigenstate decay | Not full randomized compiling, multi-qubit CB, CER, or ACES |
| P09 | Direct fidelity estimation | Executed | Bell stabilizer samples and state-fidelity estimate | Stabilizer/Bell target only; sample SE rather than bootstrap CI |
| P10 | XEB | Executed | Small random circuits, exact ideal probabilities, linear XEB | Small exact-simulation only; not a hardware-scale cross-entropy workflow |
| P11 | Quantum Volume | Executed, educational | Heavy-output probability on small portable random circuits | Circuit ensemble is not the original Haar-SU(4) QV construction; no confidence-bound pass criterion |
| P12 | MCFE | Executed, proxy | M1/M2/M3 mirror ensembles and survival-ratio proxy | Not the paper's full Hamming-weight polarization estimator or process-fidelity estimator |

## Shared infrastructure

- A backend-neutral internal circuit representation emits standard OpenQASM 3
  and parses it before execution.
- `GoogleSycamoreFakeBackend` lowers that representation to Cirq and simulates
  a fixed local noise profile. It is neither a cloud connection nor a model of
  a particular Google processor.
- All tutorial experiments use fixed seeds and persist portable experiment
  artifacts below `outputs/phase1_tutorial/`.
- The backend exposes `submit`, `status`, `fetch`, and `collect`. A job may
  contain one circuit or a homogeneous circuit batch; the tutorial keeps the
  task boundaries visible before any analysis runs.

## Next implementation priority

Complete P07, then replace the restricted P05/P06 and P08/P12 teaching
implementations with their full protocol definitions before using reported
numbers for hardware comparison.
