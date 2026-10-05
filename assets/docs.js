const qasm = {
  rb: `OPENQASM 3.0;
include "stdgates.inc";

// One single-qubit RB instance and its compiled inverse.
qubit[1] q;
bit[1] c;

// Random Clifford decomposition C_1 C_2
h q[0];
s q[0];
h q[0];

// Compiled inverse: (C_2 C_1)^(-1)
h q[0];
sdg q[0];
h q[0];

c[0] = measure q[0];`,
  rabi: `OPENQASM 3.0;
include "stdgates.inc";

// Replace 0.785398 with each pulse area in a sweep.
qubit[1] q;
bit[1] c;
rx(0.785398) q[0];
c[0] = measure q[0];`,
  ramsey: `OPENQASM 3.0;
include "stdgates.inc";

// Replace 200ns with each delay.
qubit[1] q;
bit[1] c;
sx q[0];
delay[200ns] q[0];
rz(0.314159) q[0];
sx q[0];
c[0] = measure q[0];`,
  cycle: `OPENQASM 3.0;
include "stdgates.inc";

// Educational one-qubit cycle-benchmarking instance.
qubit[1] q;
bit[1] c;
h q[0];
x q[0];
x q[0];
x q[0];
x q[0];
h q[0];
c[0] = measure q[0];`,
  qv: `OPENQASM 3.0;
include "stdgates.inc";

// A small portable square-circuit example.
qubit[2] q;
bit[2] c;
h q[0];
h q[1];
cx q[0], q[1];
rz(0.628319) q[1];
cx q[1], q[0];
sx q[0];
c[0] = measure q[0];
c[1] = measure q[1];`,
};

const quantikz = {
  rb: String.raw`\begin{quantikz}
\lstick{|0\rangle} & \gate{C_1} & \gate{C_2} & \qw & \gate{C_m} & \gate{(C_m\cdots C_1)^{-1}} & \meter{}
\end{quantikz}`,
  rabi: String.raw`\begin{quantikz}
\lstick{|0\rangle} & \gate{R_{\phi}(\Omega t_j)} & \meter{}
\end{quantikz}`,
  ramsey: String.raw`\begin{quantikz}
\lstick{|0\rangle} & \gate{X_{\pi/2}} & \qw\!\!\!\qw^{t_j} & \gate{X_{\pi/2}(\phi)} & \meter{}
\end{quantikz}`,
  cycle: String.raw`\begin{quantikz}
\lstick{|+_P\rangle} & \gate{\mathcal P_1} & \gate{G} & \gate{\mathcal P_2} & \gate{G} & \qw & \meter{P}
\end{quantikz}`,
  qv: String.raw`\begin{quantikz}
\lstick{|0\rangle} & \gate{SU(4)} & \ctrl{1} & \gate{SU(4)} & \meter{} \\
\lstick{|0\rangle} & \gate{SU(4)} & \targ{} & \gate{SU(4)} & \meter{}
\end{quantikz}`,
};

