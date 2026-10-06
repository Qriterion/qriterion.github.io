/* Public, rendered documentation for reviewed QCVV suite methods.
 * The internal Markdown and reference archives are deliberately not shipped. */
window.methodDetails = window.methodDetails || {};

Object.assign(window.methodDetails, {
  rabi: {
    title: "Rabi oscillations",
    level: "Qubit level",
    kicker: "Driven-rotation calibration",
    tags: ["Pulse calibration", "Likelihood fit", "Leakage-aware"],
    summary: "Calibrate coherent X/Y rotations from driven population oscillations, while separating amplitude error, detuning, decoherence, leakage and SPAM.",
    purpose: String.raw`
      <p>A Rabi experiment drives a qubit near resonance and measures the excited-state population while sweeping pulse duration or amplitude. Its principal outputs are the effective Rabi frequency ​​\(\Omega_R\), the controls that implement \(\pi/2\) and \(\pi\) rotations, and diagnostics for detuning, damping and population outside the computational subspace.</p>
      <div class="doc-warning"><strong>Scope:</strong> a clean, high-contrast oscillation calibrates pulse area. It does not by itself establish gate fidelity; validate the calibrated gate with Ramsey, RPE, RB or GST.</div>`,
    theory: String.raw`
      <h3>Driven two-level model</h3>
      <p>For qubit frequency \(\omega_q\), drive frequency \(\omega_d\), phase \(\phi\), and laboratory-frame drive strength \(\Omega_d\),</p>
      <div class="equation">\[H(t)=\frac{\hbar\omega_q}{2}Z+\hbar\Omega_d\cos(\omega_dt+\phi)X.\]</div>
      <p>Transforming with \(U_r=e^{i\omega_dtZ/2}\) and dropping terms rotating near \(2\omega_d\) gives the rotating-wave Hamiltonian</p>
      <div class="equation">\[H_{\rm RWA}=\frac{\hbar}{2}\left[\Delta Z+\Omega(\cos\phi X+\sin\phi Y)\right],\quad \Delta=\omega_q-\omega_d.\]</div>
      <p>The Bloch vector rotates about \(\hat n=(\Omega\cos\phi,\Omega\sin\phi,\Delta)/\Omega_{\rm eff}\), where \(\Omega_{\rm eff}=\sqrt{\Omega^2+\Delta^2}\). Starting in \(|0\rangle\),</p>
      <div class="equation">\[P_1(t)=\frac{\Omega^2}{\Omega^2+\Delta^2}\sin^2\!\left(\frac{\Omega_{\rm eff}t}{2}\right).\]</div>
      <p>Detuning therefore changes both frequency and contrast. On resonance, \(P_1=[1-\cos(\Omega t)]/2\), so \(t_\pi=\pi/\Omega\) and \(t_{\pi/2}=\pi/(2\Omega)\).</p>`,
    deepDive: String.raw`
      <section class="article-section doc-section"><h2>Damping, likelihood and multilevel corrections</h2>
        <p>A practical model is \(p(x)=B+A f(x;T_R)\cos(2\pi f_Rx+\varphi)\), with exponential, Gaussian or stretched-exponential envelope selected by residual diagnostics. Given \(k_i\) excited outcomes among \(N_i\) shots, fit the exact binomial likelihood</p>
        <div class="equation">\[\log\mathcal L=\sum_i\left[k_i\log p_i+(N_i-k_i)\log(1-p_i)\right].\]</div>
        <p>For weakly anharmonic qubits, a three-level model is required. If \(\alpha=\omega_{12}-\omega_{01}\), short strong pulses can populate \(|2\rangle\) and induce an AC-Stark phase. DRAG adds a quadrature approximately</p>
        <div class="equation">\[\Omega_y(t)\simeq-\dot\Omega_x(t)/\alpha,\]</div>
        <p>together with a frequency correction, to cancel leading leakage and phase error.</p>
      </section>
      <section class="article-section doc-section"><h2>Key metrics</h2><div class="metric-grid">
        <div><strong>\(\Omega_R/2\pi\)</strong><span>driven rotation rate</span></div><div><strong>\(t_\pi,t_{\pi/2}\)</strong><span>calibrated pulse durations or amplitudes</span></div>
        <div><strong>Contrast</strong><span>SPAM-, detuning- and leakage-sensitive amplitude</span></div><div><strong>\(T_R\)</strong><span>drive-time envelope scale, not a material constant</span></div>
        <div><strong>Leakage \(P_2\)</strong><span>population outside the computational subspace</span></div><div><strong>Deviance</strong><span>adequacy of the one-frequency envelope model</span></div>
      </div></section>
      <section class="article-section doc-section"><h2>Failure modes and assumptions</h2><ul>
        <li><strong>Rotating-wave approximation:</strong> requires \(\Omega,|\Delta|\ll\omega_d\). Strong driving introduces counter-rotating terms and a Bloch–Siegert shift.</li>
        <li><strong>Two-level approximation:</strong> fails when pulse bandwidth approaches \(|\alpha|\); leakage and AC-Stark shifts make a single sinusoid incomplete.</li>
        <li><strong>Stationarity:</strong> drift in frequency or amplitude during an ordered sweep appears as damping or beating. Randomize points and retain timestamps.</li>
        <li><strong>Envelope choice:</strong> quasistatic, \(1/f\), or telegraph noise is generally non-exponential. Compare models and inspect structured residuals.</li>
        <li><strong>Isolation:</strong> coherent TLS or neighboring qubits produce splitting, beats and revivals, so a unique Rabi frequency can lose physical meaning.</li>
        <li><strong>Control-chain linearity:</strong> saturation, mixer distortion and ringing invalidate \(\Omega\propto\) programmed amplitude.</li>
        <li><strong>Sampling:</strong> coarse spacing aliases the oscillation; too short a window confounds phase, offset and decay.</li>
      </ul></section>
      <section class="article-section doc-section"><h2>Primary references</h2><ol>
        <li>Ashhab, Johansson &amp; Nori, <a href="https://arxiv.org/abs/cond-mat/0602577">Rabi oscillations in a qubit coupled to a quantum two-level system</a>.</li>
        <li>Motzoi et al., <a href="https://arxiv.org/abs/0901.0534">Simple pulses for elimination of leakage in weakly nonlinear qubits</a>.</li>
        <li>Werninghaus et al., <a href="https://arxiv.org/abs/2202.06981">Minimum quantum run-time characterization and calibration via restless measurements</a>.</li>
      </ol></section>`,
    steps: [
      "Calibrate the readout classifier and record |0> and |1> baselines with raw counts.",
      "Use weak-drive spectroscopy to locate the resonance, then choose a conservative pulse amplitude and envelope.",
      "Sweep duration at fixed amplitude, or amplitude at fixed duration; sample enough points to resolve multiple periods and the envelope.",
      "Randomize acquisition order and fit the binomial likelihood, preferably from several frequency/phase initializations.",
      "Extract the pi and pi/2 controls; repeat at nearby drive frequencies to separate detuning from amplitude error.",
      "Measure |2> when possible, tune DRAG, and amplify residual angle error with repeated rotations.",
      "Confirm the update with a short rescan and an independent Ramsey, RPE, RB or GST experiment."
    ],
    codeTitle: "Python pseudocode",
    codeSource: String.raw`x = design_scan_points(min_value, max_value, 81)
for i in rng.permutation(len(x)):
    circuit = prepare_0() + drive_pulse(duration=x[i]) + measure()
    k[i] = backend.run(circuit, shots=N[i]).count("1")

def probability(x, theta):
    A, B, frequency, phase, decay = unpack_constrained(theta)
    envelope = choose_envelope(x, decay)
    return clip(B + A * envelope * cos(2*pi*frequency*x + phase))

def nll(theta):
    p = probability(x, theta)
    return -sum(k*log(p) + (N-k)*log(1-p))

fit = multistart_minimize(nll, guesses_from_fft(x, k/N))
calibration = pulse_area_from_fit(fit, target_angle=pi)
validate_with_repeated_rotations(calibration)
report(fit, leakage_scan(), ramsey_check(), raw_counts=k)`,
    description: "Illustrative analysis flow; the backend-specific pulse and readout interfaces remain part of the reported protocol.",
    reports: ["Drive frequency, pulse envelope, phase, sweep variable and grid.", "Raw counts, shots, acquisition order and readout treatment.", "Likelihood, envelope model, fit parameters, uncertainty and residual diagnostics.", "Selected pi/pi/2 controls, leakage checks, drift observations and independent validation."]
  },

  ramsey: {
    title: "Ramsey spectroscopy and T₂*",
    level: "Qubit level",
    kicker: "Frequency and dephasing calibration",
    tags: ["Free precession", "Detuning", "Noise spectroscopy"],
    summary: "Estimate residual frequency detuning and inhomogeneous dephasing from phase accumulated during a controlled idle.",
    purpose: String.raw`<p>A Ramsey sequence maps phase accumulated during free evolution into a measured population. It refines the qubit–drive detuning and estimates \(T_2^*\), the coherence scale that includes slow frequency fluctuations.</p><div class="doc-warning"><strong>Interpretation:</strong> \(T_2^*\) is protocol- and timescale-dependent. It is not the irreversible coherence time measured by Hahn echo.</div>`,
    theory: String.raw`
      <p>An initial \(\pi/2\) pulse creates transverse coherence. During delay \(t\), detuning \(\Delta\) produces phase \(\Delta t\); the second \(\pi/2\) pulse projects that phase into population:</p>
      <div class="equation">\[P_1(t)=B+A\,W(t)\cos(\Delta t+\phi).\]</div>
      <p>The coherence function is \(W(t)=\langle e^{-i\int_0^t\delta\omega(t')dt'}\rangle\). For stationary Gaussian noise with one-sided spectral density \(S_\omega(\omega)\),</p>
      <div class="equation">\[W(t)=e^{-\chi(t)},\qquad \chi(t)=\frac{1}{\pi}\int_0^\infty d\omega\,S_\omega(\omega)\frac{\sin^2(\omega t/2)}{\omega^2}.\]</div>
      <p>Quasistatic Gaussian detuning gives a Gaussian envelope \(e^{-\sigma_\omega^2t^2/2}\); broadband Markovian dephasing gives an exponential. This is why the fitted envelope is a noise-model choice, not mere presentation.</p>`,
    deepDive: String.raw`
      <section class="article-section doc-section"><h2>Relaxation and noise interpretation</h2><p>With energy relaxation and pure dephasing, \(1/T_2=1/(2T_1)+1/T_\phi\). Ramsey additionally includes slow run-to-run detuning, so typically \(T_2^*\le T_2\le2T_1\). Telegraph noise can instead produce beats or revivals; a single stretched exponential can conceal this structure.</p></section>
      <section class="article-section doc-section"><h2>Key metrics</h2><div class="metric-grid">
        <div><strong>Fringe frequency</strong><span>residual plus intentional detuning</span></div><div><strong>\(T_2^*\)</strong><span>inhomogeneous dephasing scale</span></div>
        <div><strong>Stretch exponent</strong><span>diagnostic for envelope shape</span></div><div><strong>Contrast/offset</strong><span>SPAM and pulse quality</span></div>
        <div><strong>Frequency drift</strong><span>block-to-block resonance motion</span></div><div><strong>Residual deviance</strong><span>evidence against the chosen noise model</span></div>
      </div></section>
      <section class="article-section doc-section"><h2>Failure modes and assumptions</h2><ul>
        <li><strong>Single detuning:</strong> fails under drift or multiple spectral components; ordered sweeps can turn drift into a false decay.</li>
        <li><strong>Gaussian noise:</strong> the filter-function exponential assumes Gaussian statistics. Strong random telegraph fluctuators need an explicit non-Gaussian model.</li>
        <li><strong>Stationary noise:</strong> aging, recalibration and temperature motion violate time-translation invariance and make one \(T_2^*\) nonportable.</li>
        <li><strong>Ideal analysis pulses:</strong> angle and phase errors change contrast and apparent phase; phase-cycled data help separate these from detuning.</li>
        <li><strong>Aliasing:</strong> delay spacing and total span must resolve both the fringe and envelope. Intentional detuning should be recorded and removed.</li>
        <li><strong>Readout neutrality:</strong> SPAM usually maps into scale and offset only when it is stable and uncorrelated with delay.</li>
      </ul></section>
      <section class="article-section doc-section"><h2>Primary references</h2><ol>
        <li>Bylander et al., <a href="https://arxiv.org/abs/1308.3096">Noise spectroscopy through dynamical decoupling with a superconducting flux qubit</a>.</li>
        <li>Yan et al., <a href="https://arxiv.org/abs/1511.07362">The flux qubit revisited to enhance coherence and reproducibility</a>.</li>
        <li>Recent Ramsey-noise analysis, <a href="https://arxiv.org/abs/2502.05499">arXiv:2502.05499</a>.</li>
      </ol></section>`,
    steps: ["Calibrate the two pi/2 pulses and choose a delay grid spanning several fringes and the expected decay.", "Introduce and record a known artificial detuning when natural fringes are too slow to identify robustly.", "Acquire phase-cycled Ramsey traces in randomized delay order, retaining timestamps and raw counts.", "Fit the exact binomial likelihood jointly for offset, contrast, frequency, phase and competing envelope models.", "Subtract the intentional detuning, update the drive frequency, and rerun a short confirmation trace.", "Repeat in time blocks and compare with echo to distinguish slow inhomogeneity from faster dephasing."],
    codeTitle: "Python pseudocode",
    codeSource: String.raw`delays = design_log_linear_delays(t_min, t_max)
for phase in [0, pi/2]:
    for t in rng.permutation(delays):
        circuit = X90() + idle(t) + virtual_Z(detuning*t + phase) + X90() + measure()
        counts[phase, t] = run(circuit, shots=shots)

models = [exponential_ramsey, gaussian_ramsey, stretched_ramsey]
fits = [fit_binomial_likelihood(model, counts) for model in models]
fit = select_by_predictive_score(fits)
residual_detuning = fit.fringe_frequency - programmed_detuning
update_drive_frequency(residual_detuning)
report(fit, compare_with_echo(), drift_by_time_block(counts))`,
    description: "Phase cycling and model comparison make frequency and envelope estimates easier to audit.",
    reports: ["Pulse phases, programmed detuning, delay grid and acquisition order.", "Counts, likelihood, envelope family and model-selection rule.", "Fringe frequency, residual detuning, T2* and uncertainty.", "Drift blocks, echo comparison and residual diagnostics."]
  },

  rpe: {
    title: "Robust phase estimation",
    level: "Qubit level",
    kicker: "Coherent angle estimation",
    tags: ["Multiscale", "SPAM-robust", "Phase unwrapping"],
    summary: "Estimate a coherent rotation angle with geometrically increasing sequence lengths and explicit phase unwrapping.",
    purpose: String.raw`<p>Robust phase estimation (RPE) estimates the eigenphase of a repeated unitary without a coherent ancilla. Two quadratures at lengths \(L=1,2,4,\ldots\) provide a wrapped phase; each stage selects the unique branch consistent with the previous estimate.</p><div class="doc-warning"><strong>Robust does not mean assumption-free:</strong> bounded additive probability error preserves branch selection only while the observed quadrature retains enough contrast.</div>`,
    theory: String.raw`
      <p>For an intended equatorial rotation by angle \(\theta\), ideal cosine- and sine-quadrature experiments at repetition length \(L\) produce</p>
      <div class="equation">\[p_c(L)=\frac{1+\cos(L\theta)}{2},\qquad p_s(L)=\frac{1+\sin(L\theta)}{2}.\]</div>
      <p>Define \(x_L=2\hat p_c-1\), \(y_L=2\hat p_s-1\), and wrapped phase \(\phi_L=\operatorname{atan2}(y_L,x_L)\). Candidate phases are</p>
      <div class="equation">\[\theta_{L,k}=\frac{\phi_L+2\pi k}{L},\qquad k=0,\ldots,L-1.\]</div>
      <p>Choose the candidate nearest the previous estimate modulo \(2\pi\). When every branch is selected correctly, the resolution scales as \(O(1/L_{\max})\), rather than the \(O(1/\sqrt N)\) resolution of an unamplified direct estimate.</p>`,
    deepDive: String.raw`
      <section class="article-section doc-section"><h2>Robustness condition</h2>
        <p>Let additive errors be \(\delta_c=\hat p_c-p_c\) and \(\delta_s=\hat p_s-p_s\). They perturb the ideal unit vector by \((2\delta_c,2\delta_s)\). A common sufficient bound, \(|\delta_c|,|\delta_s|&lt;1/\sqrt8\), keeps the angular error below the branch ambiguity required by the dyadic update. Finite shots contribute stochastic additive error; Hoeffding gives</p>
        <div class="equation">\[\Pr(|\hat p-p|\ge\epsilon)\le2e^{-2N\epsilon^2}.\]</div>
        <p>Allocate shots per stage so that the union of all stage-failure probabilities is below the experiment-wide target. Deterministic SPAM and gate-dependent errors consume the same additive-error budget.</p>
      </section>
      <section class="article-section doc-section"><h2>Key metrics</h2><div class="metric-grid">
        <div><strong>\(\hat\theta\)</strong><span>unwrapped rotation angle</span></div><div><strong>\(\delta\theta\)</strong><span>coherent over/under-rotation</span></div>
        <div><strong>\(L_{\max}\)</strong><span>maximum amplification length</span></div><div><strong>Quadrature radius</strong><span>\(\sqrt{x_L^2+y_L^2}\), usable contrast</span></div>
        <div><strong>Branch margin</strong><span>distance to the competing unwrap</span></div><div><strong>Failure budget</strong><span>shot plus systematic probability error</span></div>
      </div></section>
      <section class="article-section doc-section"><h2>Failure modes and assumptions</h2><ul>
        <li><strong>Unitary, stationary angle:</strong> drift across lengths or non-Markovian context means no single \(\theta\) explains all stages.</li>
        <li><strong>Contrast collapse:</strong> decoherence or leakage at large \(L\) shrinks both quadratures toward zero, making atan2 noise-dominated.</li>
        <li><strong>Bounded additive error:</strong> once SPAM or gate-dependent bias exceeds the robustness threshold, a stage can select the wrong branch and later stages amplify the mistake.</li>
        <li><strong>Correct quadrature pair:</strong> phase errors in preparation/measurement can rotate or distort the cosine–sine plane.</li>
        <li><strong>No strong alias at the first stage:</strong> the prior interval must make the initial branch identifiable.</li>
        <li><strong>Independent shots:</strong> burst errors and correlated readout make binomial confidence bounds overoptimistic.</li>
      </ul></section>
      <section class="article-section doc-section"><h2>Primary references</h2><ol>
        <li>Kimmel, Low &amp; Yoder, <a href="https://arxiv.org/abs/1502.02677">Robust calibration of a universal single-qubit gate set via robust phase estimation</a>.</li>
        <li>Rudinger et al., <a href="https://arxiv.org/abs/1702.01763">Experimental demonstration of a cheap and accurate phase estimation</a>.</li>
        <li>Recent RPE analysis, <a href="https://arxiv.org/abs/2502.06698">arXiv:2502.06698</a>.</li>
      </ol></section>`,
    steps: ["Choose the target rotation, a prior interval and dyadic lengths L=1,2,...,Lmax.", "For every L, construct cosine and sine experiments with identical repeated gates and different analysis phases.", "Interleave lengths in acquisition time and collect raw success counts for both quadratures.", "Compute xL, yL and atan2 phase; enumerate all L branches and select the one consistent with the previous stage.", "Track the quadrature radius and branch margin; stop before contrast loss makes a stage unreliable.", "Bootstrap the complete unwrap, including branch changes, and update the control parameter.", "Repeat after the update and compare against Ramsey or GST for axis and context errors."],
    codeTitle: "Python pseudocode",
    codeSource: String.raw`estimate = prior_center
records = []
for L in [1, 2, 4, 8, 16, 32, 64]:
    kc = run(cosine_experiment(L), shots=N[L]).successes
    ks = run(sine_experiment(L), shots=N[L]).successes
    x, y = 2*kc/N[L]-1, 2*ks/N[L]-1
    wrapped = atan2(y, x) % (2*pi)
    candidates = [(wrapped + 2*pi*k)/L for k in range(L)]
    estimate = nearest_mod_2pi(candidates, estimate)
    records.append((L, estimate, hypot(x, y), branch_margin(candidates, estimate)))
    if records[-1].radius < minimum_contrast:
        stop_before_unreliable_stage()

interval = bootstrap_entire_unwrap(records, raw_counts=True)
update_rotation_angle(estimate)
report(estimate, interval, records)`,
    description: "The bootstrap must rerun branch selection, not only perturb the final continuous estimate.",
    reports: ["Prior interval, sequence lengths, shots and acquisition schedule.", "Both quadrature counts, radii and branch margins at every length.", "Unwrapping rule, stopping rule and experiment-wide failure probability.", "Final angle error, uncertainty and post-update validation."]
  }
});

