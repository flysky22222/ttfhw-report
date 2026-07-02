/* TTFHW 测试总汇报告 — 列表(仪表盘+图表+表格) + 详情子页（原生 JS，零依赖） */
(() => {
  "use strict";
  const SCEN = { user: "使用者场景", developer: "贡献者场景" };
  const RES = { success: "成功", partial: "部分成功", failed: "失败", unknown: "未知", not_run: "未执行" };
  const COMM_ORDER = ["openEuler","HPCKit","UBS Core","openUBMC","CANN","MindSpeed","MindIE","PTA","MindSpore","openGauss","Triton","TileLang","Ascend","其他"];
  const COLOR = { success: "#3ba272", partial: "#fac858", failed: "#ee6666", unknown: "#A4B1D7", not_run: "#c7ccd6" };

  // 内联 SVG 图标（stroke 风格）
  const I = {
    repo: '<path d="M3 3h10v10H3z" fill="none"/><path d="M5 2v12M2 5h12"/>',
    check: '<path d="M3 8.5l3 3 7-8" fill="none"/>',
    clock: '<circle cx="8" cy="8" r="6.5" fill="none"/><path d="M8 4.5V8l2.5 1.5"/>',
    hammer: '<path d="M9 4l3 3-5 5-3-3z" fill="none"/><path d="M2 14l3-3"/>',
    flask: '<path d="M6 2v4L3 13h10L10 6V2" fill="none"/><path d="M6 2h4"/>',
    layers: '<path d="M8 2l6 3-6 3-6-3z" fill="none"/><path d="M2 8l6 3 6-3" fill="none"/>',
    chart: '<path d="M2 14V2M2 14h12" fill="none"/><path d="M5 11V8M8 11V5M11 11V7" />',
    pkg: '<path d="M8 2l5 2.5v5L8 14 3 9.5v-5z" fill="none"/>',
    list: '<path d="M5 4h9M5 8h9M5 12h9M2 4h.01M2 8h.01M2 12h.01"/>',
    doc: '<path d="M4 2h6l3 3v9H4z" fill="none"/><path d="M6 8h4M6 11h4"/>',
    bug: '<circle cx="8" cy="9" r="3.5" fill="none"/><path d="M8 2v3M3 6l2 2M13 6l-2 2M2 11h2M12 11h2"/>',
    arch: '<path d="M2 13h12M4 13V7l4-4 4 4v6" fill="none"/>',
  };
  const ico = (k, cls = "") => `<svg class="ico ${cls}" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${I[k] || ""}</svg>`;

  const state = { data: null, month: "latest", scenario: "all", result: "all", query: "", issueComm: "all" };

  const DEFAULT_PALETTE = ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc", "#5470c6"];

  Promise.all([
    fetch("./data.json?t=" + Date.now()).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }),
    fetch("./vendor/echarts-theme.json?v=20260611b").then(r => r.ok ? r.json() : null).catch(() => null),
    fetch("./issues.json?t=" + Date.now()).then(r => r.ok ? r.json() : []).catch(() => []),
  ]).then(([data, theme, issues]) => {
    state.data = data;
    state.issues = issues || [];
    if (theme && window.echarts) { try { echarts.registerTheme("m5", theme); state.theme = "m5"; } catch (e) {} state.palette = theme.color || DEFAULT_PALETTE; }
    else state.palette = DEFAULT_PALETTE;
    init();
  }).catch(e => { document.getElementById("content").innerHTML = `<div class="empty">数据加载失败：${e}</div>`; });

  function init() {
    const d = state.data;
    document.getElementById("genAt").textContent = d.generatedAt && d.generatedAt !== "build" ? `数据生成于 ${d.generatedAt}` : "";
    const sel = document.getElementById("monthSel");
    sel.appendChild(opt("latest", "Latest（各仓库最新全量）"));
    d.months.forEach(m => sel.appendChild(opt(m, m.replace("-", " 年 ") + " 月")));
    sel.addEventListener("change", () => { state.month = sel.value; route(); });
    document.getElementById("scenarioTabs").addEventListener("click", e => { const b = e.target.closest(".tab"); if (!b) return; state.scenario = b.dataset.scenario; setActive("#scenarioTabs .tab", b); route(); });
    document.getElementById("resultChips").addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; state.result = b.dataset.result; setActive("#resultChips .chip", b); route(); });
    const s = document.getElementById("search");
    s.addEventListener("input", () => { state.query = s.value.trim().toLowerCase(); if (!location.hash.startsWith("#id=")) route(); });
    window.addEventListener("hashchange", route);
    window.addEventListener("resize", () => charts.forEach(c => { try { c.resize(); } catch (e) {} }));
    renderIssues();
    route();
  }
  const opt = (v, t) => { const o = document.createElement("option"); o.value = v; o.textContent = t; return o; };
  const setActive = (sel, btn) => { document.querySelectorAll(sel).forEach(x => x.classList.remove("active")); btn.classList.add("active"); };

  function route() {
    const m = location.hash.match(/^#id=(\d+)/);
    const ctrls = document.querySelector(".controls"), stats = document.getElementById("stats"), charts = document.getElementById("charts"), issues = document.getElementById("issues");
    const show = m ? "none" : "";
    ctrls.style.display = show; stats.style.display = show; charts.style.display = show;
    if (issues) issues.style.display = show;
    if (m) renderDetail(+m[1]); else renderList();
  }

  // ── 底部：TTFHW 已提交的文档缺陷 Issue 表 ──────────────────────────────
  function renderIssues() {
    const el = document.getElementById("issues");
    if (!el) return;
    const all = state.issues || [];
    if (!all.length) { el.innerHTML = ""; return; }
    // 社区下拉选项（去重、按名称排序，含每个社区的条数）
    const counts = {};
    all.forEach(i => { counts[i.community] = (counts[i.community] || 0) + 1; });
    const comms = Object.keys(counts).sort((a, b) => a.localeCompare(b));
    if (state.issueComm !== "all" && !counts[state.issueComm]) state.issueComm = "all";
    const list = state.issueComm === "all" ? all : all.filter(i => i.community === state.issueComm);
    const lvlcls = l => ({ "严重": "失败", "重要": "部分", "一般": "" }[l] || "");
    const st = s => s === "closed"
      ? `<span class="badge success">已解决</span>`
      : `<span class="badge partial">待处理</span>`;
    const rows = list.map(i => `<tr>
      <td class="issue-cr"><span class="issue-comm">${esc(i.community)}</span><span class="issue-sep"> / </span><span class="issue-repo">${esc(i.repo)}</span></td>
      <td>${i.level ? `<span class="lvl lvl-${i.level}">${i.level}</span>` : "—"}</td>
      <td class="issue-title"><a href="${esc(i.url)}" target="_blank" rel="noopener">${esc(i.title)}</a>
        <span class="issue-plat">${i.platform}#${i.number}</span></td>
      <td>${st(i.status)}</td>
      <td class="issue-sym">${esc(i.symptom || "")}</td>
      <td class="issue-src">${i.source_url
        ? `<a href="${esc(i.source_url)}" target="_blank" rel="noopener">${esc(i.source || "查看")}</a>`
        : esc(i.source || "")}</td></tr>`).join("");
    const open = list.filter(i => i.status !== "closed").length;
    const commOpts = [`<option value="all">全部社区（${all.length}）</option>`]
      .concat(comms.map(c => `<option value="${esc(c)}"${c === state.issueComm ? " selected" : ""}>${esc(c)}（${counts[c]}）</option>`))
      .join("");
    el.innerHTML = `<div class="issues-head"><h2>${ico("bug")} TTFHW 提交的文档缺陷 Issue</h2>
      <div class="issues-filter">
        <label for="issueCommSel">社区</label>
        <select id="issueCommSel" class="select">${commOpts}</select>
      </div>
      <span class="issues-meta">共 ${list.length} 条 · 待处理 ${open} · 已上报至 gitcode / github 上游仓库</span></div>
      <div class="tbl-wrap"><table><thead><tr>
        <th>社区 / 仓库</th><th>级别</th><th>Issue 标题</th><th>状态</th><th>现象（节选）</th><th>来源</th>
      </tr></thead><tbody>${rows}</tbody></table></div>`;
    const csel = document.getElementById("issueCommSel");
    if (csel) csel.addEventListener("change", () => { state.issueComm = csel.value; renderIssues(); });
  }

  function selectRecords() {
    let recs = state.data.records.slice();
    if (state.month !== "latest") recs = recs.filter(r => r.month === state.month);
    const g = new Map();
    // 用户场景：每个社区只保留最新日期一行（repo 是冗长的产品描述、按 repo 分会炸出几十行）；
    // 开发者场景：仍按 社区|仓库 保留每仓最新一次。
    for (const r of recs) {
      const k = r.scenario === "user" ? `user|${r.community}` : `${r.scenario}|${r.community}|${r.repo}`;
      const c = g.get(k);
      // 使用者场景优先"月度权威代表"(rep=来自 final_reports 总汇)，其次比日期；开发者场景纯按日期
      const better = !c || (r.rep && !c.rep) || (Boolean(r.rep) === Boolean(c.rep) && r.date > c.date);
      if (better) g.set(k, r);
    }
    let out = [...g.values()];
    if (state.scenario !== "all") out = out.filter(r => r.scenario === state.scenario);
    if (state.result !== "all") out = out.filter(r => r.result === state.result);
    if (state.query) out = out.filter(r => r.repo.toLowerCase().includes(state.query) || r.community.toLowerCase().includes(state.query));
    return out;
  }

  function renderList() {
    const recs = selectRecords();
    renderStats(recs); renderCharts(recs);
    const content = document.getElementById("content"), empty = document.getElementById("empty");
    content.innerHTML = ""; empty.hidden = recs.length > 0;
    if (!recs.length) return;
    (state.scenario === "all" ? ["user", "developer"] : [state.scenario]).forEach(sc => {
      const sr = recs.filter(r => r.scenario === sc);
      if (sr.length) content.appendChild(scenarioBlock(sc, sr));
    });
  }

  function renderStats(recs) {
    const total = recs.length, by = k => recs.filter(r => r.result === k).length;
    const succ = by("success"), part = by("partial"), fail = by("failed");
    const passRate = total ? Math.round(succ / total * 100) : 0;
    const durs = recs.filter(r => r.totalMinutes > 0).map(r => r.totalMinutes);
    const avgDur = durs.length ? Math.round(durs.reduce((a, b) => a + b, 0) / durs.length) : 0;
    const dev = recs.filter(r => r.scenario === "developer");
    const buildOk = dev.filter(r => r.build && (r.build.status === "success" || r.build.status === "partial")).length;
    const buildRate = dev.length ? Math.round(buildOk / dev.length * 100) : 0;
    const utT = dev.reduce((s, r) => s + ((r.test && r.test.total) || 0), 0), utP = dev.reduce((s, r) => s + ((r.test && r.test.passed) || 0), 0);
    const utRate = utT ? Math.round(utP / utT * 100) : 0;
    const bmin = dev.filter(r => r.build && r.build.minutes > 0).map(r => r.build.minutes);
    const avgBuild = bmin.length ? Math.round(bmin.reduce((a, b) => a + b, 0) / bmin.length) : 0;
    const comm = new Set(recs.map(r => r.community)).size;
    const card = (icon, v, k, sub) => `<div class="stat"><div class="stat-h">${ico(icon)}<span class="k">${k}</span></div><div class="v">${v}</div>${sub ? `<div class="sub">${sub}</div>` : ""}</div>`;
    document.getElementById("stats").innerHTML =
      card("repo", total, "仓库 / 场景数", `<span><b>${comm}</b> 个社区</span>`) +
      card("check", `${passRate}<small>%</small>`, "TTFHW 通过率", `<span class="s-succ">成功 ${succ}</span><span class="s-part">部分 ${part}</span><span class="s-fail">失败 ${fail}</span>`) +
      card("clock", `${avgDur}<small> min</small>`, "平均总时长", `${durs.length} 条有耗时`) +
      card("hammer", `${buildRate}<small>%</small>`, "构建成功率", `${buildOk}/${dev.length} 仓库（开发者）`) +
      card("flask", utT ? `${utRate}<small>%</small>` : "—", "UT 通过率", utT ? `${utP} / ${utT} 用例` : "无 UT 数据") +
      card("layers", avgBuild ? `${avgBuild}<small> min</small>` : "—", "平均构建时长", `${bmin.length} 仓库有时长`);
  }

  // ── 图表（ECharts + v5.json 主题，渐变/每条不同色） ──────────────────────
  let charts = [];
  function disposeCharts() { charts.forEach(c => { try { c.dispose(); } catch (e) {} }); charts = []; }
  const PHASE_COLORS = ["#5470c6", "#91cc75", "#fac858", "#ee6666"];   // 四阶段堆叠色（实色，对齐 v5 主题）
  function phaseLegend(scenario) {
    if (scenario === "user") return ["了解", "安装", "使用", "贡献"];
    if (scenario === "developer") return ["获取", "编译构建", "测试", "社区CI"];
    return ["了解/获取", "安装/构建", "使用/测试", "贡献/CI"];
  }
  function renderCharts(recs) {
    const el = document.getElementById("charts");
    disposeCharts();
    el.innerHTML =
      `<div class="chart-card"><h3>${ico("chart")} 结果分布</h3><div class="echart" id="ec-pie"></div></div>` +
      `<div class="chart-card"><h3>${ico("clock")} 使用者场景 · 全流程耗时 TOP（min）</h3><div class="echart" id="ec-top-user"></div></div>` +
      `<div class="chart-card"><h3>${ico("clock")} 贡献者场景 · 全流程耗时 TOP（min）</h3><div class="echart" id="ec-top-dev"></div></div>`;
    if (!window.echarts) { el.innerHTML = `<div class="empty">ECharts 资源未加载</div>`; return; }
    const P = state.palette || DEFAULT_PALETTE, th = state.theme;

    // 结果分布 — 环形饼图（语义实色）
    const cnt = k => recs.filter(r => r.result === k).length;
    const pieData = [["成功", cnt("success"), "#3ba272"], ["部分成功", cnt("partial"), "#fac858"],
      ["失败", cnt("failed"), "#ee6666"], ["未知", recs.length - cnt("success") - cnt("partial") - cnt("failed"), "#c7ccd6"]]
      .filter(d => d[1] > 0).map(d => ({ name: d[0], value: d[1], itemStyle: { color: d[2] } }));
    const pie = echarts.init(document.getElementById("ec-pie"), th, { renderer: "svg" });
    pie.setOption({
      tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
      legend: { bottom: 0, icon: "circle", itemWidth: 9, itemHeight: 9, textStyle: { fontSize: 12 } },
      series: [{ type: "pie", radius: ["46%", "72%"], center: ["50%", "44%"], avoidLabelOverlap: true,
        itemStyle: { borderColor: "#fff", borderWidth: 2 },
        label: { show: true, formatter: "{d}%", fontSize: 11, color: "#6E7079" },
        emphasis: { scale: true, scaleSize: 6 }, data: pieData }],
    });
    charts.push(pie);

    // 全流程耗时 TOP — 拆成「使用者场景」「贡献者场景」两图，样式一致；阶段名与下方表格保持一致
    buildTopChart("ec-top-user", "user", recs);
    buildTopChart("ec-top-dev", "developer", recs);
  }

  // 单个「全流程耗时 TOP」堆叠横向柱：按可见堆叠总时长排序，多→少 自上而下
  function buildTopChart(elId, sc, recs) {
    const node = document.getElementById(elId);
    if (!node) return;
    const th = state.theme;
    const psum = r => r.phases.reduce((s, p) => s + (p.minutes || 0), 0);
    const list = recs.filter(r => r.scenario === sc && psum(r) > 0).sort((a, b) => psum(a) - psum(b)).slice(-10);
    if (!list.length) { node.innerHTML = `<div class="empty mini">当前筛选下无${SCEN[sc]}耗时数据</div>`; return; }
    // 阶段名取自数据的 phaseNames，确保与下方对应场景表头完全一致
    const names = (state.data.phaseNames && state.data.phaseNames[sc]) || phaseLegend(sc);
    const series = names.map((nm, idx) => ({
      name: nm, type: "bar", stack: "t", barWidth: "62%",
      itemStyle: { color: PHASE_COLORS[idx], borderColor: "#fff", borderWidth: 0.5 },
      emphasis: { focus: "series" },
      data: list.map(r => ({ value: (r.phases[idx] && r.phases[idx].minutes) || 0, id: r.id })),
    }));
    const c = echarts.init(node, th, { renderer: "svg" });
    c.setOption({
      legend: { top: 0, itemWidth: 12, itemHeight: 9, textStyle: { fontSize: 11 }, data: names },
      grid: { left: 6, right: 52, top: 30, bottom: 4, containLabel: true },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      xAxis: { type: "value", axisLabel: { fontSize: 11 } },
      yAxis: { type: "category", data: list.map(r => r.repo), axisLabel: { fontSize: 11 }, axisTick: { show: false } },
      series,
    });
    c.on("click", p => { if (p.data && p.data.id != null) location.hash = "#id=" + p.data.id; });
    charts.push(c);
  }

  function scenarioBlock(sc, recs) {
    const block = document.createElement("section"); block.className = "scenario-block";
    const phases = state.data.phaseNames[sc] || [];
    const head = document.createElement("div"); head.className = "scenario-head";
    head.innerHTML = `<h2>${ico(sc === "developer" ? "hammer" : "doc")} ${SCEN[sc]}</h2><span class="pill">${recs.length} 条</span><span class="legend">四阶段：${phases.join(" · ")}（数字＝分钟）</span>`;
    block.appendChild(head);
    const byC = new Map();
    for (const r of recs) { if (!byC.has(r.community)) byC.set(r.community, []); byC.get(r.community).push(r); }
    [...byC.keys()].sort((a, b) => ix(a) - ix(b) || a.localeCompare(b)).forEach(c => block.appendChild(communityTable(sc, c, byC.get(c).sort((a, b) => a.repo.localeCompare(b.repo)), phases)));
    return block;
  }
  const ix = v => { const i = COMM_ORDER.indexOf(v); return i < 0 ? 99 : i; };

  function communityTable(sc, comm, items, phases) {
    const wrap = document.createElement("div"); wrap.className = "community";
    const dist = { success: 0, partial: 0, failed: 0 };
    items.forEach(r => dist[r.result] !== undefined && dist[r.result]++);
    const head = document.createElement("div"); head.className = "community-head";
    // 使用者场景以社区为维度（每社区一行），不显示"N 仓库"计数；开发者场景才显示仓库数
    const countHtml = sc === "developer" ? `<span class="count">${items.length} 仓库</span>` : "";
    head.innerHTML = `<span class="name">${comm}</span>${countHtml}<span class="mini"><span class="s-succ">●</span>${dist.success} <span class="s-part">●</span>${dist.partial} <span class="s-fail">●</span>${dist.failed}</span>`;
    wrap.appendChild(head);
    const isDev = sc === "developer";
    const cols = `<th>仓库</th><th>结果</th>` + phases.map(p => `<th class="num">${p}</th>`).join("") + (isDev ? `<th class="num">UT</th>` : `<th class="num">断点</th>`) + `<th class="num">总时长</th>` + (isDev ? `<th class="num" title="样例运行时间（原“CI”列实为 sample）">Sample</th>` : "") + `<th class="num">缺陷</th><th>日期</th><th></th>`;
    const rows = items.map(r => {
      const pc = r.phases.map(p => `<td class="num phase-cell ${p.status}"><span class="m ${p.minutes ? "" : "zero"}">${p.minutes || "·"}</span></td>`).join("");
      const t = r.test || {};
      const extra = isDev ? (t.total ? `<td class="num"><span class="ut-pass">${t.passed || 0}</span>/${t.total}</td>` : `<td class="num">—</td>`) : `<td class="num">${r.breakpoints || 0}</td>`;
      const sampleCell = isDev ? `<td class="num">${r.sampleMinutes != null ? (r.sampleMinutes || "·") : "·"}</td>` : "";
      const dn = (r.defects || []).length;
      return `<tr data-id="${r.id}"><td class="repo-cell">${r.repo}${r.manual ? `<span class="scn manual" title="人工撰写报告">人工</span>` : ""}${r.scene && r.scene !== "compile-verify" ? `<span class="scn">${r.scene}</span>` : ""}</td>
        <td><span class="badge ${r.result}">${RES[r.result]}</span></td>${pc}${extra}
        <td class="num">${r.totalMinutes || "·"}</td>${sampleCell}<td class="num">${dn ? `<span class="defect-n">${dn}</span>` : "·"}</td><td>${r.date}</td><td class="link-arrow">›</td></tr>`;
    }).join("");
    // 固定列宽：所有社区表用同一套 colgroup，保证跨表上下对齐
    const cw = ["20%", "9%"].concat(phases.map(() => "7%")).concat(isDev ? ["8%", "8%", "7%", "6%", "10%", "4%"] : ["8%", "9%", "7%", "11%", "4%"]);
    const colgroup = `<colgroup>${cw.map(w => `<col style="width:${w}">`).join("")}</colgroup>`;
    const t = document.createElement("div"); t.className = "tbl-wrap";
    t.innerHTML = `<table class="ctbl">${colgroup}<thead><tr>${cols}</tr></thead><tbody>${rows}</tbody></table>`;
    t.querySelectorAll("tbody tr").forEach(tr => tr.addEventListener("click", () => { location.hash = "#id=" + tr.dataset.id; }));
    wrap.appendChild(t);
    return wrap;
  }

  // ── 详情子页 ─────────────────────────────────────────────────────────
  function renderDetail(id) {
    const r = state.data.records.find(x => x.id === id);
    const content = document.getElementById("content"); document.getElementById("empty").hidden = true;
    if (!r) { content.innerHTML = `<div class="empty">未找到记录。<a href="#">返回</a></div>`; return; }
    const phases = state.data.phaseNames[r.scenario] || [];
    const maxMin = Math.max(1, ...r.phases.map(p => p.minutes));
    const tl = r.phases.map(p => `<div class="tl-row"><span class="tl-name">${p.name}</span><span class="tl-min mono">${p.minutes ? p.minutes + " min" : "—"}</span>
      <span class="tl-bar"><i class="bar-${p.status}" style="width:${Math.max(4, p.minutes / maxMin * 100)}%"></i></span><span class="badge ${p.status}">${RES[p.status]}</span>${
        p.breakpoints ? `<span class="tl-bp" title="该阶段发现的问题数（数据源：标准 JSON）">${p.breakpoints} 问题</span>` : ""}${
        p.ciPr ? `<a class="ci-pr" href="${esc(p.ciPrUrl)}" target="_blank" rel="noopener" title="跑出该 CI 时间的 PR">CI PR：${esc(p.ciPr)} ↗</a>` : ""}</div>`).join("");

    const cards = [];
    cards.push(dcard("layers", "结果概览", [["场景", SCEN[r.scenario]], ["社区", r.community], ["阶段", phases.join(" · ")],
      ["总时长", r.totalMinutes ? r.totalMinutes + " min" : "—"], ["日期", r.date], r.scene && r.scene !== "compile-verify" ? ["场景关键字", r.scene] : null]));
    if (r.scenario === "developer") {
      const b = r.build || {}, t = r.test || {}, e = r.env || {};
      const tr = t.total ? Math.round((t.passed || 0) / t.total * 100) : null;
      cards.push(dcard("hammer", "构建", [["状态", badge(b.status)], ["耗时", b.minutes ? b.minutes + " min" : "—"]],
        b.command ? `<div class="codeblock">${esc(b.command)}</div>` : "", b.error ? `<div class="codeblock errblock">${esc(b.error)}</div>` : ""));
      cards.push(dcard("flask", "测试 (UT)", [["状态", badge(t.status)], ["通过 / 总数", t.total ? `<span class="ut-pass">${t.passed || 0}</span> / ${t.total}` : "—"],
        tr != null ? ["通过率", tr + "%"] : null, t.failed ? ["失败", `<span class="ut-fail">${t.failed}</span>`] : null, t.note ? ["说明", esc(t.note)] : null]));
      if (Object.keys(e).length || r.depsCount) cards.push(dcard("arch", "运行环境", [["OS", e.os || "—"], ["架构", e.arch || "—"],
        e.cpu ? ["CPU 核", e.cpu] : null, e.mem ? ["内存", typeof e.mem === "number" ? Math.round(e.mem / 1024) + " GB" : e.mem] : null,
        r.depsCount ? ["安装依赖", r.depsCount + " 个包"] : null], e.image ? `<div class="codeblock">${esc(e.image)}</div>` : ""));
    }

    const arts = r.artifacts || [];
    const artCard = arts.length ? dcard("pkg", `构建产物（${arts.length}）`, arts.map(a => [a.name, a.size || "—"])) : "";
    if (artCard) cards.push(artCard);

    // 社区CI 卡片：紧跟构建产物之后，展示状态 / 耗时 / 是否通过 / PR 地址（仅开发者场景）
    if (r.scenario === "developer") {
      const ci = (r.phases || []).find(p => /社区CI/.test(p.name || ""));
      if (ci) {
        const sec = ci.ciPrSeconds;
        const pass = ci.ciFailExpected ? "✅ 实测通过（仅 issue 关联/CLA 等测试型门禁项未过，非文档缺陷）"
          : ci.status === "success" ? "✅ 通过"
          : ci.status === "failed" ? "❌ 未通过"
          : ci.status === "no_ci" ? "— 无门禁数据"
          : (ci.status === "partial" || ci.status === "timeout") ? "⏳ 未出最终结论（近似计时）" : "—";
        // 耗时只有"真实门禁 PR 计时"(ciPrSeconds)才显示，否则 —（如 GitHub 仓无 gitcode 门禁）
        const rows = [
          ["状态", badge(ci.ciFailExpected ? "success" : ci.status)],
          ["耗时", sec ? `${Math.max(1, Math.round(sec / 60))} min（${sec}s）` : "—"],
          ["是否通过", pass],
          // PR 地址只放真实 PR 链接，没有就 —（绝不把说明文字塞进 PR 地址栏）
          ["PR 地址", ci.ciPr
            ? `<a href="${esc(ci.ciPrUrl)}" target="_blank" rel="noopener">${esc(ci.ciPr)} ↗</a>`
            : "—"],
        ];
        if (ci.ciNote) rows.push(["说明", esc(ci.ciNote)]);
        cards.push(dcard("clock", "社区CI成功", rows));
      }
    }

    const sections = [];
    sections.push(`<div class="section"><h2>${ico("clock")} 四阶段耗时</h2><div class="timeline">${tl}</div></div>`);
    sections.push(`<div class="cards">${cards.join("")}</div>`);

    if ((r.docFacts || []).length) sections.push(`<div class="section"><h2>${ico("doc")} 文档关键事实</h2>
      <table class="dtable"><colgroup><col style="width:15%"><col style="width:55%"><col style="width:30%"></colgroup><thead><tr><th>项</th><th>文档抽取值</th><th>来源</th></tr></thead><tbody>${
        r.docFacts.map(f => `<tr><td>${esc(f.label)}</td><td>${esc(f.value)}</td><td class="src">${esc(f.source)}</td></tr>`).join("")}</tbody></table></div>`);

    if ((r.attempts || []).length) sections.push(`<div class="section"><h2>${ico("list")} 执行记录（${r.attempts.length}）</h2><div class="log-list">${
      r.attempts.map(a => `<div class="log-row ${a.ok ? "ok" : "bad"}"><span class="log-dot"></span><div class="log-body">
        <div class="log-step">${esc(a.step || "—")}</div>${a.command ? `<code class="log-cmd">${esc(a.command)}</code>` : ""}${a.output ? `<div class="log-out">${esc(a.output)}</div>` : ""}</div></div>`).join("")}</div></div>`);

    const defects = r.defects || [];
    if (defects.length) sections.push(`<div class="section"><h2>${ico("bug")} 文档缺陷 / 缺口（${defects.length}）<span class="hint">点击行跳到下方完整报告对应缺陷</span></h2>
      <table class="dtable"><colgroup><col style="width:42%"><col style="width:11%"><col style="width:47%"></colgroup><thead><tr><th>问题</th><th>级别</th><th>来源 / 建议</th></tr></thead><tbody>${
        defects.map(d => `<tr${d.anchor ? ` class="jumpable" data-anchor="rep-defect-${d.anchor}"` : ""}><td>${inline(d.title)}</td><td>${d.level ? `<span class="lvl lvl-${d.level}">${d.level}</span>` : "—"}</td>
          <td>${d.source ? `<a href="${esc(d.source)}" target="_blank" rel="noopener">来源</a> ` : ""}${esc(d.detail || "")}</td></tr>`).join("")}</tbody></table></div>`);

    const problems = (r.problems || []).filter(p => p.title);
    if (problems.length) sections.push(`<div class="section"><h2>${ico("bug")} 遇到的问题（${problems.length}）</h2>
      <table class="dtable"><colgroup><col style="width:40%"><col style="width:60%"></colgroup><thead><tr><th>问题</th><th>根因 / 解决</th></tr></thead><tbody>${
        problems.map(p => `<tr><td>${esc(p.title)}</td><td>${esc(p.source ? p.source + " — " : "")}${esc(p.detail || "")}</td></tr>`).join("")}</tbody></table></div>`);

    // 社区CI 门禁检查项明细（放在详情后段）：列每项 ✅/❌/⚠，并说明测试型项失败属正常
    const ciP = (r.phases || []).find(p => /社区CI/.test(p.name || ""));
    if (ciP && (ciP.ciChecks || []).length) {
      const artifact = n => /issue.?associate|cla|sign.?off|package_license|check_pr|needs-issue/i.test(n);
      const icoOf = res => res === "OK" ? "✅" : res === "FAIL" ? "❌" : res === "WARN" ? "⚠️" : "·";
      const rows = ciP.ciChecks.map(c => {
        const art = artifact(c.name) || c.result === "WARN";
        const note = c.result === "OK" ? "" : art
          ? "测试型/环境门禁项（本计时 PR 为一行 no-op 改动且不关联 issue，必然不过）— 不算文档缺陷"
          : "构建/测试类门禁项";
        return `<tr><td><code>${esc(c.name)}</code></td><td>${icoOf(c.result)} ${esc(c.result)}</td><td>${note}</td></tr>`;
      }).join("");
      const verdict = ciP.ciFailExpected
        ? `<div class="ci-verdict ok">实测结论：<b>通过</b>。构建/测试类门禁项全部通过；仅 <code>check_issue_associate</code> / CLA 等测试型项未过，这是本计时测试方法（no-op PR、未关联 issue、noreply 邮箱）必然产生的，<b>不算文档缺陷、不判失败</b>。</div>`
        : "";
      sections.push(`<div class="section"><h2>${ico("flask")} 社区CI 门禁检查项（${ciP.ciChecks.length}）</h2>${verdict}
        <table class="dtable"><colgroup><col style="width:30%"><col style="width:14%"><col style="width:56%"></colgroup>
        <thead><tr><th>检查项</th><th>结果</th><th>说明</th></tr></thead><tbody>${rows}</tbody></table></div>`);
    }

    if (r.summary) sections.push(`<div class="section"><h2>${ico("doc")} 结论摘要</h2><div class="summary-text">${esc(r.summary)}</div></div>`);

    const hist = state.data.records.filter(x => x.scenario === r.scenario && x.community === r.community && (r.scenario === "user" || x.repo === r.repo)).sort((a, b) => b.date.localeCompare(a.date));
    if (hist.length > 1) sections.push(`<div class="section"><h2>${ico("chart")} 历史记录（${hist.length} 次）</h2><div class="history-list">${
      hist.map(h => `<div class="hist" data-id="${h.id}"><span>${h.date}</span><span class="badge ${h.result}">${RES[h.result]}</span>
        <span class="src">${h.scene && h.scene !== "compile-verify" ? h.scene : ""}</span><span class="num mono" style="text-align:right">${h.totalMinutes ? h.totalMinutes + " min" : "—"}</span></div>`).join("")}</div></div>`);

    if (r.reportFile) sections.push(`<div class="section"><h2>${ico("doc")} 完整报告（原始文档）</h2><div id="fullReport" class="full-report">加载中…</div></div>`);

    content.innerHTML = `<div class="detail"><a class="back" href="#">‹ 返回总览</a>
      <div class="detail-head"><div class="dh-id"><h1>${ico("repo")} ${r.repo}</h1>
        <div class="meta"><span class="cm">社区：${r.community}</span><span>${SCEN[r.scenario]}</span>${r.manual ? `<span class="badge manual" title="人工撰写报告（非自动化测试），不计入总汇数据源">人工</span>` : ""}<span>${r.date}</span>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">仓库 ↗</a>` : ""}</div></div>
        <div class="spacer"></div><span class="badge ${r.result} big">${RES[r.result]}</span></div>${sections.join("")}</div>`;
    content.querySelectorAll(".hist").forEach(h => h.addEventListener("click", () => { location.hash = "#id=" + h.dataset.id; }));
    content.querySelectorAll("tr.jumpable").forEach(tr => tr.addEventListener("click", () => {
      const el = document.getElementById(tr.dataset.anchor);
      if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 1600); }
    }));
    if (r.reportFile) loadReport(r);
    window.scrollTo(0, 0);
  }

  function dcard(icon, title, rows, ...extra) {
    const kv = rows.filter(Boolean).map(([k, v]) => `<div class="kv"><span class="k">${esc(k)}</span><span class="val">${typeof v === "string" && v.startsWith("<") ? v : esc(v)}</span></div>`).join("");
    return `<div class="dcard"><h3>${ico(icon)} ${title}</h3>${kv}${extra.filter(Boolean).join("")}</div>`;
  }
  const badge = s => `<span class="badge ${s || "unknown"}">${RES[s] || "未知"}</span>`;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // 行内 markdown：粗体 / 行内代码 / 链接
  const inline = s => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // 轻量 markdown → HTML（标题/表格/列表/代码块/引用/段落）
  function mdToHtml(md) {
    const lines = md.replace(/\r/g, "").split("\n"), out = [];
    let i = 0;
    while (i < lines.length) {
      let ln = lines[i];
      if (/^```/.test(ln)) { const buf = []; i++; while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]); i++; out.push(`<pre class="md-code">${esc(buf.join("\n"))}</pre>`); continue; }
      if (/^\s*\|.*\|/.test(ln)) {
        const rows = []; while (i < lines.length && /^\s*\|.*\|/.test(lines[i])) rows.push(lines[i++]);
        const cells = r => r.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());
        const head = cells(rows[0]); const body = rows.slice(rows[1] && /^[\s|:-]+$/.test(rows[1]) ? 2 : 1);
        out.push(`<table class="md-table"><thead><tr>${head.map(h => `<th>${inline(h)}</th>`).join("")}</tr></thead><tbody>${
          body.map(r => `<tr>${cells(r).map(c => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`); continue;
      }
      const h = ln.match(/^(#{1,6})\s+(.*)/); if (h) { const dm = h[2].match(/缺陷\s*#?\s*(\d+)/); const id = dm ? ` id="rep-defect-${dm[1]}"` : ""; out.push(`<h${h[1].length} class="md-h"${id}>${inline(h[2])}</h${h[1].length}>`); i++; continue; }
      if (/^\s*[-*]\s+/.test(ln)) { const items = []; while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*]\s+/, "")); out.push(`<ul class="md-ul">${items.map(t => `<li>${inline(t)}</li>`).join("")}</ul>`); continue; }
      if (/^\s*\d+\.\s+/.test(ln)) { const items = []; while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+\.\s+/, "")); out.push(`<ol class="md-ol">${items.map(t => `<li>${inline(t)}</li>`).join("")}</ol>`); continue; }
      if (/^\s*>/.test(ln)) { out.push(`<blockquote class="md-q">${inline(ln.replace(/^\s*>\s?/, ""))}</blockquote>`); i++; continue; }
      if (/^\s*(---|\*\*\*)\s*$/.test(ln)) { out.push("<hr>"); i++; continue; }
      if (!ln.trim()) { i++; continue; }
      out.push(`<p class="md-p">${inline(ln)}</p>`); i++;
    }
    return out.join("\n");
  }

  function loadReport(r) {
    fetch("./" + r.reportFile).then(x => x.ok ? x.text() : Promise.reject(x.status)).then(txt => {
      const el = document.getElementById("fullReport"); if (!el) return;
      if (r.reportFile.endsWith(".json")) { let p = txt; try { p = JSON.stringify(JSON.parse(txt), null, 2); } catch (e) {} el.innerHTML = `<pre class="json-dump">${esc(p)}</pre>`; }
      else el.innerHTML = mdToHtml(txt);
    }).catch(e => { const el = document.getElementById("fullReport"); if (el) el.textContent = "报告加载失败：" + e; });
  }
  window.__loadReport = loadReport;
})();
