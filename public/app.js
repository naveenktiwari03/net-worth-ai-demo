const formatterCache = new Map();

function currency(value, code = "INR") {
  const key = code;
  if (!formatterCache.has(key)) {
    formatterCache.set(key, new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0
    }));
  }
  return formatterCache.get(key).format(Number(value || 0));
}

function confidenceClass(confidence) {
  if (confidence >= 0.75) return "high";
  if (confidence >= 0.55) return "medium";
  return "low";
}

function label(value) {
  return String(value || "").replaceAll("_", " ").replace(/\b\w/g, char => char.toUpperCase());
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...options
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Request failed");
  return payload;
}

async function loadAll() {
  const [{ summary, settings }, { items, drafts }, goalPayload] = await Promise.all([
    api("/api/summary"),
    api("/api/items"),
    api("/api/goal")
  ]);
  renderSummary(summary, settings);
  renderDrafts(drafts);
  renderItems(items);
  renderGoal(goalPayload.goal);
  hydrateGoalForm(settings);
}

function renderSummary(summary, settings) {
  document.querySelector("#totalAssets").textContent = currency(summary.totalAssets, settings.baseCurrency);
  document.querySelector("#totalLiabilities").textContent = currency(summary.totalLiabilities, settings.baseCurrency);
  document.querySelector("#estimatedNetWorth").textContent = currency(summary.estimatedNetWorth, settings.baseCurrency);
  document.querySelector("#lowConfidenceAssets").textContent = currency(summary.lowConfidenceAssets, settings.baseCurrency);
  document.querySelector("#uncertainValue").textContent = currency(summary.uncertainValue, settings.baseCurrency);
  document.querySelector("#pendingBadge").textContent = `${summary.pendingDrafts} draft${summary.pendingDrafts === 1 ? "" : "s"}`;
}

function renderDrafts(drafts) {
  const container = document.querySelector("#draftList");
  if (!drafts.length) {
    container.className = "item-list empty-state";
    container.textContent = "No drafts yet.";
    return;
  }
  container.className = "item-list";
  container.innerHTML = drafts.map(draft => `
    <article class="item-card">
      <div class="item-head">
        <div class="item-title">
          <h4>${escapeHtml(draft.name)}</h4>
          <div class="item-meta">
            <span>${escapeHtml(label(draft.type))}</span>
            <span>${escapeHtml(label(draft.category))}</span>
            <span>${escapeHtml(label(draft.liquidity))}</span>
            <span>${escapeHtml(draft.currency)}</span>
          </div>
        </div>
        <span class="confidence ${confidenceClass(draft.confidence)}">${Math.round(draft.confidence * 100)}% confidence</span>
      </div>
      <div class="item-meta">
        <strong>Suggested value: ${draft.currentValue ? currency(draft.currentValue, draft.currency) : "Unknown"}</strong>
        <span>Source: ${escapeHtml(label(draft.sourceType))}</span>
        <span>As of ${escapeHtml(draft.asOfDate)}</span>
      </div>
      ${draft.missingFields.length ? `<div><strong>Missing fields</strong><ul class="missing-fields">${draft.missingFields.map(field => `<li>${escapeHtml(field)}</li>`).join("")}</ul></div>` : ""}
      <div><strong>Review notes</strong><ul class="item-notes">${draft.notes.map(note => `<li>${escapeHtml(note)}</li>`).join("")}</ul></div>
      <form class="draft-edit" data-draft-id="${draft.id}">
        <label>
          Name
          <input name="name" value="${escapeAttr(draft.name)}">
        </label>
        <label>
          Value
          <input name="currentValue" inputmode="decimal" value="${draft.currentValue || ""}">
        </label>
        <button class="secondary-button" type="submit">Confirm</button>
      </form>
    </article>
  `).join("");

  container.querySelectorAll(".draft-edit").forEach(form => {
    form.addEventListener("submit", confirmDraft);
  });
}