const diagram = {
  rb: `<svg viewBox="0 0 900 170" role="img" aria-label="Randomized benchmarking circuit"><text x="15" y="91" fill="#40506a" font-size="18">q₀: |0⟩</text><line x1="110" y1="85" x2="845" y2="85" stroke="#42536e" stroke-width="2"/><g fill="#eef0ff" stroke="#6547f4" stroke-width="2"><rect x="150" y="55" width="82" height="60" rx="6"/><rect x="280" y="55" width="82" height="60" rx="6"/><rect x="410" y="55" width="82" height="60" rx="6"/><rect x="545" y="43" width="180" height="84" rx="6"/></g><g fill="#263754" font-size="17" font-weight="700" text-anchor="middle"><text x="191" y="91">C₁</text><text x="321" y="91">C₂</text><text x="451" y="91">Cₘ</text><text x="635" y="79">compiled</text><text x="635" y="103">inverse</text></g><path d="M780 48v74m-12-12 12 12 12-12" stroke="#047b78" stroke-width="3" fill="none"/><text x="758" y="148" fill="#047b78" font-size="15" font-weight="700">measure</text><text x="417" y="35" fill="#647089" font-size="15">random Clifford sequence</text></svg>`,
  rabi: `<svg viewBox="0 0 900 170" role="img" aria-label="Rabi sweep circuit"><text x="15" y="91" fill="#40506a" font-size="18">q₀: |0⟩</text><line x1="110" y1="85" x2="835" y2="85" stroke="#42536e" stroke-width="2"/><rect x="275" y="47" width="245" height="76" rx="7" fill="#eef0ff" stroke="#6547f4" stroke-width="2"/><text x="397" y="79" text-anchor="middle" fill="#263754" font-size="17" font-weight="700">Rφ(Ωtⱼ)</text><text x="397" y="103" text-anchor="middle" fill="#647089" font-size="14">sweep amplitude or duration</text><path d="M760 48v74m-12-12 12 12 12-12" stroke="#047b78" stroke-width="3" fill="none"/><text x="738" y="148" fill="#047b78" font-size="15" font-weight="700">measure Z</text></svg>`,
  ramsey: `<svg viewBox="0 0 900 170" role="img" aria-label="Ramsey circuit"><text x="15" y="91" fill="#40506a" font-size="18">q₀: |0⟩</text><line x1="110" y1="85" x2="835" y2="85" stroke="#42536e" stroke-width="2"/><g fill="#eef0ff" stroke="#6547f4" stroke-width="2"><rect x="190" y="55" width="92" height="60" rx="6"/><rect x="570" y="55" width="112" height="60" rx="6"/></g><text x="236" y="92" text-anchor="middle" fill="#263754" font-size="16" font-weight="700">Xπ/2</text><text x="626" y="92" text-anchor="middle" fill="#263754" font-size="16" font-weight="700">Xπ/2(φ)</text><path d="M330 85c20-28 40 28 60 0s40 28 60 0 40 28 60 0" fill="none" stroke="#0b968c" stroke-width="3"/><text x="450" y="49" text-anchor="middle" fill="#647089" font-size="15">free evolution tⱼ</text><path d="M760 48v74m-12-12 12 12 12-12" stroke="#047b78" stroke-width="3" fill="none"/><text x="738" y="148" fill="#047b78" font-size="15" font-weight="700">measure Z</text></svg>`,
  cycle: `<svg viewBox="0 0 900 170" role="img" aria-label="Cycle benchmarking circuit"><text x="8" y="91" fill="#40506a" font-size="18">q₀…qₙ: |+P⟩</text><line x1="145" y1="85" x2="845" y2="85" stroke="#42536e" stroke-width="2"/><g fill="#edf9f7" stroke="#047b78" stroke-width="2"><rect x="185" y="55" width="92" height="60" rx="6"/><rect x="445" y="55" width="92" height="60" rx="6"/></g><g fill="#eef0ff" stroke="#6547f4" stroke-width="2"><rect x="315" y="45" width="95" height="80" rx="6"/><rect x="575" y="45" width="95" height="80" rx="6"/></g><g fill="#263754" font-size="16" font-weight="700" text-anchor="middle"><text x="231" y="91">P₁</text><text x="362" y="91">G</text><text x="491" y="91">P₂</text><text x="622" y="91">G</text></g><text x="495" y="34" text-anchor="middle" fill="#647089" font-size="15">repeat m times with randomized compiling</text><path d="M760 48v74m-12-12 12 12 12-12" stroke="#047b78" stroke-width="3" fill="none"/><text x="710" y="148" fill="#047b78" font-size="15" font-weight="700">measure Pauli P</text></svg>`,
  qv: `<svg viewBox="0 0 900 210" role="img" aria-label="Quantum-volume-style square circuit"><text x="15" y="73" fill="#40506a" font-size="18">q₀: |0⟩</text><text x="15" y="153" fill="#40506a" font-size="18">q₁: |0⟩</text><line x1="110" y1="67" x2="835" y2="67" stroke="#42536e" stroke-width="2"/><line x1="110" y1="147" x2="835" y2="147" stroke="#42536e" stroke-width="2"/><g fill="#eef0ff" stroke="#6547f4" stroke-width="2"><rect x="180" y="37" width="110" height="60" rx="6"/><rect x="440" y="37" width="110" height="60" rx="6"/><rect x="180" y="117" width="110" height="60" rx="6"/><rect x="440" y="117" width="110" height="60" rx="6"/></g><g fill="#263754" font-size="16" font-weight="700" text-anchor="middle"><text x="235" y="73">SU(4)</text><text x="495" y="73">SU(4)</text><text x="235" y="153">SU(4)</text><text x="495" y="153">SU(4)</text></g><line x1="365" y1="67" x2="365" y2="147" stroke="#047b78" stroke-width="3"/><circle cx="365" cy="67" r="7" fill="#047b78"/><circle cx="365" cy="147" r="13" fill="#fff" stroke="#047b78" stroke-width="3"/><path d="M760 30v54m-10-10 10 10 10-10M760 110v54m-10-10 10 10 10-10" stroke="#047b78" stroke-width="3" fill="none"/></svg>`,
};

