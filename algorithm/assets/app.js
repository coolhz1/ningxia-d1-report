
"use strict";

document.querySelector("[data-print]")?.addEventListener("click", () => window.print());
let printDetails = [];
window.addEventListener("beforeprint", () => {
  printDetails = [...document.querySelectorAll("details")].map(element => [element, element.open]);
  printDetails.forEach(([element]) => { element.open = true; });
});
window.addEventListener("afterprint", () => {
  printDetails.forEach(([element, wasOpen]) => { element.open = wasOpen; });
});

const colors = {
  actual: "#182c3b", baseline: "#8996a3", final: "#087f83",
  warm: "#bb8246", purple: "#8e6fa6", blue: "#367da5"
};
const format = (number, digits = 2) => Number.isFinite(number) ? number.toFixed(digits) : "—";
const mean = values => values.reduce((sum, value) => sum + value, 0) / values.length;
const byDay = rows => {
  const days = new Map();
  for (const row of rows) {
    if (!days.has(row.date)) days.set(row.date, []);
    days.get(row.date).push(row);
  }
  return days;
};

function score(rows, model) {
  if (!rows.length) return null;
  const errors = rows.map(row => Math.abs(row[model] - row.actual));
  const accuracy = rows.filter(row => row.actual !== 0)
    .map(row => Math.max(0, 1 - Math.abs(row[model] - row.actual) / Math.abs(row.actual)));
  const peak = [], valley = [], strictPeak = [], strictValley = [];
  const rankKey = model === "final" ? "rank" : "baselineRaw";
  for (const day of byDay(rows).values()) {
    if (day.length !== 24) throw new Error("Daily metrics require 24 hours");
    const indices = Array.from({length: 24}, (_, i) => i);
    const high = indices.slice().sort((a, b) =>
      day[b][model] - day[a][model] || day[b][rankKey] - day[a][rankKey] || a - b).slice(0, 4);
    const low = indices.slice().sort((a, b) =>
      day[a][model] - day[b][model] || day[a][rankKey] - day[b][rankKey] || a - b).slice(0, 4);
    const trueHigh = indices.slice().sort((a, b) => day[b].actual - day[a].actual || a - b).slice(0, 4);
    const trueLow = indices.slice().sort((a, b) => day[a].actual - day[b].actual || a - b).slice(0, 4);
    const upper = day[trueHigh[3]].actual;
    const lower = day[trueLow[3]].actual;
    peak.push(high.filter(i => day[i].actual >= upper - 1e-9).length / 4);
    valley.push(low.filter(i => day[i].actual <= lower + 1e-9).length / 4);
    strictPeak.push(high.filter(i => trueHigh.includes(i)).length / 4);
    strictValley.push(low.filter(i => trueLow.includes(i)).length / 4);
  }
  return {
    MAE: mean(errors), RMSE: Math.sqrt(mean(errors.map(value => value * value))),
    accuracy: accuracy.length ? mean(accuracy) * 100 : null,
    peak_top4: mean(peak) * 100, valley_bottom4: mean(valley) * 100,
    strict_peak_top4: mean(strictPeak) * 100, strict_valley_bottom4: mean(strictValley) * 100,
    n: rows.length, valid: accuracy.length
  };
}

const chartStates = new Map();
function drawChart(id, series, labels, unit, readoutId = null, hoverText = null) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const state = {id, series, labels, unit, readoutId, hoverText};
  chartStates.set(id, state);
  paintChart(state);
}

