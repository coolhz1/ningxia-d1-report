"use strict";

const resourceLabels = {
  version: "算法版本", compiled_date: "参数编制日期", scope: "任务范围",
  selection_requirements: "定版筛选条件", final_metrics: "定版全区间指标",
  monthly_metrics: "月度指标", seed: "随机种子", base_features: "44维小时输入",
  night_classifier_features: "夜间分类输入", night_quantile_features: "夜间条件分位数输入",
  price_context: "历史价格上下文", forests: "双森林参数", short: "短窗森林", long: "长窗森林",
  type: "模型类型", window_days: "历史窗口天数", trees: "树数", min_samples_leaf: "叶节点最少样本",
  max_features: "单次分裂特征比例", n_jobs: "并行线程数", outputs: "输出",
  fusion: "曲线融合", short_weight: "短窗权重", long_weight: "长窗权重",
  night_shape: "夜间形状构造", day: "日间价格", evening: "晚间模型与融合",
  tie_score: "并列排序分数", night: "夜间两阶段模型", low_label: "低价标签",
  classifier: "低价分类器", classifier_max_iter: "分类器最大迭代次数",
  classifier_solver: "分类器求解器", minimum_prior_days: "最少历史天数",
  minimum_positive_days: "最少正常价格天数", quantiles: "条件分位数网格",
  quantile_alpha: "分位数回归正则", quantile_scale_y: "价格缩放除数",
  low_probability_threshold: "低价概率阈值", floor_level: "低价水平", conditional_alpha: "条件分位点",
  generation_bias: "滞后出力偏差修正", lag_days: "实测滞后天数", ewm_span: "指数加权跨度",
  adjust: "归一化历史权重", ignore_na: "跳过缺测", min_periods: "最少有效偏差数",
  clip_MW: "修正上下限（MW）", target_proxy: "偏差代理定义",
  shared_calibrator: "通用价格校准器", fixed_knots: "固定价格节点", loss: "损失函数",
  node_bounds_scaled: "缩放后节点边界", identity_prior_total: "恒等映射先验总权重",
  context_prior: "上下文先验", scale_y: "价格缩放除数", night_window_days: "夜间校准窗口",
  night_context_gate: "夜间上下文门控", evening_window_days: "晚间校准窗口",
  evening_context: "晚间上下文", features: "特征", model: "模型", level_clip: "价格水平裁剪范围",
  final_price_map: "最终低价映射", raw_below: "原始价格低于", mapped_to: "映射价格",
  weather_points: "气象点位", base_weather_aliases: "基础天气字段说明",
  nwp_raw_series_required: "所需扩展天气序列数", nwp_semantics: "扩展天气变量定义",
  removed: "精简删除的组件", dependencies: "依赖版本", data_limits: "数据适用边界",
  reproduction: "复现命令", backtest: "回测", audit: "审计", profile: "性能测量",
  overall_MAE_below: "整体MAE低于", October_MAE_below: "十月MAE低于",
  peak_at_least: "峰捕获率至少", valley_at_least: "谷捕获率至少",
  MAE: "MAE（元/MWh）", RMSE: "RMSE（元/MWh）", accuracy: "准确率",
  peak_top4: "峰价4小时捕获率", valley_bottom4: "谷价4小时捕获率",
  strict_peak_top4: "严格峰时段重合率", strict_valley_bottom4: "严格谷时段重合率",
  n: "小时数", month: "月份", date: "交割日期", period: "时段",
  raw: "定版原始预测价", pred: "定版最终预测价", rank_score: "并列排序分数",
  night_level: "夜间校准价格水平", night_low_probability: "夜间低价概率",
  evening_level: "晚间校准价格水平", model_version: "模型版本", actual: "实际价",
  short_train_end: "短窗森林训练截止", long_train_end: "长窗森林训练截止",
  night_train_end: "夜间模型训练截止", night_calibration_end: "夜间校准截止",
  evening_train_end: "晚间模型训练截止", evening_calibration_end: "晚间校准截止",
  generation_available_through: "出力实测可用截止", condition: "实验条件",
  weather: "天气配置", learner: "学习器", calibration: "校准开关",
  October_MAE: "十月MAE", November_MAE: "十一月MAE",
  night_MAE: "夜间MAE", day_MAE: "日间MAE", evening_MAE: "晚间MAE",
  delta_MAE: "相对基准MAE变化", experiment: "实验方式", intervention: "处理配置",
  provider: "气象数据提供方", documentation: "接口文档", models: "天气模式",
  variables: "归档变量", lead_days: "预报提前天数", timezone: "时区",
  start: "开始日期", end: "结束日期", points: "点位", name: "名称",
  longitude: "经度", latitude: "纬度", files: "归档文件指纹", limitation: "适用限制",
  passed: "审计通过", checks: "各日检查", future_prices_and_future_OOF_changed: "已扰动未来价格与OOF",
  generation_changed_from_T_minus2_including_missing: "已扰动T−2起实测及缺测值",
  predictions_unchanged: "扰动后预测一致", all_original22_sources_unchanged: "原22个研究源文件指纹一致",
  original_predictions_unchanged: "原研究预测指纹一致", samples: "测量次数",
  median_train_predict_seconds: "训练并预测24小时的中位耗时（秒）",
  min_train_predict_seconds: "最短训练预测耗时（秒）", max_train_predict_seconds: "最长训练预测耗时（秒）",
  median_cached_inference_seconds: "已训练快照推理中位耗时（秒）",
  peak_instrumented_RSS_MiB: "进程峰值内存（MiB）", cpu_threads_per_forest: "每个森林线程数",
  network_included: "计时包含网络取数", historical_OOF_bootstrap_included: "计时包含首次OOF重建",
  all36_refit: "36天已逐日重新拟合", all864_reproduced: "864条预测已全部重现",
  max_raw_difference: "原始价最大复现差异", benchmark_refit_seconds: "36天重拟合耗时（秒）",
  median_day_training_seconds: "单日训练耗时中位数（秒）", metrics: "全区间指标",
  monthly: "月度指标", night_dates: "夜间历史预测天数", evening_dates: "晚间历史预测天数",
  fresh_refits: "已重新拟合", max_night_difference: "夜间历史最大重建差异",
  max_evening_difference: "晚间历史最大重建差异", recommended: "推荐配置编号",
  benchmark_metrics: "十月至十一月研究区间指标", dev_metrics: "九月复用研究区间指标",
  screened_configurations: "比较配置数", adoption_criteria: "选择条件",
  criteria_origin: "条件来源", confidence_gate_threshold_fixed: "固定置信门槛",
  data_limitations: "数据与结论边界", new_weather_runs_requested: "请求新增天气场次数",
  new_weather_runs_cached: "已缓存天气场次数", audit_passed: "审计通过", phase: "实验阶段",
  "2026-10_MAE": "十月MAE", "2026-11_MAE": "十一月MAE"
};
const resourceText = {
  "D+1 only": "仅预测D+1",
  "leaf-weighted median": "同叶样本加权中位数",
  "predictive mean": "森林预测均值",
  "center weighted forest means by their night median": "森林加权均值减去夜间中位数，作为夜间形状",
  "weighted short median and long mean": "短窗中位数与长窗均值加权",
  "0.75 base +0.25 calibrated supply level": "75%基础曲线与25%校准供需水平融合",
  "weighted forest means": "森林均值加权",
  "night actual median<=60": "夜间实际价格中位数≤60",
  "RobustScaler plus LogisticRegression L2 C1": "RobustScaler缩放后接L2逻辑回归，C=1",
  "actual renewable minus forecast wind where forecastPV=0": "光伏预测为0时，实际新能源总出力减风电预测",
  "RobustScaler plus QuantileRegressor median, alpha0": "RobustScaler缩放后接中位数回归，正则为0",
  "reused research benchmark, not independent test": "复用研究区间，尚无新的独立测试",
  "latest archived market and realized generation vintages": "市场与实测出力使用当前归档版本",
  "weather fixedlead1, not common historical08:45 run": "天气使用固定lead=1，尚未还原历史08:45可用的同一起报场次",
  "Fixed lead1 offsets do not reconstruct a common historical D 08:45 issue time.": "固定提前约24小时的预报偏移无法还原历史D日08:45的统一信息集。",
  "benchmark": "十月至十一月研究区间", "dev": "九月研究区间",
  "weather_refit_with_downstream_calibration": "改变天气处理后重拟合下游校准"
};
const resourcePercentages = new Set([
  "accuracy", "peak_top4", "valley_bottom4", "strict_peak_top4", "strict_valley_bottom4",
  "准确率", "峰捕获", "谷捕获", "严格峰重合", "严格谷重合"
]);
const resourceFractions = new Set(["基线小时准确率", "定版小时准确率", "night_low_probability"]);