const methods = {
  "standard-rb": { title:"Standard randomized benchmarking", level:"Circuit level", kicker:"Randomized benchmarking", tags:["Executed tutorial","Single-qubit example","Fit model"], summary:"Estimate average error per compiled Clifford while absorbing leading state-preparation and measurement effects into nuisance parameters.", purpose:"<p>The primary output is a decay parameter <i>f</i>, plus its conversion to entanglement fidelity, average gate fidelity and average gate infidelity. It is a statement about the declared compiled-Clifford ensemble—not automatically a native-gate error.</p>", theory:`<p>Random Cliffords form a unitary 2-design. Under the usual gate-independent, Markovian approximation, averaging over that ensemble twirls the effective error channel into a depolarizing channel with one nontrivial polarization parameter <i>f</i>.</p><span class="equation">D<sub>f</sub>(ρ) = fρ + (1 − f) I/d</span><p>Each additional randomized layer composes the same twirled channel once more, so its polarization becomes <i>f</i><sup>m</sup>. Imperfect preparation and measurement become the free scale and offset parameters <i>A</i> and <i>B</i>.</p><span class="equation">p̄(m) = A f<sup>m</sup> + B</span><p>For dimension <i>d</i>, convert a fitted polarization through F<sub>e</sub> = [1 + (d² − 1)f] / d² and F<sub>avg</sub> = (dF<sub>e</sub> + 1)/(d + 1). Curvature or multiple rates indicate leakage, drift, correlations or failed assumptions.</p><div class="theory-callout"><strong>Why the exponential:</strong> it follows from repeatedly composing one effective depolarizing channel after randomization—not from a generic curve imposed on arbitrary survival data.</div>`, steps:["Choose 6–10 depths spanning visible decay; use pilot data before committing shots.","At each depth sample random Clifford sequences, compile behind a fixed barrier, and calculate the final inverse.","Execute sequences in interleaved or randomized depth order; preserve per-circuit raw counts.","Fit the binomial likelihood or weighted average to A fᵐ + B.","Bootstrap circuits and shots; report compiler, depth range, residuals and uncertainty."], circuit:"rb", code:"rb", description:"A compact portable instance: a random Clifford decomposition followed by its compiled inverse.", reports:["Exact Clifford/native decomposition and compiler settings.","Depths, random sequences, shots, acquisition order and qubit subset.","A, B and f with uncertainty, circuit spread and residual diagnostics.","Error per compiled Clifford, not an unqualified native-gate error."] },
  rabi: { title:"Rabi oscillations", level:"Qubit level", kicker:"Calibration", tags:["Pulse calibration","Sweep experiment"], summary:"Calibrate a π or π/2 rotation, estimate an effective Rabi frequency, and diagnose low contrast or off-axis control.", purpose:"<p>Fit a driven population oscillation to obtain a pulse area. Validate it with Ramsey, RPE, RB or GST before calling the operation high fidelity.</p>", theory:`<p>On resonance, a driven two-level system rotates about an equatorial Bloch-sphere axis with angle Ωt. Z-basis measurement converts that rotation to a sinusoidal population. Finite contrast, readout offset and noise produce an envelope.</p><span class="equation">P<sub>1</sub>(t) = c + a e<sup>−t/T<sub>R</sub></sup> cos(2πf<sub>R</sub>t + φ)</span><p>The cosine follows coherent rotation; the envelope is contrast loss during the sweep. Use a different envelope if residuals demand it.</p><div class="theory-callout"><strong>Fit meaning:</strong> an extremum fixes a rotation area; it does not by itself estimate gate fidelity.</div>`, steps:["Start from spectroscopy and choose a conservative drive with visible oscillations.","Sweep 30–100 durations at fixed amplitude, or amplitudes at fixed duration.","Acquire counts and uncertainty at every point; inspect contrast before fitting.","Fit a suitable damped sinusoid and select the desired rotation area.","Confirm in a short independent scan and check detuning if contrast is poor."], circuit:"rabi", code:"rabi", description:"Replace the rotation angle with each calibrated amplitude or duration point.", reports:["Drive frequency, pulse envelope, phase and sweep grid.","Fit model, selected calibration point, uncertainty and residuals.","Readout treatment, drift and leakage observations."] },
  ramsey: { title:"Ramsey spectroscopy and T₂*", level:"Qubit level", kicker:"Frequency and dephasing", tags:["Detuning calibration","Free precession"], summary:"Estimate residual drive detuning and inhomogeneous dephasing from phase accumulated during a controlled idle.", purpose:"<p>The fit returns fringe frequency and an envelope time T₂*. With known artificial detunings, the fringe-frequency vertex refines the qubit-drive resonance.</p>", theory:`<p>The first Xπ/2 creates a transverse superposition. During an idle <i>t</i>, detuning Δ accumulates phase Δt; the second pulse projects that phase into population. Slow fluctuations reduce the fringe envelope.</p><span class="equation">P<sub>1</sub>(t) = c + a e<sup>−t/T₂*</sup> cos(2πf<sub>fringe</sub>t + φ)</span><p>The oscillation is phase interference; the envelope is a coherence model. Use a Gaussian or stretched exponential if it better describes the data.</p><div class="theory-callout"><strong>Interpret carefully:</strong> T₂* includes slow noise and is not the irreversible coherence time measured by echo.</div>`, steps:["Select delays spanning several fringes and a visible envelope decay.","Use known artificial detunings when natural fringes are too slow.","Randomize timing order to distribute drift.","Fit frequency, phase and envelope jointly; retain residual detuning.","Update the drive and rerun a short confirmation scan."], circuit:"ramsey", code:"ramsey", description:"A portable Ramsey-style sequence; sweep the delay instruction.", reports:["Drive frequency and intentional detuning, pulse phases and delay grid.","Envelope model, fringe frequency, T₂* and uncertainty.","Drift checks or interleaved repeat scans."] },
  "cycle-benchmarking": { title:"Cycle benchmarking", level:"Circuit level", kicker:"Parallel-cycle characterization", tags:["Executed minimal tutorial","Pauli decays","Spectator-aware"], summary:"Estimate dressed-cycle fidelity and Pauli-resolved decay for a declared parallel cycle, including spectator idles and scheduling context.", purpose:"<p>The output is a family of Pauli decay parameters f<sub>P</sub> and an aggregate dressed-cycle polarization or fidelity. A two-qubit operation without normally idle neighbors is not the same experimental object.</p>", theory:`<p>Randomized Pauli compiling turns the selected Pauli component into a measurable channel-eigenvalue decay. Prepare a +1 eigenstate of <i>P</i>, repeat randomized versions of the cycle, then measure the final observable.</p><span class="equation">⟨P<sub>out</sub>⟩<sub>m</sub> ≈ A<sub>P</sub> f<sub>P</sub><sup>m</sup></span><p>Each dressed cycle acts on that Pauli component with approximately the same eigenvalue f<sub>P</sub>, so composition multiplies it. A<sub>P</sub> collects preparation and measurement contrast.</p><div class="theory-callout"><strong>Scope:</strong> the fit describes the complete declared cycle, randomized-compiling rule and spectator context—not a universal gate score.</div>`, steps:["Define every gate, idle, duration, spectator and native compilation in the target cycle.","Select Pauli observables and prepare their +1 eigenstates.","Compile random Pauli layers and corrections so the final ideal observable is known.","Measure expectations over randomizations and depths; fit each Pauli decay.","Report individual fP values, aggregate rule and uncertainty."], circuit:"cycle", code:"cycle", description:"The executed tutorial includes a minimal one-qubit identity cycle X; X. Full CB requires randomized compiling and Pauli-basis analysis.", reports:["Complete cycle, duration, spectators, idles and qubit subset.","Randomized-compiling rule, measured Paulis, depths and readout bases.","Each fP, aggregate estimator, residuals and uncertainty."] },
  "quantum-volume": { title:"Quantum Volume", level:"System level", kicker:"Volumetric benchmark", tags:["Executed educational tutorial","Heavy-output probability","Square circuits"], summary:"Test a processor on shaped random circuits using a declared ensemble, width/depth sweep and heavy-output criterion.", purpose:"<p>Report a capability region or quantum-volume-style pass criterion only with the circuit construction and statistical confidence procedure made explicit.</p>", theory:`<p>For every ideal random circuit, divide outcomes into heavy and light sets from ideal output probabilities. Heavy-output probability summarizes whether observed samples favor the high-probability half.</p><span class="equation">HOP = Pr<sub>x∼experiment</sub>[x ∈ heavy(C)]</span><p>Width and depth scale together for a square family. The metric remains specific to its ensemble and compiler policy; the QCVV tutorial uses portable educational circuits, not the original Haar-SU(4) construction.</p><div class="theory-callout"><strong>Do not overclaim:</strong> the simulation method, confidence bound and circuit ensemble are part of the definition.</div>`, steps:["Declare the square-circuit family, native decomposition and compilation policy.","Generate fixed-seed circuits and ideal probabilities with a recorded simulator method.","Execute samples in randomized order and retain raw circuit-level counts.","Calculate per-circuit heavy-output probability and aggregate with uncertainty.","Report a pass only with its stated threshold and construction details."], circuit:"qv", code:"qv", description:"A portable square-circuit illustration. Use a declared random ensemble rather than this fixed example for a benchmark.", reports:["Circuit ensemble, width/depth, compiler and simulation precision.","Per-circuit results, aggregation and confidence bound.","Timing, shots, qubit mapping and calibration context."] },
};

