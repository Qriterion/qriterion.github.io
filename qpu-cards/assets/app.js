const formatNumber = (value) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);
const latestDate = (metrics) => metrics.map((metric) => metric.asOf).sort().at(-1);

function metricValue(metric) {
  const uncertainty = metric.uncertainty == null ? "" : ` ± ${formatNumber(metric.uncertainty)}`;
  return `${metric.comparator || ""}${formatNumber(metric.value)}${uncertainty}`;
}

function populateSelect(select, entries) {
  [...new Set(entries)].sort().forEach((entry) => {
    const option = document.createElement("option");
    option.value = entry;
    option.textContent = entry;
    select.append(option);
  });
}

function createCard(card, sources) {
  const template = document.querySelector("#card-template");
  const node = template.content.cloneNode(true);
  node.querySelector(".provider").textContent = card.provider;
  node.querySelector(".region").textContent = card.region;
  node.querySelector(".route").textContent = card.route;
  node.querySelector("h2").textContent = card.qpu;
  node.querySelector(".platform").textContent = card.platform;
  node.querySelector(".asof").textContent = `Latest public observation: ${latestDate(card.metrics)}`;

  const grid = node.querySelector(".metric-grid");
  card.metrics.slice(0, 4).forEach((metric) => {
    const item = document.createElement("div");
    item.innerHTML = `<dt title="${metric.metric}">${metric.metric}</dt><dd>${metricValue(metric)}</dd><small>${metric.unit}</small>`;
    grid.append(item);
  });

  const details = node.querySelector(".detail-list");
  card.metrics.forEach((metric) => {
    const source = sources[metric.sourceId];
    const sourceLabel = source.url
      ? `<a href="${source.url}" target="_blank" rel="noopener">${metric.sourceId}: ${source.title}</a>`
      : `${metric.sourceId}: ${source.title}`;
    const detail = document.createElement("div");
    detail.className = "detail-item";
    detail.innerHTML = `
      <div class="detail-title"><span>${metric.metric}: ${metricValue(metric)} ${metric.unit}</span><span class="type">${metric.metricClass}</span></div>
      <p class="detail-meta">As of ${metric.asOf} · ${metric.evidenceType} · ${sourceLabel}</p>
      <p class="detail-note">${metric.note}</p>`;
    details.append(detail);
  });
  return node;
}

async function init() {
  const response = await fetch("data/qpu-cards.json?v=20261005-3", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load QPU card data.");
  const { cards, sources } = await response.json();
  const search = document.querySelector("#search");
  const provider = document.querySelector("#provider-filter");
  const region = document.querySelector("#region-filter");
  const route = document.querySelector("#route-filter");
  const metric = document.querySelector("#metric-filter");
  const cardsEl = document.querySelector("#cards");
  const results = document.querySelector("#results");

  populateSelect(provider, cards.map((card) => card.provider));
  populateSelect(region, cards.map((card) => card.region));
  populateSelect(route, cards.map((card) => card.route));
  populateSelect(metric, cards.flatMap((card) => card.metrics.map((item) => item.metricClass)));
  document.querySelector("#card-count").textContent = `${cards.length} QPU cards · ${cards.reduce((sum, card) => sum + card.metrics.length, 0)} public observations`;

  const render = () => {
    const needle = search.value.trim().toLowerCase();
    const shown = cards.filter((card) => {
      const haystack = [card.qpu, card.provider, card.platform, card.route, ...card.metrics.map((item) => `${item.metric} ${item.note}`)].join(" ").toLowerCase();
      return (!needle || haystack.includes(needle))
        && (!provider.value || card.provider === provider.value)
        && (!region.value || card.region === region.value)
        && (!route.value || card.route === route.value)
        && (!metric.value || card.metrics.some((item) => item.metricClass === metric.value));
    });
    cardsEl.replaceChildren();
    results.textContent = `${shown.length} of ${cards.length} cards shown`;
    if (!shown.length) {
      cardsEl.innerHTML = '<p class="empty">No cards match these filters.</p>';
      return;
    }
    shown.forEach((card) => cardsEl.append(createCard(card, sources)));
  };

  [search, provider, region, route, metric].forEach((control) => control.addEventListener("input", render));
  document.querySelector("#reset").addEventListener("click", () => { search.value = ""; provider.value = ""; region.value = ""; route.value = ""; metric.value = ""; render(); });
  render();
}

init().catch((error) => {
  document.querySelector("#cards").innerHTML = `<p class="empty">${error.message}</p>`;
});