function resourceElement(tag, text, className) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
}

function resourceLabel(key) {
  const container = resourceElement("span", resourceLabels[key] || key);
  if (resourceLabels[key] && resourceLabels[key] !== key) {
    container.append(resourceElement("code", key, "resource-key"));
  }
  return container;
}

function resourceValue(value, key) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") {
    if (key === "passed" || key === "audit_passed") return value ? "通过" : "未通过";
    return value ? "是" : "否";
  }
  const numeric = typeof value === "number" || (typeof value === "string" && /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/.test(value));
  if (numeric && Number.isFinite(Number(value))) {
    const number = Number(value);
    if (resourceFractions.has(key)) return (number * 100).toFixed(2) + "%";
    if (resourcePercentages.has(key)) return number.toFixed(2) + "%";
    if (number !== 0 && Math.abs(number) < 0.0001) return number.toExponential(6);
    if (Number.isInteger(number)) return String(number);
    return String(Number(number.toFixed(4)));
  }
  return resourceText[String(value)] || String(value);
}

function resourceTable(columns, rows) {
  const table = resourceElement("table", undefined, "resource-table");
  const header = resourceElement("tr");
  columns.forEach(key => {
    const cell = resourceElement("th");
    cell.scope = "col";
    cell.append(resourceLabel(key));
    header.append(cell);
  });
  const thead = resourceElement("thead");
  thead.append(header);
  const tbody = resourceElement("tbody");
  rows.forEach(row => {
    const tr = resourceElement("tr");
    columns.forEach(key => {
      const cell = resourceElement("td");
      cell.title = row[key] === null ? "" : String(row[key]);
      if (key === "intervention" && String(row[key]).startsWith("{")) {
        const detail = resourceElement("details");
        detail.append(resourceElement("summary", "查看处理配置"));
        try { detail.append(resourceJson(JSON.parse(row[key]))); }
        catch { detail.append(resourceElement("p", String(row[key]))); }
        cell.append(detail);
      } else {
        cell.textContent = resourceValue(row[key], key);
      }
      tr.append(cell);
    });
    tbody.append(tr);
  });
  table.append(thead, tbody);
  const wrap = resourceElement("div", undefined, "table-scroll");
  wrap.tabIndex = 0;
  wrap.append(table);
  return wrap;
}