const groups = [["Qubit level",[["rabi","Rabi oscillations"],["ramsey","Ramsey spectroscopy & T₂*"],["rpe","Robust phase estimation"],["relaxation","T₁, T₂ & echo"],["readout","Readout response matrix"]]],["Circuit level",[["qst","Quantum state tomography"],["qpt","Quantum process tomography"],["gst","Gate-set tomography"],["standard-rb","Standard randomized benchmarking"],["interleaved-rb","Interleaved RB"],["cycle-benchmarking","Cycle benchmarking"],["xeb","Cross-entropy benchmarking"]]],["System level",[["drb","Direct randomized benchmarking"],["birb","Binary RB"],["mirror-rb","Mirror RB"],["simultaneous-rb","Simultaneous RB"],["leakage-rb","Leakage RB"],["quantum-volume","Quantum Volume"],["mcfe","Mirror circuit fidelity estimation"]]],["Application level",[["volumetric","Volumetric capability regions"],["accreditation","Circuit output accreditation"],["application-benchmarks","Application benchmarks"]]]];

function generic(id) {
  for (const [level, items] of groups) { const match = items.find(([key]) => key === id); if (match) return { title:match[1], level, kicker:"QCVV working guide", tags:["Method overview","Protocol context required"], summary:`A structured entry point for ${match[1]}. Follow its declared protocol and preserve the context needed to interpret each result.`, purpose:"<p>The QCVV Working Guide contains the procedure, limitations and reporting boundary for this method. This page is ready for the method-specific implementation note and executable example.</p>", theory:"<p>Choose the model before collecting data: a fitted number only estimates the property that its assumptions make identifiable. Fix compilation, qubits, timing, readout and acquisition order before comparison.</p><span class=\"equation\">recorded result = estimate + protocol assumptions + execution context</span><div class=\"theory-callout\"><strong>General rule:</strong> retain raw counts and circuit-level records so models, uncertainty and residuals can be re-evaluated.</div>", steps:["Define the target property and assumptions.","Freeze hardware and compilation context.","Use pilot data and randomized acquisition order.","Fit with a likelihood or bootstrap suited to recorded data.","Report scope and limitations with every estimate."], circuit:"cycle", code:"cycle", description:"A portable OpenQASM 3 starting point; replace it with the protocol-specific generated circuit before execution.", reports:["Exact protocol and assumptions.","QPU, calibration, compiler, timing and measurement context.","Raw counts, uncertainty method, residuals and limitations."] }; }
  return methods["standard-rb"];
}

