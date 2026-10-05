const numberFormat = (value) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);

function populate(select, entries) {
  [...new Set(entries)].sort().forEach((entry) => {
    const option = document.createElement("option");
    option.value = entry;
    option.textContent = entry;
    select.append(option);
  });
}

function createBar(record, height) {
  const item = document.createElement("article");
  item.className = "rank-bar";
  item.title = `${record.provider} · ${record.metric} · ${numberFormat(record.value)} ${record.unit} · ${record.asOf}`;
  item.innerHTML = `
    <p class="rank-value">${numberFormat(record.value)}</p>
    <div class="rank-bar-track"><div class="rank-bar-fill" style="height:${height}%"></div></div>
    <h3>${record.qpu}</h3>
    <p class="rank-meta">${record.provider}<br>${record.hardwareType}</p>`;
  return item;
}

async function init() {
  const response = await fetch("data/qpu-cards.json?v=20261005-4", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load leaderboard data.");
  const { leaderboards } = await response.json();
  const metricSelect = document.querySelector("#leaderboard-metric");
  const regionSelect = document.querySelector("#leaderboard-region");
  const hardwareSelect = document.querySelector("#leaderboard-hardware");
  const chart = document.querySelector("#leaderboard-chart");
  const title = document.querySelector("#metric-title");
  const direction = document.querySelector("#metric-direction");
  const explanation = document.querySelector("#metric-explanation");
  const summary = document.querySelector("#chart-summary");

  leaderboards.forEach((definition) => {
    const option = document.createElement("option");
    option.value = definition.id;
    option.textContent = definition.label;
    metricSelect.append(option);
  });
  populate(regionSelect, leaderboards.flatMap((definition) => definition.records.map((record) => record.region)));
  populate(hardwareSelect, leaderboards.flatMap((definition) => definition.records.map((record) => record.hardwareType)));

  const render = () => {
    const definition = leaderboards.find((item) => item.id === metricSelect.value) || leaderboards[0];
    const records = definition.records
      .filter((record) => (!regionSelect.value || record.region === regionSelect.value)
        && (!hardwareSelect.value || record.hardwareType === hardwareSelect.value))
      .sort((left, right) => definition.direction === "higher" ? left.value - right.value : right.value - left.value);
    title.textContent = definition.label;
    direction.textContent = definition.direction === "higher" ? "Higher is better" : "Lower is better";
    explanation.textContent = definition.explanation;
    summary.textContent = `${records.length} QPUs · ${records[0]?.unit || ""}`;
    chart.replaceChildren();
    if (!records.length) {
      chart.innerHTML = '<p class="empty">No QPUs match these filters for the selected metric.</p>';
      return;
    }
    const values = records.map((record) => record.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    records.forEach((record) => {
      const normalized = max === min ? 0.5 : (record.value - min) / (max - min);
      chart.append(createBar(record, 18 + normalized * 82));
    });
  };

  [metricSelect, regionSelect, hardwareSelect].forEach((select) => select.addEventListener("input", render));
  render();
}

init().catch((error) => {
  document.querySelector("#leaderboard-chart").innerHTML = `<p class="empty">${error.message}</p>`;
});