Object.assign(window.methodDetails, {
  volumetric: {
    title: "Volumetric capability regions",
    level: "Application level",
    kicker: "Width–depth capability map",
    tags: ["Capability region", "Confidence bounds", "Workload-defined"],
    summary: "Map where a processor passes a declared benchmark family across circuit width, depth and optional resource axes.",
    purpose: String.raw`<p>A volumetric benchmark is not one scalar. It evaluates a specified circuit family over a width–depth grid and records the region where a score exceeds a threshold with the required confidence. The benchmark tuple must fix the circuit distribution, compiler, score, aggregation rule and pass criterion.</p>`,
    theory: String.raw`
      <p>For grid point \((w,d)\), circuits \(C\sim\mathcal D_{w,d}\) produce scores \(s(C)\). Let \(\mu_{w,d}=\mathbb E_C[s(C)]\). A defensible pass rule uses a lower confidence bound rather than a point estimate:</p>
      <div class="equation">\[\operatorname{LCB}_{1-\alpha}(\mu_{w,d})>\tau.\]</div>
      <p>The capability region is \(\mathcal R=\{(w,d):\text{pass}(w,d)\}\), and its Pareto frontier contains points not dominated in both width and depth. Monotonicity should be tested, not silently imposed.</p>
      <p>Quantum Volume is one special square-family construction with \(w=d\) and a heavy-output test. Its common criterion is heavy-output probability above \(2/3\) with statistical confidence, but that definition does not transfer automatically to other circuit families.</p>`,
    deepDive: String.raw`
      <section class="article-section doc-section"><h2>Benchmark contract</h2><div class="equation">\[B=(\mathcal D_{w,d},\;\text{compiler},\;s,\;\text{aggregation},\;\tau,\;\alpha,\;\text{resource policy}).\]</div><p>Every component is constitutive: changing routing, ideal-simulation precision, postselection or the number of circuits creates a different benchmark. Store per-circuit scores so between-instance variance is visible.</p></section>
      <section class="article-section doc-section"><h2>Key metrics</h2><div class="metric-grid"><div><strong>Capability region</strong><span>all passing width–depth points</span></div><div><strong>Pareto frontier</strong><span>nondominated boundary</span></div><div><strong>LCB margin</strong><span>distance from threshold</span></div><div><strong>Circuit variance</strong><span>instance-to-instance spread</span></div><div><strong>Compiled resources</strong><span>two-qubit count, depth, swaps and duration</span></div><div><strong>Stability</strong><span>repeatability across time blocks</span></div></div></section>
      <section class="article-section doc-section"><h2>Failure modes and assumptions</h2><ul>
        <li><strong>Benchmark-family validity:</strong> a convenient random family may not represent the intended application workload.</li>
        <li><strong>Compiler neutrality:</strong> topology mapping and optimization can dominate the measured region; compiler identity is part of the benchmark.</li>
        <li><strong>Ideal reference accuracy:</strong> approximate simulation or sampling changes heavy sets and scores at larger sizes.</li>
        <li><strong>Independent circuits:</strong> reusing closely related instances or ignoring circuit variance yields overconfident intervals.</li>
        <li><strong>Stationarity:</strong> a large grid collected sequentially confounds width/depth with calibration drift.</li>
        <li><strong>Monotonic region:</strong> finite sampling and compiler discontinuities can create islands; do not fill unmeasured or failed points by assumption.</li>
        <li><strong>Selection bias:</strong> choosing qubits or circuits after observing outcomes invalidates the stated confidence level.</li>
      </ul></section>
      <section class="article-section doc-section"><h2>Primary references</h2><ol><li>Blume-Kohout &amp; Young, <a href="https://arxiv.org/abs/1904.05546">A volumetric framework for quantum computer benchmarks</a>.</li><li>Cross et al., <a href="https://arxiv.org/abs/1811.12926">Validating quantum computers using randomized model circuits</a>.</li><li>Lubinski et al., <a href="https://arxiv.org/abs/2110.03137">Application-oriented performance benchmarks for quantum computing</a>.</li></ol></section>`,
    steps: ["Write the benchmark contract: circuit distributions, grid, compiler, score, threshold, confidence method and resource policy.", "Generate independent fixed-seed circuits at every width–depth point and compute the required ideal references.", "Compile once under the declared policy, recording logical and physical resources and qubit maps.", "Randomize execution across the grid and retain per-circuit counts, timestamps and calibration context.", "Compute per-circuit scores, aggregate across circuits, and form circuit-level lower confidence bounds.", "Mark measured pass/fail/indeterminate points and extract a Pareto frontier without inventing unmeasured passes.", "Repeat boundary points over time and publish the complete contract with the capability map."],
    codeTitle: "Python pseudocode",
    codeSource: String.raw`results = []
for width, depth in randomized(capability_grid):
    for seed in fixed_seeds(width, depth):
        logical = sample_circuit(family, width, depth, seed)
        ideal = compute_reference(logical, precision=declared_precision)
        physical, resources = compile(logical, policy=compiler_policy)
        counts = run(physical, shots)
        score = scoring_rule(counts, ideal)
        results.append((width, depth, seed, score, resources))

for point in capability_grid:
    scores = per_circuit_scores(results, point)
    lcb = circuit_bootstrap_lower_bound(scores, confidence=1-alpha)
    status[point] = "pass" if lcb > threshold else "fail_or_indeterminate"

frontier = pareto_frontier(measured_passes(status))
report(status, frontier, results, benchmark_contract)`,
    description: "Resample independent circuits, not pooled shots, when circuit-instance variation is part of the target population.",
    reports: ["Circuit family, distributions, seeds, grid and ideal-reference method.", "Compiler/version, qubit selection, routing and compiled resource counts.", "Score, threshold, aggregation and confidence construction.", "Per-circuit results, measured capability region, frontier, drift repeats and indeterminate points."]
  },

  accreditation: {
    title: "Circuit output accreditation",
    level: "Application level",
    kicker: "Trap-based output certification",
    tags: ["Trap circuits", "TVD bound", "Finite-confidence"],
    summary: "Bound the total-variation distance of a target circuit's noisy output using interleaved trap circuits and an explicit confidence budget.",
    purpose: String.raw`<p>Accreditation accompanies a target circuit with trap circuits whose ideal outcomes are efficiently known. Trap failures estimate the probability of undetected faults under the protocol assumptions and provide a bound on the target output distribution. Accreditation certifies or bounds data; it is not error mitigation and does not alter target samples.</p>`,
    theory: String.raw`
      <p>For ideal target distribution \(p_{\rm id}\) and experimental distribution \(p_{\rm exp}\), total-variation distance is</p>
      <div class="equation">\[D_{\rm TV}(p_{\rm exp},p_{\rm id})=\frac12\sum_x|p_{\rm exp}(x)-p_{\rm id}(x)|.\]</div>
      <p>Under the protocol's noise and randomization assumptions, the target distance is bounded by twice the trap incorrect-outcome probability, \(D_{\rm TV}\le2p_{\rm inc}\). For empirical trap failure rate \(\hat p_{\rm inc}\), one finite-sample form is</p>
      <div class="equation">\[\boxed{D_{\rm TV}\le2\hat p_{\rm inc}+\theta}\]</div>
      <p>with confidence at least \(1-\delta\) when</p>
      <div class="equation">\[N_{\rm tr}\ge\frac{2\ln(2/\delta)}{\theta^2}.\]</div>
      <p>The factor, confidence inequality and required trap count belong together; quoting only the empirical failure rate is not accreditation.</p>`,
    deepDive: String.raw`
      <section class="article-section doc-section"><h2>Key metrics</h2><div class="metric-grid"><div><strong>Trap failure \(\hat p_{inc}\)</strong><span>incorrect known trap outcomes</span></div><div><strong>TVD upper bound</strong><span>accredited target-distance guarantee</span></div><div><strong>Confidence \(1-\delta\)</strong><span>coverage of the finite-sample bound</span></div><div><strong>Slack \(\theta\)</strong><span>statistical precision budget</span></div><div><strong>Trap count</strong><span>certification resource overhead</span></div><div><strong>Acceptance rate</strong><span>fraction of runs meeting a prespecified bound</span></div></div></section>
      <section class="article-section doc-section"><h2>Failure modes and assumptions</h2><ul>
        <li><strong>Target–trap comparability:</strong> traps must experience the same relevant noise and compilation context as the target; easier traps understate error.</li>
        <li><strong>Noise assumptions:</strong> adversarial temporal correlation, leakage or crosstalk outside the proof model can invalidate the \(2p_{inc}\) relation.</li>
        <li><strong>Hidden randomization:</strong> if device noise can depend on trap identity or random keys, detection guarantees can fail.</li>
        <li><strong>Stationarity/exchangeability:</strong> collecting traps and target in separate time blocks allows drift to break inference; interleave them randomly.</li>
        <li><strong>Finite samples:</strong> too few traps yield a vacuous bound even when zero failures are observed.</li>
        <li><strong>Postselection:</strong> discarding unfavorable traps or changing acceptance thresholds after looking at data destroys coverage.</li>
        <li><strong>Misinterpretation:</strong> the bound applies to the declared target distribution and protocol instance, not every future circuit on the processor.</li>
      </ul></section>
      <section class="article-section doc-section"><h2>Primary references</h2><ol><li>Ferracin, Kapourniotis &amp; Datta, <a href="https://arxiv.org/abs/1811.09709">Accrediting outputs of noisy intermediate-scale quantum computing devices</a>.</li><li>Kapourniotis et al., <a href="https://arxiv.org/abs/1709.10050">Direct verification of quantum computation</a>.</li><li>Ferracin et al., <a href="https://arxiv.org/abs/2103.06603">Efficiently improving the performance of noisy quantum computers</a>.</li></ol></section>`,
    steps: ["Fix the target circuit, noise model, randomization construction, desired confidence delta and TVD slack theta before acquisition.", "Compute the required number of traps and generate target-matched trap circuits with known ideal outputs.", "Compile target and traps under the same declared policy; conceal and randomize their order where required.", "Execute them in one interleaved batch and retain every trap outcome and timestamp.", "Count incorrect trap outcomes and compute a valid finite-sample upper confidence bound for p_inc.", "Translate it to the protocol-specific TVD bound and apply only the prespecified accept/reject rule.", "Report all assumptions, overhead and rejected data; do not describe accreditation as corrected target output."],
    codeTitle: "Python pseudocode",
    codeSource: String.raw`N_traps = ceil(2 * log(2/delta) / theta**2)
traps = [generate_target_matched_trap(target, secret_seed=i) for i in range(N_traps)]
batch = randomized_hidden_order([target] + traps)
records = execute(batch, same_compiler=True, retain_timestamps=True)

failures = sum(not trap_outcome_is_ideal(r) for r in trap_records(records))
p_hat = failures / N_traps
tvd_bound_simple = min(1.0, 2*p_hat + theta)

# Prefer an exact/binomial bound when specified by the protocol.
p_upper = binomial_upper_confidence(failures, N_traps, confidence=1-delta)
tvd_bound = min(1.0, 2*p_upper)
accepted = tvd_bound <= prespecified_threshold
report(accepted, tvd_bound, failures, N_traps, protocol_assumptions)`,
    description: "Choose one confidence construction in advance; do not select the tighter-looking bound after observing data.",
    reports: ["Target and trap construction, random keys/seeds policy and compiler equivalence.", "Noise assumptions, delta, theta, trap count and acceptance threshold.", "All trap outcomes, failures, confidence method and final TVD bound.", "Target samples kept separate from certification data, plus timing and overhead."]
  },

  "application-benchmarks": {
    title: "Application-oriented benchmarks",
    level: "Application level",
    kicker: "End-to-end workload evaluation",
    tags: ["Quality–cost tradeoff", "Solution metrics", "Workflow-aware"],
    summary: "Evaluate complete quantum workflows with application-defined quality, resource cost and time-to-solution rather than a hardware-only proxy.",
    purpose: String.raw`<p>An application benchmark specifies a problem distribution, workflow, quality metric, baseline, resource accounting and success rule. It measures whether the complete quantum-plus-classical system produces useful solutions under a reproducible budget. Hardware metrics may explain performance, but they do not replace the application objective.</p>`,
    theory: String.raw`
      <p>A benchmark instance is a tuple</p>
      <div class="equation">\[B=(\mathcal P,\mathcal A,Q,C,T,\mathcal B,\text{aggregation},\text{success rule}),\]</div>
      <p>where \(\mathcal P\) is the problem distribution, \(\mathcal A\) the complete workflow, \(Q\) quality, \(C\) cost, \(T\) time and \(\mathcal B\) a baseline. For sampled distributions, classical fidelity is often</p>
      <div class="equation">\[F_{\rm cl}(p,q)=\left(\sum_x\sqrt{p_xq_x}\right)^2.\]</div>
      <p>For optimization, use an orientation-aware normalized quality, for example \(Q=(f-f_{\rm base})/(f_{\rm ref}-f_{\rm base})\), with clipping policy stated. End-to-end time should be decomposed:</p>
      <div class="equation">\[T_{\rm solution}=T_{\rm compile}+T_{\rm queue}+T_{\rm quantum}+T_{\rm classical}+T_{\rm communication}.\]</div>`,
    deepDive: String.raw`
      <section class="article-section doc-section"><h2>Quality–cost frontier</h2><p>A single quality score hides resource tradeoffs. Evaluate multiple budgets and report the nondominated set in \((Q,C,T)\): a workflow is dominated if another reaches at least its quality with no greater cost or time. A quantum result is not an advantage claim unless the classical baseline receives a comparable optimization, tuning and hardware budget.</p></section>
      <section class="article-section doc-section"><h2>Key metrics</h2><div class="metric-grid"><div><strong>Application quality</strong><span>domain-specific correctness or utility</span></div><div><strong>Success probability</strong><span>chance of meeting a target threshold</span></div><div><strong>Time to solution</strong><span>complete repeated-workflow latency</span></div><div><strong>Resource cost</strong><span>shots, QPU time, classical compute and energy</span></div><div><strong>Robustness</strong><span>variation across instances, seeds and days</span></div><div><strong>Pareto frontier</strong><span>best quality–cost–time tradeoffs</span></div></div></section>
      <section class="article-section doc-section"><h2>Failure modes and assumptions</h2><ul>
        <li><strong>Metric validity:</strong> a convenient proxy may not track real application utility and can be gamed by the workflow.</li>
        <li><strong>Representative instances:</strong> handpicked easy problems create selection bias and poor external validity.</li>
        <li><strong>Baseline fairness:</strong> weak classical baselines, unequal tuning or excluded preprocessing lead to false advantage claims.</li>
        <li><strong>Resource completeness:</strong> omitting queue, compilation, mitigation, rejected runs or classical optimization understates cost.</li>
        <li><strong>Reference uncertainty:</strong> approximate “ground truth” can dominate the claimed quality difference at hard sizes.</li>
        <li><strong>Adaptive overfitting:</strong> tuning on the evaluation instances invalidates held-out confidence.</li>
        <li><strong>Nonstationarity:</strong> device drift and queue conditions make one run unrepresentative; use blocked repeats and timestamps.</li>
        <li><strong>Aggregation:</strong> means can hide catastrophic tails; publish per-instance results and distributional summaries.</li>
      </ul></section>
      <section class="article-section doc-section"><h2>Primary references</h2><ol><li>Lubinski et al., <a href="https://arxiv.org/abs/2110.03137">Application-oriented performance benchmarks for quantum computing</a>.</li><li>Application-benchmarking study, <a href="https://arxiv.org/abs/2402.08985">arXiv:2402.08985</a>.</li><li>QED-C application-oriented benchmarks, <a href="https://arxiv.org/abs/2110.14108">arXiv:2110.14108</a>.</li></ol></section>`,
    steps: ["Define the decision task, problem-instance distribution, held-out split and domain-valid quality metric.", "Freeze the quantum and classical workflows, tuning budget, baseline algorithms and hardware/software versions.", "Choose budgets across shots, circuit depth, mitigation effort, optimizer iterations and wall time.", "Randomize instances and methods in time; record compilation, queue, QPU, classical and communication time separately.", "Compute per-instance quality, success and complete cost; include failed and rejected runs under a prespecified policy.", "Construct confidence intervals and the quality–cost–time Pareto frontier using instances as the sampling unit.", "Repeat across seeds and days, disclose reference uncertainty, and limit conclusions to the sampled workload distribution."],
    codeTitle: "Python pseudocode",
    codeSource: String.raw`records = []
for instance in held_out_instances(problem_distribution):
    for method in randomized([quantum_workflow, *classical_baselines]):
        for budget in budgets:
            timer = EndToEndTimer()
            solution, resources = method.solve(instance, budget, timer=timer)
            quality = application_metric(solution, reference[instance])
            records.append({"instance": instance.id, "method": method.name,
                            "budget": budget, "quality": quality,
                            "resources": resources, "times": timer.breakdown,
                            "success": quality >= target_quality})

summary = hierarchical_interval(records, sampling_unit="instance")
frontier = pareto_frontier(records, maximize="quality", minimize=["cost", "time"])
robustness = repeatability_by_seed_and_day(records)
report(records, summary, frontier, robustness, benchmark_contract)`,
    description: "The full workflow—including compilation, optimization and mitigation—is the benchmarked system.",
    reports: ["Problem distribution, held-out protocol, references and their uncertainty.", "Complete workflows, software/hardware versions, tuning rules and baselines.", "Per-instance quality, success, resources and decomposed time-to-solution.", "Confidence intervals, failures, Pareto frontier, repeatability and exact scope of conclusions."]
  }
});