function renderItems(items) {
  const container = document.querySelector("#itemList");
  if (!items.length) {
    container.className = "item-list empty-state";
    container.textContent = "No confirmed items yet.";
    return;
  }
  container.className = "item-list";
  container.innerHTML = items.map(item => `
    <article class="item-card">
      <div class="item-head">
        <div class="item-title">
          <h4>${escapeHtml(item.name)}</h4>
          <div class="item-meta">
            <span>${escapeHtml(label(item.type))}</span>
            <span>${escapeHtml(label(item.category))}</span>
            <span>${escapeHtml(label(item.sourceType))}</span>
            <span>${escapeHtml(item.asOfDate)}</span>
          </div>
        </div>
        <strong>${currency(item.currentValue, item.currency)}</strong>
      </div>
      <div class="item-meta">
        <span class="confidence ${confidenceClass(item.confidence)}">${Math.round(item.confidence * 100)}% confidence</span>
        <span>${escapeHtml(label(item.includeInNetWorth))}</span>
        <span>${escapeHtml(label(item.liquidity))}</span>
      </div>
    </article>
  `).join("");
}

function renderGoal(goal) {
  const result = document.querySelector("#goalResult");
  const gapLabel = goal.gap <= 0 ? "On track by projection" : "Projected gap";
  result.innerHTML = `
    <p class="eyebrow">Projection</p>
    <div>
      <div class="projection-number">${currency(goal.projectedNetWorth)}</div>
      <p>Projected net worth by ${goal.targetDate}</p>
    </div>
    <div>
      <strong>${gapLabel}: ${currency(Math.abs(goal.gap))}</strong>
      <p>Additional monthly increase indicated: ${currency(goal.requiredMonthlyIncrease)}</p>
    </div>
    <div>
      <strong>Indications</strong>
      <ul class="item-notes">${goal.indications.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
    <p>Assumptions: ${currency(goal.assumptions.monthlyContribution)} monthly addition, ${goal.assumptions.expectedAnnualGrowthPct}% annual growth, taxes and inflation not included.</p>
  `;
}

function sampleIntake() {
  const form = document.querySelector("#intakeForm");
  form.elements.name.value = "SAFE note in demo startup";
  form.elements.description.value = "I invested 3 lakh in a startup through a SAFE note in 2022. I do not know the current valuation, ownership percentage, or liquidity terms.";
  form.elements.documentText.value = "Bank transfer: INR 300000 to Nova AI Labs Pvt Ltd. Purpose: SAFE investment subscription.";
  form.elements.value.value = "300000";
  form.elements.currency.value = "INR";
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function loadDemo() {
  await api("/api/demo/seed", { method: "POST", body: JSON.stringify({}) });
  await loadAll();
  document.querySelector("#dashboard").scrollIntoView({ behavior: "smooth" });
}

async function resetDemo() {
  await api("/api/demo/reset", { method: "POST", body: JSON.stringify({}) });
  await loadAll();
}

function hydrateGoalForm(settings) {
  const form = document.querySelector("#goalForm");
  for (const [key, value] of Object.entries(settings)) {
    if (form.elements[key]) form.elements[key].value = value;
  }
}

async function submitIntake(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const body = Object.fromEntries(new FormData(form).entries());
  await api("/api/intake/draft", {
    method: "POST",
    body: JSON.stringify(body)
  });
  form.reset();
  await loadAll();
  document.querySelector("#review").scrollIntoView({ behavior: "smooth" });
}

async function confirmDraft(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const draftId = form.dataset.draftId;
  const body = Object.fromEntries(new FormData(form).entries());
  await api(`/api/drafts/${draftId}/confirm`, {
    method: "POST",
    body: JSON.stringify(body)
  });
  await loadAll();
}

async function submitGoal(event) {
  event.preventDefault();
  const body = Object.fromEntries(new FormData(event.currentTarget).entries());
  const { goal } = await api("/api/settings", {
    method: "POST",
    body: JSON.stringify(body)
  });
  renderGoal(goal);
  await loadAll();
}

function escapeAttr(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.querySelector("#intakeForm").addEventListener("submit", submitIntake);
document.querySelector("#goalForm").addEventListener("submit", submitGoal);
document.querySelector("#refreshButton").addEventListener("click", loadAll);
document.querySelector("#sampleIntakeButton").addEventListener("click", sampleIntake);
document.querySelector("#loadDemoButton").addEventListener("click", loadDemo);
document.querySelector("#resetDemoButton").addEventListener("click", resetDemo);

loadAll().catch(error => {
  console.error(error);
  alert(error.message);
});
