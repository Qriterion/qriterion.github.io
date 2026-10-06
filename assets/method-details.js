/* Long-form method notes are kept separate from the navigation shell so that
 * each article can be reviewed against its Markdown source independently. */
window.methodDetails = {
  qst: {
    title: "Quantum state tomography",
    level: "Circuit level",
    kicker: "State reconstruction",
    tags: ["Born-rule model", "Physical MLE", "Compressed sensing", "Worked example"],
    summary: "Reconstruct a density matrix from informationally complete measurements, while separating identifiability, physicality, statistical uncertainty and model assumptions.",
    purpose: String.raw`
      <p>Quantum state tomography (QST) estimates an unknown state \(\rho\) from repeated preparations and an informationally complete family of measurements. For \(n\) qubits, \(d=2^n\), and a physical estimate must satisfy</p>
      <div class="equation">\[\rho=\rho^\dagger,\qquad \rho\succeq0,\qquad \operatorname{Tr}\rho=1.\]</div>
      <p>The result is not just a fidelity. A reproducible output contains \(\hat\rho\), raw counts, measurement operators, acquisition order, reconstruction objective, uncertainty and model checks. Unless the measurement is independently calibrated, ordinary QST identifies the combined preparation–basis-change–readout experiment and cannot separate SPAM contributions.</p>`,
    theory: String.raw`
      <h3>Born rule and operator reconstruction</h3>
      <p>For setting \(s\), outcome \(b\), and POVM effect \(E_{b|s}\),</p>
      <div class="equation">\[p(b|s,\rho)=\operatorname{Tr}(E_{b|s}\rho),\qquad \hat p(b|s)=n_{b|s}/N_s.\]</div>
      <p>The Born rule is linear in \(\rho\). If the effects span the \(d\times d\) Hermitian operator space, their ideal probabilities uniquely determine the state. For qubits, Pauli strings form an orthogonal basis:</p>
      <div class="equation">\[\rho=\frac{1}{2^n}\sum_{P\in\{I,X,Y,Z\}^{\otimes n}}\langle P\rangle P,\qquad \langle P\rangle=\operatorname{Tr}(P\rho).\]</div>
      <p>Hardware measuring in the computational basis obtains \(X\) by applying \(H\), \(Y\) by applying \(S^\dagger\) then \(H\), and \(Z\) directly. A complete local-Pauli design uses \(3^n\) basis settings; bitstring parities provide all compatible marginal and correlation expectations.</p>
      <div class="theory-callout"><strong>Central tension:</strong> the observation map is linear, but positivity is a global matrix constraint. Linear inversion is transparent, yet finite-sample estimates can lie outside the physical state set.</div>`,
    deepDive: String.raw`
      <section class="article-section doc-section">
        <h2>Notation and the one-qubit case</h2>
        <div class="doc-table-wrap"><table class="doc-table"><thead><tr><th>Symbol</th><th>Meaning</th></tr></thead><tbody>
          <tr><td>\(d=2^n\)</td><td>Hilbert-space dimension</td></tr><tr><td>\(E_{b|s}\)</td><td>POVM effect for outcome \(b\) in setting \(s\)</td></tr>
          <tr><td>\(N_s,n_{b|s}\)</td><td>shots and outcome counts</td></tr><tr><td>\(\|A\|_2,\|A\|_*,\|A\|_\infty\)</td><td>Frobenius, nuclear and operator norms</td></tr>
        </tbody></table></div>
        <p>A one-qubit state has Bloch representation</p>
        <div class="equation">\[\rho=\tfrac12(I+r_xX+r_yY+r_zZ),\qquad \lambda_\pm=\frac{1\pm\|\mathbf r\|_2}{2}.\]</div>
        <p>Thus positivity is exactly \(\|\mathbf r\|_2\le1\). From \(+/-\) counts in each Pauli basis, \(\hat r_a=(n_{a,+}-n_{a,-})/N_a\). Shot noise can produce \(\|\hat{\mathbf r}\|_2>1\), hence a negative eigenvalue. MLE does not “repair quantum mechanics”; it finds the physical point that best explains all counts.</p>
      </section>

      <section class="article-section doc-section">
        <h2>Linear model, identifiability and conditioning</h2>
        <p>Choose traceless Hermitian orthonormal operators \(B_j\), and write</p>
        <div class="equation">\[\rho(\boldsymbol\theta)=I/d+\sum_{j=1}^{d^2-1}\theta_jB_j,\qquad \mathbf p=\mathbf c+A\boldsymbol\theta,\]</div>
        <p>where \(c_\mu=\operatorname{Tr}(E_\mu)/d\) and \(A_{\mu j}=\operatorname{Tr}(E_\mu B_j)\). Informational completeness requires \(\operatorname{rank}(A)=d^2-1\). Otherwise a nonzero traceless Hermitian \(\Delta\) exists in the null space and \(\rho\) and \(\rho+t\Delta\) are observationally indistinguishable.</p>
        <div class="derivation"><h3>Explicit least-squares objective</h3>
          <div class="equation">\[\hat{\boldsymbol\theta}_{\rm LS}=\arg\min_{\boldsymbol\theta}\|\hat{\mathbf p}-\mathbf c-A\boldsymbol\theta\|_2^2=A^+(\hat{\mathbf p}-\mathbf c).\]</div>
          <p>Full rank is not stability. With singular values \(\sigma_{\max},\sigma_{\min}\),</p>
          <div class="equation">\[\kappa(A)=\frac{\sigma_{\max}}{\sigma_{\min}},\qquad \|\delta\boldsymbol\theta\|_2\le\frac{1}{\sigma_{\min}(A)}\|\delta\mathbf p\|_2.\]</div>
          <p>Nearly collinear effects can be formally complete but amplify shot noise severely. Inspect the complete singular-value spectrum and the weighted/whitened design matrix, not only the number of settings.</p>
        </div>
      </section>

      <section class="article-section doc-section">
        <h2>Count likelihood and physical estimation</h2>
        <p>Within each setting the counts are multinomial:</p>
        <div class="equation">\[\Pr(\{n_{b|s}\}_b\mid\rho)=\frac{N_s!}{\prod_b n_{b|s}!}\prod_b[\operatorname{Tr}(E_{b|s}\rho)]^{n_{b|s}}.\]</div>
        <p>Dropping constants gives the physical maximum-likelihood program</p>
        <div class="equation">\[\boxed{\hat\rho_{\rm MLE}=\arg\min_{\rho\succeq0,\,\operatorname{Tr}\rho=1}-\sum_{s,b}n_{b|s}\log\operatorname{Tr}(E_{b|s}\rho)}.\]</div>
        <p>With fixed effects this is convex in \(\rho\). A Cholesky form \(\rho(T)=T^\dagger T/\operatorname{Tr}(T^\dagger T)\) enforces physicality, but makes the numerical parameterization nonconvex and redundant; direct semidefinite constraints are easier to audit when available.</p>
        <p>A Gaussian approximation yields weighted least squares,</p>
        <div class="equation">\[J_{\rm WLS}=\sum_k\frac{N_k[\hat f_k-f_k(\theta)]^2}{\hat f_k(1-\hat f_k)}.\]</div>
        <div class="doc-warning"><strong>Boundary warning.</strong> At \(\hat f_k=0\) or \(1\), the plug-in variance vanishes and WLS assigns infinite weight. The event is not uncertainty-free; the approximation failed. Hedge frequencies or, preferably, use the exact binomial/multinomial likelihood.</div>
        <h3>Bayesian alternative</h3>
        <div class="equation">\[p(\rho\mid D)\propto p(D\mid\rho)p_0(\rho),\qquad \hat\rho_{\rm BME}=\mathbb E[\rho\mid D].\]</div>
        <p>Sequential Monte Carlo approximates the posterior by \(\sum_iw_i\delta(\rho-\rho_i)\). Monitor \(N_{\rm eff}=1/\sum_iw_i^2\): a small value indicates particle collapse and makes credible regions sensitive to resampling and prior support.</p>
      </section>

      <section class="article-section doc-section">
        <h2>Compressed-sensing QST: complete derivation path</h2>
        <h3>1. Low-rank degrees of freedom</h3>
        <p>A rank-\(r\) state can be written \(XX^\dagger\), \(X\in\mathbb C^{d\times r}\). Removing the \(U(r)\) gauge and the trace degree gives</p>
        <div class="equation">\[\dim(\text{rank-}r\text{ states})=2dr-r^2-1=O(rd).\]</div>
        <p>This parameter count motivates fewer observations but is not itself a recovery guarantee.</p>
        <h3>2. Random Pauli sampling map</h3>
        <p>Let \(w_a\) be Pauli strings normalized by \(\operatorname{Tr}(w_aw_b)=d\delta_{ab}\). Sample \(A_1,\ldots,A_m\) uniformly and define</p>
        <div class="equation">\[\mathcal M(M)_i=\operatorname{Tr}(w_{A_i}M),\qquad \mathcal R(M)=\frac d m\sum_{i=1}^m w_{A_i}\operatorname{Tr}(w_{A_i}M).\]</div>
        <p>Pauli completeness immediately gives \(\mathbb E[\mathcal R(M)]=M\): \(\mathcal R\) is an unbiased random approximation to the identity map.</p>
        <h3>3. Rank minimization and its convex relaxation</h3>
        <p>The ideal problem minimizes rank subject to the measured expectations. Because rank minimization is combinatorial, replace the \(\ell_0\)-like count of nonzero singular values with their \(\ell_1\) norm:</p>
        <div class="equation">\[\boxed{\min_{\sigma=\sigma^\dagger}\|\sigma\|_*\quad\text{s.t.}\quad\operatorname{Tr}\sigma=1,\;\operatorname{Tr}(w_{A_i}\sigma)=y_i\ \forall i.}\]</div>
        <div class="doc-warning"><strong>Crucial implementation trap.</strong> Do not add both \(\sigma\succeq0\) and \(\operatorname{Tr}\sigma=1\) while claiming nuclear-norm regularization: every feasible PSD matrix then has \(\|\sigma\|_*=\operatorname{Tr}\sigma=1\). The objective is constant and the solver performs feasibility, not low-rank selection.</div>
        <h3>4. Why the convex program recovers the state</h3>
        <p>For support projector \(\Pi\), define the tangent space \(T=\{\Pi X+X\Pi-\Pi X\Pi:X=X^\dagger\}\). Every data-preserving perturbation obeys \(\mathcal R(\Delta)=0\), \(\operatorname{Tr}\Delta=0\), and decomposes as \(\Delta_T+\Delta_{T^\perp}\). The nuclear-norm subdifferential is</p>
        <div class="equation">\[\partial\|\rho\|_*=\{\Pi+W:P_TW=0,\ \|W\|_\infty\le1\}.\]</div>
        <div class="doc-grid two">
          <div class="doc-card"><h4>Large tangent component</h4><p>If \(\|\Delta_T\|_2>d^2\|\Delta_{T^\perp}\|_2\), the event \(\|P_T\mathcal RP_T-I_T\|_\infty&lt;1/2\) makes the sampling map injective on \(T\). The small orthogonal component cannot cancel it, contradicting \(\mathcal R\Delta=0\).</p></div>
          <div class="doc-card"><h4>Controlled tangent component</h4><p>If \(\|\Delta_T\|_2\le d^2\|\Delta_{T^\perp}\|_2\), construct a strict dual certificate \(Y\in\operatorname{range}\mathcal R\) with \(\|P_TY-\Pi\|_2\le1/(2d^2)\) and \(\|P_{T^\perp}Y\|_\infty&lt;1/2\). It forces every nonzero feasible perturbation to increase nuclear norm.</p></div>
        </div>
        <div class="equation">\[\|\rho+\Delta\|_*\ge\|\rho\|_*-\frac{\|\Delta_T\|_2}{2d^2}+\frac12\|\Delta_{T^\perp}\|_* > \|\rho\|_*.\]</div>
        <p>The golfing scheme constructs \(Y\) from independent measurement batches. With \(X_0=\Pi\), \(Y_i=\sum_{j=1}^i\mathcal R_jX_{j-1}\), and \(X_i=\Pi-P_TY_i\), each successful batch halves \(\|X_i\|_2\). Taking \(l=O(\log d)\) batches and a union bound gives the scaling</p>
        <div class="equation">\[m=cdr\log^2d\]</div>
        <p>with failure probability decreasing exponentially in the sampling constant. This is a probabilistic theorem under random-Pauli and low-rank assumptions, not a guarantee for arbitrary chosen settings.</p>
        <h3>5. Noise and approximate low rank</h3>
        <p>If \(\|\rho_t-\rho_r\|_2\le\varepsilon_1\) and \(\|\mathcal R\omega-\mathcal R\rho_t\|_2\le\varepsilon_2\), choose \(\varepsilon\ge\lambda\sqrt{d^2/m}\,\varepsilon_1+\varepsilon_2\) and solve</p>
        <div class="equation">\[\boxed{\sigma^*=\arg\min_{\sigma=\sigma^\dagger}\|\sigma\|_*\quad\text{s.t.}\quad\|\mathcal R\sigma-\mathcal R\omega\|_2\le\varepsilon.}\]</div>
        <p>The recovery result is \(\|\sigma^*-\rho_t\|_*=O(\varepsilon\sqrt{rd})\). Optimizer convergence cannot remove the model-mismatch term \(\varepsilon_1\). Also, \(m\) counts measured Pauli expectations, not state copies: each expectation still needs repeated shots. Since \(d=2^n\), \(O(rd\log^2d)\) remains exponential in qubit number.</p>
      </section>

      <section class="article-section doc-section">
        <h2>Choosing the estimator</h2>
        <div class="doc-table-wrap"><table class="doc-table"><thead><tr><th>Method</th><th>Objective</th><th>Strength</th><th>Main limitation</th></tr></thead><tbody>
          <tr><td>Linear inversion</td><td>\(\min_\theta\|\hat p-c-A\theta\|_2^2\)</td><td>Fast, transparent diagnostic</td><td>May be nonphysical; conditioning-sensitive</td></tr>
          <tr><td>Physical MLE</td><td>Exact count NLL with PSD and trace constraints</td><td>Physical estimate and correct count model</td><td>Boundary bias and model mismatch</td></tr>
          <tr><td>Bayesian</td><td>posterior \(\propto\) likelihood × prior</td><td>Uncertainty and adaptive design</td><td>Prior and particle approximation</td></tr>
          <tr><td>Compressed sensing</td><td>Nuclear norm under measurement tolerance</td><td>Fewer settings for low-rank states</td><td>Low-rank, random-design and noise-radius assumptions</td></tr>
        </tbody></table></div>
      </section>

      <section class="article-section doc-section">
        <h2>Worked example: the Bell state</h2>
        <p>Prepare \(|\Phi^+\rangle=(|00\rangle+|11\rangle)/\sqrt2\). Its stabilizer expectations are \(\langle XX\rangle=1\), \(\langle YY\rangle=-1\), \(\langle ZZ\rangle=1\), giving</p>
        <div class="equation">\[\rho_{\Phi^+}=\frac14(I\otimes I+X\otimes X-Y\otimes Y+Z\otimes Z).\]</div>
        <p>Measure the nine local bases \(\{X,Y,Z\}^{\otimes2}\), convert bitstring parity to Pauli expectations, reconstruct linearly as a diagnostic, then fit the exact multinomial MLE. Verify trace, Hermiticity, eigenvalues and held-out predictions before quoting Bell-state fidelity.</p>
      </section>

      <section class="article-section doc-section">
        <h2>Key metrics</h2>
        <div class="metric-grid">
          <div><strong>Identifiability</strong><span>rank, singular spectrum and \(\kappa(A)\)</span></div><div><strong>Physicality</strong><span>trace error, Hermiticity error, minimum eigenvalue</span></div>
          <div><strong>Fit quality</strong><span>multinomial NLL, deviance, residuals, held-out likelihood</span></div><div><strong>Target comparison</strong><span>fidelity, trace distance and observable error bars</span></div>
          <div><strong>State properties</strong><span>purity, entropy, spectrum and entanglement witnesses</span></div><div><strong>Resources</strong><span>settings, shots, total copies, runtime and memory</span></div>
        </div>
      </section>

      <section class="article-section doc-section">
        <h2>Failure modes and why they occur</h2>
        <div class="failure-list">
          <article class="failure-card"><h3>i.i.d. preparation fails</h3><p><strong>Cause:</strong> drift or history dependence makes samples come from \(\rho_t\), not one fixed \(\rho\). <strong>Symptom:</strong> time-correlated residuals and order-dependent estimates. <strong>Response:</strong> randomize settings, retain timestamps, repeat sentinels and report segment/time-averaged states.</p></article>
          <article class="failure-card"><h3>SPAM is not identifiable</h3><p>An unknown basis rotation can be attributed either to the state or the measurement axis. QST data alone cannot distinguish them. Independently calibrate effects, perform detector tomography/GST, or label the result as measurement-model dependent.</p></article>
          <article class="failure-card"><h3>Leakage, loss and post-selection</h3><p>Mapping leakage to a computational bit or discarding it changes the estimand. Report leakage/loss rates and whether \(\hat\rho\) is unconditional or conditioned on survival; propagate selection uncertainty.</p></article>
          <article class="failure-card"><h3>Rank deficiency versus ill-conditioning</h3><p>Rank deficiency means non-identifiability; full rank with tiny \(\sigma_{\min}\) means uniqueness but unstable inversion. These require different remedies: add independent effects versus redesign for better geometry.</p></article>
          <article class="failure-card"><h3>MLE boundary bias</h3><p>Near-pure estimates lie on the PSD boundary, truncating symmetric fluctuations. Small eigenvalues, purity, entropy and infidelity are biased; Hessian/Wilks approximations may fail. Use parametric bootstrap or calibrated likelihood regions.</p></article>
          <article class="failure-card"><h3>Compressed-sensing mismatch</h3><p>A high-rank state makes \(\varepsilon_1=\|\rho_t-\rho_r\|_2\) large; a nonrandom or coherent measurement design can violate recovery geometry. More optimizer iterations do not cure either error. Validate rank assumptions and add model-independent held-out Pauli checks.</p></article>
          <article class="failure-card"><h3>Exponential scaling remains</h3><p>Even \(O(rd\log^2d)\) is exponential in \(n\) because \(d=2^n\). Shadows and tensor-network tomography answer more structured questions under extra assumptions; they are not unconditional full-state reconstruction.</p></article>
        </div>
      </section>

      <section class="article-section doc-section references-section">
        <h2>Primary references</h2>
        <ol class="reference-list">
          <li>James et al., <em>Measurement of qubits</em>. <a href="https://arxiv.org/abs/quant-ph/0103121" rel="noopener noreferrer">arXiv:quant-ph/0103121</a></li>
          <li>Granade et al., <em>Practical Bayesian tomography</em>. <a href="https://arxiv.org/abs/1605.05039" rel="noopener noreferrer">arXiv:1605.05039</a></li>
          <li>Gross et al., <em>Quantum state tomography via compressed sensing</em>. <a href="https://arxiv.org/abs/0909.3304" rel="noopener noreferrer">arXiv:0909.3304</a></li>
        </ol>
      </section>`,
    steps: [
      "Declare the prepared object, qubit subspace, target state if any, and whether results are conditional on survival or post-selection.",
      "Freeze the measurement model: basis-change gates, calibrated POVM effects, bit ordering and readout mitigation policy.",
      "Generate an informationally complete design. For local Pauli QST use all 3ⁿ X/Y/Z settings; record any overcomplete, adaptive or random-Pauli rule and seed.",
      "Allocate shots using pilot variance and randomize or interleave acquisition order to expose drift.",
      "Execute identical state preparation followed only by the selected basis rotation; save raw per-setting counts, timestamps and calibration metadata.",
      "Convert counts to frequencies and parity expectations without discarding the original multinomial records.",
      "Run linear inversion first; inspect design rank, singular values, condition number, trace, Hermiticity and negative eigenvalues.",
      "Run physical MLE, Bayesian estimation or the correctly formulated compressed-sensing program; record objective value, convergence criteria and assumptions.",
      "Estimate uncertainty by resampling whole acquisition units or by posterior/likelihood regions; propagate it to nonlinear quantities such as fidelity and entropy.",
      "Validate against held-out settings, residuals, time segments and known observables; report the full reconstruction context rather than a lone fidelity."
    ],
    circuitHtml: `<svg viewBox="0 0 900 280" role="img" aria-label="Two-qubit state tomography circuit"><text x="15" y="82" fill="#40506a" font-size="18">q₀: |0⟩</text><text x="15" y="178" fill="#40506a" font-size="18">q₁: |0⟩</text><line x1="108" y1="76" x2="850" y2="76" stroke="#42536e" stroke-width="2"/><line x1="108" y1="172" x2="850" y2="172" stroke="#42536e" stroke-width="2"/><rect x="150" y="43" width="210" height="162" rx="9" fill="#eef0ff" stroke="#6547f4" stroke-width="2"/><text x="255" y="112" text-anchor="middle" fill="#263754" font-size="18" font-weight="700">state preparation</text><text x="255" y="140" text-anchor="middle" fill="#647089" font-size="15">U(θ) or target circuit</text><g fill="#edf9f7" stroke="#047b78" stroke-width="2"><rect x="455" y="46" width="120" height="60" rx="7"/><rect x="455" y="142" width="120" height="60" rx="7"/></g><text x="515" y="82" text-anchor="middle" fill="#263754" font-size="16" font-weight="700">Bₛ₀†</text><text x="515" y="178" text-anchor="middle" fill="#263754" font-size="16" font-weight="700">Bₛ₁†</text><path d="M710 42v68m-12-12 12 12 12-12M710 138v68m-12-12 12 12 12-12" stroke="#047b78" stroke-width="3" fill="none"/><text x="680" y="238" fill="#047b78" font-size="15" font-weight="700">Z measurement</text><text x="451" y="245" fill="#647089" font-size="14">sᵢ ∈ {X,Y,Z}; repeat every setting</text></svg>`,
    quantikzSource: String.raw`\begin{quantikz}
\lstick{|0\rangle} & \multigate{1}{U_{\rm prep}} & \gate{B_{s_0}^{\dagger}} & \meter{} \\
\lstick{|0\rangle} & \ghost{U_{\rm prep}}       & \gate{B_{s_1}^{\dagger}} & \meter{}
\end{quantikz}`,
    qasmSource: `OPENQASM 3.0;
include "stdgates.inc";

// Bell-state preparation followed by one tomography setting, X ⊗ Y.
qubit[2] q;
bit[2] c;
h q[0];
cx q[0], q[1];

// X measurement: H.  Y measurement: S† then H.
h q[0];
sdg q[1];
h q[1];

c[0] = measure q[0];
c[1] = measure q[1];`,
    description: "One Bell-state tomography circuit. Generate all nine local X/Y/Z basis choices and keep their raw counts; this single setting is only one member of the design.",
    reports: [
      "Prepared circuit, qubits, Hilbert-space/subspace definition, bit ordering and post-selection rule.",
      "Every POVM effect or basis-change implementation, information-completeness rank, singular spectrum and condition number.",
      "Per-setting shots, raw counts, acquisition order, timestamps, readout treatment and calibration context.",
      "Exact estimator and objective, physical constraints, prior or rank assumption, optimizer settings and convergence diagnostics.",
      "Estimated density matrix, eigenvalues, fit/deviance and held-out checks; fidelity or other derived metrics with uncertainty.",
      "Bootstrap/posterior construction, model failures, drift/leakage diagnostics and the scope of the reported state."
    ]
  },

  "interleaved-rb": {
    title: "Interleaved randomized benchmarking",
    level: "Circuit level",
    kicker: "Target-gate benchmarking",
    tags: ["Two-decay protocol", "Exact likelihood", "Theory interval", "Cluster bootstrap"],
    summary: "Estimate the average infidelity of a declared target gate by comparing matched reference and interleaved randomized-benchmarking decays—and keep statistical uncertainty separate from model uncertainty.",
    purpose: String.raw`
      <p>IRB compares a standard randomized-Clifford decay \(p_{\rm ref}\) with a decay \(p_{\rm int}\) obtained after inserting the target \(G\) after every random Clifford. Under the depolarizing composition model,</p>
      <div class="equation">\[r_G^{\rm est}=\frac{d-1}{d}\left(1-\frac{p_{\rm int}}{p_{\rm ref}}\right).\]</div>
      <p>The result belongs to the exact compiled target, qubits, reference ensemble, spectators, timing and calibration window. It is an average infidelity estimate—not a worst-case diamond error—and must be accompanied by both sampling uncertainty and the IRB theory interval.</p>`,
    theory: String.raw`
      <h3>Average fidelity and Clifford twirling</h3>
      <p>For target-referenced error channel \(\Lambda\), \(r(\Lambda)=1-F_{\rm avg}(\Lambda)\). It is related, but not equal, to worst-case error:</p>
      <div class="equation">\[\frac{d+1}{d}r\le\frac12\|\Lambda-\mathcal I\|_\diamond\le\sqrt{d(d+1)r}.\]</div>
      <p>Clifford twirling maps a trace-preserving channel to \(\mathcal D_p(\rho)=p\rho+(1-p)I/d\) while preserving average fidelity. Therefore</p>
      <div class="equation">\[r=\frac{d-1}{d}(1-p).\]</div>
      <p>Depolarizing parameters multiply under composition, \(\mathcal D_{p_2}\circ\mathcal D_{p_1}=\mathcal D_{p_1p_2}\), which produces the exponential RB decay.</p>
      <div class="theory-callout"><strong>SPAM is absorbed, not removed.</strong> Time- and depth-independent preparation, measurement and end-gate errors enter nuisance scale and offset parameters \(A\) and \(B\); drift or depth dependence can still bias the decay.</div>`,
    deepDive: String.raw`
      <section class="article-section doc-section">
        <h2>Reference and interleaved experiments</h2>
        <h3>Reference family</h3>
        <p>Sample \(C_1,\ldots,C_m\) uniformly from the declared Clifford group and append \(C_{\rm inv}^{\rm ref}=(C_m\cdots C_1)^{-1}\). Averaging over sequences gives</p>
        <div class="equation">\[\bar F_{\rm ref}(m)=A_{\rm ref}p_{\rm ref}^m+B_{\rm ref}.\]</div>
        <h3>Interleaved family</h3>
        <p>Use the same base sequence but insert \(G\) after each Clifford. With \(U_{\rm int}=(GC_m)\cdots(GC_1)\), append \(C_{\rm inv}^{\rm int}=U_{\rm int}^{-1}\) and fit</p>
        <div class="equation">\[\bar F_{\rm int}(m)=A_{\rm int}p_{\rm int}^m+B_{\rm int}.\]</div>
        <p>Depth \(m\) counts random Cliffords. An interleaved sequence contains \(m\) random Cliffords, \(m\) targets and one inverse; it is not a native pulse count.</p>
      </section>

      <section class="article-section doc-section">
        <h2>Ratio derivation and its assumption</h2>
        <p>If reference and target errors twirl to independent depolarizing channels, each composite layer has parameter \(p_Gp_{\rm ref}\), so</p>
        <div class="equation">\[p_{\rm int}=p_Gp_{\rm ref},\qquad r_G^{\rm est}=\frac{d-1}{d}\left(1-\frac{p_{\rm int}}{p_{\rm ref}}\right).\]</div>
        <div class="doc-warning"><strong>The ratio is model-based.</strong> In general \(\mathcal T(\Lambda_G\circ\Lambda_{\rm ref})\ne\mathcal T(\Lambda_G)\circ\mathcal T(\Lambda_{\rm ref})\). Coherent orientation, gate dependence and target–reference interaction can make the ratio differ from the isolated target depolarizing parameter.</div>
      </section>

      <section class="article-section doc-section">
        <h2>General-noise theory interval</h2>
        <p>The original IRB result bounds target infidelity around the ratio estimate:</p>
        <div class="equation">\[r_G\in[r_G^{\rm est}-E_{\rm IRB},\ r_G^{\rm est}+E_{\rm IRB}],\qquad E_{\rm IRB}=\min\{E_1,E_2\},\]</div>
        <div class="equation">\[E_1=\frac{d-1}{d}\left(\left|p_{\rm ref}-\frac{p_{\rm int}}{p_{\rm ref}}\right|+1-p_{\rm ref}\right),\]</div>
        <div class="equation">\[E_2=\frac{2(d^2-1)(1-p_{\rm ref})}{p_{\rm ref}d^2}+\frac{4\sqrt{1-p_{\rm ref}}\sqrt{d^2-1}}{p_{\rm ref}}.\]</div>
        <p>Intersect the interval with the CPTP range \(0\le r_G\le d/(d+1)\). For exactly depolarizing reference noise, \(E_{\rm IRB}=0\); for Pauli reference noise the first term of \(E_2\) is a tighter replacement.</p>
        <div class="doc-callout"><strong>Two uncertainties must be reported separately.</strong> \(E_{\rm IRB}\) bounds model contamination from the imperfect reference. Bootstrap, profile likelihood or covariance describes finite-data uncertainty. Neither substitutes for the other.</div>
      </section>

      <section class="article-section doc-section">
        <h2>Gate-dependent noise and the first-order model</h2>
        <p>Write each Clifford error as \(\Lambda_i=\Lambda+\delta\Lambda_i\). The zeroth-order model is a single exponential. Keeping first-order gate-dependence produces</p>
        <div class="equation">\[F^{(1)}(m)=A_1p^m+C_1(m-1)(q-p^2)p^{m-2}+B_1.\]</div>
        <p>With \(\gamma=|\mathcal C_n|^{-1}\sum_i\|\delta\Lambda_i\|\), a sufficient perturbative condition is \(\gamma^2\ll2/[m(m+1)]\). The admissible gate dependence shrinks with maximum depth. Adding a first-order fit term does not validate a badly violated perturbation expansion; structured residuals should downgrade the result to model mismatch.</p>
      </section>

      <section class="article-section doc-section">
        <h2>Explicit count likelihood</h2>
        <p>For family \(f\in\{\mathrm{ref},\mathrm{int}\}\), sequence \(k\), depth \(m\), shots \(N_{fmk}\) and successes \(y_{fmk}\), set \(q_f(m)=A_fp_f^m+B_f\). The joint binomial negative log-likelihood is</p>
        <div class="equation">\[\boxed{\mathcal L(\Theta)=-\sum_{f,m,k}\left[y_{fmk}\log q_f(m)+(N_{fmk}-y_{fmk})\log(1-q_f(m))\right]},\]</div>
        <div class="equation">\[\hat\Theta=\arg\min_\Theta\mathcal L(\Theta),\quad \Theta=(A_{\rm ref},B_{\rm ref},p_{\rm ref},A_{\rm int},B_{\rm int},p_{\rm int}),\quad0<q_f(m)<1.\]</div>
        <p>Weak-noise fits usually constrain \(0<p_f<1\), although the full depolarizing CPTP range is \(-1/(d^2-1)\le p_f\le1\). A negative fitted decay is primarily a prompt to inspect data and model validity.</p>
        <div class="doc-warning"><strong>Avoid pseudo-replication.</strong> Different random sequences at a fixed depth have different latent survival probabilities. Shots within one circuit are a cluster. Pooling every shot as an i.i.d. binomial sample underestimates sequence-sampling uncertainty; resample whole paired sequences or use a hierarchical model.</div>
      </section>

      <section class="article-section doc-section">
        <h2>Sequence variance and experimental allocation</h2>
        <p>If \(K_m\) sequences have latent variance \(\sigma_m^2\), then approximately</p>
        <div class="equation">\[\operatorname{Var}(\hat{\bar F}_m)\approx\frac{\sigma_m^2}{K_m}+\frac1{K_m^2}\sum_{k=1}^{K_m}\frac{F_{mk}(1-F_{mk})}{N_{mk}}.\]</div>
        <p>More shots reduce only the second term; more independent random sequences reduce the first. For time- and gate-independent noise, a general bound is \(\sigma_m^2\le4d(d+1)mr+O(m^2r^2d^4)\). A variance-sensitive finite-sample design may use</p>
        <div class="equation">\[K_m\ge-\frac{\log(2/\delta)}{\log H(\epsilon,\sigma_m^2)},\quad H(\epsilon,v)=\left(\frac1{1-\epsilon}\right)^{\frac{1-\epsilon}{v+1}}\left(\frac v{v+\epsilon}\right)^{\frac{v+\epsilon}{v+1}}.\]</div>
        <p>Use pilot upper bounds for unknown variance, then refine. Preserve the pairing between reference and interleaved records through acquisition and bootstrap.</p>
      </section>

      <section class="article-section doc-section">
        <h2>Uncertainty propagation</h2>
        <p>Let \(c=(d-1)/d\). For \(r_G=c(1-p_{\rm int}/p_{\rm ref})\),</p>
        <div class="equation">\[\frac{\partial r_G}{\partial p_{\rm int}}=-\frac c{p_{\rm ref}},\qquad \frac{\partial r_G}{\partial p_{\rm ref}}=c\frac{p_{\rm int}}{p_{\rm ref}^2},\qquad \operatorname{Var}(\hat r_G)\approx\nabla r_G^\mathsf T\Sigma\nabla r_G.\]</div>
        <p>Reference and interleaved estimates can be correlated through paired seeds, shared drift and compiler state. A paired cluster bootstrap usually preserves these dependencies better than propagating two independent standard errors.</p>
      </section>

      <section class="article-section doc-section">
        <h2>Worked example: single-qubit \(X_{\pi/2}\)</h2>
        <p>Suppose a joint fit gives \(p_{\rm ref}=0.9900\) and \(p_{\rm int}=0.9850\). With \(d=2\),</p>
        <div class="equation">\[r_G^{\rm est}=\frac12\left(1-\frac{0.9850}{0.9900}\right)\approx2.53\times10^{-3}.\]</div>
        <p>This number is not complete until the cluster-bootstrap interval, \(E_1/E_2\) theory interval, curve residuals, sequence distribution and compiled definition of \(X_{\pi/2}\) are attached.</p>
      </section>

      <section class="article-section doc-section">
        <h2>Key metrics</h2>
        <div class="metric-grid">
          <div><strong>Decay</strong><span>\(p_{\rm ref}\), \(p_{\rm int}\), ratio and \(r_G^{\rm est}\)</span></div><div><strong>Model bound</strong><span>\(E_1\), \(E_2\), clipped IRB interval</span></div>
          <div><strong>Fit quality</strong><span>binomial NLL, residuals, held-out score, boundary/failure rate</span></div><div><strong>Sequence spread</strong><span>per-depth variance, quantiles and outliers</span></div>
          <div><strong>SPAM</strong><span>\(A_f\), \(B_f\), asymptotic plateau and drift</span></div><div><strong>Resources</strong><span>depths, sequences/depth, shots/sequence, native gates and wall time</span></div>
        </div>
      </section>

      <section class="article-section doc-section">
        <h2>Failure modes and why they occur</h2>
        <div class="failure-list">
          <article class="failure-card"><h3>Gate-dependent reference noise</h3><p>Different Clifford decompositions contain different pulses and coherent errors, violating one common reference channel. Residual curvature or sequence-dependent spread follows. Compare zero/first-order fits, inspect decomposition dependence and shorten the claimed scope.</p></article>
          <article class="failure-card"><h3>Target–reference interaction</h3><p>The target can rotate coherent reference error rather than compose as an independent depolarizing channel. The decay ratio then is not the isolated target parameter. Report \(E_{\rm IRB}\), use alternative compilations and compare with cycle benchmarking/GST when needed.</p></article>
          <article class="failure-card"><h3>Drift and non-Markovian noise</h3><p>A single stationary channel no longer describes all layers or timestamps. Randomize acquisition, pair families closely, add sentinels and perform time-block analysis.</p></article>
          <article class="failure-card"><h3>Coherent errors and heavy-tailed sequences</h3><p>Some Clifford words align coherent rotations and fail far more strongly than average. Means and Gaussian error bars can hide this. Keep per-sequence data, quantiles and cluster bootstrap results.</p></article>
          <article class="failure-card"><h3>Leakage and multi-exponential decay</h3><p>Population outside the computational subspace adds slow return modes and shifts the plateau. Measure leakage outcomes where possible and fit/report a leakage-aware model rather than forcing one exponential.</p></article>
          <article class="failure-card"><h3>Depth-dependent inverse</h3><p>The inverse is compiled from a depth-dependent Clifford and is not a free ideal operation. Compilation differences can contaminate the decay. Record inverse native counts and use stable compilation rules.</p></article>
          <article class="failure-card"><h3>Shallow decay and non-identifiability</h3><p>If all depths have nearly equal survival, \(A,B,p\) trade off and the ratio becomes unstable. Pilot a range that reveals curvature and retain shallow points to constrain SPAM.</p></article>
          <article class="failure-card"><h3>Compiler and context redefine the object</h3><p>Pulse decomposition, routing, spectator activity and scheduling determine the implemented target. A number from one context does not transfer automatically to another; report the compiled object and parallel workload.</p></article>
          <article class="failure-card"><h3>Non-Clifford target gate</h3><p>The usual inverse need not remain Clifford. Naive replacement changes the protocol. Use a justified generalized interleaving construction or a different benchmark and state the theorem being used.</p></article>
        </div>
      </section>

      <section class="article-section doc-section references-section">
        <h2>Primary references</h2>
        <ol class="reference-list">
          <li>Magesan et al., <em>Efficient measurement of quantum gate error by interleaved randomized benchmarking</em>. <a href="https://arxiv.org/abs/1203.4550" rel="noopener noreferrer">arXiv:1203.4550</a></li>
          <li>Magesan et al., <em>Characterizing quantum gates via randomized benchmarking</em>. <a href="https://arxiv.org/abs/1109.6887" rel="noopener noreferrer">arXiv:1109.6887</a></li>
          <li>Wallman and Flammia, <em>Randomized benchmarking with confidence</em>. <a href="https://arxiv.org/abs/1404.6025" rel="noopener noreferrer">arXiv:1404.6025</a></li>
        </ol>
      </section>`,
    steps: [
      "Declare the exact target: logical Clifford, compiled native gate or pulse; fix qubits, spectators, duration and reported estimand.",
      "Freeze the reference Clifford ensemble, sampling distribution, native decomposition, optimization passes, timing and inverse compilation rule.",
      "Use pilot data to select depths that include shallow points, visible decay and a region approaching—but not dominated by—the plateau.",
      "Allocate independent sequences per depth and shots per sequence; prioritize more sequences when sequence variance dominates.",
      "Generate paired base Clifford sequences. Build both reference and interleaved circuits from each seed so the bootstrap can preserve correlation.",
      "Calculate the correct inverse separately for each family and verify the post-compilation ideal unitary or stabilizer action.",
      "Randomize execution over family, depth and sequence while keeping paired circuits temporally close enough to share drift.",
      "Store circuit-level successes, shots, seed, logical sequence, compiled circuit, inverse, native counts, timestamps and calibration snapshot.",
      "Compute per-sequence survival and inspect distributions before aggregating depth means.",
      "Jointly fit both count datasets with the constrained binomial likelihood; compare with a first-order model when residuals require it.",
      "Compute the ratio estimate and the E₁/E₂ model interval; clip only the reported physical interval, never silently alter the raw estimate.",
      "Run a paired cluster bootstrap that resamples whole base sequences and refits both families; record boundary and fit failures.",
      "Inspect residuals, sequence heavy tails, drift, leakage, inverse cost and depth/family order effects.",
      "Report the compiled benchmark object, both decays, nuisance parameters, statistical interval, theory interval and every scope limitation."
    ],
    circuitHtml: `<svg viewBox="0 0 900 300" role="img" aria-label="Reference and interleaved randomized benchmarking circuits"><text x="12" y="72" fill="#40506a" font-size="16" font-weight="700">reference</text><text x="12" y="209" fill="#40506a" font-size="16" font-weight="700">interleaved</text><line x1="112" y1="67" x2="855" y2="67" stroke="#42536e" stroke-width="2"/><line x1="112" y1="204" x2="855" y2="204" stroke="#42536e" stroke-width="2"/><g fill="#eef0ff" stroke="#6547f4" stroke-width="2"><rect x="150" y="38" width="76" height="58" rx="6"/><rect x="280" y="38" width="76" height="58" rx="6"/><rect x="410" y="38" width="76" height="58" rx="6"/><rect x="590" y="30" width="150" height="74" rx="6"/><rect x="150" y="175" width="64" height="58" rx="6"/><rect x="310" y="175" width="64" height="58" rx="6"/><rect x="470" y="175" width="64" height="58" rx="6"/><rect x="630" y="167" width="110" height="74" rx="6"/></g><g fill="#edf9f7" stroke="#047b78" stroke-width="2"><rect x="225" y="175" width="64" height="58" rx="6"/><rect x="385" y="175" width="64" height="58" rx="6"/><rect x="545" y="175" width="64" height="58" rx="6"/></g><g fill="#263754" font-size="15" font-weight="700" text-anchor="middle"><text x="188" y="73">C₁</text><text x="318" y="73">C₂</text><text x="448" y="73">Cₘ</text><text x="665" y="62">inverse</text><text x="665" y="84">ref</text><text x="182" y="210">C₁</text><text x="257" y="210">G</text><text x="342" y="210">C₂</text><text x="417" y="210">G</text><text x="502" y="210">Cₘ</text><text x="577" y="210">G</text><text x="685" y="197">inverse</text><text x="685" y="219">int</text></g><path d="M800 30v74m-11-11 11 11 11-11M800 167v74m-11-11 11 11 11-11" stroke="#047b78" stroke-width="3" fill="none"/><text x="366" y="278" text-anchor="middle" fill="#647089" font-size="14">same base Clifford seed; family-specific ideal inverse</text></svg>`,
    quantikzSource: String.raw`\begin{quantikz}
\lstick{\rm ref} & \gate{C_1} & \gate{C_2} & \qw & \gate{C_m} & \gate{(C_m\cdots C_1)^{-1}} & \meter{} \\
\lstick{\rm int} & \gate{C_1} & \gate{G} & \gate{C_2} & \gate{G} & \qw & \gate{C_m} & \gate{G} & \gate{U_{\rm int}^{-1}} & \meter{}
\end{quantikz}`,
    qasmSource: `OPENQASM 3.0;
include "stdgates.inc";

// One illustrative single-qubit IRB member.
// G = sx is inserted after every sampled Clifford block.
qubit[1] q;
bit[1] c;

// C1; G; C2; G. Replace with compiler-recorded decompositions.
h q[0];
sx q[0];
s q[0];
h q[0];
sx q[0];

// Family-specific inverse, calculated from the ideal interleaved product.
// Placeholder decomposition for illustration only.
sdg q[0];
h q[0];

c[0] = measure q[0];`,
    description: "Illustrative interleaved member only. A valid dataset needs many fixed-seed random base sequences at every depth, paired reference circuits, and an exactly verified family-specific inverse.",
    reports: [
      "Exact target gate/pulse, qubits, spectator state, duration, scheduling context and calibration window.",
      "Reference ensemble and sampler, compiler/version/options, native decomposition and inverse-gate cost.",
      "Depths, independent sequences per depth, shots per sequence, seeds, acquisition order and raw circuit-level counts.",
      "Aref, Bref, pref, Aint, Bint and pint with likelihood, constraints, residuals and alternative-model checks.",
      "Ratio estimate, paired cluster-bootstrap interval and fit-failure rate, plus E1, E2 and the physical theory interval separately.",
      "Sequence variance/quantiles, drift, leakage, crosstalk and every condition under which the number should not be transferred."
    ]
  }
};
