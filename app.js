/* TTFHW 测试总汇报告 — 前端逻辑（无构建步骤，原生 JS） */
(() => {
  "use strict";

  const SCENARIO_LABEL = { user: "用户场景", developer: "开发者场景" };
  const RESULT_LABEL = { success: "成功", partial: "部分成功", failed: "失败", unknown: "未知" };
  const COMMUNITY_ORDER = [
    "openEuler", "HPCKit", "UBS Core", "openUBMC", "CANN",
    "MindSpeed", "MindIE", "PTA", "MindSpore", "openGauss", "Ascend", "其他"
  ];

  const state = {
    data: null,
    month: "latest",     // "latest" | "YYYY-MM"
    scenario: "all",     // all | user | developer
    result: "all",       // all | success | partial | failed
    query: "",
  };

  // ── 加载数据 ───────────────────────────────────────────────────────────
  fetch("./data.json")
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((d) => { state.data = d; init(); })
    .catch((e) => {
      document.getElementById("content").innerHTML =
        `<div class="empty">数据加载失败：${e}. 请先运行 <code>python tools/ttfhw/cli/build_report_site.py</code> 生成 data.json，并通过 HTTP（非 file://）打开。</div>`;
    });

  function init() {
    const d = state.data;
    document.getElementById("genAt").textContent =
      d.generatedAt && d.generatedAt !== "build" ? `生成于 ${d.generatedAt}` : "";

    // 月份下拉：Latest + 各月
    const sel = document.getElementById("monthSel");
    const optLatest = document.createElement("option");
    optLatest.value = "latest";
    optLatest.textContent = "Latest（各仓库最新全量）";
    sel.appendChild(optLatest);
    d.months.forEach((m) => {
      const o = document.createElement("option");
      o.value = m; o.textContent = m.replace("-", " 年 ") + " 月";
      sel.appendChild(o);
    });
    sel.addEventListener("change", () => { state.month = sel.value; render(); });

    document.getElementById("scenarioTabs").addEventListener("click", (e) => {
      const b = e.target.closest(".tab"); if (!b) return;
      state.scenario = b.dataset.scenario;
      setActive("#scenarioTabs .tab", b); render();
    });
    document.getElementById("resultChips").addEventListener("click", (e) => {
      const b = e.target.closest(".chip"); if (!b) return;
      state.result = b.dataset.result;
      setActive("#resultChips .chip", b); render();
    });
    const search = document.getElementById("search");
    search.addEventListener("input", () => { state.query = search.value.trim().toLowerCase(); render(); });

    render();
  }

  function setActive(sel, btn) {
    document.querySelectorAll(sel).forEach((x) => x.classList.remove("active"));
    btn.classList.add("active");
  }

  // ── 选取当前视图的记录 ───────────────────────────────────────────────────
  // Latest：每个 (scenario, community, repo) 取 date 最大的一条
  // 某月：先筛 month==选中月，再每个 repo 取该月最新一条
  function selectRecords() {
    let recs = state.data.records.slice();
    if (state.month !== "latest") recs = recs.filter((r) => r.month === state.month);

    const groups = new Map();
    for (const r of recs) {
      const key = `${r.scenario}|${r.community}|${r.repo}`;
      const cur = groups.get(key);
      if (!cur || r.date > cur.date) groups.set(key, r);
    }
    let out = [...groups.values()];

    if (state.scenario !== "all") out = out.filter((r) => r.scenario === state.scenario);
    if (state.result !== "all") out = out.filter((r) => r.result === state.result);
    if (state.query) {
      out = out.filter((r) =>
        r.repo.toLowerCase().includes(state.query) ||
        r.community.toLowerCase().includes(state.query));
    }
    return out;
  }

  // ── 渲染 ────────────────────────────────────────────────────────────────
  function render() {
    const recs = selectRecords();
    renderStats(recs);

    const content = document.getElementById("content");
    const empty = document.getElementById("empty");
    content.innerHTML = "";
    empty.hidden = recs.length > 0;
    if (!recs.length) return;

    const scenarios = state.scenario === "all" ? ["developer", "user"] : [state.scenario];
    for (const sc of scenarios) {
      const scRecs = recs.filter((r) => r.scenario === sc);
      if (!scRecs.length) continue;
      content.appendChild(renderScenarioBlock(sc, scRecs));
    }
  }

  function renderStats(recs) {
    const el = document.getElementById("stats");
    const total = recs.length;
    const by = (k) => recs.filter((r) => r.result === k).length;
    const succ = by("success"), part = by("partial"), fail = by("failed");
    const passRate = total ? Math.round((succ / total) * 100) : 0;
    const userN = recs.filter((r) => r.scenario === "user").length;
    const devN = recs.filter((r) => r.scenario === "developer").length;
    const communities = new Set(recs.map((r) => r.community)).size;

    const stat = (v, k, barColor, pct) => `
      <div class="stat">
        <div class="v">${v}</div>
        <div class="k">${k}</div>
        ${barColor ? `<div class="bar"><i style="width:${pct}%;background:${barColor}"></i></div>` : ""}
      </div>`;

    el.innerHTML =
      stat(total, "仓库 / 场景数") +
      stat(`${passRate}%`, `通过率（成功 ${succ}）`, "var(--success)", passRate) +
      stat(part, "部分成功", "var(--partial)", total ? (part / total) * 100 : 0) +
      stat(fail, "失败", "var(--failed)", total ? (fail / total) * 100 : 0) +
      stat(communities, "覆盖社区") +
      stat(`${devN} / ${userN}`, "开发者 / 用户");
  }

  function renderScenarioBlock(sc, recs) {
    const block = document.createElement("section");
    block.className = "scenario-block";
    const phases = state.data.phaseNames[sc] || [];

    const head = document.createElement("div");
    head.className = "scenario-head";
    head.innerHTML = `
      <h2>${SCENARIO_LABEL[sc]}</h2>
      <span class="pill">${recs.length} 条</span>
      <span class="phase-legend">阶段：${phases.join(" → ")}</span>`;
    block.appendChild(head);

    // 按社区分组
    const byComm = new Map();
    for (const r of recs) {
      if (!byComm.has(r.community)) byComm.set(r.community, []);
      byComm.get(r.community).push(r);
    }
    const order = [...byComm.keys()].sort(
      (a, b) => idx(COMMUNITY_ORDER, a) - idx(COMMUNITY_ORDER, b) || a.localeCompare(b));

    for (const comm of order) {
      const items = byComm.get(comm).sort((a, b) => a.repo.localeCompare(b.repo));
      block.appendChild(renderCommunity(comm, items));
    }
    return block;
  }

  function idx(arr, v) { const i = arr.indexOf(v); return i === -1 ? 999 : i; }

  function renderCommunity(comm, items) {
    const wrap = document.createElement("div");
    wrap.className = "community";

    const dist = { success: 0, partial: 0, failed: 0, unknown: 0 };
    items.forEach((r) => { dist[r.result] = (dist[r.result] || 0) + 1; });
    const miniDot = (c, n) => n ? `<i style="background:var(--${c})" title="${RESULT_LABEL[c]} ${n}"></i>` : "";

    const head = document.createElement("div");
    head.className = "community-head";
    head.innerHTML = `
      <span class="name">${comm}</span>
      <span class="count">${items.length} 个仓库</span>
      <span class="mini-dist">
        ${miniDot("success", dist.success)}${miniDot("partial", dist.partial)}${miniDot("failed", dist.failed)}${miniDot("unknown", dist.unknown)}
      </span>`;
    wrap.appendChild(head);

    const grid = document.createElement("div");
    grid.className = "grid";
    items.forEach((r) => grid.appendChild(renderCard(r)));
    wrap.appendChild(grid);
    return wrap;
  }

  function renderCard(r) {
    const card = document.createElement("article");
    card.className = `card r-${r.result}`;

    const repoName = r.url
      ? `<a href="${r.url}" target="_blank" rel="noopener">${r.repo}</a>`
      : r.repo;

    const phasesHtml = r.phases.map((p) => `
      <div class="phase">
        <div class="dot ${p.status}"></div>
        <div class="pn">${p.name}</div>
        <div class="pm">${p.minutes ? p.minutes + "m" : "·"}</div>
      </div>`).join("");

    const defects = (r.defectCount || (r.defects ? r.defects.length : 0));
    const sceneTxt = r.scene && r.scene !== "compile-verify" ? r.scene : "";

    card.innerHTML = `
      <div class="card-top">
        <div class="card-id">
          <div class="repo">${repoName}</div>
          <div class="community-label">社区：<b>${r.community}</b></div>
        </div>
        <span class="badge ${r.result}">${RESULT_LABEL[r.result]}</span>
      </div>
      <div class="phases">${phasesHtml}</div>
      <div class="card-foot">
        <span>${r.date}</span>
        ${sceneTxt ? `<span class="sep">·</span><span>${sceneTxt}</span>` : ""}
        ${defects ? `<span class="sep">·</span><span class="defects">${defects} 缺陷</span>` : ""}
        ${r.totalMinutes ? `<span class="total">${r.totalMinutes} min</span>` : ""}
      </div>`;
    return card;
  }
})();