Object.assign(window.methodDetails, {
  drb: {
    title: "Direct randomized benchmarking",
    level: "System level",
    kicker: "Native-layer benchmarking",
    tags: ["Random circuits", "Native gates", "Scalable decay"],
    summary: "Estimate the average error of a declared distribution over native circuit layers without compiling through a large Clifford group.",
    purpose: String.raw`<p>Direct randomized benchmarking (DRB) samples native-gate layers directly, prepares a random stabilizer state, applies a random circuit, and compiles a final recovery to a known outcome. It reports a decay associated with the declared layer distribution \(\Omega\), including its qubit selection, connectivity, idle and scheduling policy.</p>`,
    theory: String.raw`
      <p>Let \(S_m\) be the mean success probability for depth \(m\). Under approximately Markovian, weak and sufficiently randomized errors,</p>
      <div class="equation">\[S_m=A p^m+B.\]</div>
      <p>The nuisance parameters \(A,B\) absorb leading preparation, measurement and recovery effects. The fitted polarization \(p\) can be converted in dimension \(d=2^n\) to</p>
      <div class="equation">\[r_{\rm ent}=\frac{d^2-1}{d^2}(1-p),\qquad r_{\rm avg}=\frac{d-1}{d}(1-p).\]</div>
      <p>These are entanglement infidelity and average gate infidelity respectively. They are not interchangeable, and the result is an average over \(\Omega\), not automatically the error of each native gate.</p>`,
    deepDive: String.raw`
      <section class="article-section doc-section"><h2>Key metrics</h2><div class="metric-grid"><div><strong>Decay \(p\)</strong><span>per sampled native layer</span></div><div><strong>\(r_{ent}\)</strong><span>entanglement infidelity convention</span></div><div><strong>\(r_{avg}\)</strong><span>average gate infidelity convention</span></div><div><strong>Sequence variance</strong><span>heterogeneity across random circuits</span></div><div><strong>Residual curvature</strong><span>test of one-rate decay</span></div><div><strong>Throughput</strong><span>compiled depth and wall-clock cost</span></div></div></section>
      <section class="article-section doc-section"><h2>Failure modes and assumptions</h2><ul>
        <li><strong>Approximate gate independence:</strong> strongly gate-dependent errors can make a single \(p\) an opaque weighted average.</li>
        <li><strong>Markovian stationarity:</strong> drift, burst noise and context memory produce non-exponential decay and correlated sequence outcomes.</li>
        <li><strong>Sufficient scrambling:</strong> a poorly mixing layer distribution need not reduce the error to one dominant decay mode.</li>
        <li><strong>Recovery neutrality:</strong> depth-dependent recovery cost or compiler behavior can be mistaken for layer error.</li>
        <li><strong>Leakage:</strong> population outside the modeled space introduces additional rates and shifts the asymptote.</li>
        <li><strong>Distribution dependence:</strong> changing qubit subsets, parallelism, idle policy or gate weights changes the benchmarked object.</li>
        <li><strong>Finite sampling:</strong> shot-only error bars omit circuit-to-circuit variance; resample circuits as the primary experimental unit.</li>
      </ul></section>
      <section class="article-section doc-section"><h2>Primary references</h2><ol><li>Proctor et al., <a href="https://arxiv.org/abs/1807.07975">Direct randomized benchmarking for multiqubit devices</a>.</li><li>Proctor et al., <a href="https://arxiv.org/abs/2302.13853">Scalable randomized benchmarking of quantum processes using mirror circuits</a>.</li><li>Wallman, <a href="https://arxiv.org/abs/1702.01853">Randomized benchmarking with gate-dependent noise</a>.</li></ol></section>`,
    steps: ["Define the native-layer distribution Omega, qubit subset, connectivity, parallelism, idle gates and compiler version.", "Choose depths that span the visible decay and sample independent random circuits at every depth.", "Prepare a random stabilizer state, apply the sampled native layers, and compute a recovery with a known ideal bit string.", "Randomize execution across depths and retain per-circuit counts rather than only depth averages.", "Fit a hierarchical or circuit-resampled model to S_m=A p^m+B and inspect residuals and sequence variance.", "Convert p only with an explicitly named convention and dimension.", "Repeat across time blocks or qubit subsets to separate drift and spatial heterogeneity."],
    codeTitle: "Python pseudocode",
    codeSource: String.raw`records = []
for m in depths:
    for seed in range(num_circuits[m]):
        prep = random_stabilizer_preparation(seed)
        layers = [sample_native_layer(Omega, seed, j) for j in range(m)]
        recovery, target = compile_recovery(prep, layers)
        counts = run(prep + layers + recovery + measure(), shots)
        records.append((m, seed, counts[target] / shots))

fit = fit_binomial_or_hierarchical_decay(records, model="A*p**m+B")
r_ent = (d*d - 1) * (1-fit.p) / (d*d)
r_avg = (d - 1) * (1-fit.p) / d
uncertainty = bootstrap_circuits_then_shots(records)
report(fit, r_ent, r_avg, uncertainty, Omega, residuals(records, fit))`,
    description: "The layer distribution is part of the result and must be serialized with the data.",
    reports: ["Full Omega definition, native gates, qubits, parallelism, idles and compiler.", "Depths, circuits per depth, shots, seeds and execution order.", "A, B, p, fit covariance, circuit-bootstrap uncertainty and residuals.", "Named infidelity convention, dimension and any leakage or time-block diagnostics."]
  },

  birb: {
    title: "Binary randomized benchmarking",
    level: "System level",
    kicker: "Inversion-free native-layer benchmark",
    tags: ["Binary outcome", "Pauli propagation", "No motion reversal"],
    summary: "Estimate native-layer entanglement infidelity from binary Pauli observables without a global inverse circuit.",
    purpose: String.raw`<p>Binary randomized benchmarking (BiRB) prepares random Pauli eigenstates, evolves them through randomized native layers while classically propagating the ideal Pauli frame, and measures a binary \(\pm1\) observable. It avoids the deep compiled inverse used by motion-reversal protocols.</p>`,
    theory: String.raw`
      <p>At depth \(m\), let \(b\in\{-1,+1\}\) denote whether the measured parity agrees with the ideal propagated Pauli eigenvalue. Averaging over circuits yields</p>
      <div class="equation">\[\bar f_m=A p^m.\]</div>
      <p>The zero-centered observable removes the usual additive asymptote. For \(n\) qubits and \(d=2^n\), the default BiRB conversion is</p>
      <div class="equation">\[r_\Omega=\frac{4^n-1}{4^n}(1-p)=\frac{d^2-1}{d^2}(1-p),\]</div>
      <p>which is an entanglement-infidelity convention for the sampled layer distribution. If average gate infidelity is also shown, label it separately as \((d-1)(1-p)/d\).</p>`,
    deepDive: String.raw`
      <section class="article-section doc-section"><h2>Why the binary observable decays</h2><p>Random Pauli eigenstate preparation and randomized native layers distribute error across non-identity Pauli directions. Correct classical propagation determines the final ideal observable without physically reversing the circuit. Under sufficiently mixing, weak Markovian noise, repeated layers multiply the average polarization by \(p\), while SPAM sets the prefactor \(A\).</p></section>
      <section class="article-section doc-section"><h2>Key metrics</h2><div class="metric-grid"><div><strong>Decay \(p\)</strong><span>native-layer polarization</span></div><div><strong>\(r_\Omega\)</strong><span>reported entanglement infidelity</span></div><div><strong>Prefactor \(A\)</strong><span>SPAM and initial contrast</span></div><div><strong>Binary variance</strong><span>per-depth statistical information</span></div><div><strong>Circuit spread</strong><span>layer/context heterogeneity</span></div><div><strong>Residual structure</strong><span>non-Markovian or multimode behavior</span></div></div></section>
      <section class="article-section doc-section"><h2>Failure modes and assumptions</h2><ul>
        <li><strong>Correct Pauli propagation:</strong> compiler frame errors or unsupported non-Clifford structure make the target observable wrong.</li>
        <li><strong>Scrambling:</strong> insufficient mixing leaves Pauli-dependent rates and invalidates a one-parameter interpretation.</li>
        <li><strong>Stable SPAM prefactor:</strong> depth-correlated readout or preparation changes cannot be absorbed into one \(A\).</li>
        <li><strong>Markovian stationarity:</strong> drift and temporal correlation generate curvature or inconsistent blocks.</li>
        <li><strong>Leakage:</strong> a binary computational-subspace observable does not by itself reveal where lost population went.</li>
        <li><strong>Layer-distribution scope:</strong> the estimate changes when the native weights, parallelism, idles or qubit subset change.</li>
        <li><strong>Convention ambiguity:</strong> reporting \((1-p)\) as “error rate” without the dimensional factor causes systematic comparison errors.</li>
      </ul></section>
      <section class="article-section doc-section"><h2>Primary references</h2><ol><li>Proctor et al., <a href="https://arxiv.org/abs/2309.05147">Binary randomized benchmarking</a> — the primary BiRB protocol.</li><li>Proctor et al., <a href="https://arxiv.org/abs/2302.13853">Scalable randomized benchmarking of quantum processes using mirror circuits</a> — scalable RB context.</li><li>Hines et al., <a href="https://arxiv.org/abs/2203.11374">Demonstrating scalable randomized benchmarking of universal gate sets</a> — native-layer benchmarking context.</li></ol></section>`,
    steps: ["Declare the native-layer distribution Omega, qubit subset and Pauli-frame conventions.", "At each depth, sample a random Pauli eigenstate and a random native-layer circuit.", "Propagate the ideal Pauli observable through the circuit classically and compile only the required preparation and measurement bases.", "Measure the final parity and map each shot to a binary +/-1 score.", "Average at circuit level, fit A p^m, and bootstrap independent circuits before shots.", "Check Pauli-sector and time-block residuals for multimode decay or drift.", "Report r_Omega with the entanglement-infidelity convention and the complete Omega definition."],
    codeTitle: "Python pseudocode",
    codeSource: String.raw`records = []
for m in depths:
    for seed in range(num_circuits[m]):
        P0, eigenvalue = sample_pauli_eigenstate(seed)
        circuit = prepare_eigenstate(P0, eigenvalue)
        P = P0
        for j in range(m):
            layer = sample_native_layer(Omega, seed, j)
            circuit += layer
            P = propagate_pauli(P, ideal_action(layer))
        circuit += measure_pauli(P)
        outcomes = run(circuit, shots)
        records.append((m, mean(binary_score(outcomes, eigenvalue))))

fit = fit_zero_centered_decay(records, model="A*p**m")
r_Omega = (d*d - 1) * (1-fit.p) / (d*d)
report(fit, r_Omega, bootstrap_circuits(records), Omega)`,
    description: "No global inverse is executed; correctness depends on the classical observable propagation and basis compilation.",
    reports: ["Layer distribution, Pauli sampling rule, qubits, idles and compiler.", "Depths, seeds, circuits per depth, shots and binary mapping.", "A, p, r_Omega, confidence interval and conversion convention.", "Circuit/time/Pauli-sector residuals and leakage checks."]
  },

  "mirror-rb": {
    title: "Mirror randomized benchmarking",
    level: "System level",
    kicker: "Structured motion-reversal circuits",
    tags: ["Mirror circuits", "Randomized compiling", "Scalable fidelity"],
    summary: "Benchmark broad native circuits by composing a random forward circuit with its ideal inverse and scoring the predictable output.",
    purpose: String.raw`<p>Mirror RB constructs a forward native circuit, appends a compiled inverse, and inserts Pauli randomized compiling so that the ideal output remains efficiently predictable. It probes realistic connectivity and parallelism while retaining a scalable success statistic.</p><div class="doc-warning"><strong>Depth convention:</strong> state whether reported depth counts the forward half, both halves, or benchmark cycles. A factor-of-two ambiguity directly changes the inferred per-layer error.</div>`,
    theory: String.raw`
      <p>For sampled forward circuit \(C\), the ideal mirror \(C^{-1}C\) returns a known bit string up to tracked Pauli frames. Randomized compiling converts coherent accumulation into an ensemble decay that is commonly modeled as</p>
      <div class="equation">\[S_m=A p^m+B.\]</div>
      <p>When full-string success becomes too sparse, an adjusted success probability uses the Hamming distance \(h(x,x_*)\) from the ideal output, assigning a score that estimates polarization rather than requiring every bit to be correct. The exact score and normalization are part of the protocol.</p>`,
    deepDive: String.raw`
      <section class="article-section doc-section"><h2>Key metrics</h2><div class="metric-grid"><div><strong>Decay \(p\)</strong><span>per declared mirror-depth unit</span></div><div><strong>Adjusted success</strong><span>Hamming-aware scalable score</span></div><div><strong>Full-string success</strong><span>strict return probability</span></div><div><strong>Width/depth map</strong><span>system capability surface</span></div><div><strong>Circuit variance</strong><span>instance sensitivity</span></div><div><strong>Pauli-frame checks</strong><span>compiler/protocol correctness</span></div></div></section>
      <section class="article-section doc-section"><h2>Failure modes and assumptions</h2><ul>
        <li><strong>Forward/inverse cancellation:</strong> correlated coherent errors can cancel across the mirror, making performance look better than unrelated application circuits.</li>
        <li><strong>Randomized-compiling correctness:</strong> incorrect Pauli propagation or nontransparent compiler rewrites invalidate the known output.</li>
        <li><strong>Depth definition:</strong> inconsistent counting of forward and reverse layers prevents valid comparison.</li>
        <li><strong>One-rate decay:</strong> leakage, drift and strongly heterogeneous layers produce multiple rates or a moving asymptote.</li>
        <li><strong>Adjusted-score assumptions:</strong> correlated bit errors can break the mapping from Hamming score to global polarization.</li>
        <li><strong>Inverse overhead:</strong> hardware constraints can make the inverse structurally different from the forward circuit and dominate the result.</li>
        <li><strong>Ensemble dependence:</strong> connectivity, gate density, width and native distribution define the benchmarked workload.</li>
      </ul></section>
      <section class="article-section doc-section"><h2>Primary references</h2><ol><li>Proctor et al., <a href="https://arxiv.org/abs/2112.09853">Measuring the capabilities of quantum computers</a>.</li><li>Proctor et al., <a href="https://arxiv.org/abs/2207.07272">Mirror randomized benchmarking</a>.</li><li>Proctor et al., <a href="https://arxiv.org/abs/2309.05147">Binary randomized benchmarking</a> — comparison with inversion-free benchmarking.</li></ol></section>`,
    steps: ["Declare width, forward-depth convention, native-layer ensemble, connectivity, gate density and compiler.", "Sample a forward circuit C and construct its ideal inverse in the same native model.", "Insert and track randomized Pauli frames without changing the ideal return string.", "Execute many independent mirrors per width and depth in randomized order.", "Compute both full-string and explicitly defined adjusted success scores from raw counts.", "Fit the declared decay model with circuit-level resampling and inspect width, depth and time residuals.", "Repeat with asymmetric or non-mirrored diagnostics when cancellation is a material risk."],
    codeTitle: "Python pseudocode",
    codeSource: String.raw`records = []
for width, depth in capability_grid:
    for seed in range(num_circuits):
        forward = sample_native_circuit(width, depth, ensemble, seed)
        inverse = compile_inverse(forward)
        mirror, target = insert_and_track_pauli_frames(forward, inverse, seed)
        counts = run(mirror + measure_all(), shots)
        strict = counts[target] / shots
        adjusted = sum(adjusted_hamming_score(x, target, width) * n
                       for x, n in counts.items()) / shots
        records.append((width, depth, seed, strict, adjusted))

fits = fit_decay_by_width(records, depth_convention=declared_convention)
uncertainty = bootstrap_circuits_then_shots(records)
report(fits, uncertainty, compiler_manifest(), cancellation_checks())`,
    description: "Store the exact forward circuit, inverse and Pauli frame so every score can be reproduced.",
    reports: ["Circuit ensemble, width/depth convention, connectivity and compiler manifest.", "Forward/inverse construction, randomized-compiling rule, seeds and shots.", "Strict and adjusted scoring formulas, per-circuit values and decay fits.", "Circuit-bootstrap uncertainty, residuals, leakage and cancellation diagnostics."]
  }
});