function paintChart(state, selected = null) {
  const {id, series, labels, unit} = state;
  const canvas = document.getElementById(id);
  const width = Math.max(250, canvas.parentElement.clientWidth);
  const height = 280;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, width, height);
  const left = width < 420 ? 44 : 58, right = 16, top = 30, bottom = 34;
  const plotWidth = width - left - right, plotHeight = height - top - bottom;
  const values = series.flatMap(item => item.values).filter(Number.isFinite);
  ctx.font = '10px Inter, "PingFang SC", sans-serif';
  ctx.fillStyle = "#647583";
  if (!values.length) {
    ctx.fillText("当前区间无可绘制数据", left, 90);
    return;
  }
  let lower = Math.min(...values), upper = Math.max(...values);
  const padding = (upper - lower || 1) * 0.1;
  lower -= padding;
  upper += padding;
  const x = index => left + index * plotWidth / Math.max(1, labels.length - 1);
  const y = value => top + (upper - value) * plotHeight / (upper - lower);
  ctx.fillText(unit, 4, 13);
  ctx.textAlign = "right";
  for (let tick = 0; tick <= 4; tick++) {
    const value = lower + tick * (upper - lower) / 4;
    const position = y(value);
    ctx.strokeStyle = "#e8edef";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(left, position);
    ctx.lineTo(width - right, position);
    ctx.stroke();
    ctx.fillStyle = "#71828b";
    ctx.fillText(value.toFixed(upper - lower < 15 ? 1 : 0), left - 8, position + 3);
  }
  ctx.textAlign = "center";
  const tickCount = Math.min(labels.length, width < 500 ? 5 : 8);
  for (let tick = 0; tick < tickCount; tick++) {
    const index = Math.round(tick * (labels.length - 1) / Math.max(1, tickCount - 1));
    ctx.fillText(labels[index], x(index), height - 11);
  }
  for (const item of series) {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = item.key === "baseline" ? 1.25 : 1.7;
    ctx.setLineDash(item.dashed ? [4, 3] : []);
    ctx.beginPath();
    let connected = false;
    item.values.forEach((value, index) => {
      if (!Number.isFinite(value)) { connected = false; return; }
      if (connected) ctx.lineTo(x(index), y(value));
      else ctx.moveTo(x(index), y(value));
      connected = true;
    });
    ctx.stroke();
  }
  ctx.setLineDash([]);
  if (selected !== null) {
    ctx.strokeStyle = "#9bb1b5";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x(selected), top);
    ctx.lineTo(x(selected), height - bottom);
    ctx.stroke();
    for (const item of series) {
      const value = item.values[selected];
      if (!Number.isFinite(value)) continue;
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(x(selected), y(value), 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  canvas.onpointermove = event => {
    const box = canvas.getBoundingClientRect();
    const index = Math.max(0, Math.min(labels.length - 1,
      Math.round((event.clientX - box.left - left) / plotWidth * (labels.length - 1))));
    if (state.readoutId && state.hoverText) {
      document.getElementById(state.readoutId).textContent = state.hoverText(index);
    }
    paintChart(state, index);
  };
  canvas.onpointerleave = () => paintChart(state);
}

function metricTable(baseline, final) {
  const headings = ["模型", "MAE", "RMSE", "准确率", "峰捕获", "谷捕获", "严格峰重合", "严格谷重合"];
  const head = headings.map(label => "<th scope=\"col\">" + label + "</th>").join("");
  const rows = [["原始LightGBM基线", baseline], ["精简定版", final]].map(([name, result], index) => {
    const cells = [name, format(result.MAE), format(result.RMSE),
      ...["accuracy", "peak_top4", "valley_bottom4", "strict_peak_top4", "strict_valley_bottom4"]
        .map(key => format(result[key]) + (Number.isFinite(result[key]) ? "%" : ""))];
    return "<tr" + (index ? ' class="selected"' : "") + ">" +
      cells.map(cell => "<td>" + cell + "</td>").join("") + "</tr>";
  }).join("");
  return '<table class="numeric"><thead><tr>' + head + "</tr></thead><tbody>" + rows + "</tbody></table>";
}

async function initializeBacktest() {
  if (!document.getElementById("startDate")) return;
  const response = await fetch("assets/data.json");
  if (!response.ok) throw new Error("Could not load frozen comparison");
  const data = await response.json();
  const allDays = byDay(data.hourly);
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");
  const status = document.getElementById("rangeStatus");
  const select = document.getElementById("daySelect");
  let selectedDates = [];
  const priceSeries = rows => ["actual", "baseline", "final"].map(key =>
    ({key, values: rows.map(row => row[key]), color: colors[key], dashed: key === "baseline"}));
  const hourLabel = period => String(period).padStart(2, "0") + ":00";
  const hover = rows => index => {
    const row = rows[index];
    return row.date + " " + hourLabel(row.period) + "　实际 " + format(row.actual) +
      "　基线 " + format(row.baseline) + "　定版 " + format(row.final) + " 元/MWh";
  };

  function drawDay() {
    const date = select.value;
    const rows = allDays.get(date);
    const index = selectedDates.indexOf(date);
    document.getElementById("previousDay").disabled = index <= 0;
    document.getElementById("nextDay").disabled = index >= selectedDates.length - 1;
    if (!rows) return;
    const baseline = score(rows, "baseline"), final = score(rows, "final");
    const w = data.weather[date];
    document.getElementById("daySummary").textContent = date +
      "　基线MAE " + format(baseline.MAE) + "　定版MAE " + format(final.MAE) +
      "　定版准确率 " + format(final.accuracy) + "%　夜间低价概率 " +
      format(rows[0].nightProbability * 100, 1) + "%　滞后出力偏差 " + format(w.bias_MW, 0) + " MW";
    const labels = rows.map(row => hourLabel(row.period));
    drawChart("dayChart", priceSeries(rows), labels, "元/MWh", "dayHover", hover(rows));
    const weatherChart = (id, keys, unit) => drawChart(id, keys.map(([key, color, dashed]) =>
      ({key, values: w[key], color, dashed})), labels, unit);
    weatherChart("marketChart", [["load", colors.actual], ["space", colors.final],
      ["corrected_space", colors.warm, true]], "GW");
    weatherChart("generationChart", [["pv", colors.warm], ["wind", colors.final],
      ["corrected_wind", colors.purple, true]], "GW");
    weatherChart("windChart", [["gfs_seamless", colors.blue], ["ecmwf_ifs025", colors.final],
      ["icon_global", colors.warm]], "m/s");
    weatherChart("temperatureChart", [["apparent_temperature", colors.warm],
      ["air_temperature", colors.blue]], "°C");
    const body = rows.map(row => {
      const acc = model => row.actual === 0 ? "—" : format(Math.max(0, 1 - Math.abs(row[model] - row.actual) / Math.abs(row.actual)) * 100) + "%";
      return "<tr>" + [hourLabel(row.period), format(row.actual, 4), format(row.baseline, 4),
        format(row.final, 4), format(Math.abs(row.baseline - row.actual), 4),
        format(Math.abs(row.final - row.actual), 4), acc("baseline"), acc("final")]
        .map(cell => "<td>" + cell + "</td>").join("") + "</tr>";
    }).join("");
    document.getElementById("hourlyTable").innerHTML = '<table class="numeric"><thead><tr>' +
      ["时段末时刻", "实际价", "基线价", "定版价", "基线绝对误差", "定版绝对误差", "基线准确率", "定版准确率"]
        .map(label => "<th>" + label + "</th>").join("") + "</tr></thead><tbody>" + body + "</tbody></table>";
  }

  function applyRange() {
    const start = startInput.value, end = endInput.value;
    let message = "";
    if (!start || !end) message = "请输入有效的起止日期。";
    else if (start > end) message = "起始日期晚于结束日期，请调整日期。";
    const rows = message ? [] : data.hourly.filter(row => row.date >= start && row.date <= end);
    if (!message && !rows.length) message = "所选区间无数据。可用范围为" + data.start + "至" + data.end + "。";
    if (message) {
      status.className = "error";
      status.textContent = message;
      document.getElementById("metricTable").innerHTML = "";
      document.getElementById("dailyMetrics").innerHTML = "";
      document.getElementById("rangeHover").textContent = "";
      drawChart("rangeChart", [], [], "元/MWh");
      drawChart("maeChart", [], [], "MAE");
      return;
    }
    const days = byDay(rows), baseline = score(rows, "baseline"), final = score(rows, "final");
    const partial = start < data.start || end > data.end;
    status.className = "";
    status.textContent = (partial ? "按可用数据交集统计，" : "") +
      rows[0].date + "至" + rows[rows.length - 1].date + "，" +
      days.size + "天 / " + rows.length + "小时，准确率有效" + final.valid + "小时。MAE单位为元/MWh。";
    document.getElementById("metricTable").innerHTML = metricTable(baseline, final);
    const labels = rows.map(row => days.size === 1 ? hourLabel(row.period) : row.date.slice(5));
    drawChart("rangeChart", priceSeries(rows), labels, "元/MWh", "rangeHover", hover(rows));
    document.getElementById("rangeHover").textContent = "将鼠标移到图中查看小时价格。";
    const daily = [...days].map(([date, day]) => ({date, baseline: score(day, "baseline"), final: score(day, "final")}));
    drawChart("maeChart", ["baseline", "final"].map(key => ({
      key, values: daily.map(row => row[key].MAE), color: colors[key]
    })), daily.map(row => row.date.slice(5)), "MAE 元/MWh");
    const dailyBody = daily.map(row => {
      const cells = ['<button class="day-link" type="button" data-day="' + row.date + '">' + row.date + "</button>",
        format(row.baseline.MAE), format(row.final.MAE), format(row.final.MAE - row.baseline.MAE),
        format(row.baseline.accuracy) + "%", format(row.final.accuracy) + "%",
        format(row.final.peak_top4) + "%", format(row.final.valley_bottom4) + "%"];
      return "<tr>" + cells.map(cell => "<td>" + cell + "</td>").join("") + "</tr>";
    }).join("");
    document.getElementById("dailyMetrics").innerHTML = '<table class="numeric"><thead><tr>' +
      ["日期 / 查看曲线", "基线MAE", "定版MAE", "定版−基线", "基线准确率", "定版准确率", "定版峰捕获", "定版谷捕获"]
        .map(label => "<th>" + label + "</th>").join("") + "</tr></thead><tbody>" + dailyBody + "</tbody></table>";
    const previous = select.value;
    selectedDates = [...days.keys()];
    select.replaceChildren(...selectedDates.map(date => new Option(date, date)));
    if (selectedDates.includes(previous)) select.value = previous;
    drawDay();
  }

  document.getElementById("applyRange").addEventListener("click", applyRange);
  for (const input of [startInput, endInput]) input.addEventListener("keydown", event => {
    if (event.key === "Enter") applyRange();
  });
  document.getElementById("october").addEventListener("click", () => {
    startInput.value = "2026-10-01"; endInput.value = "2026-10-31"; applyRange();
  });
  document.getElementById("november").addEventListener("click", () => {
    startInput.value = "2026-11-01"; endInput.value = "2026-11-05"; applyRange();
  });
  select.addEventListener("change", drawDay);
  document.getElementById("previousDay").addEventListener("click", () => { select.selectedIndex--; drawDay(); });
  document.getElementById("nextDay").addEventListener("click", () => { select.selectedIndex++; drawDay(); });
  document.getElementById("dailyMetrics").addEventListener("click", event => {
    const button = event.target.closest("[data-day]");
    if (!button) return;
    select.value = button.dataset.day;
    drawDay();
    document.getElementById("daily").scrollIntoView({behavior: "smooth"});
  });
  const observer = new ResizeObserver(() => {
    for (const state of chartStates.values()) paintChart(state);
  });
  observer.observe(document.getElementById("rangeChart").parentElement);
  applyRange();
  window.NXDocs = {score, data, applyRange, drawDay};
  document.documentElement.dataset.ready = "true";
}

initializeBacktest().catch(error => {
  const status = document.getElementById("rangeStatus");
  if (status) { status.className = "error"; status.textContent = "回测数据载入失败，请刷新页面。"; }
  console.error(error);
});
