/* TTFHW 测试总汇报告 — 列表 + 详情子页（原生 JS，无构建步骤） */
(() => {
  "use strict";
  const SCEN = { user: "用户场景", developer: "开发者场景" };
  const RES = { success: "成功", partial: "部分成功", failed: "失败", unknown: "未知", not_run: "未执行" };
  const COMM_ORDER = ["openEuler","HPCKit","UBS Core","openUBMC","CANN","MindSpeed","MindIE","PTA","MindSpore","openGauss","Ascend","其他"];

  const state = { data: null, month: "latest", scenario: "all", result: "all", query: "" };

  fetch("./data.json").then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(d => { state.data = d; init(); })
    .catch(e => { document.getElementById("content").innerHTML =
      `<div class="empty">数据加载失败：${e}。请通过 HTTP（非 file://）打开。</div>`; });

  function init() {
    const d = state.data;
    document.getElementById("genAt").textContent =
      d.generatedAt && d.generatedAt !== "build" ? `数据生成于 ${d.generatedAt}` : "";
    const sel = document.getElementById("monthSel");
    sel.appendChild(opt("latest", "Latest（各仓库最新全量）"));
    d.months.forEach(m => sel.appendChild(opt(m, m.replace("-", " 年 ") + " 月")));
    sel.addEventListener("change", () => { state.month = sel.value; route(); });
    document.getElementById("scenarioTabs").addEventListener("click", e => {
      const b = e.target.closest(".tab"); if (!b) return;
      state.scenario = b.dataset.scenario; setActive("#scenarioTabs .tab", b); route(); });
    document.getElementById("resultChips").addEventListener("click", e => {
      const b = e.target.closest(".chip"); if (!b) return;
      state.result = b.dataset.result; setActive("#resultChips .chip", b); route(); });
    const s = document.getElementById("search");
    s.addEventListener("input", () => { state.query = s.value.trim().toLowerCase(); if (!location.hash.startsWith("#id=")) route(); });
    window.addEventListener("hashchange", route);
    route();
  }
  const opt = (v, t) => { const o = document.createElement("option"); o.value = v; o.textContent = t; return o; };
  function setActive(sel, btn) { document.querySelectorAll(sel).forEach(x => x.classList.remove("active")); btn.classList.add("active"); }

  function route() {
    const m = location.hash.match(/^#id=(\d+)/);
    const ctrls = document.querySelector(".controls"), stats = document.getElementById("stats");
    if (m) { renderDetail(+m[1]); ctrls.style.display = "none"; stats.style.display = "none"; }
    else { ctrls.style.display = ""; stats.style.display = ""; renderList(); }
  }

  // 选取视图记录：Latest=每仓库最新；某月=该月每仓库最新
  function selectRecords() {
    let recs = state.data.records.slice();
    if (state.month !== "latest") recs = recs.filter(r => r.month === state.month);
    const g = new Map();
    for (const r of recs) { const k = `${r.scenario}|${r.community}|${r.repo}`; const c = g.get(k); if (!c || r.date > c.date) g.set(k, r); }
    let out = [...g.values()];
    if (state.scenario !== "all") out = out.filter(r => r.scenario === state.scenario);
    if (state.result !== "all") out = out.filter(r => r.result === state.result);
    if (state.query) out = out.filter(r => r.repo.toLowerCase().includes(state.query) || r.community.toLowerCase().includes(state.query));
    return out;
  }

  // ── 列表页 ───────────────────────────────────────────────────────────
  function renderList() {
    const recs = selectRecords();
    renderStats(recs);
    const content = document.getElementById("content"), empty = document.getElementById("empty");
    content.innerHTML = ""; empty.hidden = recs.length > 0;
    if (!recs.length) return;
    const scenarios = state.scenario === "all" ? ["developer", "user"] : [state.scenario];
    for (const sc of scenarios) {
      const sr = recs.filter(r => r.scenario === sc);
      if (sr.length) content.appendChild(scenarioBlock(sc, sr));
    }
  }

  function renderStats(recs) {
    const el = document.getElementById("stats");
    const total = recs.length, by = k => recs.filter(r => r.result === k).length;
    const succ = by("success"), part = by("partial"), fail = by("failed");
    const passRate = total ? Math.round(succ / total * 100) : 0;
    const durs = recs.filter(r => r.totalMinutes > 0).map(r => r.totalMinutes);
    const avgDur = durs.length ? Math.round(durs.reduce((a, b) => a + b, 0) / durs.length) : 0;
    const dev = recs.filter(r => r.scenario === "developer");
    const buildOk = dev.filter(r => r.build && (r.build.status === "success" || r.build.status === "partial")).length;
    const buildRate = dev.length ? Math.round(buildOk / dev.length * 100) : 0;
    const utT = dev.reduce((s, r) => s + ((r.test && r.test.total) || 0), 0);
    const utP = dev.reduce((s, r) => s + ((r.test && r.test.passed) || 0), 0);
    const utRate = utT ? Math.round(utP / utT * 100) : 0;
    const bmin = dev.filter(r => r.build && r.build.minutes > 0).map(r => r.build.minutes);
    const avgBuild = bmin.length ? Math.round(bmin.reduce((a, b) => a + b, 0) / bmin.length) : 0;
    const comm = new Set(recs.map(r => r.community)).size;

    const card = (v, k, sub) => `<div class="stat"><div class="v">${v}</div><div class="k">${k}</div>${sub ? `<div class="sub">${sub}</div>` : ""}</div>`;
    el.innerHTML =
      card(total, "仓库 / 场景数", `<span><b>${comm}</b> 个社区</span>`) +
      card(`${passRate}<small>%</small>`, "TTFHW 通过率",
        `<span class="s-succ">成功 ${succ}</span><span class="s-part">部分 ${part}</span><span class="s-fail">失败 ${fail}</span>`) +
      card(`${avgDur}<small> min</small>`, "平均总时长", `${durs.length} 条有耗时`) +
      card(`${buildRate}<small>%</small>`, "构建成功率（开发者）", `${buildOk}/${dev.length} 仓库`) +
      card(utT ? `${utRate}<small>%</small>` : "—", "UT 通过率（开发者）", utT ? `${utP} / ${utT} 用例` : "无 UT 数据") +
      card(avgBuild ? `${avgBuild}<small> min</small>` : "—", "平均构建时长", `${bmin.length} 仓库有时长`);
  }

  function scenarioBlock(sc, recs) {
    const block = document.createElement("section"); block.className = "scenario-block";
    const phases = state.data.phaseNames[sc] || [];
    const head = document.createElement("div"); head.className = "scenario-head";
    head.innerHTML = `<h2>${SCEN[sc]}</h2><span class="pill">${recs.length} 条</span><span class="legend">四阶段：${phases.join(" · ")}（数字＝分钟）</span>`;
    block.appendChild(head);
    const byC = new Map();
    for (const r of recs) { if (!byC.has(r.community)) byC.set(r.community, []); byC.get(r.community).push(r); }
    [...byC.keys()].sort((a, b) => ix(a) - ix(b) || a.localeCompare(b)).forEach(c =>
      block.appendChild(communityTable(sc, c, byC.get(c).sort((a, b) => a.repo.localeCompare(b.repo)), phases)));
    return block;
  }
  const ix = v => { const i = COMM_ORDER.indexOf(v); return i < 0 ? 99 : i; };

  function communityTable(sc, comm, items, phases) {
    const wrap = document.createElement("div"); wrap.className = "community";
    const dist = { success: 0, partial: 0, failed: 0 };
    items.forEach(r => dist[r.result] !== undefined && dist[r.result]++);
    const head = document.createElement("div"); head.className = "community-head";
    head.innerHTML = `<span class="name">${comm}</span><span class="count">${items.length} 仓库</span>
      <span class="mini">成功 ${dist.success} · 部分 ${dist.partial} · 失败 ${dist.failed}</span>`;
    wrap.appendChild(head);

    const isDev = sc === "developer";
    const cols = `<th>仓库</th><th>结果</th>` + phases.map(p => `<th class="num">${p}</th>`).join("")
      + (isDev ? `<th class="num">UT</th>` : `<th class="num">断点</th>`)
      + `<th class="num">总时长</th><th class="num">缺陷</th><th>日期</th><th></th>`;
    const rows = items.map(r => {
      const pc = r.phases.map(p => `<td class="num phase-cell ${p.status}"><span class="m ${p.minutes ? "" : "zero"}">${p.minutes || "·"}</span></td>`).join("");
      let extra;
      if (isDev) {
        const t = r.test || {};
        extra = t.total ? `<td class="num"><span class="ut-pass">${t.passed || 0}</span>/${t.total}</td>` : `<td class="num">—</td>`;
      } else {
        extra = `<td class="num">${r.breakpoints || 0}</td>`;
      }
      const dn = (r.defects || []).length;
      return `<tr data-id="${r.id}">
        <td class="repo-cell">${r.repo}${r.scene && r.scene !== "compile-verify" ? `<span class="scn">${r.scene}</span>` : ""}</td>
        <td><span class="badge ${r.result}">${RES[r.result]}</span></td>
        ${pc}${extra}
        <td class="num">${r.totalMinutes || "·"}</td>
        <td class="num">${dn ? `<span class="defect-n">${dn}</span>` : "·"}</td>
        <td>${r.date}</td><td class="link-arrow">›</td></tr>`;
    }).join("");
    const t = document.createElement("div"); t.className = "tbl-wrap";
    t.innerHTML = `<table><thead><tr>${cols}</tr></thead><tbody>${rows}</tbody></table>`;
    t.querySelectorAll("tbody tr").forEach(tr => tr.addEventListener("click", () => { location.hash = "#id=" + tr.dataset.id; }));
    wrap.appendChild(t);
    return wrap;
  }

  // ── 详情子页 ─────────────────────────────────────────────────────────
  function renderDetail(id) {
    const r = state.data.records.find(x => x.id === id);
    const content = document.getElementById("content"), empty = document.getElementById("empty");
    empty.hidden = true;
    if (!r) { content.innerHTML = `<div class="empty">未找到该记录。<a href="#">返回</a></div>`; return; }
    const phases = state.data.phaseNames[r.scenario] || [];
    const maxMin = Math.max(1, ...r.phases.map(p => p.minutes));
    const tl = r.phases.map(p => `<div class="tl-row"><span class="tl-name">${p.name}</span>
      <span class="tl-min">${p.minutes ? p.minutes + " min" : "—"}</span>
      <span class="tl-bar"><i class="bar-${p.status}" style="width:${Math.max(4, p.minutes / maxMin * 100)}%"></i></span></div>`).join("");

    const cards = [];
    cards.push(dcard("结果概览", [
      ["场景", SCEN[r.scenario]], ["社区", r.community], ["阶段", phases.join(" · ")],
      ["总时长", r.totalMinutes ? r.totalMinutes + " min" : "—"], ["日期", r.date],
      r.scene && r.scene !== "compile-verify" ? ["场景关键字", r.scene] : null,
    ]));
    if (r.scenario === "developer") {
      const b = r.build || {}, t = r.test || {}, e = r.env || {};
      cards.push(dcard("构建", [
        ["状态", badge(b.status)], ["耗时", b.minutes ? b.minutes + " min" : "—"],
        b.command ? null : ["命令", "—"],
      ], b.command ? `<div class="codeblock">${esc(b.command)}</div>` : "", b.error ? `<div class="codeblock errblock">${esc(b.error)}</div>` : ""));
      cards.push(dcard("测试 (UT)", [
        ["状态", badge(t.status)],
        ["通过 / 总数", t.total ? `<span class="ut-pass">${t.passed || 0}</span> / ${t.total}` : "—"],
        t.failed ? ["失败", `<span class="ut-fail">${t.failed}</span>`] : null,
        t.note ? ["说明", esc(t.note)] : null,
      ]));
      if (Object.keys(e).length) cards.push(dcard("运行环境", [
        ["OS", e.os || "—"], ["架构", e.arch || "—"],
        e.cpu ? ["CPU 核", e.cpu] : null, e.mem ? ["内存", typeof e.mem === "number" ? Math.round(e.mem / 1024) + " GB" : e.mem] : null,
        r.depsCount ? ["安装依赖", r.depsCount + " 个包"] : null,
      ], e.image ? `<div class="codeblock">${esc(e.image)}</div>` : ""));
    }

    const defects = r.defects || [];
    const defSection = defects.length ? `<div class="section"><h2>文档缺陷 / 缺口（${defects.length}）</h2>
      <table class="dtable"><thead><tr><th>问题</th><th>级别</th><th>来源/建议</th></tr></thead><tbody>${
        defects.map(d => `<tr><td>${esc(d.title)}</td><td>${d.level ? `<span class="lvl lvl-${d.level}">${d.level}</span>` : "—"}</td>
          <td>${d.source ? `<a href="${esc(d.source)}" target="_blank" rel="noopener">来源</a> ` : ""}${esc(d.detail || "")}</td></tr>`).join("")
      }</tbody></table></div>` : "";
    const problems = (r.problems || []).filter(p => p.title);
    const probSection = problems.length ? `<div class="section"><h2>遇到的问题（${problems.length}）</h2>
      <table class="dtable"><thead><tr><th>问题</th><th>根因 / 解决</th></tr></thead><tbody>${
        problems.map(p => `<tr><td>${esc(p.title)}</td><td>${esc(p.detail || "")}</td></tr>`).join("")}</tbody></table></div>` : "";
    const sumSection = r.summary ? `<div class="section"><h2>结论摘要</h2><div class="summary-text">${esc(r.summary)}</div></div>` : "";

    // 历史：同 repo+scenario 各次
    const hist = state.data.records.filter(x => x.scenario === r.scenario && x.community === r.community && x.repo === r.repo)
      .sort((a, b) => b.date.localeCompare(a.date));
    const histSection = hist.length > 1 ? `<div class="section"><h2>历史记录（${hist.length} 次）</h2><div class="history-list">${
      hist.map(h => `<div class="hist" data-id="${h.id}"><span>${h.date}</span><span class="badge ${h.result}">${RES[h.result]}</span>
        <span style="color:var(--text-faint)">${h.scene && h.scene !== "compile-verify" ? h.scene : ""}</span>
        <span class="num" style="text-align:right">${h.totalMinutes ? h.totalMinutes + " min" : "—"}</span></div>`).join("")
    }</div></div>` : "";

    content.innerHTML = `<div class="detail">
      <a class="back" href="#">‹ 返回总览</a>
      <div class="detail-head"><div class="dh-id">
        <h1>${r.repo}</h1>
        <div class="meta"><span class="cm">社区：${r.community}</span><span>${SCEN[r.scenario]}</span>
          <span>${r.date}</span>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">仓库 ↗</a>` : ""}</div>
      </div><div class="spacer"></div><span class="badge ${r.result}" style="font-size:13px;padding:6px 14px">${RES[r.result]}</span></div>
      <div class="section"><h2>四阶段耗时</h2><div class="timeline">${tl}</div></div>
      <div class="cards">${cards.join("")}</div>
      ${defSection}${probSection}${sumSection}${histSection}
    </div>`;
    content.querySelectorAll(".hist").forEach(h => h.addEventListener("click", () => { location.hash = "#id=" + h.dataset.id; }));
    window.scrollTo(0, 0);
  }

  function dcard(title, rows, ...extra) {
    const kv = rows.filter(Boolean).map(([k, v]) => `<div class="kv"><span class="k">${k}</span><span class="val">${v}</span></div>`).join("");
    return `<div class="dcard"><h3>${title}</h3>${kv}${extra.filter(Boolean).join("")}</div>`;
  }
  const badge = s => `<span class="badge ${s || "unknown"}">${RES[s] || "未知"}</span>`;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
})();