Object.assign(window.methodDetails, {
  qpt: {
    title: "Quantum process tomography",
    level: "Circuit level",
    kicker: "Channel reconstruction",
    tags: ["CPTP estimation", "Choi matrix", "SPAM-sensitive"],
    summary: "Reconstruct a quantum channel from a spanning set of input states and measurements, with explicit physical constraints and uncertainty.",
    purpose: String.raw`
      <p>Quantum process tomography (QPT) estimates a map \(\mathcal E\) rather than one output state. A valid deterministic quantum channel is completely positive and trace preserving (CPTP). The output should include the estimated channel representation, the probe and measurement model, the statistical objective, uncertainty and predictive checks.</p>
      <div class="doc-warning"><strong>Identifiability warning:</strong> standard QPT assumes known input preparations and measurements. Without independent calibration, their errors are absorbed into the reconstructed channel.</div>`,
    theory: String.raw`
      <h3>Equivalent channel representations</h3>
      <p>A channel can be written in Kraus form, \(\mathcal E(\rho)=\sum_aK_a\rho K_a^\dagger\), with \(\sum_aK_a^\dagger K_a=I\). In an operator basis \(\{B_m\}\),</p>
      <div class="equation">\[\mathcal E(\rho)=\sum_{mn}\chi_{mn}B_m\rho B_n^\dagger.\]</div>
      <p>The normalized Choi matrix \(J_{\mathcal E}=(\mathcal E\otimes\mathcal I)(|\Phi\rangle\langle\Phi|)\), \(|\Phi\rangle=d^{-1/2}\sum_j|jj\rangle\), obeys</p>
      <div class="equation">\[J\succeq0,\qquad \operatorname{Tr}_{\rm out}J=I/d.\]</div>
      <p>For input \(\rho_s\) and output POVM effect \(M_{b|t}\), the Born probability is linear in the Choi matrix:</p>
      <div class="equation">\[p(b|s,t)=d\operatorname{Tr}[(M_{b|t}\otimes\rho_s^T)J].\]</div>`,
    deepDive: String.raw`
      <section class="article-section doc-section"><h2>Reconstruction objective</h2>
        <p>For multinomial counts \(n_{b|s,t}\), physical maximum likelihood is the convex program</p>
        <div class="equation">\[\boxed{\hat J=\arg\min_{J\succeq0,\,\operatorname{Tr}_{\rm out}J=I/d}-\sum_{s,t,b}n_{b|s,t}\log\!\left[d\operatorname{Tr}((M_{b|t}\otimes\rho_s^T)J)\right].}\]</div>
        <p>Linear inversion is useful for diagnosing rank and conditioning but can violate complete positivity. A projected estimate changes the statistical problem and should not be reported as unconstrained inversion.</p>
        <p>In a Pauli basis, the Pauli-transfer matrix \(R_{ij}=d^{-1}\operatorname{Tr}[P_i\mathcal E(P_j)]\) is convenient for composition. The first row tests trace preservation; the unital column distinguishes translation from contraction.</p>
      </section>
      <section class="article-section doc-section"><h2>Key metrics</h2>
        <div class="equation">\[F_{\rm avg}(\mathcal E,U)=\frac{dF_e(\mathcal U^\dagger\circ\mathcal E)+1}{d+1}.\]</div>
        <div class="metric-grid"><div><strong>Process/entanglement fidelity</strong><span>overlap of Choi matrices</span></div><div><strong>Average gate fidelity</strong><span>Haar-averaged state fidelity</span></div><div><strong>Diamond distance</strong><span>worst-case channel distinguishability</span></div><div><strong>TP residual</strong><span>\(\|\operatorname{Tr}_{out}J-I/d\|\)</span></div><div><strong>Choi spectrum</strong><span>rank and complete positivity</span></div><div><strong>Predictive deviance</strong><span>held-out input/measurement fit</span></div></div>
        <p>Average fidelity and diamond distance answer different questions: coherent errors can have modest average infidelity but much larger worst-case effect.</p>
      </section>
      <section class="article-section doc-section"><h2>Failure modes and assumptions</h2><ul>
        <li><strong>Known SPAM:</strong> preparation and measurement bias is attributed to the channel. Gate-set tomography is the self-consistent alternative when this assumption is untenable.</li>
        <li><strong>Informational completeness:</strong> rank-deficient or poorly conditioned probe/measurement designs make channel directions unidentifiable or noise-amplifying.</li>
        <li><strong>Stationary, memoryless channel:</strong> drift and history dependence mean the data do not arise from one linear CPTP map.</li>
        <li><strong>Computational-subspace closure:</strong> leakage makes a trace-preserving model on the declared subspace wrong; use an enlarged space or trace-nonincreasing model.</li>
        <li><strong>Finite-sample boundary bias:</strong> CPTP MLE often lands on a low-rank boundary, invalidating naive Gaussian error bars.</li>
        <li><strong>Scalability:</strong> a general \(d\)-dimensional channel has \(O(d^4)\) parameters, so both experiment count and optimization become exponential in qubit number.</li>
      </ul></section>
      <section class="article-section doc-section"><h2>Primary references</h2><ol>
        <li>Chuang &amp; Nielsen, <a href="https://arxiv.org/abs/quant-ph/9610001">Prescription for experimental determination of the dynamics of a quantum black box</a>.</li>
        <li>Poyatos, Cirac &amp; Zoller, <a href="https://arxiv.org/abs/quant-ph/9611013">Complete characterization of a quantum process</a>.</li>
        <li>Blume-Kohout et al., <a href="https://arxiv.org/abs/1211.0322">Robust, self-consistent, closed-form tomography of quantum logic gates on a trapped ion qubit</a>.</li>
      </ol></section>`,
    steps: ["Fix a channel representation, basis normalization and computational subspace.", "Choose a spanning set of input states and an informationally complete output measurement; calibrate both independently if standard QPT is intended.", "Randomize input/measurement configurations in time and retain multinomial counts and calibration metadata.", "Build the linear observation map and inspect its rank, singular spectrum and condition number.", "Use linear inversion as a diagnostic, then solve the CPTP multinomial maximum-likelihood problem.", "Bootstrap complete circuits or use likelihood/posterior intervals that respect the channel boundary.", "Validate on held-out probe states and report representation conventions before comparing channels."],
    codeTitle: "Python pseudocode",
    codeSource: String.raw`design = build_probe_measurement_design(input_states, povms)
assert matrix_rank(design.A) == channel_parameter_count

counts = {}
for setting in rng.permutation(design.settings):
    counts[setting] = run(prepare(setting.rho) + channel + measure(setting.povm), shots)

def nll(J):
    p = {s: d * trace(kron(s.M, s.rho.T) @ J) for s in design.events}
    return -sum(counts[s] * log(clip(p[s])) for s in design.events)

J_hat = minimize_convex(nll, constraints=[J >> 0, partial_trace_out(J) == eye(d)/d])
validate_cptp(J_hat)
metrics = compare_to_target(J_hat, target_unitary)
uncertainty = bootstrap_by_circuit(counts, refit=J_hat)
report(J_hat, metrics, uncertainty, held_out_predictions(J_hat))`,
    description: "Use one declared Choi normalization throughout; factor-of-d errors otherwise propagate into probabilities and fidelities.",
    reports: ["Input states, POVMs, calibration provenance and ordering.", "Channel/Choi/PTM basis and normalization conventions.", "Counts, estimator objective, solver tolerances and uncertainty method.", "CPTP residuals, channel matrix, target metrics and held-out diagnostics."]
  },

  gst: {
    title: "Gate-set tomography",
    level: "Circuit level",
    kicker: "Self-consistent gate characterization",
    tags: ["SPAM-inclusive", "Gauge freedom", "Long-sequence GST"],
    summary: "Estimate preparations, gates and measurements self-consistently from structured circuits, while treating gauge freedom explicitly.",
    purpose: String.raw`
      <p>Gate-set tomography (GST) models an entire gate set \(\mathcal G=\{\rho,E,G_1,\ldots,G_K\}\) from circuit outcome probabilities. Unlike QPT, it does not assume perfectly known state preparation and measurement. Its output is a fitted gate-set model plus gauge-invariant predictions, fit diagnostics and a declared gauge optimization for human-readable comparison.</p>`,
    theory: String.raw`
      <h3>Liouville representation and gauge freedom</h3>
      <p>Represent a state as \(|\rho\rangle\!\rangle\), an effect as \(\langle\!\langle E|\), and each gate as a matrix. For circuit \(s=(i_1,\ldots,i_L)\),</p>
      <div class="equation">\[p_s=\langle\!\langle E|G_{i_L}\cdots G_{i_1}|\rho\rangle\!\rangle.\]</div>
      <p>For any invertible \(B\), the transformation</p>
      <div class="equation">\[|\rho\rangle\!\rangle\mapsto B|\rho\rangle\!\rangle,\quad \langle\!\langle E|\mapsto\langle\!\langle E|B^{-1},\quad G_k\mapsto BG_kB^{-1}\]</div>
      <p>leaves every circuit probability unchanged. Individual matrix entries are therefore gauge-dependent; observable probabilities and appropriately constructed model tests are not.</p>`,
    deepDive: String.raw`
      <section class="article-section doc-section"><h2>LGST and long-sequence amplification</h2>
        <p>Choose preparation fiducials \(F_i\) and measurement fiducials \(F_j\). The Gram matrix and gate-inserted matrices are</p>
        <div class="equation">\[\tilde I_{ij}=\langle\!\langle E|F_jF_i|\rho\rangle\!\rangle,\qquad (\tilde G_k)_{ij}=\langle\!\langle E|F_jG_kF_i|\rho\rangle\!\rangle.\]</div>
        <p>If the fiducials span state/effect space, linear inversion gives an initial estimate up to gauge, e.g. \(\hat G_k=\tilde I^{-1}\tilde G_k\) under one convention. Long-sequence GST then uses circuits \(F_j g^L F_i\), where short germs \(g\) are chosen so their repeated powers amplify every non-gauge parameter direction.</p>
        <p>Given outcome counts, the final model maximizes the multinomial likelihood subject to the selected physical parameterization. Compare its log likelihood with the saturated per-circuit model; statistically significant excess deviance signals model violation rather than mere parameter uncertainty.</p>
      </section>
      <section class="article-section doc-section"><h2>Key metrics</h2><div class="metric-grid">
        <div><strong>Likelihood/deviance</strong><span>global goodness of fit</span></div><div><strong>Wildcard or model-violation budget</strong><span>size of unmodeled behavior</span></div><div><strong>Gauge-invariant spectra</strong><span>decay and coherent modes</span></div><div><strong>Diamond/infidelity after declared gauge</strong><span>target comparison</span></div><div><strong>Fisher/Hessian spectrum</strong><span>identifiability and uncertainty</span></div><div><strong>Germ completeness</strong><span>amplification of non-gauge directions</span></div>
      </div></section>
      <section class="article-section doc-section"><h2>Failure modes and assumptions</h2><ul>
        <li><strong>Markovian stationarity:</strong> GST assumes one context-independent gate set. Drift and memory produce length-dependent tension and excess deviance.</li>
        <li><strong>Gauge misinterpretation:</strong> raw gate-matrix differences are not observable. Target metrics require a documented gauge-optimization objective.</li>
        <li><strong>Incomplete fiducials or germs:</strong> weak singular directions remain unidentifiable even if many circuits are collected.</li>
        <li><strong>Local minima and boundary effects:</strong> the joint likelihood is nonlinear; initialization, physical parameterization and solver convergence matter.</li>
        <li><strong>Leakage:</strong> a computational-subspace CPTP model cannot represent lost population or return from leakage space.</li>
        <li><strong>Circuit depth limits:</strong> contrast vanishes at large germ powers, while too-short powers fail to amplify small coherent errors.</li>
        <li><strong>Resource scaling:</strong> circuit count and model dimension grow quickly; reduced models trade completeness for tractability.</li>
      </ul></section>
      <section class="article-section doc-section"><h2>Primary references</h2><ol>
        <li>Blume-Kohout et al., <a href="https://arxiv.org/abs/1310.4492">Robust, self-consistent, closed-form tomography of quantum logic gates on a trapped ion qubit</a>.</li>
        <li>Blume-Kohout et al., <a href="https://arxiv.org/abs/1605.07674">Demonstration of qubit operations below a rigorous fault-tolerance threshold with gate set tomography</a>.</li>
        <li>Nielsen et al., <a href="https://arxiv.org/abs/2009.07301">Probing quantum processor performance with pyGSTi</a>.</li>
      </ol></section>`,
    steps: ["Declare the gate-set model, basis, outcome model, leakage scope and target operations.", "Design fiducials whose Gram matrix is full rank and well conditioned.", "Select germs and verify that their Jacobians amplify all non-gauge model directions.", "Generate fiducial–germ-power–fiducial circuits over geometrically increasing powers and randomize execution order.", "Use LGST for initialization, then perform staged maximum-likelihood fits as the maximum length increases.", "Gauge-optimize only for presentation or target comparison, recording the objective and weights.", "Compute deviance against a saturated model, inspect time/length structure, and report model violation separately from statistical uncertainty."],
    codeTitle: "Python pseudocode",
    codeSource: String.raw`circuits = []
for germ in germs:
    for L in [1, 2, 4, 8, 16, 32, 64]:
        for prep_fiducial in prep_fiducials:
            for meas_fiducial in meas_fiducials:
                circuits.append(prep_fiducial + repeat_to_length(germ, L) + meas_fiducial)

counts = execute_randomized(circuits, shots)
model = linear_gst_initialization(counts, fiducials)
for max_length in staged_max_lengths:
    model = maximize_multinomial_likelihood(model, counts.up_to(max_length), physical=True)

fit_report = compare_to_saturated_model(model, counts)
display_model = gauge_optimize(model, target, objective=declared_objective)
report(model, display_model, fit_report, germ_completeness(), uncertainty())`,
    description: "Retain the ungauge-optimized fitted model for prediction; the optimized representation is a documented view of the same probability model.",
    reports: ["Gate-set parameterization, basis, physical constraints and leakage scope.", "Fiducials, germs, powers, circuits, shots and execution order.", "Likelihood, staged convergence, uncertainty and saturated-model deviance.", "Gauge optimization objective plus gauge-invariant predictions and model-violation diagnostics."]
  }
});