function resourceJson(value, key = "") {
  if (Array.isArray(value)) {
    if (!value.length) return resourceElement("span", "空列表");
    if (value.every(item => item && typeof item === "object" && !Array.isArray(item) &&
        Object.values(item).every(cell => cell === null || typeof cell !== "object"))) {
      const columns = [...new Set(value.flatMap(item => Object.keys(item)))];
      return resourceTable(columns, value);
    }
    const list = resourceElement("ul", undefined, "resource-list");
    value.forEach(item => {
      const li = resourceElement("li");
      li.append(resourceJson(item, key));
      list.append(li);
    });
    return list;
  }
  if (value && typeof value === "object") {
    const list = resourceElement("dl", undefined, "resource-object");
    Object.entries(value).forEach(([name, item]) => {
      const term = resourceElement("dt");
      term.append(resourceLabel(name));
      const description = resourceElement("dd");
      description.append(resourceJson(item, name));
      list.append(term, description);
    });
    return list;
  }
  const text = resourceElement("span", resourceValue(value, key), "resource-value");
  text.title = value === null ? "" : String(value);
  return text;
}

async function initializeResources() {
  const select = document.getElementById("resourceSelect");
  if (!select) return;
  const response = await fetch("assets/resource_catalog.json");
  if (!response.ok) throw new Error("Could not load resource catalog");
  const catalog = await response.json();
  select.replaceChildren(new Option("请选择资料", ""), ...catalog.map(item => new Option(item.title, item.file)));
  const title = document.getElementById("resourceTitle");
  const description = document.getElementById("resourceDescription");
  const status = document.getElementById("resourceStatus");
  const content = document.getElementById("resourceContent");
  const filters = document.getElementById("resourceFilters");
  const search = document.getElementById("resourceSearch");
  const start = document.getElementById("resourceStart");
  const end = document.getElementById("resourceEnd");
  const pageSize = document.getElementById("resourcePageSize");
  const pagination = document.getElementById("resourcePagination");
  const previous = document.getElementById("resourcePrevious");
  const next = document.getElementById("resourceNext");
  const pageLabel = document.getElementById("resourcePageLabel");
  const download = document.getElementById("resourceDownload");
  let current = null, pageNumber = 1, dateColumn = null, controller = null;

  function renderTable() {
    if (!current || current.kind !== "csv") return;
    const query = search.value.trim().toLowerCase();
    const invalidDates = dateColumn && start.value && end.value && start.value > end.value;
    const rows = invalidDates ? [] : current.rows.filter(row =>
      (!dateColumn || !start.value || row[dateColumn] >= start.value) &&
      (!dateColumn || !end.value || row[dateColumn] <= end.value) &&
      (!query || Object.values(row).some(value => String(value).toLowerCase().includes(query))));
    const size = Number(pageSize.value);
    const pages = Math.max(1, Math.ceil(rows.length / size));
    pageNumber = Math.max(1, Math.min(pageNumber, pages));
    const first = (pageNumber - 1) * size;
    content.replaceChildren(resourceTable(current.columns, rows.slice(first, first + size)));
    status.className = invalidDates ? "error" : "";
    status.textContent = invalidDates ? "起始日期晚于结束日期，请调整日期。" :
      rows.length ? "共" + current.rows.length + "行，筛选后" + rows.length + "行，当前显示第" +
        (first + 1) + "至" + Math.min(first + size, rows.length) + "行。" : "当前筛选条件下没有记录。";
    pageLabel.textContent = "第" + pageNumber + " / " + pages + "页";
    previous.disabled = pageNumber <= 1;
    next.disabled = pageNumber >= pages;
    pagination.hidden = false;
    document.documentElement.dataset.resourceRows = String(rows.length);
    document.documentElement.dataset.resourcePage = String(pageNumber);
  }

  async function openResource(file, updateHistory) {
    controller?.abort();
    controller = new AbortController();
    const selectedController = controller;
    const meta = catalog.find(item => item.file === file);
    current = null;
    select.value = meta ? meta.file : "";
    filters.hidden = true;
    pagination.hidden = true;
    download.hidden = true;
    document.getElementById("resourcePrecision").hidden = true;
    content.replaceChildren();
    delete document.documentElement.dataset.resourceReady;
    if (!meta) {
      title.textContent = "选择要查看的资料";
      description.textContent = "";
      status.className = "error";
      status.textContent = "未找到指定资料，请从列表选择。";
      return;
    }
    if (updateHistory) {
      const url = new URL(location.href);
      url.searchParams.set("file", meta.file);
      history.pushState(null, "", url);
    }
    title.textContent = meta.title;
    description.textContent = meta.description;
    status.className = "";
    status.textContent = "正在载入在线阅读内容…";
    try {
      const result = await fetch(meta.asset, {signal: selectedController.signal});
      if (!result.ok) throw new Error("Could not load resource");
      const data = await result.json();
      if (selectedController !== controller) return;
      current = data;
      download.href = "downloads/" + meta.file;
      download.download = meta.file;
      download.hidden = false;
      if (data.kind === "csv") {
        pageNumber = 1;
        search.value = "";
        pageSize.value = "50";
        dateColumn = data.columns.find(key => (key === "date" || key === "交割日期") &&
          data.rows.every(row => /^\d{4}-\d{2}-\d{2}$/.test(row[key])));
        const dates = dateColumn ? data.rows.map(row => row[dateColumn]).sort() : [];
        start.value = dates[0] || "";
        end.value = dates.at(-1) || "";
        document.getElementById("resourceStartLabel").hidden = !dateColumn;
        document.getElementById("resourceEndLabel").hidden = !dateColumn;
        filters.hidden = false;
        document.getElementById("resourcePrecision").hidden = false;
        renderTable();
      } else {
        content.replaceChildren(resourceJson(data.data));
        status.textContent = "完整资料已展开，可直接阅读各项参数与记录。悬停数值可查看原始精度。";
      }
      document.documentElement.dataset.resourceReady = meta.file;
    } catch (error) {
      if (error.name === "AbortError" || selectedController !== controller) return;
      status.className = "error";
      status.textContent = "资料载入失败，请重新选择或刷新页面。";
      console.error(error);
    }
  }

  select.addEventListener("change", () => openResource(select.value, true));
  for (const input of [search, start, end, pageSize]) input.addEventListener("input", () => {
    pageNumber = 1;
    renderTable();
  });
  document.getElementById("resetResourceFilters").addEventListener("click", () => {
    search.value = "";
    const dates = dateColumn ? current.rows.map(row => row[dateColumn]).sort() : [];
    start.value = dates[0] || "";
    end.value = dates.at(-1) || "";
    pageNumber = 1;
    renderTable();
  });
  previous.addEventListener("click", () => { pageNumber--; renderTable(); });
  next.addEventListener("click", () => { pageNumber++; renderTable(); });
  window.addEventListener("popstate", () => openResource(new URLSearchParams(location.search).get("file") || catalog[0].file, false));
  window.ResourcesDocs = {catalog, openResource};
  await openResource(new URLSearchParams(location.search).get("file") || catalog[0].file, false);
}

initializeResources().catch(error => {
  const status = document.getElementById("resourceStatus");
  if (status) { status.className = "error"; status.textContent = "资料目录载入失败，请刷新页面。"; }
  console.error(error);
});