function copy(text, button, label) { const fallback=()=>{const area=document.createElement("textarea");area.value=text;area.style.cssText="position:fixed;opacity:0";document.body.append(area);area.select();document.execCommand("copy");area.remove();}; (navigator.clipboard?.writeText(text).catch(fallback)||Promise.resolve()).then(()=>{button.textContent="✓ Copied";button.classList.add("copied");setTimeout(()=>{button.textContent=label;button.classList.remove("copied");},1600);}); }

function renderNavigation(active) { const nav=document.querySelector("#method-navigation"); nav.replaceChildren(); for (const [name,items] of groups) { const section=document.createElement("section"), title=document.createElement("button"), list=document.createElement("div"); section.className="nav-group";title.className="nav-group-title";title.type="button";title.textContent=name;list.className="nav-items";title.addEventListener("click",()=>{list.hidden=!list.hidden;}); for (const [id,label] of items) { const button=document.createElement("button");button.type="button";button.className="method-link";button.textContent=label;if(id===active)button.setAttribute("aria-current","page");button.addEventListener("click",()=>select(id));list.append(button);} section.append(title,list);nav.append(section); } }

function select(id) { const method=methods[id]||generic(id), article=document.querySelector("#method-article"), fragment=document.querySelector("#method-template").content.cloneNode(true); fragment.querySelector(".crumb-level").textContent=method.level;fragment.querySelector(".crumb-title").textContent=method.title;fragment.querySelector(".article-kicker").textContent=method.kicker;fragment.querySelector("h1").textContent=method.title;fragment.querySelector(".article-summary").textContent=method.summary;fragment.querySelector(".purpose-content").innerHTML=method.purpose;fragment.querySelector(".theory-content").innerHTML=method.theory;fragment.querySelector(".circuit-figure").innerHTML=diagram[method.circuit];fragment.querySelector(".quantikz-source").textContent=quantikz[method.circuit];fragment.querySelector(".qasm-code").textContent=qasm[method.code];fragment.querySelector(".qasm-description").textContent=method.description;for(const tag of method.tags){const el=document.createElement("span");el.textContent=tag;fragment.querySelector(".protocol-tags").append(el);}for(const step of method.steps){const el=document.createElement("li");el.textContent=step;fragment.querySelector(".method-steps").append(el);}for(const report of method.reports){const el=document.createElement("li");el.textContent=report;fragment.querySelector(".report-list").append(el);}const qtz=fragment.querySelector(".quantikz-copy"),qasmButton=fragment.querySelector(".qasm-copy");qtz.addEventListener("click",()=>copy(quantikz[method.circuit],qtz,"⧉ Copy Quantikz"));qasmButton.addEventListener("click",()=>copy(qasm[method.code],qasmButton,"⧉ Copy code"));article.replaceChildren(fragment);renderNavigation(id);history.replaceState(null,"",`#${id}`);if(innerWidth<900)article.scrollIntoView({behavior:"smooth",block:"start"}); }

const initial=location.hash.slice(1);select(initial || "standard-rb");
